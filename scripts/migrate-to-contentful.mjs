/**
 * Contentful Migration Script — contentful-management v10+
 * Usage: node scripts/migrate-to-contentful.mjs
 */
import { createClient } from "contentful-management";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

if (!SPACE_ID || !CMA_TOKEN) {
  console.error("ERROR: Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN");
  process.exit(1);
}

const EXTRA_ITEMS = [
  {
    "Product Name": "Cheese Calzone",
    Description: "Folded pizza dough stuffed with Grande Mozzarella, creamy Ricotta cheese, and served with a side of homemade marinara sauce.",
    Price: "15.99",
    Category: "Strombolis + Calzones",
    Slug: "cheese-calzone",
    Featured: "false",
  },
];

async function main() {
  const client = createClient({ accessToken: CMA_TOKEN });

  console.log("Connecting to Contentful...");

  // 1. Ensure content type exists
  let contentType;
  try {
    contentType = await client.contentType.get({ spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId: "menuItem" });
    console.log("Content type menuItem already exists.");
  } catch {
    console.log("Creating content type menuItem...");
    contentType = await client.contentType.create(
      { spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId: "menuItem" },
      {
        name: "Menu Item",
        displayField: "name",
        fields: [
          { id: "name", name: "Name", type: "Symbol", required: true },
          { id: "description", name: "Description", type: "Text", required: false },
          { id: "price", name: "Price", type: "Number", required: true },
          { id: "category", name: "Category", type: "Symbol", required: true },
          { id: "slug", name: "Slug", type: "Symbol", required: true },
          { id: "featured", name: "Featured", type: "Boolean", required: false },
        ],
      }
    );
    await client.contentType.publish(
      { spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId: "menuItem" },
      { sys: contentType.sys }
    );
    console.log("Content type created and published.");
  }

  // 2. Read CSV
  const csvPath = join(__dirname, "..", "public", "data", "raggio_menu.csv");
  const csvContent = readFileSync(csvPath, "utf8");
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  const allItems = [...records, ...EXTRA_ITEMS];
  console.log(`Found ${allItems.length} items to migrate.`);

  // 3. Check existing entries
  const existing = await client.entry.getMany({
    spaceId: SPACE_ID,
    environmentId: ENV_ID,
    query: { content_type: "menuItem", limit: 1000 },
  });
  const existingSlugs = new Set(
    existing.items.map((e) => e.fields?.slug?.["en-US"]).filter(Boolean)
  );
  console.log(`${existingSlugs.size} items already exist in Contentful.`);

  // 4. Create entries
  let created = 0;
  let skipped = 0;

  for (const item of allItems) {
    const slug = String(item["Slug"] || item["slug"] || "").trim();
    if (!slug || existingSlugs.has(slug)) {
      skipped++;
      continue;
    }

    const price = parseFloat(item["Price"] || item["price"] || "0");
    const featured = (item["Featured"] || item["featured"] || "").toLowerCase() === "true";
    const name = String(item["Product Name"] || item["name"] || "").trim();
    const description = String(item["Description"] || item["description"] || "").trim();
    const category = String(item["Category"] || item["category"] || "").trim();

    try {
      const entry = await client.entry.create(
        { spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId: "menuItem" },
        {
          fields: {
            name: { "en-US": name },
            description: { "en-US": description },
            price: { "en-US": price },
            category: { "en-US": category },
            slug: { "en-US": slug },
            featured: { "en-US": featured },
          },
        }
      );
      await client.entry.publish(
        { spaceId: SPACE_ID, environmentId: ENV_ID, entryId: entry.sys.id },
        { sys: entry.sys }
      );
      created++;
      process.stdout.write(`\r  Created: ${created}  Skipped: ${skipped}  `);
    } catch (err) {
      console.error(`\nFailed [${name}]: ${err.message}`);
    }
  }

  console.log(`\n\nDone! Created: ${created}, Skipped: ${skipped}, Total: ${allItems.length}`);
}

main().catch((err) => {
  console.error("Migration failed:", err.message ?? err);
  process.exit(1);
});