/**
 * CATERING ENGINE — Stage 3 (pure, deterministic, unit-testable; no React).
 *
 * Price source: FoodTec live menu /menu/Catering and /menu/Pizza, read 2026-09-26.
 * Every `foodtec` label below is the EXACT button text on FoodTec — including
 * FoodTec's own typos ("Penna Primavera", "Shirmp & Scallop Scampi",
 * "Jumbo Shirimp") — because customers must find the item by name at checkout.
 *
 * Portion model: FoodTec prints NO "serves N" for trays. The site's own copy
 * says HALF 8–10 / FULL 15–20. We plan against the LOW end of each range
 * (8 and 15), which is the built-in safety buffer; we do not add a second one.
 *
 * All money is integer cents.
 */

export type EventType = 'udel' | 'hospital' | 'corporate' | 'athletic';
export type BudgetTier = 'essential' | 'signature' | 'premier';
export type Diet = 'standard' | 'veg' | 'gf' | 'halal';
export type Course = 'main' | 'salad' | 'handheld' | 'protein' | 'app' | 'pizza';
export type TraySize = 'HALF TRAY' | 'FULL TRAY';

export const HALF_SERVES = 8;
export const FULL_SERVES = 15;
/** Slices per LG 16" pie. FoodTec does not print a cut count — owner to confirm. */
export const SLICES_PER_LG = 8;
/** Online guidance stops here; above this the concierge builds the order. */
export const SELF_SERVE_MAX_GUESTS = 200;
/**
 * Micro-group rule: a dedicated diet group this small gets individually plated
 * regular-menu entrées instead of an $85 half-pan that is 75% waste.
 */
export const MICRO_GROUP_MAX = 3;

/** Regular-menu single plates (FoodTec price, 2026-09-25 capture). */
export const PLATES: Record<Exclude<Diet, 'standard'>, { foodtecMenu: 'Pasta' | 'Latin'; foodtec: string; price: number }> = {
  veg:   { foodtecMenu: 'Pasta', foodtec: 'Baked Ziti', price: 1499 },
  gf:    { foodtecMenu: 'Latin', foodtec: '1/2 Pollo Rostizado', price: 1700 },
  halal: { foodtecMenu: 'Pasta', foodtec: 'Chicken Parmigiana', price: 1699 },
};

export interface TrayItem {
  id: string;
  foodtec: string;
  foodtecSection: 'Catering Sub' | 'Catering Apps' | 'Catering Wings' | 'Catering Salad' | 'Catering Pasta' | 'Catering Latin';
  course: Exclude<Course, 'pizza'>;
  half: number; // cents
  full: number; // cents
  /** Diets this item may be offered to. Never "certified" — see notes. */
  diets: Diet[];
  note?: { en: string; es: string };
}

export interface PizzaItem {
  id: string;
  foodtec: string;
  size: 'LG 16"';
  price: number; // cents
  diets: Diet[];
}

// ---------------------------------------------------------------------------
// Catalog (subset used by the planner; full list lives in cateringData.ts)
// Diet tags are derived from FoodTec's own ingredient text, conservatively.
// ---------------------------------------------------------------------------
export const TRAYS: Record<string, TrayItem> = {
  subTray:      { id: 'subTray', foodtec: 'Sub Tray', foodtecSection: 'Catering Sub', course: 'handheld', half: 5000, full: 9000, diets: ['standard'],
                  note: { en: 'Assorted — tell us "no pork" in notes if needed.', es: 'Surtido — indique "sin cerdo" en notas si lo necesita.' } },
  wrapTray:     { id: 'wrapTray', foodtec: 'Wrap Tray', foodtecSection: 'Catering Sub', course: 'handheld', half: 5000, full: 9000, diets: ['standard'] },

  bakedZiti:    { id: 'bakedZiti', foodtec: 'Baked Ziti', foodtecSection: 'Catering Pasta', course: 'main', half: 4995, full: 8999, diets: ['standard', 'veg', 'halal'] },
  stuffedShells:{ id: 'stuffedShells', foodtec: 'Stuffed Shells', foodtecSection: 'Catering Pasta', course: 'main', half: 4995, full: 8999, diets: ['standard', 'veg', 'halal'] },
  bakedRavioli: { id: 'bakedRavioli', foodtec: 'Baked Ravioli', foodtecSection: 'Catering Pasta', course: 'main', half: 4995, full: 8999, diets: ['standard', 'veg', 'halal'] },
  chickenParm:  { id: 'chickenParm', foodtec: 'Chicken Parmigiana', foodtecSection: 'Catering Pasta', course: 'main', half: 4995, full: 8999, diets: ['standard', 'halal'],
                  note: { en: 'Pork-free recipe; not halal-certified.', es: 'Receta sin cerdo; sin certificación halal.' } },
  lobsterRav:   { id: 'lobsterRav', foodtec: 'Lobster Ravioli', foodtecSection: 'Catering Pasta', course: 'main', half: 8000, full: 12000, diets: ['standard'] },
  scampi:       { id: 'scampi', foodtec: 'Shirmp & Scallop Scampi', foodtecSection: 'Catering Pasta', course: 'main', half: 8500, full: 19000, diets: ['standard'],
                  note: { en: 'White-wine sauce, shellfish.', es: 'Salsa de vino blanco, mariscos.' } },

  gardenSalad:  { id: 'gardenSalad', foodtec: 'Garden Salad', foodtecSection: 'Catering Salad', course: 'salad', half: 4000, full: 8000, diets: ['standard', 'veg', 'gf', 'halal'],
                  note: { en: 'Contains egg.', es: 'Contiene huevo.' } },
  greekSalad:   { id: 'greekSalad', foodtec: 'Greek Salad', foodtecSection: 'Catering Salad', course: 'salad', half: 4999, full: 9999, diets: ['standard', 'veg', 'gf', 'halal'] },
  chxCaesar:    { id: 'chxCaesar', foodtec: 'Chx Caesar Salad', foodtecSection: 'Catering Salad', course: 'salad', half: 4999, full: 9999, diets: ['standard', 'halal'],
                  note: { en: 'Croutons: ask to serve on the side for gluten-free guests.', es: 'Crutones: pídalos aparte para invitados sin gluten.' } },
  greekChx:     { id: 'greekChx', foodtec: 'Greek Grlld Chx Salad', foodtecSection: 'Catering Salad', course: 'salad', half: 4999, full: 9999, diets: ['standard', 'gf', 'halal'] },
  salmonSalad:  { id: 'salmonSalad', foodtec: 'Salmon Salad', foodtecSection: 'Catering Salad', course: 'salad', half: 8500, full: 19000, diets: ['standard', 'gf', 'halal'] },

  tradWings:    { id: 'tradWings', foodtec: 'Traditional Wings', foodtecSection: 'Catering Wings', course: 'protein', half: 5999, full: 13499, diets: ['standard', 'halal'] },
  tenders:      { id: 'tenders', foodtec: 'Chicken Tenders', foodtecSection: 'Catering Wings', course: 'protein', half: 5999, full: 13499, diets: ['standard', 'halal'] },
  polloRost:    { id: 'polloRost', foodtec: 'Pollo Rostizado', foodtecSection: 'Catering Latin', course: 'protein', half: 8500, full: 20000, diets: ['standard', 'gf', 'halal'],
                  note: { en: 'Rotisserie chicken — naturally gluten-free; confirm marinade by phone.', es: 'Pollo rostizado — sin gluten por naturaleza; confirme el adobo por teléfono.' } },
  carneAsada:   { id: 'carneAsada', foodtec: 'Carne Asada', foodtecSection: 'Catering Latin', course: 'protein', half: 10000, full: 20000, diets: ['standard', 'gf'],
                  note: { en: 'Served with corn tortillas, rice and beans.', es: 'Con tortillas de maíz, arroz y frijoles.' } },

  garlicKnots:  { id: 'garlicKnots', foodtec: 'Garlic Knots', foodtecSection: 'Catering Apps', course: 'app', half: 6000, full: 9000, diets: ['standard', 'veg', 'halal'] },
  sampler:      { id: 'sampler', foodtec: 'Sampler Platter', foodtecSection: 'Catering Apps', course: 'app', half: 5999, full: 12000, diets: ['standard'] },
  mozzSticks:   { id: 'mozzSticks', foodtec: 'Mozzarella Sticks', foodtecSection: 'Catering Apps', course: 'app', half: 11000, full: 22000, diets: ['standard', 'veg', 'halal'] },
};

export const PIZZAS: Record<string, PizzaItem> = {
  cheese:      { id: 'cheese', foodtec: 'Cheese', size: 'LG 16"', price: 1599, diets: ['standard', 'veg', 'halal'] },
  veggie:      { id: 'veggie', foodtec: 'Veggie', size: 'LG 16"', price: 2099, diets: ['standard', 'veg', 'halal'] },
  bbqChicken:  { id: 'bbqChicken', foodtec: 'BBQ Chicken', size: 'LG 16"', price: 2099, diets: ['standard', 'halal'] },
  theWorks:    { id: 'theWorks', foodtec: 'The Works', size: 'LG 16"', price: 2099, diets: ['standard', 'halal'] }, // beef pepperoni per FoodTec
};

/**
 * Traps found while building this (do NOT "fix" by tagging):
 * - "Penna Primavera" on FoodTec contains crab, shrimp and scallops → NOT vegetarian.
 * - "Chicken Marsala" / "Shirmp & Scallop Scampi" are wine-based → excluded from halal-friendly.
 * - "Lasagna" lists no meat on FoodTec but is not confirmed meatless → excluded from veg.
 * - No gluten-free crust exists on FoodTec → GF guests are never allocated pizza.
 * - Kitchen serves pork (bacon, ham, chorizo) and shellfish → "friendly" only, never certified.
 */

// ---------------------------------------------------------------------------
// Event profiles: portions per guest per course (before appetite multiplier)
// ---------------------------------------------------------------------------
export interface EventProfile {
  appetite: number;
  perGuest: Partial<Record<Exclude<Course, 'pizza'>, number>>;
  slicesPerGuest: number;
}

export const EVENT_PROFILES: Record<EventType, EventProfile> = {
  // Lunch seminar: light, low-mess, eaten standing or at desks.
  udel:      { appetite: 0.9,  perGuest: { handheld: 0.6, salad: 0.5, main: 0.4 },               slicesPerGuest: 1 },
  // Night shift: handhelds + reheat-friendly; staff graze across a 10-hour shift.
  hospital:  { appetite: 1.0,  perGuest: { handheld: 0.5, protein: 0.4, main: 0.4, salad: 0.3 }, slicesPerGuest: 1.5 },
  // Working lunch / all-hands: balanced plate.
  corporate: { appetite: 1.0,  perGuest: { main: 0.6, salad: 0.6, handheld: 0.4, app: 0.2 },    slicesPerGuest: 1 },
  // Athletes: protein-and-carb heavy.
  athletic:  { appetite: 1.35, perGuest: { main: 0.8, protein: 0.6, salad: 0.5, app: 0.3 },     slicesPerGuest: 2 },
};

/** Item chosen per (tier, course, diet). `null` = no safe item → reallocate. */
type Pick = Partial<Record<Diet, string | null>>;
const PICKS: Record<BudgetTier, Record<Course, Pick>> = {
  essential: {
    main:     { standard: 'bakedZiti',   veg: 'bakedZiti',     gf: null,          halal: 'bakedZiti' },
    salad:    { standard: 'gardenSalad', veg: 'gardenSalad',   gf: 'gardenSalad', halal: 'gardenSalad' },
    handheld: { standard: 'subTray',     veg: null,            gf: null,          halal: null },
    protein:  { standard: 'tenders',     veg: null,            gf: 'polloRost',   halal: 'tenders' },
    app:      { standard: 'garlicKnots', veg: 'garlicKnots',   gf: null,          halal: 'garlicKnots' },
    pizza:    { standard: 'cheese',      veg: 'cheese',        gf: null,          halal: 'cheese' },
  },
  signature: {
    main:     { standard: 'chickenParm', veg: 'stuffedShells', gf: null,          halal: 'chickenParm' },
    salad:    { standard: 'chxCaesar',   veg: 'greekSalad',    gf: 'greekChx',    halal: 'greekChx' },
    handheld: { standard: 'wrapTray',    veg: null,            gf: null,          halal: null },
    protein:  { standard: 'tradWings',   veg: null,            gf: 'polloRost',   halal: 'tradWings' },
    app:      { standard: 'sampler',     veg: 'garlicKnots',   gf: null,          halal: 'garlicKnots' },
    pizza:    { standard: 'bbqChicken',  veg: 'veggie',        gf: null,          halal: 'bbqChicken' },
  },
  premier: {
    main:     { standard: 'lobsterRav',  veg: 'bakedRavioli',  gf: null,          halal: 'chickenParm' },
    salad:    { standard: 'salmonSalad', veg: 'greekSalad',    gf: 'salmonSalad', halal: 'salmonSalad' },
    handheld: { standard: 'wrapTray',    veg: null,            gf: null,          halal: null },
    protein:  { standard: 'carneAsada',  veg: null,            gf: 'carneAsada',  halal: 'polloRost' },
    app:      { standard: 'mozzSticks',  veg: 'mozzSticks',    gf: null,          halal: 'mozzSticks' },
    pizza:    { standard: 'theWorks',    veg: 'veggie',        gf: null,          halal: 'theWorks' },
  },
};

/** Where a diet group's portions go when a course has no safe item. */
const FALLBACK_ORDER: Record<Diet, Exclude<Course, 'pizza'>[]> = {
  standard: ['main'],
  veg: ['main', 'salad'],
  gf: ['protein', 'salad'],
  halal: ['main', 'protein', 'salad'],
};

// ---------------------------------------------------------------------------
export interface PlanInput {
  guests: number;
  event: EventType;
  tier: BudgetTier;
  /** Percent of guests (0–100) in each dedicated group; clamped so the sum ≤ 100. */
  split: { veg: number; gf: number; halal: number };
  includePizza: boolean;
}

export interface PlanLine {
  key: string;
  course: Course;
  diet: Diet;
  foodtecMenu: 'Catering' | 'Pizza' | 'Pasta' | 'Latin';
  foodtecSection: string;
  foodtec: string;
  size: TraySize | 'LG 16"' | 'PLATE';
  qty: number;
  unit: number;
  subtotal: number;
  portions: number; // planned portions (or slices for pizza)
  capacity: number; // portions (or slices) the qty actually provides
  note?: { en: string; es: string };
}

export interface Plan {
  input: PlanInput;
  groups: Record<Diet, number>;
  lines: PlanLine[];
  total: number;
  perGuest: number;
  flags: {
    concierge: boolean;         // > SELF_SERVE_MAX_GUESTS
    overPCardLimit: boolean;    // total > $5,000
    splitClamped: boolean;
    gfNoPizza: boolean;
    microGroups: Diet[];
  };
}

/** Cheapest mix of FULL/HALF trays that covers `portions`. */
export function trayMix(portions: number, half: number, full: number): { full: number; half: number; cost: number; capacity: number } {
  if (portions <= 0) return { full: 0, half: 0, cost: 0, capacity: 0 };
  let best = { full: 0, half: 0, cost: Infinity, capacity: 0 };
  const maxFull = Math.ceil(portions / FULL_SERVES);
  for (let f = 0; f <= maxFull; f++) {
    const rest = Math.max(0, portions - f * FULL_SERVES);
    const h = Math.ceil(rest / HALF_SERVES);
    const cost = f * full + h * half;
    const capacity = f * FULL_SERVES + h * HALF_SERVES;
    // Within 1% on cost, prefer fewer pans (less buffet space, less setup).
    const pans = f + h, bestPans = best.full + best.half;
    const cheaper = cost < best.cost * 0.99;
    const similar = Math.abs(cost - best.cost) <= best.cost * 0.01;
    if (best.cost === Infinity || cheaper || (similar && pans < bestPans)) {
      best = { full: f, half: h, cost, capacity };
    }
  }
  return best;
}

export function clampSplit(split: PlanInput['split']): { split: PlanInput['split']; clamped: boolean } {
  const s = {
    veg: Math.max(0, Math.min(100, Math.round(split.veg))),
    gf: Math.max(0, Math.min(100, Math.round(split.gf))),
    halal: Math.max(0, Math.min(100, Math.round(split.halal))),
  };
  const sum = s.veg + s.gf + s.halal;
  if (sum <= 100) return { split: s, clamped: false };
  const k = 100 / sum;
  return { split: { veg: Math.floor(s.veg * k), gf: Math.floor(s.gf * k), halal: Math.floor(s.halal * k) }, clamped: true };
}

export function buildPlan(raw: PlanInput): Plan {
  const guests = Math.max(10, Math.round(raw.guests));
  const { split, clamped } = clampSplit(raw.split);
  const groups: Record<Diet, number> = {
    veg: Math.round((guests * split.veg) / 100),
    gf: Math.round((guests * split.gf) / 100),
    halal: Math.round((guests * split.halal) / 100),
    standard: 0,
  };
  groups.standard = Math.max(0, guests - groups.veg - groups.gf - groups.halal);

  const profile = EVENT_PROFILES[raw.event];
  const picks = PICKS[raw.tier];

  // 1) portions needed per (course, diet) with reallocation for missing items
  const need = new Map<string, { course: Course; diet: Diet; itemId: string; portions: number }>();
  const add = (course: Course, diet: Diet, itemId: string, portions: number) => {
    const k = `${course}:${diet}:${itemId}`;
    const cur = need.get(k);
    if (cur) cur.portions += portions;
    else need.set(k, { course, diet, itemId, portions });
  };

  const plates: PlanLine[] = [];
  (Object.keys(groups) as Diet[]).forEach((diet) => {
    const n = groups[diet];
    if (n === 0) return;
    if (diet !== 'standard' && n <= MICRO_GROUP_MAX) {
      const pl = PLATES[diet];
      plates.push({
        key: `plate:${diet}`, course: 'main', diet, foodtecMenu: pl.foodtecMenu, foodtecSection: pl.foodtecMenu,
        foodtec: pl.foodtec, size: 'PLATE', qty: n, unit: pl.price, subtotal: n * pl.price, portions: n, capacity: n,
        note: { en: 'Individually plated & labelled — cheaper than a dedicated pan for a small group.', es: 'Platos individuales etiquetados — más económico que una bandeja para un grupo pequeño.' },
      });
      return;
    }
    (Object.entries(profile.perGuest) as [Exclude<Course, 'pizza'>, number][]).forEach(([course, per]) => {
      const portions = n * per * profile.appetite;
      let item = picks[course][diet];
      let target: Exclude<Course, 'pizza'> = course;
      if (!item) {
        // reallocate to the first fallback course that has a safe item
        for (const fb of FALLBACK_ORDER[diet]) {
          const cand = picks[fb][diet];
          if (cand) { item = cand; target = fb; break; }
        }
      }
      if (item) add(target, diet, item, portions);
    });

    if (raw.includePizza) {
      const slices = n * profile.slicesPerGuest * profile.appetite;
      const pz = picks.pizza[diet];
      if (pz) add('pizza', diet, pz, slices);
      else {
        // GF: no crust available → give the equivalent as salad/protein portions (≈ 2.5 slices per portion)
        const fb = FALLBACK_ORDER[diet].map((c) => ({ c, id: picks[c][diet] })).find((x) => x.id);
        if (fb?.id) add(fb.c, diet, fb.id, slices / 2.5);
      }
    }
  });

  // 2) merge identical items across diet groups ONLY for 'standard' pans; dedicated
  //    diet pans stay separate so they can be labelled and held apart on the buffet.
  const lines: PlanLine[] = [...plates];
  need.forEach(({ course, diet, itemId, portions }) => {
    const p = Math.ceil(portions - 1e-9);
    if (course === 'pizza') {
      const pz = PIZZAS[itemId];
      const qty = Math.ceil(p / SLICES_PER_LG);
      lines.push({
        key: `pizza:${diet}:${itemId}`, course, diet, foodtecMenu: 'Pizza', foodtecSection: 'Pizza',
        foodtec: pz.foodtec, size: pz.size, qty, unit: pz.price, subtotal: qty * pz.price,
        portions: p, capacity: qty * SLICES_PER_LG,
      });
      return;
    }
    const t = TRAYS[itemId];
    const mix = trayMix(p, t.half, t.full);
    if (mix.full) lines.push({
      key: `${course}:${diet}:${itemId}:F`, course, diet, foodtecMenu: 'Catering', foodtecSection: t.foodtecSection,
      foodtec: t.foodtec, size: 'FULL TRAY', qty: mix.full, unit: t.full, subtotal: mix.full * t.full,
      portions: p, capacity: mix.capacity, note: t.note,
    });
    if (mix.half) lines.push({
      key: `${course}:${diet}:${itemId}:H`, course, diet, foodtecMenu: 'Catering', foodtecSection: t.foodtecSection,
      foodtec: t.foodtec, size: 'HALF TRAY', qty: mix.half, unit: t.half, subtotal: mix.half * t.half,
      portions: mix.full ? 0 : p, capacity: mix.full ? 0 : mix.capacity, note: t.note,
    });
  });

  const courseOrder: Course[] = ['main', 'protein', 'handheld', 'salad', 'app', 'pizza'];
  const dietOrder: Diet[] = ['standard', 'veg', 'gf', 'halal'];
  lines.sort((a, b) =>
    courseOrder.indexOf(a.course) - courseOrder.indexOf(b.course) ||
    dietOrder.indexOf(a.diet) - dietOrder.indexOf(b.diet) ||
    a.foodtec.localeCompare(b.foodtec) ||
    (a.size === 'FULL TRAY' ? -1 : 1),
  );

  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  return {
    input: { ...raw, guests, split },
    groups,
    lines,
    total,
    perGuest: Math.round(total / guests),
    flags: {
      concierge: guests > SELF_SERVE_MAX_GUESTS,
      overPCardLimit: total > 5000 * 100,
      splitClamped: clamped,
      gfNoPizza: raw.includePizza && groups.gf > 0,
      microGroups: (['veg', 'gf', 'halal'] as Diet[]).filter((d) => groups[d] > 0 && groups[d] <= MICRO_GROUP_MAX),
    },
  };
}

export const usd = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/** Plain-text checklist the customer pastes into FoodTec notes / email to AP. */
export function planToChecklist(plan: Plan, meta: { eventLabel: string; tierLabel: string; org?: string; po?: string; deliverTo?: string; when?: string }): string {
  const L: string[] = [];
  L.push('RAGGIO GOURMET & PIZZA — CATERING PLAN');
  L.push(`${plan.input.guests} guests · ${meta.eventLabel} · ${meta.tierLabel}`);
  if (meta.org) L.push(`Organization: ${meta.org}`);
  if (meta.po) L.push(`PO / cost center: ${meta.po}`);
  if (meta.deliverTo) L.push(`Deliver to (building/room): ${meta.deliverTo}`);
  if (meta.when) L.push(`Requested time: ${meta.when}`);
  L.push('');
  const byMenu: Record<string, PlanLine[]> = {};
  plan.lines.forEach((l) => { (byMenu[l.foodtecMenu] ||= []).push(l); });
  (['Catering', 'Pizza', 'Pasta', 'Latin'] as const).forEach((m) => {
    if (!byMenu[m]) return;
    L.push(`FoodTec › ${m}`);
    byMenu[m].forEach((l) => {
      const tag = l.diet === 'standard' ? '' : ` [${l.diet.toUpperCase()} — label & separate]`;
      L.push(`  ${l.qty} × ${l.foodtec} — ${l.size} @ ${usd(l.unit)} = ${usd(l.subtotal)}${tag}`);
    });
  });
  L.push('');
  L.push(`Estimated food total: ${usd(plan.total)} (~${usd(plan.perGuest)}/guest). Delaware has no sales tax.`);
  L.push('Please email an ITEMIZED receipt (merchant name & address, date, item, qty, amount, total).');
  return L.join('\n');
}
