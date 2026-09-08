'use client';

import { useState } from 'react';

interface MenuItemCardProps {
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
  dict?: {
    menu?: {
      view_details?: string;
      key_ingredients?: string;
      order_online?: string;
      freshly_prepared?: string;
      modal_close?: string;
    };
  };
}

export default function MenuItemCard(props: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const itemName = props.name || props.item?.name || 'Menu Item';
  const rawPrice = props.price ?? props.item?.price ?? '0.00';
  const itemPrice = typeof rawPrice === 'number' ? `$${rawPrice.toFixed(2)}` : rawPrice;
  const itemDescription = props.description || props.item?.description || 'Prepared fresh to order with premium ingredients.';

  const itemOrderUrl = props.orderUrl || props.item?.orderUrl || 'https://phillystyleexpress.foodtecsolutions.com/';

  // Key ingredients list (fallback to empty array)
  const itemIngredients = props.ingredients || props.item?.ingredients || [];

  // Item image URL
  const itemImage = props.image || props.item?.image;

  const viewDetailsText = props.dict?.menu?.view_details || 'View Details & Ingredients';
  const orderOnlineText = props.dict?.menu?.order_online || 'Order Online';
  const keyIngredientsText = props.dict?.menu?.key_ingredients || 'Key Ingredients';
  const freshlyPreparedText = props.dict?.menu?.freshly_prepared || 'Freshly Prepared';
  const modalCloseAria = props.dict?.menu?.modal_close || 'Close details modal';

  return (
    <>
      <div className="bg-panel border border-panel-border rounded-xl p-5 hover:border-gold/60 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(201,161,92,0.14)] transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-bold text-cream group-hover:text-gold-bright transition-colors">{itemName}</h4>
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
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {viewDetailsText}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-panel border border-panel-border rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={modalCloseAria}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-ink/90 text-stone hover:text-cream flex items-center justify-center border border-panel-border cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Display Image or Elegant Brand Logo Fallback */}
            <div className="w-full md:w-1/2 h-56 md:h-auto relative bg-ink border-b md:border-b-0 md:border-r border-panel-border/50 flex-shrink-0 flex items-center justify-center">
              {itemImage ? (
                <img
                  src={itemImage}
                  alt={itemName}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg className="w-16 h-16 text-gold mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-gold font-extrabold tracking-[0.2em] uppercase text-xs">
                    Raggio Gourmet
                  </span>
                  <span className="text-stone text-xs mt-1 font-medium tracking-wider">
                    {freshlyPreparedText}
                  </span>
                </div>
              )}
            </div>

            {/* Item Details Information */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-4 pr-8">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-cream leading-tight">{itemName}</h3>
                  <span className="text-gold font-extrabold text-2xl ml-3 flex-shrink-0">{itemPrice}</span>
                </div>

                <p className="text-sm md:text-base text-stone mb-6 leading-relaxed">
                  {itemDescription}
                </p>

                {/* Key Ingredients (Rendered Only When Present) */}
                {itemIngredients.length > 0 && (
                  <div className="mb-8">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-3">
                      {keyIngredientsText}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {itemIngredients.map((ing) => (
                        <span key={ing} className="text-xs md:text-sm px-3 py-1.5 rounded-md bg-ink text-cream border border-panel-border font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a
                href={itemOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gold hover:bg-gold-bright text-ink font-extrabold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-center text-base md:text-lg shadow-lg hover:shadow-gold/20"
              >
                {orderOnlineText}
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