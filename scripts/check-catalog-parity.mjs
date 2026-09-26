#!/usr/bin/env node
/**
 * Stage 2 catalog-parity guard: every menu row's anchor price in mockData.json must
 * equal what the card shows (foodtecCatalog.ts), which must equal FoodTec.
 *
 *   node scripts/check-catalog-parity.mjs            # report, exit 1 on drift
 *   node scripts/check-catalog-parity.mjs --write    # rewrite mockData "Price" to the anchor
 *
 * Anchor convention (mockData "Price" feeds <meta description> + JSON-LD offers.price):
 *   pizzas LG 16" · strombolis/calzones LG 16" · steaks/hoagies MED · wings 10pc · else single price.
 *
 * Loads the real TypeScript catalog via the project's own `typescript` devDependency
 * (Node 20 has no --experimental-strip-types), so there is no second copy of prices to drift.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = process.cwd();
const WRITE = process.argv.includes('--write');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-'));

for (const f of ['pizzaPricing', 'foodtecCatalog']) {
  const src = fs.readFileSync(path.join(root, 'src/data', `${f}.ts`), 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace(/from '\.\/pizzaPricing'/g, "from './pizzaPricing.mjs'");
  fs.writeFileSync(path.join(tmp, `${f}.mjs`), out);
}
const { resolveCatalogEntry } = await import(pathToFileURL(path.join(tmp, 'foodtecCatalog.mjs')).href);

const mockPath = path.join(root, 'src/data/mockData.json');
const items = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
const problems = [];
const unverified = [];

for (const it of items) {
  const cur = Number(it.Price);
  const e = resolveCatalogEntry(it.Category, it.Slug, cur);
  if (e.priceSource !== 'foodtec') {
    unverified.push(`${it.Category} › ${it['Product Name']} ($${cur.toFixed(2)})`);
    continue;
  }
  const anchor = e.sizes ? (e.sizes.find((s) => s.id === e.defaultSizeId) ?? e.sizes[0]).price : e.price;
  if (Math.abs(anchor - cur) > 0.001) {
    problems.push({ it, from: cur, to: anchor, where: `${e.foodtecCategory} › ${e.foodtecItem}` });
    if (WRITE) it.Price = anchor.toFixed(2);
  }
}

if (problems.length) {
  console.log(`\n${problems.length} anchor-price drift(s) vs FoodTec:`);
  for (const p of problems) {
    console.log(`  ${p.it.Category.padEnd(22)} ${p.it['Product Name'].padEnd(34)} ${p.from.toFixed(2).padStart(6)} → ${p.to.toFixed(2).padStart(6)}   (${p.where})`);
  }
}
console.log(`\n${unverified.length} row(s) not matched to a FoodTec item (price shown from menu data; verify manually).`);
if (process.argv.includes('--list-unverified')) unverified.forEach((u) => console.log('  ' + u));

if (WRITE && problems.length) {
  fs.writeFileSync(mockPath, JSON.stringify(items, null, 2) + '\n');
  console.log(`\n✔ Rewrote ${problems.length} Price field(s) in mockData.json`);
} else if (!problems.length) {
  console.log('✔ Catalog parity OK.');
}
process.exit(!WRITE && problems.length ? 1 : 0);
