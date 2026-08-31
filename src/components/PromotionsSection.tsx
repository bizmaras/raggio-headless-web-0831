'use client';

import { Tag, ArrowRight } from 'lucide-react';

const promotions = [
  {
    badge: 'MON & TUE SPECIAL',
    title: '2 Large Plain Cheese Pizzas',
    price: '$29.99',
    savings: 'Save $7.99',
    description: 'Two 16" stone-baked deck-oven cheese pizzas with 100% Grande Mozzarella. Available all day Mon & Tue.',
    code: 'AUTO-APPLIED',
    link: 'https://phillystyleexpress.foodtecsolutions.com/',
  },
  {
    badge: 'DELAWARE FAMILY BUNDLE',
    title: 'Large 1-Topping + 10 Wings + 2L Soda',
    price: '$31.99',
    savings: 'Save $6.50',
    description: '16" 1-topping pizza, 10 traditional or boneless wings with ranch/blue cheese, and a 2-liter soda.',
    code: 'POS WEEKLY DEAL',
    link: 'https://phillystyleexpress.foodtecsolutions.com/',
  },
  {
    badge: 'WEEKDAY LUNCH COMBINATION',
    title: 'Cheesesteak or Sub + Fries & Soda',
    price: '$13.99',
    savings: 'Mon-Fri 10:30AM–3PM',
    description: 'Choice of authentic Philly ribeye cheesesteak or gourmet sub, served with golden fries and a cold can drink.',
    code: 'LUNCH SPECIAL',
    link: 'https://phillystyleexpress.foodtecsolutions.com/',
  },
];

export default function PromotionsSection() {
  return (
    <section id="promotions" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[210px]">
      <div className="bg-gradient-to-b from-panel to-ink-2 border border-ember/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-ember/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-ember-bright uppercase bg-ember/10 border border-ember/30 px-3.5 py-1 rounded-full mb-3">
            <Tag className="w-3.5 h-3.5" />
            Weekly POS Specials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-cream">
            Featured Deals &amp; Online Offers
          </h2>
          <p className="text-stone text-sm md:text-base max-w-xl mx-auto mt-2">
            Select your deal to order online directly through our FoodTec portal for instant delivery or pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {promotions.map((promo, idx) => (
            <div
              key={idx}
              className="bg-ink/80 border border-panel-border hover:border-gold/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-gold bg-panel px-2.5 py-1 rounded-md border border-panel-border">
                    {promo.badge}
                  </span>
                  <span className="text-xs font-semibold text-ember-bright">
                    {promo.savings}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-cream mb-2 leading-snug">
                  {promo.title}
                </h3>

                <p className="text-stone text-xs leading-relaxed mb-6">
                  {promo.description}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-gold-bright">
                    {promo.price}
                  </span>
                  <span className="text-xs font-mono text-stone-dim">
                    ({promo.code})
                  </span>
                </div>

                <a
                  href={promo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-[#1c1408] font-extrabold text-sm py-2.5 rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all duration-200 cursor-pointer"
                >
                  Order This Deal
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}