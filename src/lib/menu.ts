import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { getMenuItemsFromContentful } from "./contentful";
import type { MenuItem } from "./contentful";

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
    return EXTRA_CALZONES;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  // Try Contentful first; fall back to CSV if not configured or fails
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (spaceId && token) {
    const items = await getMenuItemsFromContentful();
    if (items.length > 0) {
      return [...items, ...EXTRA_CALZONES];
    }
  }

  // Fallback to CSV
  return getMenuItemsFromCSV();
}
