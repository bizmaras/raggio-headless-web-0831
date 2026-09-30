'use client';

/**
 * HeroSlider v3 — "Premium Landing" (preview/raggio-premium-landing)
 * Drop-in replacement: same default export, same props ({ dict, lang }).
 *
 * v3 changes:
 * 1. Single cinematic first view (no picker, no auto-rotation → WCAG 2.2.2 safe).
 * 2. One primary CTA (Order Online → FoodTec pizza menu) + secondary View Menu.
 * 3. Four quick-selection "Raggio Favorites" cards directly under the hero
 *    (Pizza · Cheesesteaks · Wings · Catering) using existing repo photography.
 * 4. Only verified claims (brick-oven, Grande Mozzarella — see craftClaims.ts).
 * 5. Ordering links come from src/config/ordering.ts (single source of truth).
 */

import Image from 'next/image';
import OrderTrustBadge from './OrderTrustBadge';
import { ORDER_LINKS, STORE } from '@/config/ordering';

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

const HERO_IMAGE = '/images/products/raggio-ny-style-pizza-luxury-8k.png';

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
    image: '/images/dishes/pizza-pepperoni-luxury-8k.png',
    menuHref: '#gourmet-pizza',
    orderHref: ORDER_LINKS.pizza,
    copy: {
      en: { eyebrow: 'Brick-oven', title: 'Signature Pizza', body: '16" pies with Grande Mozzarella, from classic pepperoni to gourmet.', alt: 'Pepperoni pizza with a cheese pull — Raggio Gourmet, Newark DE' },
      es: { eyebrow: 'Horno de ladrillo', title: 'Pizza de la casa', body: 'Pizzas de 16" con Grande Mozzarella, del pepperoni clásico a las gourmet.', alt: 'Pizza de pepperoni con queso fundido — Raggio Gourmet, Newark DE' },
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
    image: '/images/products/raggio-sicilian-square-luxury-8k.png',
    menuHref: '#catering',
    orderHref: ORDER_LINKS.catering,
    copy: {
      en: { eyebrow: 'Offices & events', title: 'Catering & Family Feasts', body: 'Trays, Sicilian squares and platters sized for your group.', alt: 'Sicilian square pizza for catering — Raggio Gourmet, Newark DE' },
      es: { eyebrow: 'Oficinas y eventos', title: 'Catering y banquetes', body: 'Bandejas, pizzas sicilianas y platos para tu grupo.', alt: 'Pizza siciliana cuadrada para catering — Raggio Gourmet, Newark DE' },
    },
  },
];

const UI = {
  en: {
    eyebrow: 'Newark, DE · Pickup & delivery',
    h1a: 'Gourmet pizza,',
    h1b: 'cheesesteaks & catering.',
    sub: 'Brick-oven pizza with Grande Mozzarella, Philly-style steaks and wings — made to order at 681 E Chestnut Hill Rd.',
    order: 'Order Online',
    menu: 'View Menu',
    call: 'Call',
    facts: ['Brick-oven baked', 'Grande Mozzarella', 'Open daily 9 AM'],
    favEyebrow: 'Raggio Favorites',
    favTitle: 'What are you craving?',
    see: 'See menu',
    orderShort: 'Order',
  },
  es: {
    eyebrow: 'Newark, DE · Para llevar y entrega',
    h1a: 'Pizza gourmet,',
    h1b: 'cheesesteaks y catering.',
    sub: 'Pizza al horno de ladrillo con Grande Mozzarella, cheesesteaks estilo Filadelfia y alitas — hechos al momento en 681 E Chestnut Hill Rd.',
    order: 'Ordenar en línea',
    menu: 'Ver menú',
    call: 'Llamar',
    facts: ['Horno de ladrillo', 'Grande Mozzarella', 'Abierto a diario 9 AM'],
    favEyebrow: 'Favoritos Raggio',
    favTitle: '¿Qué se te antoja?',
    see: 'Ver menú',
    orderShort: 'Ordenar',
  },
} as const;

function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export default function HeroSlider({ lang = 'en' }: HeroSliderProps) {
  const loc: Loc = lang === 'es' ? 'es' : 'en';
  const ui = UI[loc];

  return (
    <>
      {/* ================= HERO ================= */}
      <section aria-labelledby="hero-h1" className="rg-hero relative w-full text-cream overflow-hidden">
        {/* Photo layer — right side on desktop, top on mobile */}
        <div className="rg-hero-media">
          <Image
            src={HERO_IMAGE}
            alt={loc === 'es'
              ? 'Pizza estilo Nueva York recién salida del horno — Raggio Gourmet, Newark DE'
              : 'New York–style pizza fresh from the oven — Raggio Gourmet, Newark DE'}
            fill
            priority
            quality={82}
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-[60%_50%]"
          />
          <div className="rg-hero-scrim" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-7xl 2xl:max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rg-hero-copy">
            <p className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <span aria-hidden="true" className="inline-block w-6 h-px bg-gold" />
              {ui.eyebrow}
            </p>

            <h1
              id="hero-h1"
              className="font-display mt-4 text-[2.35rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem] font-semibold tracking-tight text-cream"
            >
              {ui.h1a}
              <span className="block text-gold-bright italic font-normal">{ui.h1b}</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] sm:text-lg leading-relaxed text-stone">
              {ui.sub}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={ORDER_LINKS.pizza}
                target="_blank"
                rel="noopener noreferrer"
                data-dd-action-name="hero_order_online"
                className="btn-gold rg-focus px-7 py-3.5 text-base"
              >
                {ui.order}
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="#menu" className="btn-charcoal rg-focus px-6 py-3.5 text-base">
                {ui.menu}
              </a>
              <a
                href={STORE.phoneHref}
                className="rg-focus inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-stone hover:text-cream underline underline-offset-4 decoration-gold/40 hover:decoration-gold"
              >
                {ui.call} {STORE.phoneDisplay}
              </a>
            </div>

            <OrderTrustBadge lang={loc} variant="inline" className="mt-5" />

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-cream/85">
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
      <section aria-labelledby="fav-h2" className="surface-oven border-t border-panel-border/60">
        <div className="max-w-7xl 2xl:max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{ui.favEyebrow}</p>
              <h2 id="fav-h2" className="font-display mt-2 text-3xl sm:text-4xl font-semibold text-cream">
                {ui.favTitle}
              </h2>
            </div>
          </div>

          <ul className="mt-8 grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FAVORITES.map((f, i) => {
              const c = f.copy[loc];
              return (
                <li key={f.id} className="rg-fav-card group">
                  <a href={f.menuHref} className="rg-focus block" aria-label={`${c.title} — ${ui.see}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={f.image}
                        alt={c.alt}
                        fill
                        loading={i < 2 ? 'eager' : 'lazy'}
                        quality={78}
                        sizes="(max-width: 519px) 92vw, (max-width: 1023px) 46vw, 320px"
                        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#14110d]/85 via-transparent to-transparent" />
                      <p className="absolute left-4 bottom-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
                        {c.eyebrow}
                      </p>
                    </div>
                  </a>
                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-cream">{c.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-stone">{c.body}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                      <a href={f.menuHref} className="rg-focus text-sm font-semibold text-stone hover:text-cream underline underline-offset-4 decoration-gold/40">
                        {ui.see}
                      </a>
                      <a
                        href={f.orderHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-dd-action-name={`fav_order:${f.id}`}
                        aria-label={`${ui.orderShort} ${c.title}`}
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
