'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryRailProps {
  categoriesDict?: Record<string, string>;
  lang?: string;
  activeSlug?: string;
}

const CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'deals' },
  { label: '⭐ Reviews (4.2)', searchId: 'reviews' },
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

export default function CategoryRail({ categoriesDict, lang = 'en', activeSlug }: CategoryRailProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>(activeSlug || 'deals');

  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const exactScroll = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeSlug]);

  // Continuous smooth auto-scroll to the left on mobile (never stops or stutters)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;
    exactScroll.current = container.scrollLeft;

    const step = () => {
      if (!isPaused.current && window.innerWidth < 768) {
        if (container.scrollWidth > container.clientWidth) {
          exactScroll.current += 0.8;
          container.scrollLeft = exactScroll.current;

          // Seamless loop back when reaching the end
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 2) {
            exactScroll.current = 0;
            container.scrollLeft = 0;
          }
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleInteractionStart = useCallback(() => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) exactScroll.current = scrollRef.current.scrollLeft;
      isPaused.current = false;
    }, 1200);
  }, []);

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    e.preventDefault();
    setActiveCategory(searchId);
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) exactScroll.current = scrollRef.current.scrollLeft;
      isPaused.current = false;
    }, 2000);

    // If deals, reviews, or catering: scroll to homepage section
    if (searchId === 'deals' || searchId === 'reviews' || searchId === 'catering') {
      if (activeSlug) {
        router.push(`/${lang}/#${searchId}`);
      } else {
        const target = document.getElementById(searchId);
        if (target) {
          const isMobile = window.innerWidth < 640;
          const yOffset = isMobile ? -130 : -220;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + yOffset, behavior: 'instant' });
        }
      }
      return;
    }

    // For all menu categories: immediately open the dedicated category page in the same tab!
    router.push(`/${lang}/menu/${searchId}`);
  }, [activeSlug, lang, router]);

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-2 md:py-3.5 shadow-sm">
      <div
        ref={scrollRef}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        onPointerLeave={handleInteractionEnd}
        className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-3 md:px-6 max-w-7xl mx-auto no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.searchId;
          const label = categoriesDict?.[cat.label] || cat.label;
          const href = cat.searchId === 'deals' || cat.searchId === 'reviews' || cat.searchId === 'catering'
            ? `/${lang}/#${cat.searchId}`
            : `/${lang}/menu/${cat.searchId}`;

          return (
            <a
              key={cat.label}
              data-cat-pill={cat.searchId}
              href={href}
              onClick={(e) => handleCategoryClick(e, cat.searchId)}
              className={`
                flex-none flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm font-medium whitespace-nowrap
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