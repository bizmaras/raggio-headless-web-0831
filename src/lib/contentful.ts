import { createClient } from "contentful";
import type { EntrySkeletonType, ContentfulClientApi } from "contentful";
import { unstable_cache } from "next/cache";

let client: ContentfulClientApi<undefined> | null = null;

export function getContentfulClient() {
  if (!client && process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
    });
  }
  return client;
}

export interface MenuItem {
  "Product Name": string;
  Description: string;
  Price: string;
  Category: string;
  Slug: string;
  Featured: string;
  Image?: string;
  image?: string;
}

interface MenuItemFields {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  slug?: string;
  featured?: boolean;
  image?: {
    fields?: {
      file?: {
        url?: string;
        details?: {
          size?: number;
          image?: { width?: number; height?: number };
        };
      };
    };
  } | string;
}

interface MenuItemSkeleton extends EntrySkeletonType {
  contentTypeId: "menuItem";
  fields: MenuItemFields;
}

/**
 * Transforms a Contentful asset URL to use the Contentful Image API.
 * Requests WebP format, dimensions, quality, and fit mode to drastically
 * reduce bandwidth consumption (up to 99% reduction).
 */
export function optimizeContentfulImage(
  url?: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string | undefined {
  if (!url) return undefined;

  // If local static asset, return as-is
  if (url.startsWith('/') || !url.includes('ctfassets.net')) {
    return url;
  }

  // Ensure protocol
  const fullUrl = url.startsWith('//') ? `https:${url}` : url;

  try {
    const parsed = new URL(fullUrl);
    const { width, height, quality = 80, format = 'webp', fit = 'fill' } = options;

    if (width) parsed.searchParams.set('w', String(width));
    if (height) parsed.searchParams.set('h', String(height));
    if (quality) parsed.searchParams.set('q', String(quality));
    if (format) parsed.searchParams.set('fm', format);
    if (fit) parsed.searchParams.set('fit', fit);

    return parsed.toString();
  } catch {
    return fullUrl;
  }
}

// ─────────────────────────────────────────────────────────────
// Multi-Tier Aggressive Caching (In-Memory + In-Flight + ISR)
// ─────────────────────────────────────────────────────────────

let inMemoryCache: MenuItem[] | null = null;
let inMemoryCacheTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour memory TTL
let inFlightPromise: Promise<MenuItem[]> | null = null;

async function fetchFromContentfulRaw(): Promise<MenuItem[]> {
  const contentfulClient = getContentfulClient();
  if (!contentfulClient) return [];

  try {
    const entries = await contentfulClient.getEntries<MenuItemSkeleton>({
      content_type: "menuItem",
      limit: 1000,
    });

    return entries.items.map((entry) => {
      const imgField = entry.fields.image as any;
      let rawImgUrl: string | undefined;
      if (typeof imgField === 'string') {
        rawImgUrl = imgField;
      } else if (imgField && typeof imgField === 'object' && imgField.fields?.file?.url) {
        rawImgUrl = imgField.fields.file.url;
      }

      const formattedImg = rawImgUrl
        ? (rawImgUrl.startsWith('//') ? `https:${rawImgUrl}` : rawImgUrl)
        : undefined;

      return {
        "Product Name": entry.fields.name ?? "",
        Description: entry.fields.description ?? "",
        Price: String(entry.fields.price ?? 0),
        Category: entry.fields.category ?? "",
        Slug: entry.fields.slug ?? "",
        Featured: entry.fields.featured ? "True" : "False",
        Image: formattedImg,
        image: formattedImg,
      };
    });
  } catch (error) {
    console.error("[Contentful] Failed to fetch menu items:", error);
    return [];
  }
}

/**
 * Cached fetcher using Next.js unstable_cache for cross-request persistence.
 */
const getCachedContentfulEntries = unstable_cache(
  async () => {
    return fetchFromContentfulRaw();
  },
  ['contentful-menu-items'],
  {
    revalidate: 3600, // Revalidate every 1 hour (ISR)
    tags: ['contentful-menu'],
  }
);

/**
 * Returns menu items from Contentful with:
 * 1. In-flight request deduplication (prevents parallel calls during page render)
 * 2. In-memory TTL cache (prevents redundant calls within the process)
 * 3. Next.js unstable_cache (persists across serverless functions)
 */
export async function getMenuItemsFromContentful(): Promise<MenuItem[]> {
  const now = Date.now();
  if (inMemoryCache && now - inMemoryCacheTime < CACHE_TTL_MS) {
    return inMemoryCache;
  }

  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const items = await getCachedContentfulEntries();
      if (items && items.length > 0) {
        inMemoryCache = items;
        inMemoryCacheTime = Date.now();
      }
      return items;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export { client };