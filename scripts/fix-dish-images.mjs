#!/usr/bin/env node
/**
 * Stage 2 — deterministic dish-image repair for src/data/mockData.json
 *
 *   node scripts/fix-dish-images.mjs           # dry run: prints the plan, exit 1 if changes needed
 *   node scripts/fix-dish-images.mjs --write   # apply
 *
 * Safe on BOTH machines:
 *  - Sandbox / PR #19 (15 new PNGs are NOT committed yet) → targets that don't exist on
 *    disk fall back to `ifMissing` (usually null = typographic plate). Never a wrong photo.
 *  - Owner PC (C:\Users\maras\Desktop\raggio-headless-web, 15 untracked PNGs present,
 *    mockData has an uncommitted edit that put breakfast-classic-platter on Veggie Pizza)
 *    → the new photos are wired to the dishes they actually depict.
 *
 * Writes "Image" and "image" identically (lib/menu.ts reads either), preserves key order,
 * and enforces: one photo ↔ at most one slug per Category.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const WRITE = process.argv.includes('--write');
const mockPath = path.join(root, 'src/data/mockData.json');
const items = JSON.parse(fs.readFileSync(mockPath, 'utf8'));

const P = '/images/products/';
const D = '/images/dishes/';

/** slug → { src, ifMissing } ; src:null removes the photo on purpose. */
const PLAN = {
  // ---------- Pizza ----------
  'plain-cheese-pizza': { src: P + 'plain-cheese-luxury-dark.webp' },
  'signature-thin-crust': { src: P + 'user-pizza-ny-style-relit.jpg' },
  'the-works-pizza': { src: P + 'product-meat-lover.jpg' },
  'house-pizza': { src: P + 'product-green-pepper-sausage.jpg' }, // peppers+sausage ≈ House Special
  'white-special-pizza': { src: P + 'product-spinach-white.jpg' },
  'buffalo-chicken-pizza': { src: D + 'pizza-buffalo-chicken-luxury-8k.png', ifMissing: P + 'product-buffalo-chicken.jpg' },
  'veggie-pizza': { src: null }, // WAS breakfast-classic-platter on the owner PC. No veggie photo exists → plate.
  'chicken-parm-pizza': { src: null }, // WAS dinner-chicken-parm (a pasta plate)
  'chicken-ranch-pizza': { src: null }, // WAS pizza-bbq-chicken (wrong sauce/toppings)
  // ---------- Sicilian ----------
  'sicilian-meat-lover': { src: P + 'raggio-sicilian-square-luxury-8k.png' },
  'buffalo-chicken-sicilian': { src: null }, // WAS a round pie
  'chicken-ranch-sicilian': { src: null },
  // ---------- Cheesesteaks ----------
  'philly-cheesesteak': { src: P + 'raggio-cheesesteak-luxury-8k.png' }, // WAS a green-pepper PIZZA
  // ---------- Strombolis + Calzones ----------
  'cheese-calzone': { src: D + 'calzone-golden-luxury-8k.png' },
  'italian-stromboli': { src: D + 'stromboli-italian-luxury-8k.png', ifMissing: null },
  'cheese-stromboli': { src: null },
  'chicken-stromboli': { src: null },
  'buffalo-chicken-stromboli': { src: null },
  'meat-lovers-stromboli': { src: null },
  'vegetable-stromboli': { src: null },
  'philly-special-stromboli': { src: null },
  'philly-chicken-stromboli': { src: null },
  // ---------- Wings ----------
  'spicy-wings': { src: D + 'wings-buffalo-jumbo-luxury-8k.png' },
  // ---------- Burgers ----------
  'burger': { src: null },
  'cheeseburger': { src: null },
  'double-cheeseburger': { src: D + 'burger-smash-luxury-8k.png' },
  'bacon-double-cheeseburger': { src: null },
  'texas-cheeseburger': { src: D + 'burger-texas-luxury-8k.png', ifMissing: null },
  'chicken-ranch-burger': { src: D + 'burger-chicken-ranch-luxury-8k.png', ifMissing: null },
  'chicken-caesar-burger': { src: D + 'burger-chicken-caesar-luxury-8k.png', ifMissing: null },
  'cheeseburger-sandwich': { src: null },
  // ---------- Quesadillas ----------
  'chicken-steak-quesadilla': { src: D + 'quesadilla-chicken-luxury-8k.png' },
  'crab-quesadilla': { src: null },
  'bbq-chicken-quesadilla': { src: null },
  'texas-chicken-quesadilla': { src: null },
  'buffalo-chicken-quesadilla': { src: null },
  'steak-quesadilla': { src: null },
  'seafood-quesadilla': { src: null },
  // ---------- Salads ----------
  'greek-salad': { src: D + 'salad-greek-luxury-8k.png' },
  'greek-chicken-salad': { src: null },
  // ---------- New owner-PC photos, wired to the dish they depict ----------
  'chicken-parmigiana': { src: D + 'dinner-chicken-parm-luxury-8k.png', ifMissing: null },
  'fried-calamari': { src: D + 'appetizer-calamari-luxury-8k.png', ifMissing: null },
  'garlic-knots': { src: D + 'side-garlic-knots-luxury-8k.png', ifMissing: null },
  'italian-sub': { src: D + 'sub-italian-grinder-luxury-8k.png', ifMissing: null },
  'meatball-parm': { src: D + 'sandwich-meatball-parm-sub-luxury-8k.png', ifMissing: null },
  'fried-seafood-combo': { src: D + 'seafood-combo-platter-luxury-8k.png', ifMissing: null },
  'house-breakfast': { src: D + 'breakfast-classic-platter-luxury-8k.png', ifMissing: null },
  // Deliberately NOT wired (owner must confirm what the photo shows vs. what we sell):
  //   pasta-penne-vodka-luxury-8k.png   → no "penne vodka" row in mockData (FoodTec: CYO Pasta w/ Vodka Sauce)
  //   soup-italian-minestrone-luxury-8k → "Home Soup" recipe unknown
  //   pizza-bbq-chicken-luxury-8k.png   → FoodTec sells "BBQ Chicken" pizza but mockData has no such row (add it)
};

const exists = (src) => !!src && fs.existsSync(path.join(root, 'public', src));
const changes = [];
const warnings = [];

for (const it of items) {
  const slug = String(it.Slug || '').toLowerCase();
  if (!(slug in PLAN)) continue;
  const { src, ifMissing } = PLAN[slug];
  let target = src;
  if (target && !exists(target)) {
    warnings.push(`${slug}: ${target} not on disk → ${ifMissing ?? 'typographic plate'}`);
    target = ifMissing === undefined ? null : ifMissing;
    if (target && !exists(target)) target = null;
  }
  const before = it.Image || it.image || null;
  if (before === target) continue;
  changes.push({ slug, before, after: target });
  if (target) {
    it.Image = target;
    it.image = target;
  } else {
    delete it.Image;
    delete it.image;
  }
}

// Uniqueness audit (after plan)
const byCat = new Map();
for (const it of items) {
  const img = it.Image || it.image;
  if (!img) continue;
  const key = `${it.Category}::${img}`;
  byCat.set(key, [...(byCat.get(key) || []), it.Slug]);
}
const dupes = [...byCat.entries()].filter(([, v]) => v.length > 1);

console.log(`\nDish-image plan (${WRITE ? 'WRITE' : 'dry run'})`);
for (const c of changes) console.log(`  ${c.slug.padEnd(28)} ${String(c.before ?? '—').padEnd(56)} → ${c.after ?? '— (plate)'}`);
if (warnings.length) {
  console.log('\nMissing files (commit these from the owner PC to upgrade the plate to a photo):');
  warnings.forEach((w) => console.log('  ' + w));
}
if (dupes.length) {
  console.log('\nDUPLICATE photos within a category (fix before merge):');
  dupes.forEach(([k, v]) => console.log(`  ${k} ← ${v.join(', ')}`));
}

if (WRITE && changes.length) {
  fs.writeFileSync(mockPath, JSON.stringify(items, null, 2) + '\n');
  console.log(`\nWrote ${changes.length} change(s) to src/data/mockData.json`);
}
process.exit(!WRITE && (changes.length || dupes.length) ? 1 : 0);
