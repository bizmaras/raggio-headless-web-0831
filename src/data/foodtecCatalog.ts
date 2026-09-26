/**
 * FoodTec catalog — the ONLY place card prices, size ladders and checkout
 * deep links come from.
 *
 * Source of truth: https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/<Category>
 * Observed: 2026-09-25 ~23:30 EDT (Stage 2 audit). Cross-checked against the
 * printed menu PDF shipped at /public/raggio-full-menu.pdf.
 *
 * Why this file exists (Stage 2 audit findings):
 *  - Stage 1 fixed pizza parity only. Every other sized family on the site was
 *    still computed by arithmetic in sizePricing.ts ("LRG - $3", "LRG + $3"),
 *    which produced prices that exist nowhere:
 *      Philly Cheesesteak  site SM 8.99 / LRG 10.99 / XL 13.99
 *                          FoodTec MED 10.99 / LG 13.99 / XL 24.99
 *      Strombolis          site MD 14.99 / LG 17.99
 *                          FoodTec + printed menu MD 14" 15.99 / LG 16" 19.99
 *      Wings (per flavor)  site 8.99 (= 5pc on the PDF; FoodTec online sells 10pc/20pc only)
 *                          FoodTec 10pc 14.99 / 20pc 28.99
 *      Hot sandwiches/subs site 9.99 / 12.99 / 15.99 (derived)
 *                          FoodTec MED 9.99 / LG 11.99 / XL 21.00–24.00
 *  - FoodTec does NOT expose item-level URLs (clicking an item opens an
 *    order-type modal; the URL stays on /menu/<Category>). The deepest honest
 *    link is the category page, so each entry also carries the exact FoodTec
 *    item label, which the card prints as "On checkout: Stromboli → Italian".
 *
 * RULE: if the owner changes a price in FoodTec, change it HERE, then run
 *   node scripts/check-price-parity.mjs
 */

import { CHEESE_LADDER, GOURMET_LADDER, GOURMET_EXCEPTIONS } from './pizzaPricing';

export const FOODTEC_VERIFIED_AT = '2026-09-25';

const FOODTEC_BASE = 'https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu';

/** FoodTec category route names, exactly as FoodTec spells them. */
export const FOODTEC_CATEGORY = {
  pizza: 'Pizza',
  calzone: 'Calzone',
  stromboli: 'Stromboli',
  appetizers: 'Appetizers',
  fries: 'Fries',
  wings: 'Wings',
  sides: 'Sides',
  pasta: 'Pasta',
  dinner: 'Dinner',
  seafood: 'Seafood',
  salad: 'Salad',
  steaks: 'Steaks',
  subs: 'Subs',
  hotSandwiches: 'Hot Sandwiches',
  burgers: 'Burgers',
  sandwiches: 'Sandwiches',
  clubs: 'Clubs',
  wraps: 'Wraps',
  pitas: 'Pitas',
  latin: 'Latin',
  quesadillas: 'Quesadillas',
  specials: 'Specials',
  drinks: 'Drinks',
  desserts: 'Desserts',
  chips: 'Chips',
  extras: 'Extras',
  breakfast: 'NEW!!! Breakfast', // verified: /menu/NEW!!!%20Breakfast renders the breakfast menu
  catering: 'Catering',
} as const;

export type FoodTecCategoryKey = keyof typeof FOODTEC_CATEGORY;

export function foodtecUrl(key: FoodTecCategoryKey): string {
  return `${FOODTEC_BASE}/${encodeURIComponent(FOODTEC_CATEGORY[key]).replace(/%21/g, '!')}`;
}

/** Website category (mockData "Category") → FoodTec category page. */
export const SITE_TO_FOODTEC: Record<string, FoodTecCategoryKey> = {
  'pizza': 'pizza',
  'gourmet pizza': 'pizza',
  'sicilian pizza': 'pizza',
  'chicken wings': 'wings',
  'cheesesteaks': 'steaks',
  'fresh burgers': 'burgers',
  'appetizers': 'appetizers',
  'fresh salads': 'salad',
  'pasta': 'pasta',
  'complete dinners': 'dinner',
  'seafood': 'seafood',
  'quesadillas': 'quesadillas',
  'latin food': 'latin',
  'subs + grinders': 'subs',
  'strombolis + calzones': 'stromboli',
  'breakfast': 'breakfast',
  'hot sandwiches': 'hotSandwiches',
  'desserts': 'desserts',
  'soups': 'extras',
  'drinks': 'drinks',
  'side orders': 'sides',
  'catering': 'catering',
};

export interface CatalogSize {
  id: string;         // stable key: 'sm' | 'med' | 'lrg' | 'xl' | 'sicilian' | '10pc' | '20pc'
  label: string;      // what FoodTec prints on the size button
  inches?: string;    // only when FoodTec or the printed menu states it
  price: number;
  fullName: { en: string; es: string };
}

export interface CatalogEntry {
  foodtecCategory: FoodTecCategoryKey;
  /** Exact FoodTec item label to look for at checkout. */
  foodtecItem: string;
  sizes: CatalogSize[] | null;
  /** Single price for unsized items. */
  price?: number;
  /** 'foodtec' = observed on FoodTec; 'menu-data' = not found on FoodTec, shown from mockData. */
  priceSource: 'foodtec' | 'menu-data';
  /** Default size the card pre-selects (LG for pizza, the "anchor" size). */
  defaultSizeId?: string;
}

// ---------- ladders ----------
const pizzaLadder = (l: Record<'sm' | 'med' | 'lrg' | 'xl', number>, sicilian?: number): CatalogSize[] => {
  const out: CatalogSize[] = [
    { id: 'sm', label: 'SM', inches: '12"', price: l.sm, fullName: { en: 'Small 12"', es: 'Pequeña 12"' } },
    { id: 'med', label: 'MED', inches: '14"', price: l.med, fullName: { en: 'Medium 14"', es: 'Mediana 14"' } },
    { id: 'lrg', label: 'LG', inches: '16"', price: l.lrg, fullName: { en: 'Large 16"', es: 'Grande 16"' } },
    { id: 'xl', label: 'XL', inches: '18"', price: l.xl, fullName: { en: 'Extra Large 18"', es: 'Extra Grande 18"' } },
  ];
  if (sicilian != null) {
    out.push({ id: 'sicilian', label: 'SICILIAN', price: sicilian, fullName: { en: 'Sicilian (square)', es: 'Siciliana (cuadrada)' } });
  }
  return out;
};

const STROMBOLI_LADDER: CatalogSize[] = [
  { id: 'med', label: 'MED', inches: '14"', price: 15.99, fullName: { en: 'Medium 14"', es: 'Mediano 14"' } },
  { id: 'lrg', label: 'LG', inches: '16"', price: 19.99, fullName: { en: 'Large 16"', es: 'Grande 16"' } },
];

const steakLadder = (xl = 24.99): CatalogSize[] => [
  // Inches from the printed menu (M.10" / LG.12"). FoodTec prints no inches; XL length unknown → omitted.
  { id: 'med', label: 'MED', inches: '10"', price: 10.99, fullName: { en: 'Medium 10"', es: 'Mediano 10"' } },
  { id: 'lrg', label: 'LG', inches: '12"', price: 13.99, fullName: { en: 'Large 12"', es: 'Grande 12"' } },
  { id: 'xl', label: 'XL', price: xl, fullName: { en: 'Extra Large', es: 'Extra Grande' } },
];

const hoagieLadder = (xl: number): CatalogSize[] => [
  { id: 'med', label: 'MED', inches: '10"', price: 9.99, fullName: { en: 'Medium 10"', es: 'Mediano 10"' } },
  { id: 'lrg', label: 'LG', inches: '12"', price: 11.99, fullName: { en: 'Large 12"', es: 'Grande 12"' } },
  { id: 'xl', label: 'XL', price: xl, fullName: { en: 'Extra Large', es: 'Extra Grande' } },
];

const WINGS_BONE_IN: CatalogSize[] = [
  { id: '10pc', label: '10 PC', price: 14.99, fullName: { en: '10 wings', es: '10 alitas' } },
  { id: '20pc', label: '20 PC', price: 28.99, fullName: { en: '20 wings', es: '20 alitas' } },
];

// ---------- Sicilian prices per gourmet pizza (FoodTec "SICILIAN" size button) ----------
// NOTE: The Works Sicilian is $23.00 on FoodTec (every sibling is $23.99) — likely a
// data-entry typo. Shown as observed; flagged in the owner checklist.
const SICILIAN_BY_FOODTEC_ITEM: Record<string, number> = {
  'Cheese': 18.99, 'White Cheese': 18.99, 'The Works': 23.0, 'White Special': 23.99,
  'BBQ Chicken': 23.99, 'Buffalo Chicken': 23.99, 'Chicken Ranch': 23.99, 'Chicken Parm': 23.99,
  'Chicken Alfredo': 23.99, 'Shrimp Alfredo': 25.99, 'House Special': 25.99, 'Veggie': 23.99,
  'Philly Cheese Steak': 23.99, 'Meat Lover': 23.99, 'Broccoli White': 24.0, 'Spinach White': 23.0,
  'Shrimp Parm': 23.99, 'Bianca White Pizza': 24.0,
};

// ---------- slug → FoodTec item (only where the names differ or the family is sized) ----------
const PIZZA_ITEM_BY_SLUG: Record<string, string> = {
  'plain-cheese-pizza': 'Cheese',
  'white-cheese-pizza': 'White Cheese',
  'signature-thin-crust': 'The Works',
  'the-works-pizza': 'The Works',
  'white-special-pizza': 'White Special',
  'buffalo-chicken-pizza': 'Buffalo Chicken',
  'chicken-ranch-pizza': 'Chicken Ranch',
  'chicken-parm-pizza': 'Chicken Parm',
  'chicken-alfredo-pizza': 'Chicken Alfredo',
  'shrimp-alfredo-pizza': 'Shrimp Alfredo',
  'greek-pizza': 'Greek',
  'house-pizza': 'House Special',
  'philly-cheesesteak-pizza': 'Philly Cheese Steak',
  'veggie-pizza': 'Veggie',
};

/** Sicilian rows on the website are single-price items; FoodTec sells them as the SICILIAN size. */
const SICILIAN_ROW_BY_SLUG: Record<string, string> = {
  'white-cheese-sicilian': 'White Cheese',
  'sicilian-meat-lover': 'Meat Lover',
  'sicilian-special': 'House Special',
  'shrimp-alfredo-sicilian': 'Shrimp Alfredo',
  'buffalo-chicken-sicilian': 'Buffalo Chicken',
  'chicken-ranch-sicilian': 'Chicken Ranch',
  'white-special-sicilian': 'White Special',
  'philly-steak-sicilian': 'Philly Cheese Steak',
  // 'ham-american-sicilian' — no FoodTec equivalent → priceSource 'menu-data'
};

const STROMBOLI_ITEM_BY_SLUG: Record<string, { cat: 'stromboli' | 'calzone'; item: string }> = {
  'cheese-stromboli': { cat: 'stromboli', item: 'Cheese' },
  'chicken-stromboli': { cat: 'stromboli', item: 'Chicken' },
  'buffalo-chicken-stromboli': { cat: 'stromboli', item: 'Buffalo Chicken' },
  'italian-stromboli': { cat: 'stromboli', item: 'Italian' },
  'meat-lovers-stromboli': { cat: 'stromboli', item: 'Meat Lover' },
  'vegetable-stromboli': { cat: 'stromboli', item: 'Vegetable' },
  'philly-special-stromboli': { cat: 'stromboli', item: 'Philly Steak' },
  'philly-chicken-stromboli': { cat: 'stromboli', item: 'Philly Chicken' },
  'cheese-calzone': { cat: 'calzone', item: 'Cheese' },
};

const STEAK_ITEM_BY_SLUG: Record<string, { item: string; xl?: number }> = {
  'philly-cheesesteak': { item: 'Cheese Steak' },
  'philly-special': { item: 'Philly Special Steak' },
  'cheesesteak-ranchero': { item: 'Chicken Cheese Steak Ranchero' },
  'pizza-steak-chicken': { item: 'Pizza Chicken Cheese Steak' },
  'bbq-chicken-cheesesteak': { item: 'BBQ Chicken Cheese Steak' },
  'chicken-cheesesteak-sand': { item: 'Chicken Cheese Steak' },
  // 'italian-veg-cheesesteak', 'ham-american-cheese' — not on FoodTec Steaks → menu-data
};

const HOT_SANDWICH_BY_SLUG: Record<string, { item: string; xl: number }> = {
  'italian-sausage-parm': { item: 'Sausage Parm', xl: 21.0 },
  'special-chicken-cutlet': { item: 'Special Chicken Cutlet', xl: 24.0 },
  'meatball-parm': { item: 'Meatball Parm', xl: 24.0 },
};

const SUB_BY_SLUG: Record<string, { item: string; xl: number }> = {
  'italian-sub': { item: 'Italian', xl: 24.0 },
};

// FoodTec sells ONE wings item per count; the flavor is a sauce modifier inside it.
// Printed-menu sauces: Hot, Mild, Spicy BBQ, Garlic Parmesan, Sweet & Spicy, BBQ,
// Lemon Pepper, Mango Habanero, Sweet Chili, Dry Old Bay. "Honey Habanero" is NOT on
// that list → owner must confirm before it stays on the website.
const WING_FLAVOR_BY_SLUG: Record<string, string> = {
  'plain-wings': 'Wings (10pc) → no sauce',
  'bbq-wings': 'Wings (10pc) → BBQ',
  'garlic-parm-wings': 'Wings (10pc) → Garlic Parmesan',
  'spicy-wings': 'Wings (10pc) → Hot',
  'honey-habanero-wings': 'Wings (10pc) → Sweet & Spicy', // site name "Honey Habanero"; mockData desc says "Sweet & spicy" — owner to confirm
  'mango-habanero-wings': 'Wings (10pc) → Mango Habanero',
};

function norm(s?: string) {
  return (s || '').trim().toLowerCase();
}

/**
 * Resolve the checkout truth for one website menu row.
 * Uses the SLUG (language-independent) — product names are translated in /es,
 * which silently broke the old name-based `includes('broccoli white')` matching.
 */
export function resolveCatalogEntry(category: string, slug: string, fallbackPrice: number): CatalogEntry {
  const cat = norm(category);
  const s = norm(slug);
  const ftCat: FoodTecCategoryKey = SITE_TO_FOODTEC[cat] ?? 'pizza';

  // Pizza + Gourmet Pizza
  if (PIZZA_ITEM_BY_SLUG[s]) {
    const item = PIZZA_ITEM_BY_SLUG[s];
    const isCheese = item === 'Cheese' || item === 'White Cheese';
    const exceptionKey = Object.keys(GOURMET_EXCEPTIONS).find((k) => norm(item).includes(k));
    const ladder = isCheese ? CHEESE_LADDER : exceptionKey ? GOURMET_EXCEPTIONS[exceptionKey] : GOURMET_LADDER;
    return {
      foodtecCategory: 'pizza',
      foodtecItem: item,
      sizes: pizzaLadder(ladder, SICILIAN_BY_FOODTEC_ITEM[item]),
      priceSource: 'foodtec',
      defaultSizeId: 'lrg',
    };
  }

  // Sicilian rows → single price = FoodTec SICILIAN size of the matching pizza
  if (SICILIAN_ROW_BY_SLUG[s]) {
    const item = SICILIAN_ROW_BY_SLUG[s];
    return { foodtecCategory: 'pizza', foodtecItem: `${item} → SICILIAN`, sizes: null, price: SICILIAN_BY_FOODTEC_ITEM[item], priceSource: 'foodtec' };
  }

  if (STROMBOLI_ITEM_BY_SLUG[s]) {
    const { cat: c, item } = STROMBOLI_ITEM_BY_SLUG[s];
    return { foodtecCategory: c, foodtecItem: item, sizes: STROMBOLI_LADDER, priceSource: 'foodtec', defaultSizeId: 'med' };
  }

  if (STEAK_ITEM_BY_SLUG[s]) {
    const { item, xl } = STEAK_ITEM_BY_SLUG[s];
    return { foodtecCategory: 'steaks', foodtecItem: item, sizes: steakLadder(xl), priceSource: 'foodtec', defaultSizeId: 'med' };
  }

  if (HOT_SANDWICH_BY_SLUG[s]) {
    const { item, xl } = HOT_SANDWICH_BY_SLUG[s];
    return { foodtecCategory: 'hotSandwiches', foodtecItem: item, sizes: hoagieLadder(xl), priceSource: 'foodtec', defaultSizeId: 'med' };
  }

  if (SUB_BY_SLUG[s]) {
    const { item, xl } = SUB_BY_SLUG[s];
    return { foodtecCategory: 'subs', foodtecItem: item, sizes: hoagieLadder(xl), priceSource: 'foodtec', defaultSizeId: 'med' };
  }

  if (WING_FLAVOR_BY_SLUG[s]) {
    return { foodtecCategory: 'wings', foodtecItem: WING_FLAVOR_BY_SLUG[s], sizes: WINGS_BONE_IN, priceSource: 'foodtec', defaultSizeId: '10pc' };
  }

  if (SINGLE_PRICE_FOODTEC[s]) {
    const { item, price } = SINGLE_PRICE_FOODTEC[s];
    return { foodtecCategory: ftCat, foodtecItem: item, sizes: null, price, priceSource: 'foodtec' };
  }

  // Everything else: single price from menu data, linked to the right FoodTec category.
  return { foodtecCategory: ftCat, foodtecItem: '', sizes: null, price: fallbackPrice, priceSource: 'menu-data' };
}

/**
 * Known drift between mockData "Price" and FoodTec for single-price items
 * (observed 2026-09-25). The parity script fails on these until mockData is fixed.
 * key = slug, value = FoodTec price.
 */
export const SINGLE_PRICE_FOODTEC: Record<string, { item: string; price: number }> = {
  'garlic-bread': { item: 'Garlic Bread', price: 4.99 },
  'bread-sticks': { item: 'Bread Sticks', price: 7.99 },
  'onion-rings': { item: 'Onion Rings', price: 7.99 },
  'mac-cheese-bites': { item: 'Mac & Cheese Bites', price: 6.99 },
  'cheesesteak-fries': { item: 'Cheese Steak Fries', price: 12.0 },
  'chicken-parmigiana': { item: 'Chicken Parmigiana', price: 16.99 },
  'shrimp-parmigiana': { item: 'Shrimp Parmigiana', price: 17.99 },
  'lobster-ravioli': { item: 'Lobster Ravioli', price: 18.99 },
  'italian-trio': { item: 'Italian Trio', price: 17.99 },
  'crab-cake-platter': { item: 'Crab Cake Platter', price: 26.99 },
  'tacos': { item: 'Tacos', price: 13.99 },
  'pupusas': { item: 'Pupusas', price: 14.99 },
  'nachos-latin': { item: 'Nachos', price: 11.0 },
  'strawberry-cheesecake': { item: 'Strawberry Cheesecake', price: 6.95 },
  'carrot-cake': { item: 'Carrot Cake', price: 6.5 },
  'chocolate-cake': { item: 'Chocolate Cake', price: 6.5 },
  'tiramisu': { item: 'Tiramisu', price: 6.5 },
  'can-soda': { item: 'Pepsi → Can', price: 1.5 },
  'small-garden-salad': { item: 'Side Salad', price: 5.99 },
};
