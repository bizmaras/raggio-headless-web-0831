/**
 * SINGLE SOURCE OF TRUTH — ordering links, brand bridge copy, store hours.
 *
 * Why this file exists:
 * - 13+ components hard-coded two different FoodTec hosts.
 * - `https://phillystyleexpress.foodtecsolutions.com/` 301-redirects to
 *   `/ordering/` → `/ordering/phillystyleexpress/intro` (an extra "intro" screen
 *   before the customer sees any food). Deep-link straight to the menu instead.
 * - FoodTec renders the store as "Philly Express" (page title, "PSE REWARDS"),
 *   so the bridge copy must name that brand, or customers think they left Raggio.
 *
 * Verified live on 2026-09-25 (FoodTec store page shows 681 E Chestnut Hill Rd.,
 * 302-369-0553 — the same address/phone as Raggio).
 */

const FOODTEC_BASE = 'https://order.foodtecsolutions.com/ordering/phillystyleexpress';

export const ORDER_LINKS = {
  /** Default "Order Now" destination: the pizza menu, not the intro screen. */
  root: `${FOODTEC_BASE}/menu/Pizza`,
  pizza: `${FOODTEC_BASE}/menu/Pizza`,
  catering: `${FOODTEC_BASE}/menu/Catering`,
  specials: `${FOODTEC_BASE}/menu/Specials`,
  wings: `${FOODTEC_BASE}/menu/Wings`,
  steaks: `${FOODTEC_BASE}/menu/Steaks`,
  signUp: `${FOODTEC_BASE}/intro`,
} as const;

export type OrderLinkKey = keyof typeof ORDER_LINKS;

export const STORE = {
  phoneDisplay: '(302) 369-0553',
  phoneHref: 'tel:+13023690553',
  address: '681 E Chestnut Hill Rd, Newark, DE 19713',
  checkoutBrand: 'Philly Express',
  checkoutBrandLong: 'Philly Style Express',
  timeZone: 'America/New_York',
  /**
   * Online-ordering window (24h, local time). Keep in sync with FoodTec admin.
   * NOTE: FoodTec was observed showing "closed" at ~21:15 on a Friday while the
   * site JSON-LD advertises 22:00. Owner must confirm and update BOTH places.
   * 0 = Sunday … 6 = Saturday
   */
  hours: {
    0: { open: '09:00', close: '21:00' },
    1: { open: '09:00', close: '21:00' },
    2: { open: '09:00', close: '21:00' },
    3: { open: '09:00', close: '21:00' },
    4: { open: '09:00', close: '21:00' },
    5: { open: '09:00', close: '22:00' },
    6: { open: '09:00', close: '22:00' },
  } as Record<number, { open: string; close: string }>,
} as const;

export const BRIDGE_COPY = {
  en: {
    badgeTitle: 'Secure checkout by our sister kitchen',
    badgeBody:
      'Online orders are processed by Philly Style Express ("Philly Express") on the FoodTec ordering platform. Same kitchen, same address: 681 E Chestnut Hill Rd.',
    badgeShort: 'Checkout powered by Philly Express · same kitchen',
    openNow: 'Online ordering open',
    closedNow: 'Online ordering is closed right now',
    closedCta: 'Call (302) 369-0553',
    preorder: 'You can still schedule for our next opening.',
  },
  es: {
    badgeTitle: 'Pago seguro con nuestra cocina hermana',
    badgeBody:
      'Los pedidos en línea se procesan a través de Philly Style Express ("Philly Express") en la plataforma FoodTec. Misma cocina, misma dirección: 681 E Chestnut Hill Rd.',
    badgeShort: 'Pago con Philly Express · misma cocina',
    openNow: 'Pedidos en línea abiertos',
    closedNow: 'Los pedidos en línea están cerrados ahora',
    closedCta: 'Llamar al (302) 369-0553',
    preorder: 'Aún puedes programar tu pedido para la próxima apertura.',
  },
} as const;

/** Returns true when the local store clock is within the ordering window. */
export function isOrderingOpen(now: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hh = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  const mm = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
  const slot = STORE.hours[dayIdx];
  if (!slot) return false;
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
  const cur = hh * 60 + mm;
  return cur >= toMin(slot.open) && cur < toMin(slot.close);
}
