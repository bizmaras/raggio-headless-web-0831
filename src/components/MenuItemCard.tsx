'use client';

import { useState } from 'react';

interface MenuItemCardProps {
  // Hem doğrudan prop hem de nesne prop alabilmesi için esnek tip
  item?: {
    id?: string;
    name?: string;
    price?: string | number;
    description?: string;
    ingredients?: string[];
    image?: string;
    orderUrl?: string;
  };
  name?: string;
  price?: string | number;
  description?: string;
  ingredients?: string[];
  image?: string;
  orderUrl?: string;
}

export default function MenuItemCard(props: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prop veya item nesnesi üzerinden gelen verileri birleştir
  const itemName = props.name || props.item?.name || 'Menu Item';
  const rawPrice = props.price ?? props.item?.price ?? '0.00';
  const itemPrice = typeof rawPrice === 'number' ? `$${rawPrice.toFixed(2)}` : rawPrice;
  const itemDescription = props.description || props.item?.description || 'Prepared fresh with premium artisanal ingredients.';

  const defaultOrderUrl = props.orderUrl || props.item?.orderUrl || 'https://phillystyleexpress.foodtecsolutions.com/';
  const defaultIngredients = props.ingredients || props.item?.ingredients || ['Grande Mozzarella', 'Fresh Garlic', 'Signature House Sauce'];
  const defaultImage = props.image || props.item?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      {/* Standart Menü Kartı */}
      <div className="bg-panel border border-panel-border rounded-xl p-5 hover:border-gold/50 transition-all flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-bold text-cream">{itemName}</h4>
            <span className="text-gold font-extrabold">{itemPrice}</span>
          </div>
          <p className="text-sm text-stone mb-4 line-clamp-2">
            {itemDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full py-2.5 px-4 rounded-lg bg-ink border border-panel-border hover:border-gold text-cream hover:text-gold text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer mt-auto"
        >
          <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round"></path>
          </svg>
          View Details & Ingredients
        </button>
      </div>

      {/* Pop-up Modal (Genişletilmiş max-w-4xl Görünüm) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-panel border border-panel-border rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-ink/90 text-stone hover:text-cream flex items-center justify-center border border-panel-border cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 h-56 md:h-auto relative bg-ink flex-shrink-0">
              <img
                src={defaultImage}
                alt={itemName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-4 pr-8">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-cream leading-tight">{itemName}</h3>
                  <span className="text-gold font-extrabold text-2xl ml-3 flex-shrink-0">{itemPrice}</span>
                </div>

                <p className="text-sm md:text-base text-stone mb-6 leading-relaxed">
                  {itemDescription}
                </p>

                <div className="mb-8">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-3">
                    Key Ingredients
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {defaultIngredients.map((ing) => (
                      <span key={ing} className="text-xs md:text-sm px-3 py-1.5 rounded-md bg-ink text-cream border border-panel-border font-medium">
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
                className="w-full bg-gold hover:bg-gold-bright text-ink font-extrabold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-center text-base md:text-lg shadow-lg hover:shadow-gold/20"
              >
                Order Online
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}