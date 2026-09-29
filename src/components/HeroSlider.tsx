'use client';

/**
 * HeroSlider v2 — "The Oven Pass"
 * Drop-in replacement: same default export, same props ({ dict, lang }).
 *
 * What changed vs v1 and why:
 * 1. NO AUTO-ROTATION. v1 advanced every 6.5s with no pause control, which fails
 *    WCAG 2.2.2 (Pause, Stop, Hide) and hides each pizza ~75% of the time.
 *    v2 is a user-driven pizza picker (ARIA tabs, arrow-key + swipe support).
 * 2. VISIBLE H1. v1's only H1 was sr-only. v2 shows a real headline.
 * 3. HONEST PRICE ON THE CTA. Each pizza shows its FoodTec Large 16" price, derived
 *    from src/data/pizzaPricing.ts — never a hard-coded string.
 * 4. RECIPES MATCH FOODTEC. Buffalo uses Blue Cheese Dressing (FoodTec recipe),
 *    not "ranch drizzle"; unverifiable claims (San Marzano D.O.P., basil, garlic-
 *    infused oil) are removed until the owner confirms them.
 * 5. DEEP LINK. CTAs go straight to FoodTec's Pizza menu (the old root URL
 *    redirects to an "intro" screen first).
 * 6. LIGHTER DARK. Warm obsidian with gold/ember light pools instead of a
 *    blue-black box with an 85%-black drop shadow.
 */

import { useCallback, useId, useRef, useState } from 'react';
import Image from 'next/image';
import OrderTrustBadge from './OrderTrustBadge';
import { ORDER_LINKS } from '@/config/ordering';
import { CHEESE_LADDER, GOURMET_LADDER, GOURMET_EXCEPTIONS, formatUSD } from '@/data/pizzaPricing';

interface HeroSliderProps {
  lang?: string;
  dict?: {
    hero?: {
      tagline?: string;
      subtitle?: string;
      cta?: string;
      cta_order?: string;
      badge?: string;
    };
  };
}

type Loc = 'en' | 'es';

interface Pizza {
  id: string;
  image: string;
  glow: string;
  /** Price label for the Large 16" — derived, never typed by hand. */
  largePrice: string;
  copy: Record<Loc, { name: string; tag: string; description: string; notes: [string, string]; alt: string }>;
}

const PIZZAS: Pizza[] = [
  {
    id: 'meat-lover',
    image: '/images/pizza-meatlover-clean.png',
    glow: 'rgba(201, 161, 92, 0.30)',
    largePrice: formatUSD(GOURMET_LADDER.lrg),
    copy: {
      en: {
        name: 'Meat Lover',
        tag: 'Gourmet pizza',
        description: 'Ham, bacon, pepperoni and sausage over pizza sauce and Grande Mozzarella, stone-baked until the edges crackle.',
        notes: ['4 meats', 'Grande Mozzarella'],
        alt: 'Meat Lover pizza with ham, bacon, pepperoni and sausage — Raggio Gourmet, Newark DE',
      },
      es: {
        name: 'Meat Lover',
        tag: 'Pizza gourmet',
        description: 'Jamón, tocino, pepperoni y salchicha sobre salsa de pizza y Grande Mozzarella, horneada en piedra.',
        notes: ['4 carnes', 'Grande Mozzarella'],
        alt: 'Pizza Meat Lover con jamón, tocino, pepperoni y salchicha — Raggio Gourmet, Newark DE',
      },
    },
  },
  {
    id: 'buffalo-chicken',
    image: '/images/pizza-buffalo-clean.png',
    glow: 'rgba(184, 69, 43, 0.26)',
    largePrice: formatUSD(GOURMET_LADDER.lrg),
    copy: {
      en: {
        name: 'Buffalo Chicken',
        tag: 'House favorite',
        description: 'Grilled chicken in buffalo sauce with blue cheese dressing and Grande Mozzarella.',
        notes: ['Buffalo sauce', 'Blue cheese dressing'],
        alt: 'Buffalo Chicken pizza with grilled chicken and blue cheese dressing — Raggio Gourmet, Newark DE',
      },
      es: {
        name: 'Buffalo Chicken',
        tag: 'Favorito de la casa',
        description: 'Pollo a la parrilla en salsa búfalo con aderezo de queso azul y Grande Mozzarella.',
        notes: ['Salsa búfalo', 'Queso azul'],
        alt: 'Pizza Buffalo Chicken con pollo y aderezo de queso azul — Raggio Gourmet, Newark DE',
      },
    },
  },
  {
    id: 'pepperoni',
    image: '/images/pizza-pepperoni-clean.png',
    glow: 'rgba(184, 69, 43, 0.22)',
    // Pepperoni = Cheese pizza + 1 topping on FoodTec. Topping price is added at checkout.
    largePrice: `${formatUSD(CHEESE_LADDER.lrg)} + topping`,
    copy: {
      en: {
        name: 'Pepperoni',
        tag: 'The classic',
        description: 'Our cheese pie — pizza sauce and Grande Mozzarella — with pepperoni that cups and crisps in the oven.',
        notes: ['Crisp-edged pepperoni', 'Grande Mozzarella'],
        alt: 'Pepperoni pizza with Grande Mozzarella — Raggio Gourmet, Newark DE',
      },
      es: {
        name: 'Pepperoni',
        tag: 'El clásico',
        description: 'Nuestra pizza de queso — salsa de pizza y Grande Mozzarella — con pepperoni que se dora en el horno.',
        notes: ['Pepperoni crujiente', 'Grande Mozzarella'],
        alt: 'Pizza de pepperoni con Grande Mozzarella — Raggio Gourmet, Newark DE',
      },
    },
  },
  {
    id: 'spinach-white',
    image: '/images/pizza-spinach-clean.png',
    glow: 'rgba(120, 150, 90, 0.22)',
    largePrice: formatUSD(GOURMET_EXCEPTIONS['spinach white'].lrg),
    copy: {
      en: {
        name: 'Spinach White',
        tag: 'No red sauce',
        description: 'Garlic white sauce, spinach, ricotta and tomatoes under Grande Mozzarella.',
        notes: ['Ricotta', 'Garlic white sauce'],
        alt: 'Spinach White pizza with ricotta and tomatoes — Raggio Gourmet, Newark DE',
      },
      es: {
        name: 'Spinach White',
        tag: 'Sin salsa roja',
        description: 'Salsa blanca de ajo, espinaca, ricotta y tomate bajo Grande Mozzarella.',
        notes: ['Ricotta', 'Salsa blanca de ajo'],
        alt: 'Pizza blanca de espinaca con ricotta y tomate — Raggio Gourmet, Newark DE',
      },
    },
  },
];

const UI = {
  en: {
    eyebrow: 'Newark, DE · Pickup & delivery',
    h1a: 'Stone-baked gourmet pizza',
    h1b: '& catering, made to order.',
    large: 'Large 16"',
    order: 'Order',
    catering: 'Catering for a group',
    menu: 'See the full menu',
    picker: 'Choose a pizza',
    prev: 'Previous pizza',
    next: 'Next pizza',
  },
  es: {
    eyebrow: 'Newark, DE · Para llevar y entrega',
    h1a: 'Pizza gourmet horneada en piedra',
    h1b: 'y catering, hecha al momento.',
    large: 'Grande 16"',
    order: 'Ordenar',
    catering: 'Catering para grupos',
    menu: 'Ver el menú completo',
    picker: 'Elige una pizza',
    prev: 'Pizza anterior',
    next: 'Pizza siguiente',
  },
} as const;

export default function HeroSlider({ lang = 'en' }: HeroSliderProps) {
  const loc: Loc = lang === 'es' ? 'es' : 'en';
  const ui = UI[loc];
  const [current, setCurrent] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchX = useRef<number | null>(null);
  const baseId = useId();

  const pizza = PIZZAS[current];
  const c = pizza.copy[loc];

  const go = useCallback((i: number, focus = false) => {
    const n = (i + PIZZAS.length) % PIZZAS.length;
    setCurrent(n);
    if (focus) tabRefs.current[n]?.focus();
  }, []);

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1, true); }
    if (e.key === 'Home') { e.preventDefault(); go(0, true); }
    if (e.key === 'End') { e.preventDefault(); go(PIZZAS.length - 1, true); }
  };

  return (
    <section
      aria-labelledby={`${baseId}-h1`}
      className="relative w-full surface-oven text-cream overflow-hidden"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) go(current + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="max-w-7xl 2xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16 pb-10 sm:pb-14 lg:pb-16">
        {/* Grid areas — mobile: headline → pizza → panel; desktop: headline+panel left, pizza right */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_auto] gap-x-4 gap-y-5 sm:gap-y-6 items-center">

          {/* HEADLINE */}
          <div className="order-1 lg:order-none relative z-10 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {ui.eyebrow}
            </p>

            <h1
              id={`${baseId}-h1`}
              className="font-display mt-2 sm:mt-3 text-[1.85rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem] font-semibold tracking-tight text-cream"
            >
              {ui.h1a}
              <span className="block text-gold-bright italic font-normal">{ui.h1b}</span>
            </h1>
          </div>

          {/* PANEL */}
          <div className="order-3 lg:order-none relative z-10 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${current}`}
              aria-live="polite"
              className="rounded-2xl border border-panel-border bg-ink-2/70 p-4 sm:p-5 max-w-xl"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{c.tag}</p>
                  <h2 className="text-xl sm:text-2xl font-semibold text-cream mt-0.5">{c.name}</h2>
                </div>
                <p className="text-right shrink-0">
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-stone">{ui.large}</span>
                  <span className="block text-xl sm:text-2xl font-semibold text-gold-bright tabular-nums">{pizza.largePrice}</span>
                </p>
              </div>
              <p className="text-sm sm:text-[15px] leading-relaxed text-stone mt-2">{c.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={ORDER_LINKS.pizza}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-6 py-3 text-sm sm:text-base"
                >
                  {ui.order} {c.name}
                  <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </a>
                <a href="#catering" className="btn-charcoal px-5 py-3 text-sm sm:text-base">
                  {ui.catering}
                </a>
              </div>
              <OrderTrustBadge lang={loc} variant="inline" className="mt-4" />
            </div>

            <a
              href="#menu"
              className="inline-block mt-5 text-sm font-medium text-stone underline underline-offset-4 decoration-gold/40 hover:text-cream hover:decoration-gold"
            >
              {ui.menu} ↓
            </a>
          </div>

          {/* RIGHT — product */}
          <div className="order-2 lg:order-none relative lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div
              aria-hidden="true"
              className="absolute inset-[-10%] rounded-full blur-3xl transition-[background] duration-700"
              style={{ background: `radial-gradient(circle at 50% 55%, ${pizza.glow} 0%, transparent 62%)` }}
            />
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] max-w-[360px] sm:max-w-[560px] lg:max-w-[760px] mx-auto">
              {/* Ingredient notes (desktop) */}
              <span className="hidden sm:inline-flex absolute z-10 top-[12%] left-[6%] items-center gap-1.5 rounded-full border border-panel-border bg-ink/80 backdrop-blur px-3 py-1 text-[11px] font-medium text-cream">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold" />{c.notes[0]}
              </span>
              <span className="hidden sm:inline-flex absolute z-10 bottom-[14%] right-[6%] items-center gap-1.5 rounded-full border border-panel-border bg-ink/80 backdrop-blur px-3 py-1 text-[11px] font-medium text-cream">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold" />{c.notes[1]}
              </span>

              <Image
                key={pizza.id}
                src={pizza.image}
                alt={c.alt}
                fill
                priority={current === 0}
                quality={85}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 720px"
                className="object-contain drop-shadow-[0_24px_32px_rgba(20,14,8,0.55)] motion-safe:animate-[heroFade_420ms_ease-out]"
              />
            </div>

            {/* Picker */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => go(current - 1)}
                aria-label={ui.prev}
                className="hidden sm:inline-flex p-2 rounded-full border border-panel-border text-stone hover:text-cream hover:border-gold/60 cursor-pointer"
              >
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div role="tablist" aria-label={ui.picker} className="flex flex-wrap justify-center gap-1.5 sm:gap-2" onKeyDown={onTabKey}>
                {PIZZAS.map((p, i) => {
                  const selected = i === current;
                  return (
                    <button
                      key={p.id}
                      ref={(el) => { tabRefs.current[i] = el; }}
                      id={`${baseId}-tab-${i}`}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      aria-controls={`${baseId}-panel`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => go(i)}
                      className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
                        selected
                          ? 'bg-gold text-[#1e1b17] border-gold'
                          : 'bg-transparent text-stone border-panel-border hover:text-cream hover:border-gold/50'
                      }`}
                    >
                      {p.copy[loc].name}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => go(current + 1)}
                aria-label={ui.next}
                className="hidden sm:inline-flex p-2 rounded-full border border-panel-border text-stone hover:text-cream hover:border-gold/60 cursor-pointer"
              >
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
