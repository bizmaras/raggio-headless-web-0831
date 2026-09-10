'use client';

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

  return (
    <section
      id="catering"
      className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[150px] md:scroll-mt-[270px]"
      style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 250px) + 20px)' }}
    >
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-1.5 text-gold mb-2 opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-xs font-bold tracking-widest uppercase">{locationBadge}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright mb-3">
          {sectionTitle}
        </h2>
        <p className="text-stone text-sm md:text-base leading-relaxed">
          {sectionSubtitle}
        </p>
      </div>

      {categories.map((categoryName) => {
        const items = categoriesMap[categoryName];
        const displayCategoryName = dict?.categories?.[categoryName] || categoryName;

        return (
          <div key={categoryName} className="mb-16 scroll-mt-[210px]">
            <h3 className="sticky top-[138px] md:top-[180px] lg:top-[220px] z-[35] bg-ink/95 backdrop-blur-md pt-4 pb-3 mb-6 border-b border-panel-border text-gold-bright flex items-center justify-between text-2xl md:text-3xl font-bold tracking-wide shadow-sm">
              <span>{displayCategoryName}</span>
              <span className="text-sm font-normal text-cream/60 md:text-gold-bright tracking-normal">
                {items.length} {itemsCountLabel}
              </span>
            </h3>

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
    </section>
  );
}