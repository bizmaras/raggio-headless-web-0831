'use client';

const PROMOTIONS = [
  {
    id: 'promo-1',
    tag: 'COUPON SPECIAL',
    title: '2 XL Pizzas 1 Topping Each',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$32.99'
  },
  {
    id: 'promo-2',
    tag: 'COUPON SPECIAL',
    title: 'Large 1 Topping Pizza & 20 Wings',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$37.99'
  },
  {
    id: 'promo-3',
    tag: 'COUPON SPECIAL',
    title: '2 Lrg 1 Topping Pizza, 20 Wings & Soda',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$52.99'
  },
  {
    id: 'promo-4',
    tag: 'COUPON SPECIAL',
    title: 'Large 1 Topping Pizza & 10 Wings',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$29.99'
  },
  {
    id: 'promo-5',
    tag: 'COUPON SPECIAL',
    title: 'Large Cheese Pizza with 3 Toppings',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$19.99'
  },
  {
    id: 'promo-6',
    tag: 'COUPON SPECIAL',
    title: '2 XL Cheese Pizzas & 20 Wings',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer. For take-out & delivery only.',
    price: '$64.99'
  },
  {
    id: 'promo-7',
    tag: 'COUPON SPECIAL',
    title: '$5 OFF with Purchase of $40 or more',
    description: 'Present coupon when receiving your order. Not to be combined with any other offer.',
    price: 'SAVE $5'
  }
];

export default function PromotionsSection() {
  return (
    <section id="promotions" className="max-w-7xl mx-auto px-4 md:px-6 py-16 scroll-mt-[120px]">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-panel-border bg-panel text-stone text-xs font-bold uppercase tracking-wider mb-4">
          <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Weekly POS Specials
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-cream mb-4">Featured Deals & Online Offers</h2>
        <p className="text-stone max-w-2xl mx-auto">
          Select your deal to order online directly through our FoodTec portal for instant delivery or pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROMOTIONS.map((promo) => (
          <div key={promo.id} className="flex flex-col bg-panel border border-panel-border rounded-xl p-6 hover:border-gold/50 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-stone uppercase tracking-wider px-2 py-1 bg-ink rounded border border-panel-border">
                {promo.tag}
              </span>
            </div>

            <h3 className="text-xl font-bold text-cream mb-2">{promo.title}</h3>
            <p className="text-sm text-stone mb-6 flex-grow">{promo.description}</p>

            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-extrabold text-gold">{promo.price}</span>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button className="w-full bg-gold hover:bg-gold-bright text-ink font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                Order This Deal
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-cream hover:text-gold transition-colors border border-transparent hover:border-panel-border rounded-lg">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"></path>
                  <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
                View Details & Ingredients
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}