'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryRailProps {
  categoriesDict?: Record<string, string>;
  lang?: string;
  activeSlug?: string;
}

export const CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'deals' },
  { label: 'Gourmet Pizza', searchId: 'gourmet-pizza' },
  { label: 'Sicilian Pizza', searchId: 'sicilian-pizza' },
  { label: 'Chicken Wings', searchId: 'chicken-wings' },
  { label: 'Cheesesteaks', searchId: 'cheesesteaks' },
  { label: 'Fresh Burgers', searchId: 'fresh-burgers' },
  { label: 'Appetizers', searchId: 'appetizers' },
  { label: 'Fresh Salads', searchId: 'fresh-salads' },
  { label: 'Pasta', searchId: 'pasta' },
  { label: 'Complete Dinners', searchId: 'complete-dinners' },
  { label: 'Seafood', searchId: 'seafood' },
  { label: 'Quesadillas', searchId: 'quesadillas' },
  { label: 'Latin Food', searchId: 'latin-food' },
  { label: 'Subs & Grinders', searchId: 'subs-and-grinders' },
  { label: 'Strombolis & Calzones', searchId: 'strombolis-and-calzones' },
  { label: 'Breakfast', searchId: 'breakfast' },
  { label: 'Hot Sandwiches', searchId: 'hot-sandwiches' },
  { label: 'Desserts', searchId: 'desserts' },
  { label: 'Soups', searchId: 'soups' },
  { label: 'Drinks', searchId: 'drinks' },
  { label: 'Side Orders', searchId: 'side-orders' },
  { label: 'Pizza', searchId: 'pizza' },
  { label: 'Catering', searchId: 'catering' },
  { label: '⭐ Reviews (4.2)', searchId: 'reviews' },
];

export default function CategoryRail({ categoriesDict, lang = 'en', activeSlug }: CategoryRailProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>(activeSlug || 'deals');

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSlug) {
      setActiveCategory(activeSlug);
    }
  }, [activeSlug]);

  // Active category is highlighted in place without auto-scrolling the track during vertical touch scroll


  // ScrollSpy to highlight active category on scroll (Homepage only)
  useEffect(() => {
    if (activeSlug) return;
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-rail-id') || entry.target.id;
            setActiveCategory(id);
          }
        });
      },
      { root: null, rootMargin: '-140px 0px -60% 0px', threshold: 0 }
    );

    const timer = setTimeout(() => {
      CATEGORIES.forEach((cat) => {
        let el = document.getElementById(cat.searchId);
        if (!el) {
          el = Array.from(document.querySelectorAll('div[id],section[id]'))
            .find(e => e.id.toLowerCase().includes(cat.searchId.replace('-and-', ''))) as HTMLElement | null;
        }
        if (el) {
          el.setAttribute('data-rail-id', cat.searchId);
          observer.observe(el);
        }
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeSlug]);

  // Set exact --sticky-category-top CSS variable (Header height + Rail height) with ResizeObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStickyOffsets = () => {
      const headerEl = document.querySelector('header');
      const railEl = containerRef.current;
      if (headerEl && railEl) {
        const headerH = headerEl.offsetHeight;
        const railH = railEl.offsetHeight;
        const totalTop = Math.round(headerH + railH);
        const currentVal = document.documentElement.style.getPropertyValue('--sticky-category-top');
        const newVal = `${totalTop}px`;
        if (currentVal !== newVal) {
          document.documentElement.style.setProperty('--sticky-category-top', newVal);
        }
      }
    };

    updateStickyOffsets();
    const t1 = setTimeout(updateStickyOffsets, 150);
    const t2 = setTimeout(updateStickyOffsets, 600);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateStickyOffsets) : null;
    if (ro) {
      if (containerRef.current) ro.observe(containerRef.current);
      const headerEl = document.querySelector('header');
      if (headerEl) ro.observe(headerEl);
    }

    window.addEventListener('resize', updateStickyOffsets, { passive: true });
    window.addEventListener('orientationchange', updateStickyOffsets, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateStickyOffsets);
      window.removeEventListener('orientationchange', updateStickyOffsets);
    };
  }, []);

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    e.preventDefault();
    setActiveCategory(searchId);

    // Smoothly center clicked pill in mobile track on click:
    if (trackRef.current && typeof window !== 'undefined' && window.innerWidth < 768) {
      const pill = trackRef.current.querySelector(`[data-cat-pill="${searchId}"]`) as HTMLElement | null;
      if (pill) {
        const scrollLeft = pill.offsetLeft - (trackRef.current.offsetWidth / 2) + (pill.offsetWidth / 2);
        trackRef.current.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      }
    }

    // If on a dedicated category page or product page:
    if (activeSlug) {
      if (searchId === 'deals' || searchId === 'reviews' || searchId === 'catering') {
        router.push(`/${lang}/#${searchId}`);
      } else {
        router.push(`/${lang}/menu/${searchId}`);
      }
      return;
    }

    let target = document.getElementById(searchId);
    if (!target) {
      target = Array.from(document.querySelectorAll('div[id],section[id]'))
        .find(el => el.id.toLowerCase().includes(searchId.replace('-and-', ''))) as HTMLElement | null;
    }

    if (target) {
      const headerEl = document.querySelector('header');
      const railEl = containerRef.current;
      const headerH = headerEl ? headerEl.offsetHeight : 80;
      const railH = railEl ? railEl.offsetHeight : 56;
      const totalOffset = headerH + railH;

      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

      window.scrollTo({
        top: Math.max(0, Math.round(offsetPosition)),
        behavior: 'smooth',
      });
    }
  }, [activeSlug, lang, router]);

  const renderPill = (cat: typeof CATEGORIES[number], key: string) => {
    const isActive = activeCategory === cat.searchId;
    const label = categoriesDict?.[cat.label] || cat.label;
    const href = activeSlug
      ? (cat.searchId === 'deals' || cat.searchId === 'reviews' || cat.searchId === 'catering'
          ? `/${lang}/#${cat.searchId}`
          : `/${lang}/menu/${cat.searchId}`)
      : `#${cat.searchId}`;

    return (
      <a
        key={key}
        data-cat-pill={cat.searchId}
        href={href}
        onClick={(e) => handleCategoryClick(e, cat.searchId)}
        className={`
          flex-none inline-flex items-center justify-center px-4 py-2 md:px-4.5 md:py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap
          transition-all duration-200 touch-manipulation select-none cursor-pointer tracking-wide active:scale-95
          ${isActive
            ? 'bg-[#181c22] text-[#ebd092] font-bold border border-[#d4af62] shadow-[0_6px_20px_-2px_rgba(212,175,98,0.45)]'
            : 'bg-[#181c22]/90 border border-white/10 text-cream/85 font-medium hover:text-[#ebd092] hover:border-[#d4af62]/50 hover:shadow-[0_4px_14px_-2px_rgba(212,175,98,0.25)]'
          }
        `}
      >
        {label}
      </a>
    );
  };

  return (
    <div
      ref={containerRef}
      className="sticky top-20 z-40 bg-ink border-b border-panel-border py-2.5 md:py-4 shadow-sm select-none isolate"
    >
      {/* MOBILE: Seamless Hardware-Accelerated Infinite Marquee (Zero Jitter, Normal Speed) */}
      <div className="md:hidden relative w-full overflow-hidden select-none">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-ink to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-ink to-transparent z-10" />

        <div
          className="flex items-center gap-2 px-2 w-max will-change-transform active:[animation-play-state:paused] hover:[animation-play-state:paused]"
          style={{
            animation: 'category-marquee-smooth 65s linear infinite',
          }}
        >
          {/* Set 1 */}
          {CATEGORIES.map((cat, idx) => renderPill(cat, `m1-${cat.searchId}-${idx}`))}
          {/* Set 2 for seamless loop */}
          {CATEGORIES.map((cat, idx) => renderPill(cat, `m2-${cat.searchId}-${idx}`))}
        </div>
      </div>

      {/* DESKTOP: Multi-row wrapped centered grid matching Image 1 */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-2 md:gap-2.5 px-4 max-w-7xl mx-auto w-full">
        {CATEGORIES.map((cat, idx) => renderPill(cat, `d-${cat.searchId}-${idx}`))}
      </div>
    </div>
  );
}