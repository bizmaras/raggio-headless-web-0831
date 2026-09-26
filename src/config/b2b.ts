/**
 * B2B / CORPORATE INVOICING CONFIG — Stage 3
 *
 * Nothing in here is invented. Every tax identifier, legal name and contact
 * that the business must supply is read from an environment variable and the
 * UI HIDES the corresponding element until the owner sets it. That keeps the
 * site from ever publishing a wrong EIN or a placeholder W-9.
 *
 * Owner checklist (set in Vercel → Project → Settings → Environment Variables):
 *   NEXT_PUBLIC_B2B_LEGAL_NAME      Exact IRS legal name on the W-9 (line 1)
 *   NEXT_PUBLIC_B2B_DBA             DBA shown on receipts (e.g. "Raggio Gourmet & Pizza")
 *   NEXT_PUBLIC_B2B_EIN             Format NN-NNNNNNN. Must be the EIN the FoodTec
 *                                   merchant account settles to (see MERCHANT_OF_RECORD).
 *   NEXT_PUBLIC_B2B_W9_URL          e.g. /docs/raggio-w9-2026.pdf (signed, dated Form W-9, Rev. March 2024)
 *   NEXT_PUBLIC_B2B_W9_SIGNED_ON    ISO date the W-9 was signed, e.g. 2026-10-01
 *   NEXT_PUBLIC_CATERING_MANAGER    Display name of the catering manager
 *   NEXT_PUBLIC_CATERING_EMAIL      catering@… inbox that receives PO / exemption docs
 *   NEXT_PUBLIC_CATERING_DIRECT     Direct line / mobile, digits only, e.g. 3025550100
 *   NEXT_PUBLIC_UDX_SUPPLIER        "true" once Raggio is onboarded in UD Exchange (Jaggaer)
 *   NEXT_PUBLIC_CATERING_LEAD_HOURS Minimum notice for tray orders (integer hours, default 24)
 */

import { STORE } from './ordering';

// NEXT_PUBLIC_* must be referenced literally so Next can inline them at build time.
const RAW = {
  legalName: process.env.NEXT_PUBLIC_B2B_LEGAL_NAME,
  dba: process.env.NEXT_PUBLIC_B2B_DBA,
  ein: process.env.NEXT_PUBLIC_B2B_EIN,
  w9Url: process.env.NEXT_PUBLIC_B2B_W9_URL,
  w9SignedOn: process.env.NEXT_PUBLIC_B2B_W9_SIGNED_ON,
  managerName: process.env.NEXT_PUBLIC_CATERING_MANAGER,
  managerEmail: process.env.NEXT_PUBLIC_CATERING_EMAIL,
  managerDirect: process.env.NEXT_PUBLIC_CATERING_DIRECT,
  udx: process.env.NEXT_PUBLIC_UDX_SUPPLIER,
  leadHours: process.env.NEXT_PUBLIC_CATERING_LEAD_HOURS,
};
const clean = (v?: string) => (v && v.trim() !== '' ? v.trim() : undefined);
const EIN_RE = /^\d{2}-\d{7}$/;

const ein = clean(RAW.ein);
const direct = clean(RAW.managerDirect)?.replace(/\D/g, '');

export const B2B = {
  legalName: clean(RAW.legalName),
  dba: clean(RAW.dba) ?? 'Raggio Gourmet & Pizza',
  /** Only exposed when it is syntactically a valid EIN. */
  ein: ein && EIN_RE.test(ein) ? ein : undefined,
  w9Url: clean(RAW.w9Url),
  w9SignedOn: clean(RAW.w9SignedOn),
  udxOnboarded: clean(RAW.udx) === 'true',
  leadHours: Number.parseInt(clean(RAW.leadHours) ?? '24', 10) || 24,
  address: STORE.address,
  concierge: {
    phoneDisplay: STORE.phoneDisplay,
    phoneHref: STORE.phoneHref,
    managerName: clean(RAW.managerName),
    managerEmail: clean(RAW.managerEmail),
    managerDirectDisplay:
      direct && direct.length === 10 ? `(${direct.slice(0, 3)}) ${direct.slice(3, 6)}-${direct.slice(6)}` : undefined,
    managerDirectHref: direct && direct.length === 10 ? `tel:+1${direct}` : undefined,
  },
  /**
   * The card is charged by the FoodTec merchant account, which FoodTec renders
   * as "Philly Express" (see config/ordering.ts). University AP matches the
   * merchant name on the receipt/card statement against the supplier record,
   * so the W-9 legal name must be the entity behind THAT merchant account.
   */
  merchantOfRecord: STORE.checkoutBrandLong,
} as const;

/** University of Delaware card rules (sourced; see Stage 3 report for citations). */
export const UDEL_RULES = {
  singleTransactionLimit: 5000, // UD Credit Card max single transaction
  monthlyLimit: 20000,
  receiptThreshold: 25, // documentation required for every expense >= $25 in Concur
  concierge: 'UD Catering (on-campus): 302-831-2891',
} as const;

/** Christiana Hospital (ChristianaCare Newark campus) — used for night-shift copy. */
export const HOSPITAL_NIGHT_WINDOW = { start: '21:00', end: '07:00' } as const;
