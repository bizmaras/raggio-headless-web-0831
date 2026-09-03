'use client';

import React, { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'deals' },
  { label: 'Pizza', searchId: 'pizza' },
  { label: 'Gourmet Pizza', searchId: 'gourmet' },
  { label: 'Sicilian Pizza', searchId: 'sicilian' },
  { label: 'Chicken Wings', searchId: 'wing' },
  { label: 'Cheesesteaks', searchId: 'cheesesteak' },
  { label: 'Fresh Burgers', searchId: 'burger' },
  { label: 'Appetizers', searchId: 'appetizer' },
  { label: 'Fresh Salads', searchId: 'salad' },
  { label: 'Pasta', searchId: 'pasta' },
  { label: 'Complete Dinners', searchId: 'dinner' },
  { label: 'Seafood', searchId: 'seafood' },
  { label: 'Quesadillas', searchId: 'quesadilla' },
  { label: 'Latin Food', searchId: 'latin' },
  { label: 'Subs & Grinders', searchId: 'subs' },
  { label: 'Strombolis & Calzones', searchId: 'stromboli' },
  { label: 'Breakfast', searchId: 'breakfast' },
  { label: 'Hot Sandwiches', searchId: 'sandwiches' },
  { label: 'Desserts', searchId: 'dessert' },
  { label: 'Soups', searchId: 'soup' },
  { label: 'Drinks', searchId: 'drink' },
  { label: 'Side Orders', searchId: 'side' },
  { label: 'Catering', searchId: 'catering' }
];

export default function CategoryRail() {
  const [activeCategory, setActiveCategory] = useState<string>('deals');

  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const exactScroll = useRef(0);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  // IntersectionObserver for ScrollSpy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const timer = setTimeout(() => {
      CATEGORIES.forEach((cat) => {
        const el = document.getElementById(cat.searchId);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Kesintisiz ve Hızlı Auto-scroll motoru (Self-sabotaj kaldırıldı)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;
    exactScroll.current = container.scrollLeft;

    const step = () => {
      if (!isPaused.current) {
        if (container.scrollWidth > container.clientWidth) {
          // Hız 0.5'ten 1.5'e çıkarıldı (çok daha hızlı ve akıcı)
          exactScroll.current += 1.5;
          container.scrollLeft = exactScroll.current;

          // Sona gelince pürüzsüzce başa dön
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

  // SADECE fiziksel dokunuşta durdur (onScroll dinleyicisi silindi)
  const handleInteractionStart = () => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  // Dokunma bittikten 1.5 saniye sonra son pozisyonu alıp akmaya devam et
  const handleInteractionEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) {
        exactScroll.current = scrollRef.current.scrollLeft;
      }
      isPaused.current = false;
    }, 1500);
  };

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    setActiveCategory(searchId);
    e.preventDefault();

    let targetElement = document.getElementById(searchId);

    if (!targetElement) {
      const elements = Array.from(document.querySelectorAll('section, div, h1, h2, h3'));
      targetElement = elements.find(el => {
        const elId = el.id ? el.id.toLowerCase() : '';
        return elId.includes(searchId);
      }) as HTMLElement | null;
    }

    if (targetElement) {
      const topPosition = targetElement.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-20 z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border py-4">
      <div
        ref={scrollRef}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        onPointerLeave={handleInteractionEnd}
        className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 px-4 md:px-6 max-w-7xl mx-auto no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.searchId;

          return (
            <a
              key={cat.label}
              href={`#${cat.searchId}`}
              onClick={(e) => handleCategoryClick(e, cat.searchId)}
              className={`
                flex-none flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap
                transition-all duration-200 touch-manipulation select-none cursor-pointer
                active:scale-95 focus:outline-none
                ${isActive
                  ? 'border-gold text-gold bg-gold/15 shadow-[0_0_15px_rgba(201,161,92,0.35)] ring-1 ring-gold/40'
                  : 'border-panel-border bg-panel text-stone hover:text-cream hover:border-gold'
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${isActive ? 'bg-gold animate-pulse' : 'bg-red-500/80'}`} />
              {cat.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}