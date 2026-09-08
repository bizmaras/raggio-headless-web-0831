'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CategoryRailProps {
  categoriesDict?: Record<string, string>;
}

const DEFAULT_CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'deals' },
  { label: 'Pizza', searchId: 'pizza' },
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
  { label: 'Catering', searchId: 'catering' }
];

export default function CategoryRail({ categoriesDict }: CategoryRailProps) {
  const [activeCategory, setActiveCategory] = useState<string>('deals');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const exactScroll = useRef(0);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  const categories = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    displayLabel: categoriesDict?.[cat.label] || cat.label,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observerOptions = {
      root: null,
      rootMargin: '-230px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const catId = entry.target.getAttribute('data-rail-id') || entry.target.id;
          setActiveCategory(catId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const timer = setTimeout(() => {
      try {
        categories.forEach((cat) => {
          const el = document.getElementById(cat.searchId);
          if (el) observer.observe(el);
        });
      } catch (e) {
        console.warn('CategoryRail observer setup error:', e);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [categories]);

  // Subtle continuous auto-scroll ticker for desktop and mobile discoverability
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof window === 'undefined') return;

    let animationFrameId: number;

    const scrollTicker = () => {
      if (!isPaused.current && el) {
        exactScroll.current += 0.45;
        if (exactScroll.current >= el.scrollWidth - el.clientWidth) {
          exactScroll.current = 0;
        }
        el.scrollLeft = exactScroll.current;
      }
      animationFrameId = requestAnimationFrame(scrollTicker);
    };

    animationFrameId = requestAnimationFrame(scrollTicker);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const pauseTemporary = () => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) {
        exactScroll.current = scrollRef.current.scrollLeft;
      }
      isPaused.current = false;
    }, 2800);
  };

  const handleCategoryClick = (searchId: string) => {
    setActiveCategory(searchId);
    isPaused.current = true;

    const targetEl = document.getElementById(searchId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Menu category quick jump"
      className="sticky top-20 z-30 w-full bg-ink/95 backdrop-blur-md border-b border-panel-border py-3 px-4 shadow-sm"
    >
      <div
        ref={scrollRef}
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => {
          if (scrollRef.current) exactScroll.current = scrollRef.current.scrollLeft;
          isPaused.current = false;
        }}
        onTouchStart={pauseTemporary}
        onWheel={pauseTemporary}
        className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.searchId;
          return (
            <button
              key={cat.searchId}
              type="button"
              onClick={() => handleCategoryClick(cat.searchId)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gold text-ink shadow-[0_0_12px_rgba(201,161,92,0.4)] scale-[1.02]'
                  : 'bg-panel border border-panel-border text-cream/80 hover:text-gold hover:border-gold/50'
              }`}
            >
              {cat.displayLabel}
            </button>
          );
        })}
      </div>
    </nav>
  );
}