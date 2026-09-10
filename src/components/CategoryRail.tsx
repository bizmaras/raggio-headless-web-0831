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

  const scrollRef = useRef<HTMLDivElement>(null);
  // Tracks whether activeCategory was set by a user tap (true) or by scrollspy (false).
  // Auto-center only fires when the user tapped — NOT during free scroll.
  const clickedRef = useRef(false);

  useEffect(() => {
    if (activeSlug) {
      setActiveCategory(activeSlug);
    }
  }, [activeSlug]);

  // ScrollSpy to highlight active category on scroll (Homepage only)
  useEffect(() => {
    if (activeSlug) return;
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-rail-id') || entry.target.id;
            clickedRef.current = false; // scrollspy update — do NOT auto-center rail
            setActiveCategory(id);
          }
        });
      },
      { root: null, rootMargin: '-160px 0px -60% 0px', threshold: 0 }
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

  // Set --sticky-category-top CSS variable (header height + rail height).
  // NO ResizeObserver — it fires when the mobile browser hides/shows its address bar
  // causing constant trembling. Simple one-time measurement with two delayed retries.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStickyOffsets = () => {
      const headerEl = document.querySelector('header');
      const railEl = scrollRef.current?.closest('.sticky') as HTMLElement | null;
      if (headerEl && railEl) {
        const headerH = headerEl.getBoundingClientRect().height;
        const railH = railEl.getBoundingClientRect().height;
        const totalTop = Math.round(headerH + railH);
        document.documentElement.style.setProperty('--sticky-category-top', `${totalTop}px`);
      }
    };

    updateStickyOffsets();
    const t1 = setTimeout(updateStickyOffsets, 150);
    const t2 = setTimeout(updateStickyOffsets, 700);

    // Only re-measure on orientation change (device rotation), NOT on window resize
    window.addEventListener('orientationchange', updateStickyOffsets, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('orientationchange', updateStickyOffsets);
    };
  }, []);

  // Auto-center the active pill — ONLY when the user explicitly tapped a pill.
  // scrollspy changes do NOT trigger this (clickedRef.current === false during scroll).
  useEffect(() => {
    if (!clickedRef.current) return;
    if (!scrollRef.current || typeof window === 'undefined' || window.innerWidth >= 768) return;

    const activePill = scrollRef.current.querySelector(`[data-cat-pill="${activeCategory}"]`) as HTMLElement;
    if (activePill) {
      const container = scrollRef.current;
      const targetLeft = activePill.offsetLeft - container.offsetWidth / 2 + activePill.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    e.preventDefault();
    clickedRef.current = true; // user tapped — allow auto-center
    setActiveCategory(searchId);

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
      const railEl = scrollRef.current?.closest('.sticky') || scrollRef.current?.parentElement;
      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 70;
      const railH = railEl ? railEl.getBoundingClientRect().height : 60;
      const isPageSection = searchId === 'deals' || searchId === 'catering' || searchId === 'reviews' || searchId === 'location';
      const totalOffset = headerH + railH + (isPageSection ? 20 : 0);

      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
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
          flex-none flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-xl border text-xs sm:text-sm font-semibold whitespace-nowrap
          transition-all duration-300 touch-manipulation select-none cursor-pointer
          active:scale-95 focus:outline-none tracking-wide
          ${isActive
            ? 'bg-[#c9a15c]/15 text-[#c9a15c] font-bold border-[#c9a15c] shadow-[0_0_24px_rgba(201,161,92,0.45)] ring-1 ring-[#c9a15c]/50'
            : 'border-white/10 bg-[#16181d]/90 text-white/90 hover:text-[#c9a15c] hover:border-[#c9a15c] hover:shadow-[0_0_20px_rgba(201,161,92,0.35)] hover:-translate-y-0.5 shadow-sm active:text-[#c9a15c] active:border-[#c9a15c]'
          }
        `}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-ink border-b border-panel-border py-3 md:py-5 shadow-sm">
      <div
        ref={scrollRef}
        className="mobile-scroll-x flex md:flex-wrap md:overflow-x-visible md:justify-center gap-2.5 md:gap-3 px-3 md:px-6 max-w-7xl mx-auto no-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          overscrollBehaviorX: 'contain',
        }}
      >
        {CATEGORIES.map((cat, idx) => renderPill(cat, `${cat.searchId}-${idx}`))}
      </div>
    </div>
  );
}