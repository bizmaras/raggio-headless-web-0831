'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CategoryRailProps {
  categoriesDict?: Record<string, string>;
}

const CATEGORIES = [
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

  // IntersectionObserver for ScrollSpy
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
        CATEGORIES.forEach((cat) => {
          let el = document.getElementById(cat.searchId);
          if (!el) {
            const elements = Array.from(document.querySelectorAll('div[id], section[id]'));
            el = elements.find(e => e.id && e.id.toLowerCase().includes(cat.searchId.replace('-and-', ''))) as HTMLElement | null;
          }
          if (el) {
            el.setAttribute('data-rail-id', cat.searchId);
            observer.observe(el);
          }
        });
      } catch (err) {
        console.error('ScrollSpy error:', err);
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Smooth center active category pill on mobile/desktop
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector(`[data-cat-pill="${activeCategory}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      if (scrollRef.current) {
        exactScroll.current = scrollRef.current.scrollLeft;
      }
    }
  }, [activeCategory]);

  // Gentle auto-scroll loop on mobile with initial pause
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;
    exactScroll.current = container.scrollLeft;

    const initialDelay = setTimeout(() => {
      const step = () => {
        if (!isPaused.current && window.innerWidth < 768) {
          if (container.scrollWidth > container.clientWidth) {
            exactScroll.current += 0.45;
            container.scrollLeft = exactScroll.current;

            if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 2) {
              exactScroll.current = 0;
              container.scrollLeft = 0;
            }
          }
        }
        animId = requestAnimationFrame(step);
      };

      animId = requestAnimationFrame(step);
    }, 3000);

    return () => {
      clearTimeout(initialDelay);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleInteractionStart = () => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleInteractionEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) exactScroll.current = scrollRef.current.scrollLeft;
      isPaused.current = false;
    }, 2500);
  };

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    setActiveCategory(searchId);
    e.preventDefault();
    if (typeof window === 'undefined') return;

    let targetElement = document.getElementById(searchId);
    if (!targetElement) {
      const elements = Array.from(document.querySelectorAll('section, div, h1, h2, h3'));
      targetElement = elements.find(el => {
        const elId = el.id ? el.id.toLowerCase() : '';
        return elId.includes(searchId.replace('-and-', ''));
      }) as HTMLElement | null;
    }

    if (targetElement) {
      const isMobile = window.innerWidth < 640;
      const yOffset = isMobile ? -160 : -220;
      const topPosition = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-2.5 md:py-4 shadow-sm">
      <div
        ref={scrollRef}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        onPointerLeave={handleInteractionEnd}
        className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto no-scrollbar scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.searchId;
          const label = categoriesDict?.[cat.label] || cat.label;

          return (
            <a
              key={cat.label}
              data-cat-pill={cat.searchId}
              href={`#${cat.searchId}`}
              onClick={(e) => handleCategoryClick(e, cat.searchId)}
              className={`
                flex-none flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm font-medium whitespace-nowrap
                transition-all duration-200 touch-manipulation select-none cursor-pointer
                active:scale-95 focus:outline-none
                ${isActive
                  ? 'border-gold text-gold bg-gold/15 shadow-[0_0_15px_rgba(201,161,92,0.35)] ring-1 ring-gold/40 font-semibold'
                  : 'border-panel-border bg-panel text-stone hover:text-cream hover:border-gold'
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${isActive ? 'bg-gold animate-pulse' : 'bg-red-500/80'}`} />
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}