'use client';

import { useState } from 'react';

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    price: string;
    description?: string;
    ingredients?: string[];
    image?: string;
    orderUrl?: string;
  };
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Doğrudan restoranının FoodTec portal adresi atandı
  const defaultOrderUrl = item.orderUrl || 'https://phillystyleexpress.foodtecsolutions.com/';
  const defaultIngredients = item.ingredients || ['Grande Mozzarella', 'Fresh Garlic', 'Signature House Sauce'];
  const defaultImage = item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      <div className="bg-panel border border-panel-border rounded-xl p-5 hover:border-gold/50 transition-all flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-bold text-cream">{item.name}</h4>
            <span className="text-gold font-extrabold">{item.price}</span>
          </div>
          <p className="text-sm text-stone mb-4 line-clamp-2">
            {item.description || 'Prepared fresh with premium artisanal ingredients.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full py-2 px-4 rounded-lg bg-ink border border-panel-border hover:border-gold text-cream hover:text-gold text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer mt-auto"
        >
          <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round"></path>
          </svg>
          View Details & Ingredients
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-panel border border-panel-border rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-ink/80 text-stone hover:text-cream flex items-center justify-center border border-panel-border cursor-pointer"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 h-48 md:h-auto relative bg-ink">
              <img
                src={defaultImage}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 pr-6">
                  <h3 className="text-xl font-bold text-cream">{item.name}</h3>
                  <span className="text-gold font-extrabold text-lg">{item.price}</span>
                </div>
                <p className="text-xs text-stone mb-4">
                  {item.description || 'Prepared fresh with premium artisanal ingredients.'}
                </p>

                <div className="mb-6">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-2">
                    Key Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {defaultIngredients.map((ing) => (
                      <span key={ing} className="text-[11px] px-2 py-1 rounded bg-ink text-cream border border-panel-border">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={defaultOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gold hover:bg-gold-bright text-ink font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
              >
                Order Online
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}