'use client';

/**
 * SignatureDishShowcase v2 — "Anatomy of a Raggio Pie" (Stage 2)
 *
 * Drop-in: same default export, same props ({ dict, lang }). Uses dict.showcase only for
 * badge / title / subtitle; RECIPES AND PRICES NO LONGER COME FROM THE DICTIONARY.
 *
 * Why: the v1 dictionary copy contradicted the checkout the customer lands on.
 *   Meat Lover  v1: sausage, MEATBALLS, bacon, pepperoni, "mozzarella & PROVOLONE"
 *               FoodTec: Pizza Sauce, Grande Mozzarella, Ham, Bacon, Pepperoni, Sausage
 *   Buffalo     v1: "RANCH swirl", "mozzarella & CHEDDAR"
 *               FoodTec: Buffalo Sauce, BLUE CHEESE dressing, Grande Mozzarella, Grilled Chicken
 *   Pepperoni   v1: "Fior di Latte", "San Marzano D.O.P.", "48-hour" — none evidenced;
 *               FoodTec/PDF say "Grande Mozzarella"; Fior di latte is a different cheese.
 *
 * Layers use the claim ledger: an unverified layer (48 h dough, San Marzano) renders
 * only in preview (NEXT_PUBLIC_SHOW_UNVERIFIED_CLAIMS=true), with a dashed rule.
 */

import { useId, useState } from 'react';
import Image from 'next/image';
import { CLAIMS, SHOW_UNVERIFIED, type ClaimId } from '@/data/craftClaims';
import { CHEESE_LADDER, GOURMET_LADDER, formatUSD } from '@/data/pizzaPricing';
import { foodtecUrl } from '@/data/foodtecCatalog';

type Lang = 'en' | 'es';
type DishKey = 'pepperoni' | 'meatlover' | 'buffalo';

interface Layer {
  n: number;
  /** hotspot position on the 1:1 pizza image, % */
  at: { x: number; y: number };
  title: { en: string; es: string };
  body: { en: string; es: string };
  claim?: ClaimId; // if set, layer obeys the ledger
}

interface Dish {
  key: DishKey;
  name: { en: string; es: string };
  image: string;
  price: number;
  priceNote: { en: string; es: string };
  foodtecItem: string;
  layers: Layer[];
}

const crust = (claim: ClaimId = 'brick-oven'): Layer => ({
  n: 1,
  at: { x: 14, y: 50 },
  title: { en: CLAIMS[claim].chip.en, es: CLAIMS[claim].chip.es },
  body: CLAIMS[claim].story,
  claim,
});
const cheese: Layer = {
  n: 3,
  at: { x: 46, y: 55 },
  title: CLAIMS['grande-mozzarella'].chip,
  body: CLAIMS['grande-mozzarella'].story,
  claim: 'grande-mozzarella',
};

const DISHES: Dish[] = [
  {
    key: 'pepperoni',
    name: { en: 'Pepperoni', es: 'Pepperoni' },
    image: '/images/pizza-pepperoni-clean.png',
    price: CHEESE_LADDER.lrg + 1, // PDF: "Each topping 1.00" on the plain cheese pie
    priceNote: { en: 'Large 16" cheese + 1 topping', es: 'Grande 16" de queso + 1 ingrediente' },
    foodtecItem: 'Pizza › Cheese › add Pepperoni',
    layers: [
      crust(),
      { n: 2, at: { x: 72, y: 62 }, title: { en: 'House pizza sauce', es: 'Salsa de pizza de la casa' }, body: { en: 'Our red pizza sauce, spread edge to edge.', es: 'Nuestra salsa roja, de borde a borde.' } },
      cheese,
      { n: 4, at: { x: 62, y: 40 }, title: { en: 'Pepperoni', es: 'Pepperoni' }, body: { en: 'Added as a topping on our Large cheese pie.', es: 'Agregado como ingrediente a nuestra grande de queso.' } },
    ],
  },
  {
    key: 'meatlover',
    name: { en: 'Meat Lover', es: 'Amante de la Carne' },
    image: '/images/pizza-meatlover-clean.png',
    price: GOURMET_LADDER.lrg,
    priceNote: { en: 'Large 16"', es: 'Grande 16"' },
    foodtecItem: 'Pizza › Meat Lover',
    layers: [
      crust(),
      { n: 2, at: { x: 72, y: 62 }, title: { en: 'Pizza sauce', es: 'Salsa de pizza' }, body: { en: 'Red sauce base to carry four meats.', es: 'Base de salsa roja para cuatro carnes.' } },
      cheese,
      { n: 4, at: { x: 62, y: 40 }, title: { en: 'Ham · Bacon · Pepperoni · Sausage', es: 'Jamón · Tocino · Pepperoni · Salchicha' }, body: { en: 'Exactly the four meats on the checkout recipe.', es: 'Las cuatro carnes exactas de la receta.' } },
    ],
  },
  {
    key: 'buffalo',
    name: { en: 'Buffalo Chicken', es: 'Pollo Búfalo' },
    image: '/images/pizza-buffalo-clean.png',
    price: GOURMET_LADDER.lrg,
    priceNote: { en: 'Large 16"', es: 'Grande 16"' },
    foodtecItem: 'Pizza › Buffalo Chicken',
    layers: [
      crust(),
      { n: 2, at: { x: 72, y: 62 }, title: { en: 'Buffalo sauce + blue cheese', es: 'Salsa búfalo + queso azul' }, body: { en: 'Buffalo sauce base finished with blue cheese dressing.', es: 'Base de salsa búfalo con aderezo de queso azul.' } },
      cheese,
      { n: 4, at: { x: 62, y: 40 }, title: { en: 'Grilled chicken', es: 'Pollo a la parrilla' }, body: { en: 'Grilled chicken over the Grande.', es: 'Pollo a la parrilla sobre la Grande.' } },
    ],
  },
];

// Preview-only layer: dough fermentation (renders only if the ledger allows it)
const FERMENT: Layer = { n: 5, at: { x: 30, y: 68 }, title: CLAIMS['cold-ferment-48h'].chip, body: CLAIMS['cold-ferment-48h'].story, claim: 'cold-ferment-48h' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SignatureDishShowcase({ dict, lang = 'en' }: { dict?: any; lang?: string }) {
  const L: Lang = lang === 'es' ? 'es' : 'en';
  const t = dict?.showcase || {};
  const [dishIdx, setDishIdx] = useState(0);
  const [spot, setSpot] = useState(1);
  const uid = useId();
  const dish = DISHES[dishIdx];

  const layers = [...dish.layers, ...(SHOW_UNVERIFIED ? [FERMENT] : [])].filter(
    (l) => !l.claim || CLAIMS[l.claim].status === 'verified' || SHOW_UNVERIFIED
  );
  const activeLayer = layers.find((l) => l.n === spot) ?? layers[0];

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (dishIdx + (e.key === 'ArrowRight' ? 1 : -1) + DISHES.length) % DISHES.length;
    setDishIdx(next);
    setSpot(1);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16" aria-labelledby={`${uid}-h`}>
      <header className="max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-gold">{(t.badge || 'Signature pies').toUpperCase()}</p>
        <h2 id={`${uid}-h`} className="mt-2 font-display text-3xl md:text-5xl font-semibold leading-[1.05] text-cream">
          {L === 'es' ? 'Anatomía de una pizza Raggio' : 'Anatomy of a Raggio pie'}
        </h2>
        <p className="mt-3 text-sm md:text-base text-stone leading-relaxed">
          {L === 'es'
            ? 'Toque cada número. Todo lo que ve aquí es exactamente lo que encontrará al pagar.'
            : 'Tap each number. Everything here is exactly what you’ll find at checkout.'}
        </p>
      </header>

      <div role="tablist" aria-label={L === 'es' ? 'Pizzas' : 'Pizzas'} onKeyDown={onTabKey} className="mt-8 flex gap-1 border-b border-panel-border">
        {DISHES.map((d, i) => (
          <button
            key={d.key}
            id={`${uid}-tab-${i}`}
            role="tab"
            aria-selected={i === dishIdx}
            aria-controls={`${uid}-panel`}
            tabIndex={i === dishIdx ? 0 : -1}
            onClick={() => { setDishIdx(i); setSpot(1); }}
            className={`-mb-px px-4 h-11 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              i === dishIdx ? 'border-gold text-cream' : 'border-transparent text-stone hover:text-cream'
            }`}
          >
            {d.name[L]}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${dishIdx}`} className="mt-8 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div className="relative aspect-square max-w-[520px] w-full mx-auto">
          <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(201,161,92,.22),transparent)]" />
          <Image src={dish.image} alt={`${dish.name[L]} pizza — Raggio Gourmet & Pizza`} fill sizes="(min-width:768px) 520px, 90vw" className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,.55)]" />
          {layers.map((l) => (
            <button
              key={l.n}
              type="button"
              onClick={() => setSpot(l.n)}
              aria-pressed={activeLayer?.n === l.n}
              aria-label={`${l.n}. ${l.title[L]}`}
              style={{ left: `${l.at.x}%`, top: `${l.at.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center text-sm font-bold border-2 transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                activeLayer?.n === l.n ? 'bg-gold text-ink border-gold scale-110' : 'bg-ink/80 text-cream border-cream/70 backdrop-blur-sm'
              }`}
            >
              {l.n}
            </button>
          ))}
        </div>

        <div>
          <ol className="space-y-4">
            {layers.map((l) => {
              const on = activeLayer?.n === l.n;
              const dashed = l.claim && CLAIMS[l.claim].status === 'owner-confirm';
              return (
                <li key={l.n}>
                  <button
                    type="button"
                    onClick={() => setSpot(l.n)}
                    className={`w-full text-left pl-4 border-l-2 ${dashed ? 'border-dashed' : ''} ${on ? 'border-gold' : 'border-panel-border'} cursor-pointer`}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="font-display text-gold tabular-nums">{String(l.n).padStart(2, '0')}</span>
                      <span className={`font-semibold ${on ? 'text-cream' : 'text-cream/75'}`}>{l.title[L]}</span>
                    </span>
                    {on && <span className="block mt-1 text-sm leading-relaxed text-stone">{l.body[L]}</span>}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 pt-6 border-t border-panel-border flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-3xl font-semibold text-gold tabular-nums">{formatUSD(dish.price)}</p>
              <p className="text-xs text-stone">{dish.priceNote[L]}</p>
            </div>
            <a
              href={foodtecUrl('pizza')}
              target="_blank"
              rel="noopener noreferrer"
              data-dd-action-name={`showcase_order:${dish.key}`}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-ember hover:bg-ember-hover text-white font-bold transition-colors"
            >
              {t.order_pizza || (L === 'es' ? 'Ordenar esta pizza' : 'Order this pizza')}
            </a>
          </div>
          <p className="mt-2 text-[11px] text-stone">
            {L === 'es' ? 'Al pagar' : 'On checkout'}: <span className="text-cream/85">{dish.foodtecItem}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
