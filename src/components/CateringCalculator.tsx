'use client';

/**
 * Stage 3 — B2B Catering Tray & Pizza Planner
 * Replaces the orphaned v1 calculator (never mounted; hard-coded $110 wing /
 * $85 pasta / $65 salad trays that did not match FoodTec's $134.99 / $89.99 / $80.00).
 *
 * Renders inside <div className="surface-milk">, so token utilities (text-cream,
 * bg-panel, border-panel-border, text-gold…) resolve to the milk/espresso/gold-deep
 * palette automatically. No new colors are introduced.
 */

import React, { useId, useMemo, useState } from 'react';
import {
  buildPlan,
  planToChecklist,
  usd,
  type BudgetTier,
  type Diet,
  type EventType,
  type Plan,
  HALF_SERVES,
  FULL_SERVES,
  SLICES_PER_LG,
  SELF_SERVE_MAX_GUESTS,
} from '@/data/cateringEngine';
import { ORDER_LINKS, STORE } from '@/config/ordering';
import { B2B, UDEL_RULES } from '@/config/b2b';

type Lang = 'en' | 'es';

const COPY = {
  en: {
    kicker: 'Catering Planner · Newark, DE',
    title: 'Build the order your event actually needs.',
    lede: `Planned against the conservative end of our tray ranges — half tray ${HALF_SERVES}, full tray ${FULL_SERVES} portions — so you never run short. Prices are the live FoodTec catering menu.`,
    guests: 'Guests',
    guestsHint: '10 to 500+. Above 200 our catering manager confirms kitchen timing personally.',
    event: 'Occasion',
    tier: 'Menu tier',
    diet: 'Dietary split',
    dietHint: 'Share of guests who need a dedicated, labelled pan. Groups of 1–3 get individually plated meals instead of a wasted tray.',
    veg: 'Vegetarian',
    gf: 'Gluten-free',
    halal: 'Halal / Kosher-friendly',
    pizza: 'Add pizza (LG 16")',
    ledger: 'Your plan',
    perGuest: 'per guest',
    total: 'Estimated food total',
    taxLine: 'Delaware sales tax',
    taxZero: '$0.00 — Delaware has no sales tax',
    delivery: 'Delivery / fees shown at FoodTec checkout',
    copy: 'Copy order checklist',
    copied: 'Copied — paste into FoodTec notes or your PO',
    openCatering: 'Open FoodTec · Catering',
    openPizza: 'Then add pizzas · FoodTec Pizza',
    call: 'Call the catering concierge',
    orgLabel: 'Organization (for the receipt)',
    poLabel: 'PO / cost center / grant #',
    toLabel: 'Deliver to (building & room)',
    whenLabel: 'Date & time',
    howTo: 'How checkout works',
    howSteps: [
      'Copy the checklist — it lists every item with the exact FoodTec button name and size.',
      'Open FoodTec · Catering, tap each item, choose HALF TRAY or FULL TRAY, and set the quantity.',
      'Pizzas live in the FoodTec Pizza menu — same cart, same checkout.',
      `Checkout is processed by ${STORE.checkoutBrand} (our sister kitchen at the same address). Schedule a future time if we are closed.`,
    ],
    diets: { standard: 'Main', veg: 'Vegetarian', gf: 'Gluten-free', halal: 'Halal/Kosher-friendly' } as Record<Diet, string>,
    courses: { main: 'Mains', protein: 'Proteins', handheld: 'Subs & wraps', salad: 'Salads', app: 'Starters', pizza: 'Pizza' } as Record<string, string>,
    dietDisclaimer:
      'Dietary pans are prepared and labelled separately, but our kitchen also handles wheat, pork, shellfish, dairy, eggs and nuts. We are not halal- or kosher-certified and have no gluten-free crust. For celiac or strict religious observance, please call before ordering.',
    micro: 'Small group plated individually',
    clamped: 'Dietary shares added up to more than 100% — scaled down proportionally.',
    concierge: `For ${SELF_SERVE_MAX_GUESTS}+ guests, call us before checkout so the kitchen can stage the order and delivery.`,
  },
  es: {
    kicker: 'Planificador de Catering · Newark, DE',
    title: 'Arme el pedido que su evento realmente necesita.',
    lede: `Calculado con el extremo conservador de nuestras bandejas — media ${HALF_SERVES}, completa ${FULL_SERVES} porciones. Precios del menú de catering en FoodTec.`,
    guests: 'Invitados',
    guestsHint: 'De 10 a 500+. Más de 200: nuestro gerente de catering confirma los tiempos personalmente.',
    event: 'Ocasión',
    tier: 'Nivel de menú',
    diet: 'Distribución dietética',
    dietHint: 'Porcentaje de invitados que necesita una bandeja separada y etiquetada. Grupos de 1–3 reciben platos individuales.',
    veg: 'Vegetariano',
    gf: 'Sin gluten',
    halal: 'Apto Halal / Kosher',
    pizza: 'Agregar pizza (LG 16")',
    ledger: 'Su plan',
    perGuest: 'por invitado',
    total: 'Total estimado de comida',
    taxLine: 'Impuesto de Delaware',
    taxZero: '$0.00 — Delaware no cobra impuesto sobre ventas',
    delivery: 'Entrega / cargos en el pago de FoodTec',
    copy: 'Copiar lista del pedido',
    copied: 'Copiado — péguelo en las notas de FoodTec o su orden de compra',
    openCatering: 'Abrir FoodTec · Catering',
    openPizza: 'Luego pizzas · FoodTec Pizza',
    call: 'Llamar al concierge de catering',
    orgLabel: 'Organización (para el recibo)',
    poLabel: 'Orden de compra / centro de costo',
    toLabel: 'Entregar en (edificio y sala)',
    whenLabel: 'Fecha y hora',
    howTo: 'Cómo funciona el pago',
    howSteps: [
      'Copie la lista — incluye cada artículo con el nombre exacto del botón en FoodTec.',
      'Abra FoodTec · Catering, elija HALF TRAY o FULL TRAY y la cantidad.',
      'Las pizzas están en el menú Pizza de FoodTec — mismo carrito.',
      `El pago lo procesa ${STORE.checkoutBrand} (nuestra cocina hermana, misma dirección). Programe una hora futura si estamos cerrados.`,
    ],
    diets: { standard: 'Principal', veg: 'Vegetariano', gf: 'Sin gluten', halal: 'Apto Halal/Kosher' } as Record<Diet, string>,
    courses: { main: 'Platos', protein: 'Proteínas', handheld: 'Subs y wraps', salad: 'Ensaladas', app: 'Entradas', pizza: 'Pizza' } as Record<string, string>,
    dietDisclaimer:
      'Las bandejas dietéticas se preparan y etiquetan por separado, pero nuestra cocina maneja trigo, cerdo, mariscos, lácteos, huevo y nueces. No tenemos certificación halal ni kosher, ni masa sin gluten. Para celiaquía u observancia religiosa estricta, llame antes de pedir.',
    micro: 'Grupo pequeño en platos individuales',
    clamped: 'Los porcentajes sumaban más de 100% — se ajustaron proporcionalmente.',
    concierge: `Para ${SELF_SERVE_MAX_GUESTS}+ invitados, llámenos antes de pagar para coordinar cocina y entrega.`,
  },
} as const;

const EVENTS: { id: EventType; en: [string, string]; es: [string, string] }[] = [
  { id: 'udel', en: ['UDel Academic Seminar', 'Lunch-weight, low-mess, P-Card ready'], es: ['Seminario UDel', 'Almuerzo ligero, listo para P-Card'] },
  { id: 'hospital', en: ['Hospital Night Shift', 'Handhelds that hold and reheat'], es: ['Turno nocturno hospital', 'Comida que aguanta y se recalienta'] },
  { id: 'corporate', en: ['Corporate Meeting', 'Balanced plate, pasta + salad'], es: ['Reunión corporativa', 'Plato balanceado, pasta + ensalada'] },
  { id: 'athletic', en: ['Athletic Team Banquet', 'Protein-forward, ×1.35 appetite'], es: ['Banquete deportivo', 'Más proteína, apetito ×1.35'] },
];

const TIERS: { id: BudgetTier; en: [string, string]; es: [string, string] }[] = [
  { id: 'essential', en: ['Essential', 'Baked ziti, garden salad, cheese pies'], es: ['Esencial', 'Ziti al horno, ensalada, pizza de queso'] },
  { id: 'signature', en: ['Signature', 'Chicken parm, Caesar, gourmet pies'], es: ['Firma', 'Pollo parm, César, pizzas gourmet'] },
  { id: 'premier', en: ['Premier', 'Lobster ravioli, salmon salad, carne asada'], es: ['Premier', 'Ravioli de langosta, salmón, carne asada'] },
];

const QUICK = [15, 30, 60, 120, 250, 500];

/** Store closing time for "today" in America/New_York, e.g. "9:00 PM". Client-only. */
function closingTimeToday(now = new Date()): string {
  const wd = new Intl.DateTimeFormat('en-US', { timeZone: STORE.timeZone, weekday: 'short' }).format(now);
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
  const slot = STORE.hours[idx >= 0 ? idx : 0];
  const [h, m] = slot.close.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function CateringCalculator({ lang = 'en' }: { lang?: string; dict?: unknown }) {
  const L: Lang = lang === 'es' ? 'es' : 'en';
  const t = COPY[L];
  const uid = useId();

  const [guests, setGuests] = useState(40);
  const [event, setEvent] = useState<EventType>('udel');
  const [tier, setTier] = useState<BudgetTier>('signature');
  const [split, setSplit] = useState({ veg: 15, gf: 5, halal: 5 });
  const [includePizza, setIncludePizza] = useState(true);
  const [meta, setMeta] = useState({ org: '', po: '', deliverTo: '', when: '' });
  const [copied, setCopied] = useState(false);
  // SSR always renders the default 'udel' event, so the time-zone-dependent
  // hospital copy is only ever computed on the client → no hydration mismatch.
  const closeAt = event === 'hospital' ? closingTimeToday() : '';

  const plan: Plan = useMemo(
    () => buildPlan({ guests, event, tier, split, includePizza }),
    [guests, event, tier, split, includePizza],
  );

  // Per-guest price of every tier at the current settings → honest tier comparison.
  const tierPerGuest = useMemo(() => {
    const out = {} as Record<BudgetTier, number>;
    TIERS.forEach(({ id }) => { out[id] = buildPlan({ guests, event, tier: id, split, includePizza }).perGuest; });
    return out;
  }, [guests, event, split, includePizza]);

  const eventLabel = EVENTS.find((e) => e.id === event)![L][0];
  const tierLabel = TIERS.find((x) => x.id === tier)![L][0];
  const hasPizza = plan.lines.some((l) => l.foodtecMenu === 'Pizza');
  const hasPlates = plan.lines.some((l) => l.foodtecMenu === 'Pasta' || l.foodtecMenu === 'Latin');

  const onCopy = async () => {
    const text = planToChecklist(plan, { eventLabel, tierLabel, ...meta });
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  const pct = (k: keyof typeof split) => (
    <label className="block" key={k}>
      <span className="flex items-baseline justify-between text-sm text-cream">
        <span>{t[k]}</span>
        <span className="font-display tabular-nums text-gold">
          {split[k]}% · {plan.groups[k]}
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={50}
        step={5}
        value={split[k]}
        onChange={(e) => setSplit((s) => ({ ...s, [k]: Number(e.target.value) }))}
        className="mt-2 w-full accent-[var(--color-gold)]"
        aria-label={t[k]}
      />
    </label>
  );

  // Group ledger by course for an editorial "menu card" feel.
  const byCourse = plan.lines.reduce<Record<string, typeof plan.lines>>((acc, l) => {
    (acc[l.course] ||= []).push(l);
    return acc;
  }, {});

  return (
    <section
      id="catering-planner"
      aria-labelledby={`${uid}-title`}
      className="relative mb-14 overflow-hidden rounded-[28px] border border-panel-border bg-panel shadow-[0_1px_0_rgba(43,38,32,0.04),0_24px_60px_-30px_rgba(43,38,32,0.35)]"
    >
      {/* Editorial masthead */}
      <header className="grid gap-6 border-b border-panel-border px-6 pb-8 pt-9 md:grid-cols-[1.4fr_1fr] md:px-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{t.kicker}</p>
          <h2 id={`${uid}-title`} className="font-display mt-3 text-3xl leading-[1.05] text-cream md:text-[44px]">
            {t.title}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone">{t.lede}</p>
        </div>
        <div className="flex flex-col justify-end gap-2 md:items-end md:text-right">
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone">{t.call}</span>
          <a href={B2B.concierge.phoneHref} className="font-display text-2xl text-cream underline decoration-[var(--color-gold)] decoration-1 underline-offset-[6px] hover:text-gold">
            {B2B.concierge.phoneDisplay}
          </a>
          {B2B.concierge.managerName && (
            <span className="text-xs text-stone">
              {B2B.concierge.managerName}
              {B2B.concierge.managerDirectDisplay && (
                <> · <a className="underline" href={B2B.concierge.managerDirectHref}>{B2B.concierge.managerDirectDisplay}</a></>
              )}
            </span>
          )}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* ---------------- Inputs ---------------- */}
        <div className="space-y-9 border-panel-border px-6 py-9 md:px-12 lg:border-r">
          {/* 01 Guests */}
          <fieldset>
            <legend className="flex w-full items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">01 · {t.guests}</span>
              <span className="font-display text-4xl tabular-nums text-cream">{guests}{guests >= 500 ? '+' : ''}</span>
            </legend>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={Math.min(guests, 500)}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--color-gold)]"
              aria-label={t.guests}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setGuests(q)}
                  aria-pressed={guests === q}
                  className={`rounded-full border px-3 py-1 text-xs tabular-nums transition ${
                    guests === q ? 'border-cream bg-cream text-panel' : 'border-panel-border text-stone hover:border-gold hover:text-cream'
                  }`}
                >
                  {q}{q === 500 ? '+' : ''}
                </button>
              ))}
              <input
                type="number"
                inputMode="numeric"
                min={10}
                max={2000}
                value={guests}
                onChange={(e) => setGuests(Math.max(10, Math.min(2000, Number(e.target.value) || 10)))}
                className="ml-auto w-24 rounded-full border border-panel-border bg-transparent px-3 py-1 text-right text-sm tabular-nums text-cream"
                aria-label={`${t.guests} (exact)`}
              />
            </div>
            <p className="mt-2 text-xs text-stone">{t.guestsHint}</p>
          </fieldset>

          {/* 02 Event */}
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">02 · {t.event}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {EVENTS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEvent(e.id)}
                  aria-pressed={event === e.id}
                  className={`rounded-2xl border p-4 text-left transition ${
                    event === e.id ? 'border-cream bg-ink-2 shadow-[inset_0_0_0_1px_var(--color-cream)]' : 'border-panel-border hover:border-gold'
                  }`}
                >
                  <span className="block text-sm font-semibold text-cream">{e[L][0]}</span>
                  <span className="mt-1 block text-xs text-stone">{e[L][1]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* 03 Tier */}
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">03 · {t.tier}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {TIERS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setTier(x.id)}
                  aria-pressed={tier === x.id}
                  className={`rounded-2xl border p-4 text-left transition ${
                    tier === x.id ? 'border-cream bg-ink-2 shadow-[inset_0_0_0_1px_var(--color-cream)]' : 'border-panel-border hover:border-gold'
                  }`}
                >
                  <span className="font-display block text-lg text-cream">{x[L][0]}</span>
                  <span className="mt-0.5 block text-sm tabular-nums text-gold">≈ {usd(tierPerGuest[x.id])} <span className="text-xs text-stone">/ {t.perGuest}</span></span>
                  <span className="mt-2 block text-xs leading-snug text-stone">{x[L][1]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* 04 Diet */}
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">04 · {t.diet}</legend>
            <p className="mt-2 text-xs text-stone">{t.dietHint}</p>
            <div className="mt-4 space-y-5">{(['veg', 'gf', 'halal'] as const).map(pct)}</div>
            <label className="mt-6 flex items-center gap-3 text-sm text-cream">
              <input type="checkbox" checked={includePizza} onChange={(e) => setIncludePizza(e.target.checked)} className="h-4 w-4 accent-[var(--color-gold)]" />
              {t.pizza}
              <span className="text-xs text-stone">· {SLICES_PER_LG} slices/pie</span>
            </label>
          </fieldset>

          {/* Receipt metadata (feeds the checklist only; nothing is sent anywhere) */}
          <fieldset className="grid gap-3 sm:grid-cols-2">
            {([
              ['org', t.orgLabel],
              ['po', t.poLabel],
              ['deliverTo', t.toLabel],
              ['when', t.whenLabel],
            ] as const).map(([k, label]) => (
              <label key={k} className="block text-xs text-stone">
                {label}
                <input
                  value={meta[k]}
                  onChange={(e) => setMeta((m) => ({ ...m, [k]: e.target.value }))}
                  className="mt-1 w-full border-b border-panel-border bg-transparent py-1.5 text-sm text-cream outline-none focus:border-cream"
                  autoComplete="off"
                />
              </label>
            ))}
          </fieldset>
        </div>

        {/* ---------------- Ledger ---------------- */}
        <div className="bg-ink-2 px-6 py-9 md:px-12" aria-live="polite">
          <div className="flex items-baseline justify-between border-b border-cream/80 pb-3">
            <h3 className="font-display text-2xl text-cream">{t.ledger}</h3>
            <span className="text-xs uppercase tracking-[0.18em] text-stone">{eventLabel} · {tierLabel}</span>
          </div>

          {Object.entries(byCourse).map(([course, lines]) => (
            <div key={course} className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{t.courses[course]}</p>
              <ul className="mt-2 divide-y divide-panel-border">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-start justify-between gap-4 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm text-cream">
                        <span className="tabular-nums">{l.qty} ×</span> {l.foodtec}
                        <span className="ml-2 text-[11px] uppercase tracking-wider text-stone">{l.size}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone">
                        FoodTec › {l.foodtecMenu}
                        {l.diet !== 'standard' && (
                          <span className="ml-2 rounded-full border border-gold px-2 py-[1px] text-gold">{t.diets[l.diet]}</span>
                        )}
                        {l.size === 'PLATE' && <span className="ml-2">{t.micro}</span>}
                      </p>
                      {l.note && <p className="mt-0.5 text-[11px] italic text-stone">{l.note[L]}</p>}
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-cream">{usd(l.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <dl className="mt-8 space-y-2 border-t border-cream/80 pt-4 text-sm">
            <div className="flex justify-between text-stone"><dt>{t.taxLine}</dt><dd>{t.taxZero}</dd></div>
            <div className="flex justify-between text-stone"><dt>{t.delivery}</dt><dd>—</dd></div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="text-cream">{t.total}</dt>
              <dd className="font-display text-4xl tabular-nums text-cream">{usd(plan.total)}</dd>
            </div>
            <div className="text-right text-xs tabular-nums text-gold"><dt className="sr-only">{t.perGuest}</dt><dd>≈ {usd(plan.perGuest)} {t.perGuest}</dd></div>
          </dl>

          {/* Context-aware advisories */}
          <div className="mt-6 space-y-2 text-xs leading-relaxed">
            {plan.flags.splitClamped && <p className="rounded-xl border border-panel-border p-3 text-stone">{t.clamped}</p>}
            {plan.flags.concierge && <p className="rounded-xl border border-gold p-3 text-cream">{t.concierge}</p>}
            {event === 'udel' && (
              <p className={`rounded-xl border p-3 ${plan.flags.overPCardLimit ? 'border-[var(--color-ember)] text-cream' : 'border-panel-border text-stone'}`}>
                {plan.flags.overPCardLimit
                  ? L === 'es'
                    ? `Supera el límite de ${usd(UDEL_RULES.singleTransactionLimit * 100)} por transacción de la UD Credit Card. La UD prohíbe dividir compras: use una orden en UDX.`
                    : `Exceeds the ${usd(UDEL_RULES.singleTransactionLimit * 100)} UD Credit Card single-transaction limit. UD policy prohibits splitting a purchase — route this through a UDX purchase order.`
                  : L === 'es'
                    ? 'Listo para P-Card: recibirá un recibo detallado. Concur pedirá la lista de asistentes.'
                    : 'P-Card ready: you will receive an itemized receipt. Concur will ask for your attendee list — see the P-Card guide below.'}
              </p>
            )}
            {event === 'hospital' && (
              <p className="rounded-xl border border-panel-border p-3 text-stone">
                {L === 'es'
                  ? `El turno nocturno empieza cuando nuestra cocina cierra (hoy ${closeAt}). Programe la entrega antes del cierre; pasta, tenders y pizza se recalientan bien.`
                  : `Night shift starts as our kitchen closes (today ${closeAt}). Schedule delivery before close — pasta, tenders and pizza all reheat well for the 2 a.m. break.`}
              </p>
            )}
            {(plan.flags.gfNoPizza || plan.groups.veg + plan.groups.gf + plan.groups.halal > 0) && (
              <p className="rounded-xl border border-panel-border p-3 text-stone">{t.dietDisclaimer}</p>
            )}
            {hasPlates && <p className="text-stone">{t.micro}: FoodTec › Pasta / Latin.</p>}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" onClick={onCopy} className="btn-gold w-full justify-center rounded-full py-3.5 text-sm font-semibold">
              {copied ? t.copied : t.copy}
            </button>
            <a
              href={ORDER_LINKS.catering}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { void onCopy(); }}
              className="btn-charcoal w-full rounded-full border py-3.5 text-center text-sm font-semibold"
            >
              {t.openCatering} ↗
            </a>
            {hasPizza && (
              <a href={ORDER_LINKS.pizza} target="_blank" rel="noopener noreferrer" className="text-center text-xs text-stone underline underline-offset-4 hover:text-cream">
                {t.openPizza} ↗
              </a>
            )}
            <a href={B2B.concierge.phoneHref} className="text-center text-xs text-stone hover:text-cream">
              {t.call}: <span className="text-cream">{B2B.concierge.phoneDisplay}</span>
            </a>
          </div>

          <details className="mt-8 border-t border-panel-border pt-4 text-xs text-stone">
            <summary className="cursor-pointer text-cream">{t.howTo}</summary>
            <ol className="mt-3 list-decimal space-y-1.5 pl-4">
              {t.howSteps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </details>
        </div>
      </div>
    </section>
  );
}
