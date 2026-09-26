'use client';

/**
 * OrderTrustBadge — bridges the Raggio brand to the FoodTec checkout.
 *
 * The customer clicks "Order" on Raggio and lands on a page titled
 * "Philly Express" with "PSE REWARDS" in the nav, on order.foodtecsolutions.com.
 * Without a warning that looks like a wrong site. This badge tells them BEFORE
 * they click, names the brand they will see, and proves continuity with the
 * shared street address. It also shows ordering status, since FoodTec shows
 * "Web Ordering is currently closed" outside hours.
 *
 * Variants:
 *  - "inline": one line under a CTA (hero, cards, sticky bar)
 *  - "panel":  a full-width strip with 3 proof points (below hero / above catering)
 */

import { useEffect, useState } from 'react';
import { BRIDGE_COPY, ORDER_LINKS, STORE, isOrderingOpen } from '@/config/ordering';

type Props = {
  lang?: string;
  variant?: 'inline' | 'panel';
  className?: string;
};

function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinejoin="round" d="M12 3l7.5 3v5.5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5V6L12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.8 12.2l2.2 2.2 4.3-4.6" />
    </svg>
  );
}

function useOrderingStatus() {
  // null until mounted → identical SSR/CSR markup (no hydration mismatch)
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOrderingOpen());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}

export default function OrderTrustBadge({ lang = 'en', variant = 'inline', className = '' }: Props) {
  const t = lang === 'es' ? BRIDGE_COPY.es : BRIDGE_COPY.en;
  const open = useOrderingStatus();

  const status =
    open === null ? null : (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span
          aria-hidden="true"
          className={`w-2 h-2 rounded-full ${open ? 'bg-[#3f8f5a]' : 'bg-ember'}`}
        />
        <span>{open ? t.openNow : t.closedNow}</span>
      </span>
    );

  if (variant === 'inline') {
    return (
      <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone ${className}`}>
        <span className="inline-flex items-center gap-1.5">
          <ShieldIcon className="w-4 h-4 text-gold" />
          <span>{t.badgeShort}</span>
        </span>
        {status}
        {open === false && (
          <a href={STORE.phoneHref} className="underline underline-offset-4 decoration-gold/50 hover:text-cream">
            {t.closedCta}
          </a>
        )}
      </p>
    );
  }

  const isEs = lang === 'es';
  const proofs = [
    {
      k: isEs ? 'Misma cocina' : 'Same kitchen',
      v: isEs ? '681 E Chestnut Hill Rd, Newark' : '681 E Chestnut Hill Rd, Newark',
    },
    {
      k: isEs ? 'Nombre en el pago' : 'Name you’ll see at checkout',
      v: `${STORE.checkoutBrand} (${STORE.checkoutBrandLong})`,
    },
    {
      k: isEs ? 'Plataforma' : 'Ordering platform',
      v: isEs ? 'FoodTec · pago seguro' : 'FoodTec · secure payment',
    },
  ];

  return (
    <section
      aria-labelledby="order-trust-title"
      className={`surface-milk border-y border-panel-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 grid gap-5 lg:grid-cols-[1.1fr_2fr_auto] lg:items-center">
        <div className="flex items-start gap-3">
          <span className="shrink-0 mt-0.5 inline-flex w-10 h-10 items-center justify-center rounded-full bg-panel-2 border border-panel-border text-gold-bright">
            <ShieldIcon className="w-5 h-5" />
          </span>
          <div>
            <h2 id="order-trust-title" className="text-base font-semibold text-cream">
              {t.badgeTitle}
            </h2>
            <p className="text-sm text-stone mt-1 max-w-md">{t.badgeBody}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {proofs.map((p) => (
            <div key={p.k} className="rounded-xl bg-panel border border-panel-border px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-stone">{p.k}</dt>
              <dd className="text-sm font-semibold text-cream mt-1">{p.v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col items-start lg:items-end gap-2 text-sm text-stone">
          {status}
          {open === false ? (
            <a href={STORE.phoneHref} className="btn-gold px-5 py-2.5 text-sm">
              {t.closedCta}
            </a>
          ) : (
            <a href={ORDER_LINKS.pizza} target="_blank" rel="noopener noreferrer" className="btn-gold px-5 py-2.5 text-sm">
              {isEs ? 'Ordenar ahora' : 'Order now'} ↗
            </a>
          )}
          {open === false && <span className="text-xs">{t.preorder}</span>}
        </div>
      </div>
    </section>
  );
}
