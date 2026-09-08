'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface PromoItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  price: string;
  details: string;
  ingredients: string[];
  orderUrl: string;
}

interface PromotionsSectionProps {
  dict?: {
    promotions?: {
      title?: string;
      order_deal?: string;
      view_deal?: string;
      coupon_tag?: string;
      items?: Array<{
        id: string;
        tag: string;
        title: string;
        description: string;
        details: string;
      }>;
    };
    menu?: {
      key_ingredients?: string;
    };
  };
}

const FOODTEC_BASE_URL = 'https://phillystyleexpress.foodtecsolutions.com/';

const DEFAULT_PROMOTIONS: PromoItem[] = [
  {
    id: 'promo-1',
    tag: 'COUPON SPECIAL',
    title: '2 XL Pizzas 1 Topping Each',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$32.99',
    details: 'Includes 2 Extra Large Cheese Pizzas with 1 topping of your choice on each. Valid for Take-Out & Delivery only.',
    ingredients: ['Grande Mozzarella', 'Signature Sauce', 'Choice of 1 Topping per Pizza'],
    orderUrl: FOODTEC_BASE_URL
  },
  {
    id: 'promo-2',
    tag: 'COUPON SPECIAL',
    title: 'Large 1 Topping Pizza & 20 Wings',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$37.99',
    details: 'Includes 1 Large Pizza with 1 topping and 20 Jumbo Wings (Traditional or Boneless) with ranch or blue cheese.',
    ingredients: ['Grande Mozzarella', 'Jumbo Chicken Wings', 'Choice of Wing Sauce'],
    orderUrl: FOODTEC_BASE_URL
  },
  {
    id: 'promo-3',
    tag: 'COUPON SPECIAL',
    title: '2 Lrg 1 Topping Pizza, 20 Wings & Soda',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$52.99',
    details: 'Includes 2 Large 1-Topping Pizzas, 20 Jumbo Wings, and one 2-Liter Soda of choice.',
    ingredients: ['Grande Mozzarella', 'Jumbo Wings', '2-Liter Soda'],
    orderUrl: FOODTEC_BASE_URL
  },
  {
    id: 'promo-4',
    tag: 'COUPON SPECIAL',
    title: 'Large 1 Topping Pizza & 10 Wings',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$29.99',
    details: 'Includes 1 Large 1-Topping Pizza and 10 Jumbo Wings with celery and choice of dipping sauce.',
    ingredients: ['Grande Mozzarella', 'Jumbo Wings', 'Dipping Sauce'],
    orderUrl: FOODTEC_BASE_URL
  },
  {
    id: 'promo-5',
    tag: 'COUPON SPECIAL',
    title: '2 Medium 1 Topping Pizzas',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$26.99',
    details: 'Includes 2 Medium 1-Topping Pizzas with our signature marinara and fresh mozzarella.',
    ingredients: ['Grande Mozzarella', 'Choice of 1 Topping per Pizza'],
    orderUrl: FOODTEC_BASE_URL
  },
  {
    id: 'promo-6',
    tag: 'COUPON SPECIAL',
    title: '2 XL Pizzas, 20 Wings & 2L Soda',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$59.99',
    details: 'The ultimate party feast: 2 Extra Large 1-Topping Pizzas, 20 Jumbo Wings, and a 2-Liter Soda.',
    ingredients: ['Grande Mozzarella', 'Jumbo Wings', '2-Liter Soda'],
    orderUrl: FOODTEC_BASE_URL
  }
];

export default function PromotionsSection({ dict }: PromotionsSectionProps) {
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);

  const sectionTitle = dict?.promotions?.title || 'Deals & Specials';
  const orderDealText = dict?.promotions?.order_deal || 'Order This Deal';
  const viewDealText = dict?.promotions?.view_deal || 'View Deal Details';

  const promotions = DEFAULT_PROMOTIONS.map((promo, idx) => {
    const localized = dict?.promotions?.items?.[idx];
    if (!localized) return promo;
    return {
      ...promo,
      tag: localized.tag || promo.tag,
      title: localized.title || promo.title,
      description: localized.description || promo.description,
      details: localized.details || promo.details,
    };
  });

  const handleScroll = (direction: 'left' | 'right') => {
    const el = document.getElementById('promotions-carousel');
    if (el) {
      const scrollAmount = el.clientWidth * 0.85;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-bright tracking-tight">
            {sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone mt-1">
            {dict?.promotions?.coupon_tag ? 'Válido para llevar y entrega a domicilio' : 'Valid for takeout & delivery online'}
          </p>
        </div>

        {/* Mobile Navigation Arrows to slide deals left/right */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous deal"
            className="p-2 rounded-full bg-panel border border-panel-border text-stone hover:text-gold hover:border-gold/50 transition-all cursor-pointer active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next deal"
            className="p-2 rounded-full bg-panel border border-panel-border text-stone hover:text-gold hover:border-gold/50 transition-all cursor-pointer active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SNAP CAROUSEL ON MOBILE (saves vertical space) / 3-COL GRID ON DESKTOP */}
      <div
        id="promotions-carousel"
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 pb-4 md:pb-0 scroll-pl-6 md:scroll-pl-0"
      >
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="snap-start shrink-0 w-[82vw] max-w-[330px] sm:w-[350px] md:w-auto md:max-w-none bg-panel border border-panel-border rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-gold/60 hover:shadow-xl transition-all duration-300 relative group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20 font-mono">
                  {promo.tag}
                </span>
                <span className="text-xl font-extrabold text-cream group-hover:text-gold-bright transition-colors">
                  {promo.price}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-cream mb-2 group-hover:text-gold transition-colors line-clamp-1">
                {promo.title}
              </h3>

              <p className="text-xs text-stone leading-relaxed mb-4 line-clamp-2">
                {promo.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-panel-border/50">
              <button
                type="button"
                onClick={() => setSelectedPromo(promo)}
                className="w-full py-2.5 px-3 rounded-lg bg-ink border border-panel-border hover:border-gold text-stone hover:text-cream text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <BookOpen className="w-3.5 h-3.5 text-gold" />
                {viewDealText}
              </button>

              <a
                href={promo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-gold hover:bg-gold-bright text-ink text-xs font-extrabold transition-all duration-200 shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                {orderDealText}
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Deal Details & Ingredients */}
      {selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-panel border border-panel-border rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedPromo(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-stone hover:text-cream text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">
              {selectedPromo.tag}
            </span>

            <h3 className="text-2xl font-extrabold text-cream mb-2">
              {selectedPromo.title}
            </h3>

            <div className="text-xl font-extrabold text-gold-bright mb-4">
              {selectedPromo.price}
            </div>

            <p className="text-sm text-stone leading-relaxed mb-4">
              {selectedPromo.details}
            </p>

            <div className="mb-6">
              <span className="text-xs font-bold text-cream uppercase tracking-wider block mb-2">
                {dict?.menu?.key_ingredients || 'Key Inclusions:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPromo.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs px-2.5 py-1 rounded-md bg-ink text-stone border border-panel-border font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={selectedPromo.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-gold hover:bg-gold-bright text-ink font-extrabold py-3 rounded-xl text-sm transition-all shadow-lg"
            >
              {orderDealText} &rarr;
            </a>
          </div>
        </div>
      )}
    </section>
  );
}