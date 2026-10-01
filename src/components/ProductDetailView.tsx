'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { SizeVariant } from '@/data/sizePricing';
import Image from 'next/image';
import { optimizeContentfulImage } from '@/lib/contentfulImage';
import { ORDER_LINKS } from '@/config/ordering';

const MOZZARELLA_CATEGORY_SLUGS = new Set(['pizza', 'gourmet-pizza', 'sicilian-pizza', 'strombolis-and-calzones']);

interface ProductDetailViewProps {
  name: string;
  categoryName: string;
  categorySlug: string;
  basePrice: number;
  description: string;
  ingredients?: string[];
  image?: string;
  sizes?: SizeVariant[] | null;
  orderUrl?: string;
  lang: 'en' | 'es';
  dict: {
    menu: {
      order_online?: string;
      key_ingredients?: string;
      select_size?: string;
      choose_size?: string;
      freshly_prepared?: string;
      default_description?: string;
      back_to_category?: string;
    };
  };
}

export default function ProductDetailView({
  name,
  categoryName,
  categorySlug,
  basePrice,
  description,
  ingredients = [],
  image,
  sizes,
  orderUrl = ORDER_LINKS.root,
  lang,
  dict,
}: ProductDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Only claim Grande Mozzarella / prep time where it is true for the item.
  const hasMozzarella = MOZZARELLA_CATEGORY_SLUGS.has(categorySlug);
  const isDrink = categorySlug === 'drinks';

  // Mobile: fade the floating chat / scroll-top buttons while they would cover
  // the size selector or the Order button (thin band where the buttons sit).
  useEffect(() => {
    const el = detailsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const root = document.documentElement;
    const band = Math.max(0, window.innerHeight - 150);
    const io = new IntersectionObserver(
      ([entry]) => root.toggleAttribute('data-fab-clear', entry.isIntersecting),
      { rootMargin: `-${band}px 0px -90px 0px` }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      root.removeAttribute('data-fab-clear');
    };
  }, []);

  // Default to LRG if present, otherwise first size
  const defaultSizeIdx = sizes && sizes.length > 0
    ? Math.max(0, sizes.findIndex((s) => s.id === 'lrg'))
    : 0;
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(defaultSizeIdx);

  const activeSize = sizes && sizes.length > 0 ? sizes[selectedSizeIndex] ?? sizes[0] : null;
  const currentPrice = activeSize ? activeSize.price : basePrice;
  const formattedPrice = `$${currentPrice.toFixed(2)}`;

  const orderOnlineText = dict.menu.order_online || (lang === 'es' ? 'Ordenar en Línea' : 'Order Online');
  const keyIngredientsText = dict.menu.key_ingredients || (lang === 'es' ? 'Ingredientes Clave' : 'Key Ingredients');
  const chooseSizeText = dict.menu.choose_size || (lang === 'es' ? 'Seleccionar Tamaño' : 'Select Size');
  const freshlyPreparedText = dict.menu.freshly_prepared || (lang === 'es' ? 'Preparado Fresco' : 'Freshly Prepared');

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${name} | Raggio Gourmet & Pizza`,
          text: `Check out ${name} from Raggio Gourmet & Pizza in Newark, DE!`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const optimizedImage = optimizeContentfulImage(image, {
    width: 800,
    quality: 80,
    format: 'webp',
    fit: 'scale',
  });

  return (
    <div className="bg-panel border border-panel-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side: Product Image or Brand Presentation */}
        <div className="w-full lg:w-1/2 min-h-[300px] sm:min-h-[380px] lg:min-h-[500px] relative bg-ink flex items-center justify-center border-b lg:border-b-0 lg:border-r border-panel-border/60 overflow-hidden">
          {optimizedImage ? (
            <Image
              src={optimizedImage}
              alt={name}
              fill
              priority
              unoptimized={!optimizedImage.startsWith('/')}
              sizes="(min-width: 1024px) 576px, 100vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center relative z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-panel border border-gold/40 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(201,161,92,0.15)]">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-gold font-extrabold tracking-[0.25em] uppercase text-sm sm:text-base">
                Raggio Gourmet
              </span>
              <span className="text-stone text-xs sm:text-sm mt-1.5 font-medium tracking-wider">
                {isDrink ? 'Raggio Gourmet & Pizza' : freshlyPreparedText}
                {hasMozzarella ? ' • 100% Grande Mozzarella' : ''}
              </span>
            </div>
          )}

          {/* Badges on Top Left */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-ink/90 backdrop-blur-md text-gold border border-panel-border px-3 py-1 rounded-full shadow-md">
              {categoryName}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-ink/90 backdrop-blur-md text-cream/90 border border-panel-border px-3 py-1 rounded-full shadow-md">
              ⭐ 4.2 Rated
            </span>
          </div>

          {/* Share Button on Top Right */}
          <button
            type="button"
            onClick={handleShare}
            className="absolute top-4 right-4 z-20 bg-ink/90 hover:bg-panel backdrop-blur-md text-stone hover:text-gold border border-panel-border p-2.5 rounded-full transition-colors shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Share this dish"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden sm:inline">{copied ? (lang === 'es' ? 'Copiado!' : 'Copied!') : (lang === 'es' ? 'Compartir' : 'Share')}</span>
          </button>
        </div>

        {/* Right Side: Product Details, Size Selector, CTA */}
        <div ref={detailsRef} className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4 gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cream tracking-tight leading-tight">
                {name}
              </h1>
              <div className="text-right flex-shrink-0">
                <span className="text-gold font-extrabold text-2xl sm:text-3xl tabular-nums tracking-tight transition-all duration-200">
                  {formattedPrice}
                </span>
                {activeSize && (
                  <span className="block text-[11px] text-stone font-medium mt-0.5">
                    {activeSize.fullName?.[lang] || activeSize.label}
                  </span>
                )}
              </div>
            </div>

            {description && (
              <p className="text-sm sm:text-base text-stone mb-6 leading-relaxed">
                {description}
              </p>
            )}

            {/* Interactive Size Variant Pills */}
            {sizes && sizes.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-ink/80 border border-panel-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                    {chooseSizeText}
                  </span>
                  <span className="text-xs text-cream/80 font-medium">
                    {activeSize?.fullName?.[lang]}
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
                        className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-gold text-ink shadow-[0_4px_12px_rgba(201,161,92,0.35)] scale-[1.02]'
                            : 'bg-panel/90 text-stone hover:text-cream border border-panel-border hover:border-gold/50'
                        }`}
                      >
                        <span className="leading-tight">{s.label}</span>
                        {s.inches && (
                          <span className={`text-[11px] font-normal mt-0.5 leading-none ${isSelected ? 'text-ink/85 font-semibold' : 'text-stone'}`}>
                            {s.inches}
                          </span>
                        )}
                        <span className={`text-[11px] mt-1 tabular-nums ${isSelected ? 'text-ink/90 font-extrabold' : 'text-stone-dim'}`}>
                          ${s.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Ingredients */}
            {ingredients.length > 0 && (
              <div className="mb-8">
                <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-2.5">
                  {keyIngredientsText}
                </span>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-ink text-cream/90 border border-panel-border font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-panel-border/60">
            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-gold py-3.5 px-6 text-base sm:text-lg"
            >
              <span>{orderOnlineText} {activeSize ? `(${activeSize.label})` : ''}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {(!isDrink || hasMozzarella) && (
            <div className="flex items-center justify-between text-xs text-stone pt-1">
              {!isDrink && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lang === 'es' ? 'Preparado en ~20-30 min' : 'Prepared fresh in ~20-30 mins'}
              </span>
              )}
              {hasMozzarella && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {lang === 'es' ? 'Calidad Grande Mozzarella' : '100% Grande Mozzarella'}
              </span>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
