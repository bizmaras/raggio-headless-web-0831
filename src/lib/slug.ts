/**
 * Helper to convert category names to URL-friendly slugs
 * e.g. "Strombolis + Calzones" -> "strombolis-and-calzones"
 * e.g. "Gourmet Pizza" -> "gourmet-pizza"
 */
export function categoryToSlug(category: string): string {
  return String(category || "")
    .toLowerCase()
    .replace(/\s*\+\s*|\s*&\s*/g, "-and-")
    .replace(/[^a-z0-9\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Reverse lookup: Find original category name from URL slug
 */
export function slugToCategory(
  slug: string,
  categories: string[]
): string | undefined {
  const normSlug = (slug || "").trim().toLowerCase();
  return categories.find((cat) => categoryToSlug(cat) === normSlug);
}
