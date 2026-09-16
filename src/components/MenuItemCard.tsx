'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { SizeVariant } from '@/data/sizePricing';
import { optimizeContentfulImage } from '@/lib/contentful';

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

  const sizes = props.sizes && props.sizes.length > 0 ? props.sizes : null;
  // Default to LRG if present, otherwise first available size
  const defaultSizeIdx = sizes
    ? Math.max(0, sizes.findIndex((s) => s.id === 'lrg'))
    : 0;
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(defaultSizeIdx);

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
  const rawImage = props.image || props.item?.image;
  const thumbnailImage = optimizeContentfulImage(rawImage, {
    width: 160,
    height: 160,
    quality: 75,
    format: 'webp',
    fit: 'fill',
  });
  const modalImage = optimizeContentfulImage(rawImage, {
    width: 600,
    quality: 80,
    format: 'webp',
    fit: 'scale',
  });

  const viewDetailsText = props.dict?.menu?.view_details || 'View Details & Ingredients';
  const orderOnlineText = props.dict?.menu?.order_online || 'Order Online';
  const keyIngredientsText = props.dict?.menu?.key_ingredients || 'Key Ingredients';
  const freshlyPreparedText = props.dict?.menu?.freshly_prepared || 'Freshly Prepared';
  const modalCloseAria = props.dict?.menu?.modal_close || 'Close details modal';
  const selectSizeText = props.dict?.menu?.select_size || 'Size:';
  const chooseSizeText = props.dict?.menu?.choose_size || 'Select Size';

  const productUrl = props.categorySlug && props.slug ? `/${currentLang}/menu/${props.categorySlug}/${props.slug}` : null;

  const seoAltText = `${itemName} - Raggio Gourmet & Pizza Newark DE`;

  return (
    <>
      <div className="relative z-0 isolate bg-panel border border-panel-border rounded-xl p-4 sm:p-5 hover:border-gold hover:shadow-[0_0_22px_rgba(201,161,92,0.35)] md:hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
        <div>
          {/* Top Row: 80x80 Thumbnail + Title, Price, Description */}
          <div className="flex items-start gap-3.5 mb-3">
            {/* 80x80 (mobile 72x72) Locked Thumbnail or Brand Monogram Placeholder */}
            <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-ink/90 border border-panel-border group-hover:border-gold/50 transition-colors relative shadow-inner flex items-center justify-center">
              {thumbnailImage ? (
                <img
                  src={thumbnailImage}
                  alt={seoAltText}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-1.5 text-center select-none">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold mb-0.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-[9px] font-extrabold text-gold uppercase tracking-wider leading-none">Raggio</span>
                  <span className="text-[8px] text-stone/80 mt-0.5 leading-none">{freshlyPreparedText}</span>
                </div>
              )}
            </div>

            {/* Title, Price & Short Description */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-1 mb-1">
                {productUrl ? (
                  <Link
                    href={productUrl}
                    className="text-base sm:text-lg font-bold text-cream group-hover:text-gold-bright transition-colors leading-tight hover:underline decoration-gold/40 line-clamp-1"
                  >
                    {itemName}
                  </Link>
                ) : (
                  <h4 className="text-base sm:text-lg font-bold text-cream group-hover:text-gold-bright transition-colors leading-tight line-clamp-1">
                    {itemName}
                  </h4>
                )}
                <div className="text-right flex-shrink-0 ml-1.5">
                  <span className="text-gold font-extrabold text-base sm:text-lg tabular-nums tracking-tight transition-all duration-150">
                    {itemPrice}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone line-clamp-2 leading-relaxed">
                {itemDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Micro In-Card Size Pills (Rendered only for items with sizes) */}
        {sizes && sizes.length > 0 && (
          <div className="mb-4 pt-1 border-t border-panel-border/50">
            <div className="flex items-center justify-between gap-2 mb-1.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone/80 flex items-center gap-1">
                <svg className="w-3 h-3 text-gold/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
                        ? 'bg-[#c9a15c] text-[#121214] font-bold border border-white/40 shadow-sm ring-1 ring-[#c9a15c]/50'
                        : 'text-stone hover:text-cream hover:bg-panel/70'
                    }`}
                    title={`${s.fullName?.[currentLang] || s.label} - $${s.price.toFixed(2)}`}
                  >
                    <span className="leading-tight">{s.label}</span>
                    {s.inches && (
                      <span className={`text-[9px] font-normal leading-none mt-0.5 ${isSelected ? 'text-[#121214] font-semibold' : 'text-stone/60'}`}>
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
          className="w-full py-2.5 px-4 rounded-xl bg-panel-2 border border-panel-border hover:border-gold/50 text-cream hover:text-white text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-auto active:scale-[0.98] shadow-sm"
        >
          <svg className="w-4 h-4 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>{viewDetailsText}</span>
        </button>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg md:max-w-4xl bg-gradient-to-br from-[#141622] via-[#0d0e15] to-[#07080c] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.18)] flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85vh] my-auto animate-in zoom-in-95 duration-200">
            
            {/* Ambient Lighting Orbs inside modal */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Luxury Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={modalCloseAria}
              className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/80 hover:bg-amber-950/70 text-slate-300 hover:text-amber-300 flex items-center justify-center border border-white/15 hover:border-amber-500/50 cursor-pointer transition-all duration-200 shadow-xl backdrop-blur-md group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Image Showcase with Luxury Presentation */}
            <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto relative bg-[#090a0f] border-b md:border-b-0 md:border-r border-white/[0.08] flex-shrink-0 flex items-center justify-center overflow-hidden p-6 sm:p-8 group/img">
              {/* Radial warm spotlight behind pizza */}
              <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <span>🔥</span>
                <span>Stone-Deck Baked</span>
              </div>

              <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[9px] sm:text-[10px] font-mono text-slate-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <span>🥛</span>
                <span>100% Grande Mozzarella</span>
              </div>

              {modalImage ? (
                <img
                  src={modalImage}
                  alt={seoAltText}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover/img:scale-105 transition-transform duration-500"
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

            {/* Right Column: Gastronomic Details Information */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar relative z-20">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>RAGGIO ARTISAN GOURMET</span>
                </div>

                <div className="flex justify-between items-start mb-3 sm:mb-4 pr-10 gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{itemName}</h3>
                  <div className="px-3.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-xl sm:text-2xl tracking-tight shadow-inner flex items-center flex-shrink-0">
                    {itemPrice}
                  </div>
                </div>

                {/* Micro Trust Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                    ⏱️ 48h Soğuk Fermente
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                    🍅 San Marzano Sos
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                    🧀 %100 Grande Peyniri
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed font-light">
                  {itemDescription}
                </p>

                {productUrl && (
                  <div className="mb-4">
                    <Link
                      href={productUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link"
                    >
                      <span className="underline underline-offset-4 decoration-amber-500/40">
                        {currentLang === 'es' ? 'Ver página completa del plato' : 'View dedicated dish page'}
                      </span>
                      <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}

                {/* Modal Size Selector (Synchronized with Card) */}
                {sizes && sizes.length > 0 && (
                  <div className="mb-5 sm:mb-6 p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] shadow-inner">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v8M8 12h8" />
                        </svg>
                        {chooseSizeText}
                      </span>
                      <span className="text-xs text-white font-mono font-bold">
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
                            className={`py-2 px-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-[#c9a15c] text-neutral-950 font-black border border-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-[1.03]'
                                : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06]'
                            }`}
                          >
                            <span className="leading-tight">{s.label}</span>
                            {s.inches && (
                              <span className={`text-[9px] font-mono mt-0.5 leading-none ${isSelected ? 'text-black/80 font-bold' : 'text-slate-500'}`}>
                                {s.inches}
                              </span>
                            )}
                            <span className={`text-[10px] sm:text-xs mt-1 tabular-nums font-mono ${isSelected ? 'text-black font-black' : 'text-amber-400/90'}`}>
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
                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                      {keyIngredientsText}
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {itemIngredients.map((ing) => (
                        <span key={ing} className="text-xs px-2.5 py-1 rounded-lg bg-black/60 text-slate-200 border border-white/10 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>{ing}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Luxury Call-to-Action Button */}
              <a
                href={itemOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-[#D4AF37] text-neutral-950 font-black text-base sm:text-lg tracking-wide shadow-[0_12px_35px_rgba(212,175,55,0.4)] hover:shadow-[0_16px_45px_rgba(212,175,55,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>{orderOnlineText} {activeSize ? `(${activeSize.label})` : ''}</span>
                <span className="text-xs font-mono font-bold bg-black/20 px-2 py-0.5 rounded-md text-black">
                  {itemPrice}
                </span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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