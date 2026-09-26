/**
 * FoodTec-verified pizza price ladders.
 *
 * Source of truth: https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/Pizza
 * Observed: 2026-09-25 22:58 EDT. Matches printed menu PDF (Nov 2025):
 *   Cheese:  S.12" 11.99  M.14" 13.99  L.16" 15.99  XL.18" 17.99
 *   Gourmet: S.12" 15.99  M.14" 17.99  L.16" 20.99  XL.18" 25.99
 *
 * RULE: every price rendered anywhere on raggiogourmetpizza.com (cards, hero,
 * showcase, meta description, JSON-LD) must be derived from this file.
 * If the owner changes a price in FoodTec, change it HERE and run
 * `node scripts/check-price-parity.mjs`.
 */

export const PRICES_VERIFIED_AT = '2026-09-25';

export type PizzaSizeId = 'sm' | 'med' | 'lrg' | 'xl';

export const CHEESE_LADDER: Record<PizzaSizeId, number> = {
  sm: 11.99,
  med: 13.99,
  lrg: 15.99,
  xl: 17.99,
};

export const GOURMET_LADDER: Record<PizzaSizeId, number> = {
  sm: 15.99,
  med: 17.99,
  lrg: 20.99,
  xl: 25.99,
};

/**
 * FoodTec items that DO NOT follow the gourmet ladder (observed 2026-09-25).
 * Several of these look like data-entry typos in FoodTec ($15.00, $23.00 …) —
 * flag to owner; do not "fix" on the website side without confirmation.
 */
export const GOURMET_EXCEPTIONS: Record<string, Record<PizzaSizeId, number>> = {
  'broccoli white': { sm: 15.0, med: 17.0, lrg: 19.0, xl: 23.99 },
  'spinach white': { sm: 14.0, med: 16.0, lrg: 19.0, xl: 23.0 },
  'bianca white': { sm: 15.0, med: 17.0, lrg: 19.0, xl: 24.0 },
  'shrimp parm': { sm: 13.99, med: 15.99, lrg: 18.99, xl: 23.99 },
};

export function gourmetLadderFor(productName: string): Record<PizzaSizeId, number> {
  const n = (productName || '').toLowerCase();
  for (const key of Object.keys(GOURMET_EXCEPTIONS)) {
    if (n.includes(key)) return GOURMET_EXCEPTIONS[key];
  }
  return GOURMET_LADDER;
}

/** Hero / showcase helper: the Large 16" gourmet price shown to customers. */
export const LARGE_GOURMET_PRICE = GOURMET_LADDER.lrg; // 20.99

export function formatUSD(n: number): string {
  return `$${n.toFixed(2)}`;
}
