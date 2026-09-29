/**
 * Size variants for menu cards — thin adapter over foodtecCatalog.ts.
 *
 * Stage 2: all arithmetic ladders ("LRG - $3", "LRG + $3", stromboli 14.99/17.99)
 * were removed. Every size and price now comes from the FoodTec-verified catalog.
 * Signature kept backward compatible; pass `slug` (4th arg) — it is language
 * independent, whereas `productName` is translated on /es.
 */
import { resolveCatalogEntry } from './foodtecCatalog';

export interface SizeVariant {
  id: string;
  label: string;
  fullName: { en: string; es: string };
  inches?: string;
  price: number;
}

function slugify(name: string) {
  return (name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getSizeVariants(
  category: string,
  productName: string,
  basePrice: number,
  slug?: string
): SizeVariant[] | null {
  const entry = resolveCatalogEntry(category, slug || slugify(productName), basePrice);
  if (!entry.sizes) return null;
  return entry.sizes.map((s) => ({ id: s.id, label: s.label, inches: s.inches, price: s.price, fullName: s.fullName }));
}
