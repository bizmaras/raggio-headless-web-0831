import { createClient } from "contentful";
import type { EntrySkeletonType } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
});

export interface MenuItem {
  "Product Name": string;
  Description: string;
  Price: string;
  Category: string;
  Slug: string;
  Featured: string;
}

interface MenuItemFields {
  name: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  featured: boolean;
}

interface MenuItemSkeleton extends EntrySkeletonType {
  contentTypeId: "menuItem";
  fields: MenuItemFields;
}

export async function getMenuItemsFromContentful(): Promise<MenuItem[]> {
  try {
    const entries = await client.getEntries<MenuItemSkeleton>({
      content_type: "menuItem",
      limit: 1000,
    });

    return entries.items.map((entry) => ({
      "Product Name": entry.fields.name ?? "",
      Description: entry.fields.description ?? "",
      Price: String(entry.fields.price ?? 0),
      Category: entry.fields.category ?? "",
      Slug: entry.fields.slug ?? "",
      Featured: entry.fields.featured ? "True" : "False",
    }));
  } catch (error) {
    console.error("[Contentful] Failed to fetch menu items:", error);
    return [];
  }
}

export { client };