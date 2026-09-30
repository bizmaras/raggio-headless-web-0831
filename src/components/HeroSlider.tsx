'use client';

/**
 * HeroSlider v4 — "Premium Carousel" (preview/raggio-premium-landing)
 * Drop-in replacement: same default export, same props ({ dict, lang }).
 *
 * - Multi-slide hero, whole-pie photography only (no lifted slices / cheese pulls).
 * - Autoplay 7s with a visible Pause/Play control (WCAG 2.2.2), pauses on hover,
 *   keyboard focus, and when the tab is hidden; never autoplays under
 *   prefers-reduced-motion. Arrow keys, dots, prev/next and swipe supported.
 * - One static, visible H1 for SEO; each slide exposes name / recipe / price.
 * - Recipes come from src/data/mockData.json (FoodTec parity), prices from
 *   src/data/pizzaPricing.ts or the menu data — never hand-typed marketing copy.
 * - Directly under the hero: four "Raggio Favorites" quick-selection cards.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import OrderTrustBadge from './OrderTrustBadge';
import { ORDER_LINKS } from '@/config/ordering';
import { CHEESE_LADDER, GOURMET_LADDER, formatUSD } from '@/data/pizzaPricing';

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

interface Slide {
  id: string;
  image: string;
  price: string;
  priceLabel: Record<Loc, string>;
  menuHref: string;
  copy: Record<Loc, { tag: string; name: string; description: string; alt: string }>;
}

const L16 = { en: 'Large 16"', es: 'Grande 16"' };

const SLIDES: Slide[] = [
  {
    id: 'the-works',
    image: '/images/dishes/pizza-the-works-pizza-luxury-8k.png',
    price: formatUSD(GOURMET_LADDER.lrg),
    priceLabel: L16,
    menuHref: '#gourmet-pizza',
    copy: {
      en: { tag: 'Gourmet pizza', name: 'The Works', description: 'Meat, green pepper, mushrooms and fried onions over Grande Mozzarella.', alt: 'The Works pizza with meat, green peppers, mushrooms and fried onions — Raggio Gourmet, Newark DE' },
      es: { tag: 'Pizza gourmet', name: 'The Works', description: 'Carne, pimiento verde, champiñones y cebolla frita sobre Grande Mozzarella.', alt: 'Pizza The Works con carne, pimiento, champiñones y cebolla frita — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'buffalo-chicken',
    image: '/images/dishes/pizza-buffalo-chicken-pizza-luxury-8k.png',
    price: formatUSD(GOURMET_LADDER.lrg),
    priceLabel: L16,
    menuHref: '#gourmet-pizza',
    copy: {
      en: { tag: 'House favorite', name: 'Buffalo Chicken', description: 'Grilled chicken tossed in buffalo sauce, baked over Grande Mozzarella.', alt: 'Buffalo chicken pizza with grilled chicken and buffalo sauce — Raggio Gourmet, Newark DE' },
      es: { tag: 'Favorito de la casa', name: 'Buffalo Chicken', description: 'Pollo a la parrilla en salsa búfalo, horneado sobre Grande Mozzarella.', alt: 'Pizza de pollo búfalo — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'pepperoni',
    image: '/images/dishes/pizza-pizza-by-the-slice-luxury-8k.png',
    // Pepperoni = Large cheese pie + 1 topping ($1.00 per the printed menu).
    price: formatUSD(CHEESE_LADDER.lrg + 1),
    priceLabel: { en: 'Large 16" · cheese + pepperoni', es: 'Grande 16" · queso + pepperoni' },
    menuHref: '#pizza',
    copy: {
      en: { tag: 'The classic', name: 'Pepperoni', description: 'Our cheese pie — pizza sauce and 100% Grande Mozzarella — topped with pepperoni.', alt: 'Whole pepperoni pizza on a dark stone board — Raggio Gourmet, Newark DE' },
      es: { tag: 'El clásico', name: 'Pepperoni', description: 'Nuestra pizza de queso — salsa y 100% Grande Mozzarella — con pepperoni.', alt: 'Pizza de pepperoni entera — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'white-special',
    image: '/images/dishes/pizza-white-special-pizza-luxury-8k.png',
    price: formatUSD(GOURMET_LADDER.lrg),
    priceLabel: L16,
    menuHref: '#gourmet-pizza',
    copy: {
      en: { tag: 'No red sauce', name: 'White Special', description: 'Spinach, ricotta and mozzarella on our fresh garlic sauce.', alt: 'White Special pizza with spinach, ricotta and garlic sauce — Raggio Gourmet, Newark DE' },
      es: { tag: 'Sin salsa roja', name: 'White Special', description: 'Espinaca, ricotta y mozzarella sobre nuestra salsa de ajo fresca.', alt: 'Pizza blanca con espinaca y ricotta — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'sicilian-meat-lover',
    image: '/images/dishes/sicilian-sicilian-meat-lover-luxury-8k.png',
    price: formatUSD(23.99),
    priceLabel: { en: 'Sicilian square', es: 'Siciliana cuadrada' },
    menuHref: '#sicilian-pizza',
    copy: {
      en: { tag: 'Thick-crust Sicilian', name: 'Sicilian Meat Lover', description: 'Sausage, ham, pepperoni and bacon on our thick, square Sicilian crust.', alt: 'Sicilian Meat Lover square pizza with sausage, ham, pepperoni and bacon — Raggio Gourmet, Newark DE' },
      es: { tag: 'Siciliana de masa gruesa', name: 'Sicilian Meat Lover', description: 'Salchicha, jamón, pepperoni y tocino sobre masa siciliana gruesa.', alt: 'Pizza siciliana cuadrada con cuatro carnes — Raggio Gourmet, Newark DE' },
    },
  },
];

interface Favorite {
  id: string;
  image: string;
  menuHref: string;
  orderHref: string;
  copy: Record<Loc, { eyebrow: string; title: string; body: string; alt: string }>;
}

const FAVORITES: Favorite[] = [
  {
    id: 'pizza',
    image: '/images/dishes/pizza-signature-thin-crust-luxury-8k.png',
    menuHref: '#gourmet-pizza',
    orderHref: ORDER_LINKS.pizza,
    copy: {
      en: { eyebrow: 'Deck oven', title: 'Signature Pizza', body: '16" pies with Grande Mozzarella, from classic pepperoni to gourmet.', alt: 'Signature thin-crust pizza — Raggio Gourmet, Newark DE' },
      es: { eyebrow: 'Horno de piso', title: 'Pizza de la casa', body: 'Pizzas de 16" con Grande Mozzarella, del pepperoni clásico a las gourmet.', alt: 'Pizza de masa fina de la casa — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'steaks',
    image: '/images/dishes/cheesesteak-philly-cheesesteak-luxury-8k.png',
    menuHref: '#cheesesteaks',
    orderHref: ORDER_LINKS.steaks,
    copy: {
      en: { eyebrow: 'Philly style', title: 'Cheesesteaks', body: 'Chopped steak and melted cheese on a toasted roll.', alt: 'Philly cheesesteak on a toasted roll — Raggio Gourmet, Newark DE' },
      es: { eyebrow: 'Estilo Filadelfia', title: 'Cheesesteaks', body: 'Carne picada y queso fundido en pan tostado.', alt: 'Cheesesteak estilo Filadelfia — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'wings',
    image: '/images/dishes/wings-garlic-parm-wings-luxury-8k.png',
    menuHref: '#chicken-wings',
    orderHref: ORDER_LINKS.wings,
    copy: {
      en: { eyebrow: 'Game-day', title: 'Chicken Wings', body: 'Buffalo, BBQ, garlic parm, honey or mango habanero.', alt: 'Garlic parmesan chicken wings with celery — Raggio Gourmet, Newark DE' },
      es: { eyebrow: 'Para compartir', title: 'Alitas de pollo', body: 'Búfalo, BBQ, ajo y parmesano, miel o mango habanero.', alt: 'Alitas de pollo al ajo y parmesano — Raggio Gourmet, Newark DE' },
    },
  },
  {
    id: 'catering',
    image: '/images/dishes/sicilian-sicilian-special-luxury-8k.png',
    menuHref: '/catering',
    orderHref: ORDER_LINKS.catering,
    copy: {
      en: { eyebrow: 'Offices & events', title: 'Catering & Family Feasts', body: 'Trays, Sicilian squares and platters sized for your group.', alt: 'Sicilian Special square pizza for catering trays — Raggio Gourmet, Newark DE' },
      es: { eyebrow: 'Oficinas y eventos', title: 'Catering y banquetes', body: 'Bandejas, pizzas sicilianas y platos para tu grupo.', alt: 'Pizza siciliana cuadrada para catering — Raggio Gourmet, Newark DE' },
    },
  },
];

const UI = {
  en: {
    eyebrow: 'Newark, DE · Pickup & delivery',
    h1a: 'Gourmet pizza,',
    h1b: 'cheesesteaks & catering.',
    order: 'Order Online',
    menu: 'View Menu',
    carousel: 'Featured pizzas',
    slideOf: (i: number, n: number) => `${i} of ${n}`,
    prev: 'Previous pizza',
    next: 'Next pizza',
    pause: 'Pause slideshow',
    play: 'Play slideshow',
    goTo: (name: string) => `Show ${name}`,
    facts: ['Deck-oven baked', '100% Grande Mozzarella', 'Open daily from 9 AM'],
    favEyebrow: 'Raggio Favorites',
    favTitle: 'What are you craving?',
    see: 'See menu',
    orderShort: 'Order',
  },
  es: {
    eyebrow: 'Newark, DE · Para llevar y entrega',
    h1a: 'Pizza gourmet,',
    h1b: 'cheesesteaks y catering.',
    order: 'Ordenar en línea',
    menu: 'Ver menú',
    carousel: 'Pizzas destacadas',
    slideOf: (i: number, n: number) => `${i} de ${n}`,
    prev: 'Pizza anterior',
    next: 'Pizza siguiente',
    pause: 'Pausar presentación',
    play: 'Reproducir presentación',
    goTo: (name: string) => `Mostrar ${name}`,
    facts: ['Horneada en horno de piso', '100% Grande Mozzarella', 'Abierto a diario desde las 9 AM'],
    favEyebrow: 'Favoritos Raggio',
    favTitle: '¿Qué se te antoja?',
    see: 'Ver menú',
    orderShort: 'Ordenar',
  },
} as const;

const INTERVAL_MS = 7000;

function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

function Chevron({ dir }: { dir: 'l' | 'r' }) {
  return (
    <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'l' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

export default function HeroSlider({ lang = 'en' }: HeroSliderProps) {
  const loc: Loc = lang === 'es' ? 'es' : 'en';
  const ui = UI[loc];
  const uid = useId();
  const n = SLIDES.length;

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);   // user intent (Pause/Play button)
  const [hold, setHold] = useState(false);        // hover / focus inside carousel
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const touchX = useRef<number | null>(null);
  // Only the first slide's photo is requested up front (LCP). The rest are
  // requested after the page has loaded, so they never compete with the LCP image.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const arm = () => window.setTimeout(() => setArmed(true), 1500);
    if (document.readyState === 'complete') { const t = arm(); return () => window.clearTimeout(t); }
    let t = 0;
    const onLoad = () => { t = arm(); };
    window.addEventListener('load', onLoad, { once: true });
    return () => { window.removeEventListener('load', onLoad); window.clearTimeout(t); };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => { setReduced(mq.matches); if (mq.matches) setPlaying(false); };
    apply();
    mq.addEventListener('change', apply);
    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => { mq.removeEventListener('change', apply); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const go = useCallback((i: number) => { setArmed(true); setCurrent(((i % n) + n) % n); }, [n]);

  const running = playing && !hold && !reduced && visible;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(current + 1), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [running, current, go]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  };

  const slide = SLIDES[current];
  const c = slide.copy[loc];

  return (
    <>
      {/* ================= HERO CAROUSEL ================= */}
      <section
        aria-labelledby={`${uid}-h1`}
        className="rg-hero relative w-full text-cream overflow-hidden"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 48) go(current + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {/* Photo stack */}
        <div
          className="rg-hero-media"
          role="region"
          aria-roledescription="carousel"
          aria-label={ui.carousel}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${ui.slideOf(i + 1, n)}: ${s.copy[loc].name}`}
              aria-hidden={i !== current}
              className={`rg-slide ${i === current ? 'is-active' : ''}`}
            >
              {(i === 0 || armed) && (
                <Image
                  src={s.image}
                  alt={s.copy[loc].alt}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  loading={i === 0 ? undefined : 'lazy'}
                  quality={80}
                  sizes="(max-width: 1023px) 100vw, 64vw"
                  className="object-cover object-[50%_40%]"
                />
              )}
            </div>
          ))}
          <div className="rg-hero-scrim" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-7xl 2xl:max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rg-hero-copy">
            <p className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <span aria-hidden="true" className="inline-block w-6 h-px bg-gold" />
              {ui.eyebrow}
            </p>

            <h1
              id={`${uid}-h1`}
              className="font-display mt-4 text-[2.3rem] leading-[1.02] sm:text-6xl lg:text-[4.2rem] font-semibold tracking-tight text-cream"
            >
              {ui.h1a}
              <span className="block text-gold-bright italic font-normal">{ui.h1b}</span>
            </h1>

            {/* Current slide card */}
            <div
              className="rg-slide-card mt-6"
              aria-live={running ? 'off' : 'polite'}
              aria-atomic="true"
              onMouseEnter={() => setHold(true)}
              onMouseLeave={() => setHold(false)}
            >
              <div key={slide.id} className="motion-safe:animate-[heroFade_420ms_ease-out]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{c.tag}</p>
                    <p className="font-display text-2xl sm:text-[1.75rem] font-semibold text-cream mt-1 leading-tight">{c.name}</p>
                  </div>
                  <p className="text-right shrink-0">
                    <span className="block font-display text-2xl sm:text-[1.75rem] font-semibold text-gold-bright tabular-nums leading-tight">{slide.price}</span>
                    <span className="block text-[11px] text-stone mt-0.5">{slide.priceLabel[loc]}</span>
                  </p>
                </div>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-stone">{c.description}</p>
              </div>

              {/* Progress bar — restarts per slide, freezes when paused */}
              <div className="rg-progress mt-4" aria-hidden="true">
                <span
                  key={`${slide.id}-${running}`}
                  className={running ? 'is-running' : ''}
                  style={{ animationDuration: `${INTERVAL_MS}ms` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={ORDER_LINKS.pizza}
                target="_blank"
                rel="noopener noreferrer"
                data-dd-action-name={`hero_order_online:${slide.id}`}
                className="btn-gold rg-focus px-7 py-3.5 text-base"
              >
                {ui.order}
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="#menu" className="btn-charcoal rg-focus px-6 py-3.5 text-base">
                {ui.menu}
              </a>
            </div>

            <OrderTrustBadge lang={loc} variant="inline" className="mt-4" />

            {/* Carousel controls */}
            <div
              className="mt-6 flex items-center gap-2"
              onKeyDown={onKey}
              onFocus={() => setHold(true)}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); }}
            >
              <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? ui.pause : ui.play} className="rg-ctrl rg-focus">
                {playing ? (
                  <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                ) : (
                  <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                )}
              </button>
              <button type="button" onClick={() => go(current - 1)} aria-label={ui.prev} className="rg-ctrl rg-focus"><Chevron dir="l" /></button>
              <div className="flex items-center gap-1.5 px-1">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={ui.goTo(s.copy[loc].name)}
                    aria-current={i === current ? 'true' : undefined}
                    className={`rg-dot rg-focus ${i === current ? 'is-active' : ''}`}
                  />
                ))}
              </div>
              <button type="button" onClick={() => go(current + 1)} aria-label={ui.next} className="rg-ctrl rg-focus"><Chevron dir="r" /></button>
              <span className="ml-2 hidden sm:inline text-xs tabular-nums text-stone whitespace-nowrap" aria-hidden="true">
                {String(current + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-cream/85">
              {ui.facts.map((f) => (
                <li key={f} className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= RAGGIO FAVORITES ================= */}
      <section aria-labelledby={`${uid}-fav`} className="surface-oven border-t border-panel-border/60">
        <div className="max-w-7xl 2xl:max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{ui.favEyebrow}</p>
          <h2 id={`${uid}-fav`} className="font-display mt-2 text-3xl sm:text-4xl font-semibold text-cream">
            {ui.favTitle}
          </h2>

          <ul className="mt-8 grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FAVORITES.map((f) => {
              const fc = f.copy[loc];
              return (
                <li key={f.id} className="rg-fav-card group">
                  <a href={f.menuHref.startsWith('/') ? `/${lang}${f.menuHref}` : f.menuHref} className="block" tabIndex={-1} aria-hidden="true">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={f.image}
                        alt={fc.alt}
                        fill
                        loading="lazy"
                        quality={75}
                        sizes="(max-width: 519px) 92vw, (max-width: 1023px) 46vw, 320px"
                        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#14110d]/85 via-transparent to-transparent" />
                      <p className="absolute left-4 bottom-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
                        {fc.eyebrow}
                      </p>
                    </div>
                  </a>
                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-cream">{fc.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-stone">{fc.body}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                      <a href={f.menuHref.startsWith('/') ? `/${lang}${f.menuHref}` : f.menuHref} className="rg-focus text-sm font-semibold text-stone hover:text-cream underline underline-offset-4 decoration-gold/40">
                        {ui.see}
                      </a>
                      <a
                        href={f.orderHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-dd-action-name={`fav_order:${f.id}`}
                        aria-label={`${ui.orderShort} ${fc.title}`}
                        className="btn-gold rg-focus px-4 py-2 text-sm"
                      >
                        {ui.orderShort}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
