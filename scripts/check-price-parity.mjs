#!/usr/bin/env node
/**
 * Price-parity guard for raggiogourmetpizza.com  ⟷  FoodTec (Philly Express).
 *
 *   node scripts/check-price-parity.mjs          # report only, exit 1 on drift
 *   node scripts/check-price-parity.mjs --write  # fix "Price" fields in mockData.json in place
 *
 * --write edits ONLY the "Price" value of Pizza / Gourmet Pizza rows, preserving every
 * other field (safe with uncommitted local image-path edits in mockData.json).
 *
 * Convention: for sized items, mockData "Price" == the LARGE 16" price, because
 * product pages use it for <meta description> and JSON-LD `offers.price`.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const WRITE = process.argv.includes('--write');

// Keep in sync with src/data/pizzaPricing.ts (verified on FoodTec 2026-09-25)
const CHEESE_LRG = 15.99;
const GOURMET_LRG = 20.99;
const GOURMET_EXCEPTIONS_LRG = {
  'broccoli white': 19.0,
  'spinach white': 19.0,
  'bianca white': 19.0,
  'shrimp parm': 18.99,
};

const problems = [];
const mockPath = path.join(root, 'src/data/mockData.json');
const raw = fs.readFileSync(mockPath, 'utf8');
const items = JSON.parse(raw);

function expectedLarge(item) {
  const cat = String(item.Category || '').toLowerCase();
  const name = String(item['Product Name'] || '').toLowerCase();
  if (/slice|can drink/.test(name)) return null;
  if (cat === 'pizza') return CHEESE_LRG;
  if (cat === 'gourmet pizza') {
    for (const k of Object.keys(GOURMET_EXCEPTIONS_LRG)) if (name.includes(k)) return GOURMET_EXCEPTIONS_LRG[k];
    return GOURMET_LRG;
  }
  return null;
}

let text = raw;
for (const item of items) {
  const exp = expectedLarge(item);
  if (exp == null) continue;
  const cur = Number(item.Price);
  if (Math.abs(cur - exp) > 0.001) {
    problems.push(`mockData: "${item['Product Name']}" Price ${cur.toFixed(2)} → expected ${exp.toFixed(2)} (Large 16")`);
    if (WRITE) {
      // Targeted, order-preserving replacement inside this item's JSON block only.
      const nameEsc = item['Product Name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`("Product Name":\\s*"${nameEsc}"[\\s\\S]*?"Price":\\s*")([0-9.]+)(")`);
      text = text.replace(re, `$1${exp.toFixed(2)}$3`);
    }
  }
}

// Hard-coded price strings that must not drift from the ladder
const scan = [
  'messages/en.json',
  'messages/es.json',
  'src/components/SignatureDishShowcase.tsx',
  'src/components/HeroSlider.tsx',
];
for (const rel of scan) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, 'utf8');
  for (const bad of ['$21.99', '$24.99', '$23.99']) {
    const lines = s.split('\n');
    lines.forEach((ln, i) => {
      if (ln.includes(bad) && /price|Large|16/i.test(ln)) {
        problems.push(`${rel}:${i + 1} hard-coded ${bad} next to a Large/price label — derive from pizzaPricing.ts`);
      }
    });
  }
}

if (WRITE && text !== raw) {
  fs.writeFileSync(mockPath, text);
  console.log('✔ mockData.json Price fields updated in place.');
}

if (problems.length) {
  console.log(`\n${problems.length} price-parity issue(s):\n- ` + problems.join('\n- '));
  if (!WRITE) process.exit(1);
} else {
  console.log('✔ Price parity OK (site ⟷ FoodTec ladder).');
}
