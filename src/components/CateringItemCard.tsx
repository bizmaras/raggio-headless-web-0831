'use client';

/**
 * CateringItemCard v2 (Stage 2)
 *
 * Drop-in: same default export and props; `lang` is NEW (optional).
 *
 * Changes
 *  1. PER-GUEST COST. Office/event buyers compare trays by $/person, not by tray price.
 *     "Half $54.99 · serves 8–10" becomes "$5.50–6.87 per guest" — computed, never typed.
 *  2. Language comes from `lang`, not from sniffing `halfLabel === 'MEDIANO'`.
 *  3. Native <dialog> (focus trap, Esc, focus return) instead of a portal div.
 *  4. Tray options are a real choice (radio) feeding ONE order button; v1 had two
 *     price tiles that were both plain links to the same URL.
 */

import { useEffect, useRef, useState } from 'react';
import { ORDER_LINKS, STORE } from '@/config/ordering';

interface CateringItemCardProps {
  name: string;
  desc?: string;
  half?: string | number;
  full?: string | number;
  servesHalf?: string;
  servesFull?: string;
  halfLabel?: string;
  fullLabel?: string;
  lang?: string;
}

const FOODTEC_URL = ORDER_LINKS.catering;

const parsePrice = (v?: string | number): number =>
  typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) || 0;

function perGuest(price: number, serves: string): string | null {
  const nums = (serves.match(/\d+/g) || []).map(Number).filter((n) => n > 0);
  if (!price || !nums.length) return null;
  const lo = Math.min(...nums);
  const hi = Math.max(...nums);
  const a = price / hi;
  const b = price / lo;
  return lo === hi ? `$${a.toFixed(2)}` : `$${a.toFixed(2)}–${b.toFixed(2)}`;
}

export default function CateringItemCard({
  name,
  desc,
  half,
  full,
  servesHalf = '8-10',
  servesFull = '15-20',
  halfLabel = 'HALF',
  fullLabel = 'FULL',
  lang,
}: CateringItemCardProps) {
  const es = lang ? lang === 'es' : halfLabel === 'MEDIANO'; // legacy fallback only
  const t = es
    ? { guest: 'por invitado', serves: 'Sirve', people: 'personas', details: 'Ver porciones', order: 'Ordenar catering', close: 'Cerrar', tray: 'Bandeja', via: `Pago con ${STORE.checkoutBrand} · misma cocina`, fallback: 'Preparado al momento para sus eventos.' }
    : { guest: 'per guest', serves: 'Serves', people: 'guests', details: 'Servings & details', order: 'Order catering', close: 'Close', tray: 'Tray', via: `Checkout by ${STORE.checkoutBrand} · same kitchen`, fallback: 'Made fresh to order for your event.' };

  const options = [
    { id: 'half', label: halfLabel, price: parsePrice(half), serves: servesHalf },
    { id: 'full', label: fullLabel, price: parsePrice(full), serves: servesFull },
  ].filter((o) => o.price > 0);

  const [sel, setSel] = useState(options.length > 1 ? 1 : 0);
  const chosen = options[sel] ?? options[0];

  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [openTick, setOpenTick] = useState(0);
  useEffect(() => {
    if (openTick && ref.current && !ref.current.open) ref.current.showModal();
  }, [openTick, mounted]);

  const optionGrid = (size: 'card' | 'dialog') => (
    <div role="radiogroup" aria-label={`${t.tray} — ${name}`} className="grid grid-cols-2 gap-2">
      {options.map((o, i) => {
        const on = i === sel;
        const pg = perGuest(o.price, o.serves);
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setSel(i)}
            className={`text-left rounded-xl border px-3 ${size === 'card' ? 'py-2.5' : 'py-3.5'} transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-gold ${
              on ? 'border-gold bg-gold/10' : 'border-panel-border bg-ink-2 hover:border-gold/50'
            }`}
          >
            <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-stone">{o.label} · {o.serves}</span>
            <span className="block font-display text-lg font-semibold text-gold tabular-nums">${o.price.toFixed(2)}</span>
            {pg && <span className="block text-[11px] text-stone tabular-nums">{pg} {t.guest}</span>}
          </button>
        );
      })}
    </div>
  );

  const orderBtn = (
    <a
      href={FOODTEC_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-dd-action-name={`catering_order:${name}:${chosen?.id ?? 'na'}`}
      className="inline-flex w-full items-center justify-center gap-2 h-11 rounded-xl bg-ember hover:bg-ember-hover text-white text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {t.order}{chosen ? ` · ${chosen.label} $${chosen.price.toFixed(2)}` : ''}
    </a>
  );

  return (
    <>
      <article className="h-full flex flex-col rounded-2xl border border-panel-border bg-panel p-5">
        <h4 className="font-display text-xl font-semibold leading-tight text-cream">{name}</h4>
        <p className="mt-1.5 text-sm text-stone line-clamp-2">{desc || t.fallback}</p>
        <div className="mt-4">{optionGrid('card')}</div>
        <div className="mt-4 space-y-2 mt-auto pt-4">
          {orderBtn}
          <button
            type="button"
            onClick={() => { setMounted(true); setOpenTick((n) => n + 1); }}
            className="w-full min-h-[44px] text-xs font-semibold text-gold hover:text-gold-bright cursor-pointer"
          >
            {t.details}
          </button>
        </div>
      </article>

      {mounted && (
        <dialog
          ref={ref}
          onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
          className="m-auto w-[min(100vw-1.5rem,32rem)] p-0 rounded-3xl bg-panel text-cream border border-panel-border shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
        >
          <div className="relative p-6 sm:p-8">
            <button type="button" onClick={() => ref.current?.close()} aria-label={t.close} className="absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full border border-panel-border text-stone hover:text-cream cursor-pointer">
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <h3 className="pr-12 font-display text-2xl font-semibold">{name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">{desc || t.fallback}</p>
            <div className="mt-6">{optionGrid('dialog')}</div>
            <div className="mt-6 space-y-2">
              {orderBtn}
              <p className="text-[11px] text-stone">{t.via}</p>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
