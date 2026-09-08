'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  // Auto-scroll state — all in refs to avoid re-render overhead
  const isPaused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animId = useRef<number>(0);
  // Separate flag: when scrollIntoView is running we must not also RAF-scroll
  const centring = useRef(false);

  // ─── ScrollSpy ───────────────────────────────────────────────────────────
  useEffect(() => {
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
      { root: null, rootMargin: '-230px 0px -60% 0px', threshold: 0 }
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
    }, 800);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  // ─── Centre active pill (no scrollIntoView — manual, conflict-free) ──────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const pill = container.querySelector<HTMLElement>(`[data-cat-pill="${activeCategory}"]`);
    if (!pill) return;

    // Pause auto-scroll while we manually centre
    centring.current = true;
    const pillLeft = pill.offsetLeft;
    const pillWidth = pill.offsetWidth;
    const containerWidth = container.clientWidth;
    const targetScroll = pillLeft - containerWidth / 2 + pillWidth / 2;

    // Smooth-scroll only on desktop; on mobile let auto-scroll handle position
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) {
      container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }

    // Release centring lock after a brief moment
    const t = setTimeout(() => { centring.current = false; }, 400);
    return () => clearTimeout(t);
  }, [activeCategory]);

  // ─── Auto-scroll (RAF, mobile-only, no conflict with centring) ───────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Wait 4 s before starting so page settles
    const startDelay = setTimeout(() => {
      const step = () => {
        if (!isPaused.current && !centring.current && window.innerWidth < 768) {
          if (container.scrollWidth > container.clientWidth) {
            container.scrollLeft += 0.5;
            // Loop back seamlessly
            if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
              container.scrollLeft = 0;
            }
          }
        }
        animId.current = requestAnimationFrame(step);
      };
      animId.current = requestAnimationFrame(step);
    }, 4000);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  const handleInteractionStart = useCallback(() => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, 2000);
  }, []);

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    e.preventDefault();
    setActiveCategory(searchId);
    isPaused.current = true; // pause auto-scroll during navigation
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { isPaused.current = false; }, 3000);

    if (typeof window === 'undefined') return;
    let target = document.getElementById(searchId);
    if (!target) {
      target = Array.from(document.querySelectorAll('section,div,h1,h2,h3'))
        .find(el => (el.id || '').toLowerCase().includes(searchId.replace('-and-', ''))) as HTMLElement | null;
    }
    if (target) {
      const isMobile = window.innerWidth < 640;
      const yOffset = isMobile ? -130 : -220;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + yOffset, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-2 md:py-3.5 shadow-sm">
      <div
        ref={scrollRef}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        onPointerLeave={handleInteractionEnd}
        className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-3 md:px-6 max-w-7xl mx-auto no-scrollbar"
        /* No scroll-smooth here — we control it manually to avoid conflicts */
        style={{ WebkitOverflowScrolling: 'touch' }}
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
                flex-none flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm font-medium whitespace-nowrap
                transition-all duration-200 touch-manipulation select-none cursor-pointer
                active:scale-95 focus:outline-none
                ${isActive
                  ? 'border-gold text-gold bg-gold/15 shadow-[0_0_12px_rgba(201,161,92,0.3)] ring-1 ring-gold/30 font-semibold'
                  : 'border-panel-border bg-panel text-stone hover:text-cream hover:border-gold/60'
                }
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isActive ? 'bg-gold animate-pulse' : 'bg-red-500/70'}`} />
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}