import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { getMenuItemsFromContentful } from "./contentful";
import type { MenuItem } from "./contentful";
import mockData from "@/data/mockData.json";

export type { MenuItem };

const EXTRA_CALZONES: MenuItem[] = [
  {
    Category: "Strombolis + Calzones",
    "Product Name": "Cheese Calzone",
    Price: "15.99",
    Description:
      "Folded pizza dough stuffed with Grande Mozzarella, creamy Ricotta cheese, and served with a side of homemade marinara sauce.",
    Slug: "cheese-calzone",
    Featured: "false",
  },
];

async function getMenuItemsFromCSV(): Promise<MenuItem[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "raggio_menu.csv");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = Papa.parse<MenuItem>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return [...parsed.data, ...EXTRA_CALZONES];
  } catch (error) {
    console.error("[CSV] Failed to load menu:", error);
    return (mockData as MenuItem[]) || EXTRA_CALZONES;
  }
}

// Build index of mockData items for fast lookup by Slug and Product Name
interface LocalMockItem {
  "Product Name"?: string;
  Description?: string;
  Price?: string;
  Category?: string;
  Slug?: string;
  Featured?: string;
  Image?: string;
  image?: string;
  pos_provider?: string;
  pos_order_url?: string;
  [key: string]: unknown;
}

const mockItems = (mockData as unknown as LocalMockItem[]) || [];
const mockBySlug = new Map<string, LocalMockItem>();
const mockByName = new Map<string, LocalMockItem>();

for (const item of mockItems) {
  if (item.Slug) {
    mockBySlug.set(item.Slug.toLowerCase().trim(), item);
  }
  if (item["Product Name"]) {
    mockByName.set(item["Product Name"].toLowerCase().trim(), item);
  }
}

/**
 * Prioritizes local mockData assets and descriptions:
 * 1. If mockData defines an image (Image or image), it transfers this image to the card instead of Contentful.
 * 2. If mockData defines a description, it prioritizes the local description over Contentful.
 */
function applyLocalOverrides(items: MenuItem[]): MenuItem[] {
  return items.map((item) => {
    const slugKey = (item.Slug || "").toLowerCase().trim();
    const nameKey = (item["Product Name"] || "").toLowerCase().trim();
    const localMatch =
      (slugKey ? mockBySlug.get(slugKey) : undefined) ||
      (nameKey ? mockByName.get(nameKey) : undefined);

    if (!localMatch) {
      return item;
    }

    const localImg = localMatch.Image || localMatch.image;
    const localDesc = localMatch.Description;

    return {
      ...item,
      ...(localMatch.pos_provider ? { pos_provider: localMatch.pos_provider as string } : {}),
      ...(localMatch.pos_order_url ? { pos_order_url: localMatch.pos_order_url as string } : {}),
      Description: localDesc && localDesc.trim() ? localDesc : item.Description,
      Image: localImg || item.Image || item.image,
      image: localImg || item.image || item.Image,
    };
  });
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const isDev = process.env.NODE_ENV === "development";
  const forceContentful = process.env.FORCE_CONTENTFUL === "true";

  // 1. In development, use local mock data to avoid consuming Contentful API quota & asset bandwidth
  if (isDev && !forceContentful) {
    const devItems = (mockData as unknown as MenuItem[]) || (await getMenuItemsFromCSV());
    return applyLocalOverrides(devItems);
  }

  // 2. Production: Use aggressively cached Contentful integration
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (spaceId && token) {
    try {
      const items = await getMenuItemsFromContentful();
      if (items && items.length > 0) {
        return applyLocalOverrides([...items, ...EXTRA_CALZONES]);
      }
    } catch (err) {
      console.warn("[Menu] Contentful fetch failed, falling back to local dataset:", err);
    }
  }

  // 3. Graceful fallback to mock data or CSV if Contentful is unconfigured or quota-exhausted
  const fallbackItems = (mockData as unknown as MenuItem[]) || (await getMenuItemsFromCSV());
  return applyLocalOverrides(fallbackItems);
}
