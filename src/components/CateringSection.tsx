'use client';

import React, { useState, useEffect } from 'react';
import CateringItemCard from './CateringItemCard';
import * as cateringModule from '../data/cateringData';
import { getLocalizedCateringItem } from '../data/cateringTranslations';

interface CateringSectionProps {
  lang?: string;
  dict?: {
    catering?: {
      title?: string;
      location_badge?: string;
      subtitle?: string;
      items_count?: string;
      half_size?: string;
      full_size?: string;
      order_catering?: string;
    };
    categories?: Record<string, string>;
  };
}

export default function CateringSection({ dict, lang = 'en' }: CateringSectionProps) {
  const rawItems: any[] = (
    (cateringModule as any).CATERING_ITEMS ||
    (cateringModule as any).cateringItems ||
    (cateringModule as any).default ||
    []
  ).map((item: any) => getLocalizedCateringItem(item, lang));

  const categoriesMap: Record<string, any[]> = {};
  rawItems.forEach((item) => {
    const catName = item.category || 'Other Catering';
    if (!categoriesMap[catName]) {
      categoriesMap[catName] = [];
    }
    categoriesMap[catName].push(item);
  });

  const categories = Object.keys(categoriesMap);

  const sectionTitle = dict?.catering?.title || 'Catering by Raggio';
  const locationBadge = dict?.catering?.location_badge || 'Newark, Delaware';
  const sectionSubtitle = dict?.catering?.subtitle || 'Feeding a crowd in Newark? All catering trays are available in Half or Full sizes.';
  const itemsCountLabel = dict?.catering?.items_count || 'items';
  const halfLabel = dict?.catering?.half_size || 'HALF';
  const fullLabel = dict?.catering?.full_size || 'FULL';

  const isEs = lang === 'es';

  const [activeSubcat, setActiveSubcat] = useState<{ name: string; count: number } | null>(null);

  // Track active subcategory as user scrolls through catering items
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (categories.length === 0) return;

    const firstCat = categories[0];
    const firstDisplayName = dict?.categories?.[firstCat] || firstCat;
    setActiveSubcat({ name: firstDisplayName, count: categoriesMap[firstCat]?.length || 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const catKey = entry.target.getAttribute('data-catering-cat');
            if (catKey && categoriesMap[catKey]) {
              const displayName = dict?.categories?.[catKey] || catKey;
              setActiveSubcat({ name: displayName, count: categoriesMap[catKey].length });
            }
          }
        });
      },
      { rootMargin: '-200px 0px -50% 0px', threshold: 0 }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-sec-${cat}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories.length]);

  return (
    <section
      id="catering"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 scroll-mt-[150px] md:scroll-mt-[270px]"
      style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 250px) + 20px)' }}
    >
      {/* Pure Native Sticky Main Catering Header with Dynamic Subcategory Pill */}
      <div
        style={{ top: 'var(--sticky-category-top, 136px)' }}
        className="sticky z-30 bg-ink pt-3.5 pb-3 mb-6 border-b border-panel-border flex flex-wrap items-center justify-between gap-3 shadow-sm isolate"
      >
        <div className="flex items-center flex-wrap gap-2.5 min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-gold opacity-90 mb-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[10px] font-bold tracking-widest uppercase">{locationBadge}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gold-bright tracking-wide shrink-0 leading-tight">
              {sectionTitle}
            </h2>
          </div>

          {/* Dynamic Morphing Subcategory Dock */}
          {activeSubcat && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-panel border border-gold/40 text-xs sm:text-sm font-bold text-cream shadow-sm transition-all animate-in fade-in duration-200">
              <span className="text-gold">›</span>
              <span>{activeSubcat.name}</span>
              <span className="text-[11px] text-gold font-normal">({activeSubcat.count})</span>
            </div>
          )}
        </div>

        {/* Portion Guide & Quick Call Pill */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2.5 text-xs bg-panel border border-panel-border px-3.5 py-1.5 rounded-full text-stone shadow-sm">
            <span className="font-semibold text-cream">
              <span className="text-gold font-bold">{halfLabel}:</span> 8–10 {isEs ? 'personas' : 'guests'}
            </span>
            <span className="text-panel-border">|</span>
            <span className="font-semibold text-cream">
              <span className="text-gold font-bold">{fullLabel}:</span> 15–20 {isEs ? 'personas' : 'guests'}
            </span>
          </div>

          <a
            href="tel:3023690553"
            className="btn-gold py-1.5 px-3.5 text-xs font-bold shrink-0"
            aria-label="Call Raggio for Catering: (302) 369-0553"
          >
            <span>📞</span>
            <span>(302) 369-0553</span>
          </a>
        </div>
      </div>

      {/* Top Info Notice Bar */}
      <div className="bg-panel border border-panel-border rounded-2xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">🥘</span>
          <div>
            <p className="text-xs sm:text-sm text-cream font-medium leading-relaxed">
              {sectionSubtitle}
            </p>
            <p className="text-[11px] sm:text-xs text-stone mt-1">
              {isEs
                ? '¿Necesitas pizzas gourmet, bebidas o alitas del menú regular? Podemos agregarlas a cualquier pedido de catering.'
                : 'Need gourmet pizzas, wings, or canned sodas from our regular menu added? Any main menu items can be bundled with your catering order.'}
            </p>
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-2 text-xs bg-ink-2 border border-panel-border px-3 py-1.5 rounded-xl text-stone w-full justify-around mt-1">
          <span><strong className="text-gold">{halfLabel}:</strong> 8–10</span>
          <span className="text-panel-border">•</span>
          <span><strong className="text-gold">{fullLabel}:</strong> 15–20</span>
        </div>
      </div>

      {/* Category Sections & Tray Items */}
      {categories.map((categoryName) => {
        const items = categoriesMap[categoryName];
        const displayCategoryName = dict?.categories?.[categoryName] || categoryName;

        return (
          <div
            key={categoryName}
            id={`cat-sec-${categoryName}`}
            data-catering-cat={categoryName}
            className="mb-16 scroll-mt-[210px]"
          >
            <div className="pt-2 pb-3 mb-6 border-b border-panel-border text-gold-bright flex items-center justify-between text-xl md:text-2xl font-bold tracking-wide">
              <span>{displayCategoryName}</span>
              <span className="text-xs sm:text-sm font-normal text-cream/60 md:text-gold-bright tracking-normal">
                {items.length} {itemsCountLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => {
                const isLastItem = index === items.length - 1;
                const isSingleOrphanOnDesktop = isLastItem && items.length % 3 === 1;

                return (
                  <div
                    key={item.id || item.name || index}
                    className={isSingleOrphanOnDesktop ? 'lg:col-span-3 max-w-md mx-auto w-full' : ''}
                  >
                    <CateringItemCard
                      name={item.name}
                      desc={item.description || item.desc}
                      half={item.halfTrayPrice || item.half}
                      full={item.fullTrayPrice || item.full}
                      servesHalf={item.servesHalf}
                      servesFull={item.servesFull}
                      halfLabel={halfLabel}
                      fullLabel={fullLabel}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bottom Event Booking & Inquiry Card */}
      <div className="bg-gradient-to-br from-panel to-ink-2 border border-panel-border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mt-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-1">
              {isEs ? 'EVENTOS, OFICINAS Y FIESTAS' : 'FOR PARTIES, OFFICES & EVENTS'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gold-bright mb-2">
              {isEs ? '¿Planeas un Evento en Newark?' : 'Planning an Event in Newark, DE?'}
            </h3>
            <p className="text-xs sm:text-sm text-stone leading-relaxed">
              {isEs
                ? 'Preparamos tepsis frescas para grupos de 10 a 200+ personas. Llámanos para armar un paquete personalizado con bandejas de pasta, subs, alitas o pizzas de nuestro menú regular.'
                : 'We prepare fresh, piping-hot catering trays for gatherings of 10 to 200+ guests. Call our team to customize your package with pasta trays, subs, wings, and pizzas from our regular menu.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:3023690553"
              className="btn-gold w-full sm:w-auto py-3 px-6 text-sm font-bold shadow-lg"
            >
              <span>📞</span>
              <span>{isEs ? 'Llamar: (302) 369-0553' : 'Call: (302) 369-0553'}</span>
            </a>
            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-6 rounded-full border border-panel-border bg-panel text-cream hover:border-gold/60 text-sm font-bold text-center transition-all"
            >
              {isEs ? 'Pedir Online' : 'Order Online'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}