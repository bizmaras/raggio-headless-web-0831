'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { SizeVariant } from '@/data/sizePricing';

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
  sizes?: SizeVariant[] | null;
  lang?: string;
  categorySlug?: string;
  slug?: string;
  dict?: {
    menu?: {
      view_details?: string;
      key_ingredients?: string;
      order_online?: string;
      freshly_prepared?: string;
      default_description?: string;
      modal_close?: string;
      select_size?: string;
      choose_size?: string;
    };
  };
}

export default function MenuItemCard(props: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sizes = props.sizes && props.sizes.length > 0 ? props.sizes : null;
  // Default to LRG if present, otherwise first available size
  const defaultSizeIdx = sizes
    ? Math.max(0, sizes.findIndex((s) => s.id === 'lrg'))
    : 0;
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(defaultSizeIdx);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentLang = (props.lang === 'es' ? 'es' : 'en') as 'en' | 'es';
  const itemName = props.name || props.item?.name || 'Menu Item';
  
  // Selected size calculation
  const activeSize = sizes ? sizes[selectedSizeIndex] ?? sizes[0] : null;
  const rawPrice = activeSize
    ? activeSize.price
    : (props.price ?? props.item?.price ?? '0.00');
  const itemPrice = typeof rawPrice === 'number' ? `$${rawPrice.toFixed(2)}` : rawPrice;

  const defaultDesc = props.dict?.menu?.default_description || 
    (props.dict?.menu?.view_details === 'Ver Detalles e Ingredientes' 
      ? 'Preparado fresco al momento con ingredientes de primera calidad.' 
      : 'Prepared fresh to order with premium ingredients.');
  const itemDescription = props.description || props.item?.description || defaultDesc;

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
  const selectSizeText = props.dict?.menu?.select_size || 'Size:';
  const chooseSizeText = props.dict?.menu?.choose_size || 'Select Size';

  const productUrl = props.categorySlug && props.slug ? `/${currentLang}/menu/${props.categorySlug}/${props.slug}` : null;

  return (
    <>
      <div className="bg-panel border border-panel-border rounded-xl p-5 hover:border-gold/60 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(201,161,92,0.14)] transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div className="flex justify-between items-start mb-2 gap-2">
            {productUrl ? (
              <Link
                href={productUrl}
                className="text-lg font-bold text-cream group-hover:text-gold-bright transition-colors leading-snug hover:underline decoration-gold/40"
              >
                {itemName}
              </Link>
            ) : (
              <h4 className="text-lg font-bold text-cream group-hover:text-gold-bright transition-colors leading-snug">
                {itemName}
              </h4>
            )}
            <div className="text-right flex-shrink-0 ml-2">
              <span className="text-gold font-extrabold text-base sm:text-lg tabular-nums tracking-tight transition-all duration-150">
                {itemPrice}
              </span>
            </div>
          </div>
          <p className="text-sm text-stone mb-4 line-clamp-2 leading-relaxed">
            {itemDescription}
          </p>
        </div>

        {/* Micro In-Card Size Pills (Rendered only for items with sizes) */}
        {sizes && sizes.length > 0 && (
          <div className="mb-4 pt-1 border-t border-panel-border/50">
            <div className="flex items-center justify-between gap-2 mb-1.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone/80 flex items-center gap-1">
                <svg className="w-3 h-3 text-gold/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                {selectSizeText}
              </span>
              <span className="text-[11px] text-gold-bright font-semibold">
                {activeSize?.fullName?.[currentLang] || activeSize?.label}
              </span>
            </div>

            <div className="grid grid-flow-col auto-cols-fr gap-1 p-1 rounded-lg bg-ink/90 border border-panel-border">
              {sizes.map((s, idx) => {
                const isSelected = selectedSizeIndex === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSizeIndex(idx);
                    }}
                    aria-pressed={isSelected}
                    className={`py-1 px-1 rounded-md text-xs font-bold transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-gold text-ink shadow-[0_2px_8px_rgba(201,161,92,0.35)] scale-[1.02]'
                        : 'text-stone hover:text-cream hover:bg-panel/70'
                    }`}
                    title={`${s.fullName?.[currentLang] || s.label} - $${s.price.toFixed(2)}`}
                  >
                    <span className="leading-tight">{s.label}</span>
                    {s.inches && (
                      <span className={`text-[9px] font-normal leading-none mt-0.5 ${isSelected ? 'text-ink/85 font-semibold' : 'text-stone/60'}`}>
                        {s.inches}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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

      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg md:max-w-4xl bg-panel border border-panel-border rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85dvh] md:max-h-[80vh] my-auto animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={modalCloseAria}
              className="absolute top-3.5 right-3.5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ink/90 text-stone hover:text-cream flex items-center justify-center border border-panel-border cursor-pointer transition-colors shadow-md"
            >
              ✕
            </button>

            {/* Display Image or Elegant Brand Logo Fallback */}
            <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-auto relative bg-ink border-b md:border-b-0 md:border-r border-panel-border/50 flex-shrink-0 flex items-center justify-center">
              {itemImage ? (
                <img
                  src={itemImage}
                  alt={itemName}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gold mb-2 sm:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-3 sm:mb-4 pr-8 gap-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cream leading-tight">{itemName}</h3>
                  <span className="text-gold font-extrabold text-xl sm:text-2xl ml-3 flex-shrink-0 tabular-nums">{itemPrice}</span>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-stone mb-3 sm:mb-4 leading-relaxed">
                  {itemDescription}
                </p>

                {productUrl && (
                  <div className="mb-4">
                    <Link
                      href={productUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone hover:text-gold transition-colors group/link"
                    >
                      <span>{currentLang === 'es' ? 'Ver página completa del plato' : 'View dedicated dish page'}</span>
                      <svg className="w-3.5 h-3.5 text-gold group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}

                {/* Modal Size Selector (Synchronized with Card) */}
                {sizes && sizes.length > 0 && (
                  <div className="mb-5 sm:mb-6 p-3 rounded-xl bg-ink/70 border border-panel-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">
                        {chooseSizeText}
                      </span>
                      <span className="text-xs text-cream/80 font-medium">
                        {activeSize?.fullName?.[currentLang] || activeSize?.label}
                      </span>
                    </div>
                    <div className="grid grid-flow-col auto-cols-fr gap-2">
                      {sizes.map((s, idx) => {
                        const isSelected = selectedSizeIndex === idx;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSizeIndex(idx)}
                            aria-pressed={isSelected}
                            className={`py-2 px-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-gold text-ink shadow-md scale-[1.02]'
                                : 'bg-panel/80 text-stone hover:text-cream border border-panel-border hover:border-gold/40'
                            }`}
                          >
                            <span>{s.label}</span>
                            <span className={`text-[10px] sm:text-xs mt-0.5 tabular-nums ${isSelected ? 'text-ink/85 font-medium' : 'text-stone/60'}`}>
                              ${s.price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Ingredients (Rendered Only When Present) */}
                {itemIngredients.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <span className="text-[11px] sm:text-xs font-bold text-gold uppercase tracking-wider block mb-2 sm:mb-3">
                      {keyIngredientsText}
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {itemIngredients.map((ing) => (
                        <span key={ing} className="text-xs md:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md bg-ink text-cream border border-panel-border font-medium">
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
                className="w-full bg-gold hover:bg-gold-bright text-ink font-extrabold py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-center text-sm sm:text-base md:text-lg shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
              >
                {orderOnlineText} {activeSize ? `(${activeSize.label})` : ''}
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}