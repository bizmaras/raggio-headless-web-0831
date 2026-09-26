/**
 * Dish-image provenance.
 *
 * mockData.json stays the place where an item's photo path lives (that is what
 * lib/menu.ts#applyLocalOverrides reads). This file adds the metadata a card
 * needs to present that photo HONESTLY:
 *
 *   kind 'exact'          photo is this dish.
 *   kind 'representative' photo is the same family, not this recipe → the card
 *                         prints a small caption ("Shown: Buffalo style").
 *   (no photo)            the card renders a typographic "menu plate" instead
 *                         of re-using a neighbour's photo.
 *
 * Rule enforced by scripts/fix-dish-images.mjs: one photo may back at most ONE
 * slug per website category. Seven quesadillas sharing one image read as stock
 * photography — and a crab quesadilla shown as chicken is a "not as pictured"
 * complaint waiting to happen.
 */

export type ImageKind = 'exact' | 'representative';

export interface DishImageMeta {
  kind: ImageKind;
  caption?: { en: string; es: string };
  /** CSS object-position for editorial crops (the 8K PNGs are 1200x896 landscape). */
  focal?: string;
}

export const DISH_IMAGE_META: Record<string, DishImageMeta> = {
  // Pizza
  'plain-cheese-pizza': { kind: 'exact', focal: '50% 50%' },
  'buffalo-chicken-pizza': { kind: 'exact' },
  'white-special-pizza': {
    kind: 'representative',
    caption: { en: 'Shown: spinach white pie', es: 'En la foto: pizza blanca de espinaca' },
  },
  'house-pizza': {
    kind: 'representative',
    caption: { en: 'Shown: peppers & sausage', es: 'En la foto: pimientos y salchicha' },
  },
  'the-works-pizza': {
    kind: 'representative',
    caption: { en: 'Shown: meat lover build', es: 'En la foto: versión carnes' },
  },
  'sicilian-meat-lover': { kind: 'representative', caption: { en: 'Shown: Sicilian square', es: 'En la foto: siciliana cuadrada' } },
  // Sandwich / steak
  'philly-cheesesteak': { kind: 'exact', focal: '50% 60%' },
  // Stromboli / calzone
  'cheese-calzone': { kind: 'exact' },
  'italian-stromboli': { kind: 'exact' },
  // Wings
  'spicy-wings': { kind: 'representative', caption: { en: 'Shown: hot sauce', es: 'En la foto: salsa picante' } },
  // Burgers
  'double-cheeseburger': { kind: 'exact' },
  'texas-cheeseburger': { kind: 'exact' },
  'chicken-ranch-burger': { kind: 'exact' },
  'chicken-caesar-burger': { kind: 'exact' },
  // Quesadillas / salads / latin / pasta / apps / desserts
  'chicken-steak-quesadilla': { kind: 'representative', caption: { en: 'Shown: chicken', es: 'En la foto: pollo' } },
  'greek-salad': { kind: 'exact' },
  'baked-ziti': { kind: 'exact' },
  'chicken-parmigiana': { kind: 'exact' },
  'mozzarella-sticks': { kind: 'exact' },
  'fried-calamari': { kind: 'exact' },
  'garlic-knots': { kind: 'exact' },
  'italian-sub': { kind: 'exact' },
  'meatball-parm': { kind: 'exact' },
  'fried-seafood-combo': { kind: 'exact' },
  'house-breakfast': { kind: 'representative', caption: { en: 'Shown: breakfast platter', es: 'En la foto: plato de desayuno' } },
  'tiramisu': { kind: 'exact' },
};

/**
 * Hard guard: photos that must NEVER render for a slug, even if mockData or
 * Contentful supplies them. These are the exact regressions found in the audit.
 */
export const IMAGE_BLOCKLIST: Record<string, string[]> = {
  // Local uncommitted edit on the owner PC (C:\Users\maras\Desktop\raggio-headless-web) mapped a
  // breakfast plate to a pizza.
  'veggie-pizza': ['breakfast-classic-platter'],
  // Same local edit: a pasta dinner photo on a pizza, and a BBQ pie on a ranch/bacon pie.
  'chicken-parm-pizza': ['dinner-chicken-parm'],
  'chicken-ranch-pizza': ['pizza-bbq-chicken'],
  'chicken-ranch-sicilian': ['pizza-bbq-chicken'],
  // Round pie photo on a square Sicilian.
  'buffalo-chicken-sicilian': ['pizza-buffalo-chicken', 'product-buffalo-chicken'],
  // PR #19 state: a green-pepper PIZZA photo on the Philly cheesesteak SANDWICH.
  'philly-cheesesteak': ['product-green-pepper-sausage'],
  // A calzone (folded half-moon) is not a stromboli (rolled log).
  'cheese-stromboli': ['calzone-golden'],
  'chicken-stromboli': ['calzone-golden'],
  'buffalo-chicken-stromboli': ['calzone-golden'],
  'meat-lovers-stromboli': ['calzone-golden'],
  'vegetable-stromboli': ['calzone-golden'],
  'philly-special-stromboli': ['calzone-golden'],
  'philly-chicken-stromboli': ['calzone-golden'],
  'italian-stromboli': ['calzone-golden'],
  // Seafood/crab/steak quesadillas shown as chicken.
  'crab-quesadilla': ['quesadilla-chicken'],
  'seafood-quesadilla': ['quesadilla-chicken'],
  'steak-quesadilla': ['quesadilla-chicken'],
  // A hot-sandwich row showing a burger.
  'cheeseburger-sandwich': ['burger-smash'],
};

export function isBlocked(slug: string, src?: string | null): boolean {
  if (!src) return false;
  const rules = IMAGE_BLOCKLIST[(slug || '').toLowerCase()];
  return !!rules?.some((needle) => src.includes(needle));
}

export function imageMeta(slug: string): DishImageMeta | undefined {
  return DISH_IMAGE_META[(slug || '').toLowerCase()];
}
