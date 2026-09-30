/**
 * CRAFT-CLAIM LEDGER
 *
 * Every "artisanal" attribute a card can print lives here with its evidence.
 * Cards render ONLY claims whose status is 'verified', unless the preview flag
 * NEXT_PUBLIC_SHOW_UNVERIFIED_CLAIMS=true is set (then they render with a dashed
 * outline so the owner can see the design and sign off).
 *
 * Why: the FTC judges a restaurant ad by its "net impression" — photos and
 * wording together — and requires claims to be evidence-based. "San Marzano"
 * in particular is a protected Italian D.O.P. designation and the Consorzio has
 * said only ~5% of US "San Marzano" is genuine. Printing it without the can in
 * the kitchen is a liability, not a garnish.
 *
 * Evidence sources:
 *  [FT]  FoodTec item descriptions, observed 2026-09-25
 *  [PDF] /public/raggio-full-menu.pdf (the owner's own printed menu)
 */

export type ClaimStatus = 'verified' | 'owner-confirm';

export type ClaimId =
  | 'grande-mozzarella'
  | 'deck-oven'
  | 'signature-thin-crust'
  | 'homemade-garlic-sauce'
  | 'size-16'
  | 'ribeye-marinated'
  | 'meats-sliced-to-order'
  | 'stromboli-16'
  | 'cold-ferment-48h'
  | 'san-marzano'
  | 'grande-fresh-curd'
  | 'eight-slices-16'
  | 'wings-jumbo';

export interface CraftClaim {
  id: ClaimId;
  status: ClaimStatus;
  /** Short chip text (≤ 22 chars so it never wraps on a 360px phone). */
  chip: { en: string; es: string };
  /** One-line sensory/technical story used in Editorial mode + the detail sheet. */
  story: { en: string; es: string };
  evidence: string;
}

export const CLAIMS: Record<ClaimId, CraftClaim> = {
  'grande-mozzarella': {
    id: 'grande-mozzarella',
    status: 'verified',
    chip: { en: '100% Grande Mozzarella', es: '100% Mozzarella Grande' },
    story: {
      en: '100% Grande mozzarella, made in Wisconsin — the stretch-and-blister cheese of serious pizzerias.',
      es: 'Mozzarella 100% Grande, hecha en Wisconsin — la que se estira y dora en las mejores pizzerías.',
    },
    evidence: '[PDF] "100% Grande Mozzarella" on Pizza, Sicilian and Gourmet headers; [FT] "Grande Mozzarella" in every pizza description',
  },
  'deck-oven': {
    id: 'deck-oven',
    status: 'verified',
    chip: { en: 'Deck-oven baked', es: 'Horno de piso' },
    story: {
      en: 'Baked directly on the oven deck for a crisp, leopard-spotted underside.',
      es: 'Horneada directamente sobre la piedra del horno para una base crujiente.',
    },
    evidence: 'OWNER CORRECTION 2026-09-30: the oven is a DECK OVEN (not brick). The old PDF header "Brick Oven Pizza" is outdated; use "deck oven" everywhere.',
  },
  'signature-thin-crust': {
    id: 'signature-thin-crust',
    status: 'verified',
    chip: { en: 'Signature thin crust', es: 'Masa fina de la casa' },
    story: { en: 'Our signature thin crust, hand-stretched to order.', es: 'Nuestra masa fina de la casa, estirada al momento.' },
    evidence: '[PDF] Plain Cheese Pizza: "Our signature thin crust with Grande mozzarella". ("hand-stretched" → owner-confirm; remove if not true)',
  },
  'homemade-garlic-sauce': {
    id: 'homemade-garlic-sauce',
    status: 'verified',
    chip: { en: 'House garlic sauce', es: 'Salsa de ajo casera' },
    story: { en: 'Our special homemade garlic sauce replaces the tomato base.', es: 'Nuestra salsa de ajo casera reemplaza la base de tomate.' },
    evidence: '[PDF] White Cheese Pizza: "Our special homemade garlic sauce & Grande mozzarella"',
  },
  'size-16': {
    id: 'size-16',
    status: 'verified',
    chip: { en: '16" Large', es: '16" Grande' },
    story: { en: 'Sizes 12" · 14" · 16" · 18", plus Sicilian square.', es: 'Tamaños 12" · 14" · 16" · 18" y siciliana cuadrada.' },
    evidence: '[FT] size buttons SM 12" / MED 14" / LG 16" / XL 18" / SICILIAN',
  },
  'ribeye-marinated': {
    id: 'ribeye-marinated',
    status: 'verified',
    chip: { en: 'Marinated rib-eye', es: 'Rib-eye marinado' },
    story: {
      en: 'Thin-sliced, marinated rib-eye chopped on the flat-top — Philly style.',
      es: 'Rib-eye marinado, en láminas finas y picado en la plancha — estilo Filadelfia.',
    },
    evidence: '[PDF] Cheesesteaks: "We use marinated thinly sliced and chopped Rib-eye steak or Chicken Breast."',
  },
  'meats-sliced-to-order': {
    id: 'meats-sliced-to-order',
    status: 'verified',
    chip: { en: 'Sliced to order', es: 'Cortado al momento' },
    story: { en: 'All deli meats are sliced fresh to order.', es: 'Todos los fiambres se cortan al momento.' },
    evidence: '[PDF] Subs section: "All meats are sliced fresh to order."',
  },
  'stromboli-16': {
    id: 'stromboli-16',
    status: 'verified',
    chip: { en: '14" or 16"', es: '14" o 16"' },
    story: { en: 'Rolled and baked in two sizes: 14" medium, 16" large.', es: 'Enrollado y horneado en dos tamaños: 14" y 16".' },
    evidence: '[PDF] "Strombolis + Calzones MD. 14" 15.99 LG. 16" 19.99"; [FT] MED $15.99 / LG $19.99',
  },
  // ---------------- NOT YET EVIDENCED — owner must confirm ----------------
  'cold-ferment-48h': {
    id: 'cold-ferment-48h',
    status: 'owner-confirm',
    chip: { en: '48-hr cold ferment', es: 'Fermentación 48 h' },
    story: {
      en: 'Dough rests 48 hours in the cold for an airy, blistered, easy-to-digest crust.',
      es: 'La masa reposa 48 horas en frío para un borde aireado y ligero.',
    },
    evidence: 'NONE on FoodTec or the printed menu. Appears only in website copy. Confirm dough schedule with the kitchen.',
  },
  'san-marzano': {
    id: 'san-marzano',
    status: 'owner-confirm',
    chip: { en: 'San Marzano tomato', es: 'Tomate San Marzano' },
    story: { en: 'Sauce built on San Marzano plum tomatoes.', es: 'Salsa a base de tomates San Marzano.' },
    evidence: 'NONE. FoodTec says only "Pizza Sauce". If used, the can must say "Pomodoro San Marzano dell\'Agro Sarnese-Nocerino D.O.P." — "San Marzano style" is NOT the same claim.',
  },
  'grande-fresh-curd': {
    id: 'grande-fresh-curd',
    status: 'owner-confirm',
    chip: { en: 'Stretched from Grande curd', es: 'Estirada de cuajada Grande' },
    story: { en: 'Mozzarella hand-stretched in-house from Grande fresh curd.', es: 'Mozzarella estirada en casa con cuajada fresca Grande.' },
    evidence: 'NONE. "Grande curd" is a raw product for making your own mozzarella; FoodTec/PDF say "Grande Mozzarella". Use the verified "100% Grande Mozzarella" chip instead.',
  },
  'eight-slices-16': {
    id: 'eight-slices-16',
    status: 'owner-confirm',
    chip: { en: '8 slices', es: '8 porciones' },
    story: { en: 'The 16" large is cut into 8 slices.', es: 'La grande de 16" se corta en 8 porciones.' },
    evidence: 'Industry-typical, but not stated by FoodTec or the menu. Confirm the house cut (some shops cut 16" into 10 or 12).',
  },
  'wings-jumbo': {
    id: 'wings-jumbo',
    status: 'verified',
    chip: { en: 'Jumbo wings', es: 'Alitas jumbo' },
    story: { en: 'Jumbo wings, served with ranch or blue cheese.', es: 'Alitas jumbo, con ranch o queso azul.' },
    evidence: '[PDF] "Chicken Wings … Jumbo … All wings served with Ranch or Blue Cheese (4oz)"',
  },
};

export const SHOW_UNVERIFIED =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_CLAIMS === 'true';

/** Claim sets per website category (order = visual priority on the card). */
const CLAIMS_BY_CATEGORY: Record<string, ClaimId[]> = {
  'pizza': ['size-16', 'grande-mozzarella', 'deck-oven', 'cold-ferment-48h', 'san-marzano', 'eight-slices-16'],
  'gourmet pizza': ['size-16', 'grande-mozzarella', 'deck-oven', 'cold-ferment-48h', 'san-marzano', 'eight-slices-16'],
  'sicilian pizza': ['grande-mozzarella', 'deck-oven', 'cold-ferment-48h'],
  'strombolis + calzones': ['stromboli-16', 'grande-mozzarella'],
  'cheesesteaks': ['ribeye-marinated'],
  'subs + grinders': ['meats-sliced-to-order'],
  'chicken wings': ['wings-jumbo'],
};

/** Per-slug additions (e.g. the white pizza's garlic base). */
const CLAIMS_BY_SLUG: Record<string, ClaimId[]> = {
  'plain-cheese-pizza': ['signature-thin-crust'],
  'white-cheese-pizza': ['homemade-garlic-sauce'],
};

export function claimsFor(category: string, slug: string, opts?: { max?: number }): CraftClaim[] {
  const ids = [
    ...(CLAIMS_BY_CATEGORY[(category || '').trim().toLowerCase()] ?? []),
    ...(CLAIMS_BY_SLUG[(slug || '').trim().toLowerCase()] ?? []),
  ];
  const seen = new Set<ClaimId>();
  const out: CraftClaim[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const c = CLAIMS[id];
    if (c.status === 'verified' || SHOW_UNVERIFIED) out.push(c);
  }
  return typeof opts?.max === 'number' ? out.slice(0, opts.max) : out;
}
