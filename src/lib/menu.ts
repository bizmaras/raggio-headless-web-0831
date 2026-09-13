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

export async function getMenuItems(): Promise<MenuItem[]> {
  const isDev = process.env.NODE_ENV === "development";
  const forceContentful = process.env.FORCE_CONTENTFUL === "true";

  // 1. In development, use local mock data to avoid consuming Contentful API quota & asset bandwidth
  if (isDev && !forceContentful) {
    return (mockData as unknown as MenuItem[]) || getMenuItemsFromCSV();
  }

  // 2. Production: Use aggressively cached Contentful integration
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (spaceId && token) {
    try {
      const items = await getMenuItemsFromContentful();
      if (items && items.length > 0) {
        return [...items, ...EXTRA_CALZONES];
      }
    } catch (err) {
      console.warn("[Menu] Contentful fetch failed, falling back to local dataset:", err);
    }
  }

  // 3. Graceful fallback to mock data or CSV if Contentful is unconfigured or quota-exhausted
  return (mockData as unknown as MenuItem[]) || getMenuItemsFromCSV();
}
