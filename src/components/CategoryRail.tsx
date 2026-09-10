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

  // Mobile auto-scroll: Seamless infinite loop with zero subpixel jitter and slower speed
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;
    let lastTime = performance.now();
    let accumulated = 0;
    // Calibrated speed: ~22 pixels/second (calm, legible, premium motion)
    const PIXELS_PER_SECOND = 22;

    exactScroll.current = container.scrollLeft;

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isPaused.current && window.innerWidth < 768) {
        // Half-width corresponds to Set 1 length (since Set 1 and Set 2 are equal on mobile)
        const halfWidth = container.scrollWidth / 2;

        if (halfWidth > 0 && container.scrollWidth > container.clientWidth) {
          accumulated += dt * PIXELS_PER_SECOND;

          // Integer-only pixel movement eliminates subpixel text jittering on mobile
          if (accumulated >= 1) {
            const pixelsToMove = Math.floor(accumulated);
            accumulated -= pixelsToMove;
            exactScroll.current += pixelsToMove;

            // Seamless infinite loop without any visual jump
            if (exactScroll.current >= halfWidth) {
              exactScroll.current -= halfWidth;
            }
            container.scrollLeft = Math.round(exactScroll.current);
          }
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pause auto-scroll during window vertical scroll to prevent jitter
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleWindowScroll = () => {
      isPaused.current = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (scrollRef.current) {
          exactScroll.current = scrollRef.current.scrollLeft;
        }
        isPaused.current = false;
      }, 150); // Resume 150ms after user stops scrolling vertically
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const handleInteractionStart = useCallback(() => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) {
        exactScroll.current = scrollRef.current.scrollLeft;
      }
      isPaused.current = false;
    }, 2500); // 2.5s calm pause after user releases touch
  }, []);

  // Handle continuous loop while user manually scrolls or flicks
  const handleContainerScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || window.innerWidth >= 768) return;

    const halfWidth = container.scrollWidth / 2;
    if (halfWidth <= 0) return;

    if (container.scrollLeft >= halfWidth) {
      container.scrollLeft -= halfWidth;
      exactScroll.current = container.scrollLeft;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft += halfWidth;
      exactScroll.current = container.scrollLeft;
    } else {
      exactScroll.current = container.scrollLeft;
    }
  }, []);

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    e.preventDefault();
    setActiveCategory(searchId);
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (scrollRef.current) exactScroll.current = scrollRef.current.scrollLeft;
      isPaused.current = false;
    }, 3500);

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
      const railEl = scrollRef.current?.parentElement;
      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 80;
      const railH = railEl ? railEl.getBoundingClientRect().height : 60;
      const headerOffset = headerH + railH + 16;

      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  }, [activeSlug, lang, router]);

  const renderPill = (cat: typeof CATEGORIES[number], key: string, isDuplicate = false) => {
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
          ${isDuplicate ? 'md:hidden' : ''}
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
    <div className="sticky top-16 md:top-20 z-40 bg-ink/95 backdrop-blur-md border-b border-panel-border pt-6 pb-4 md:pt-8 md:pb-5 shadow-sm">
      <div
        ref={scrollRef}
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        onPointerLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onScroll={handleContainerScroll}
        className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2.5 md:gap-3 px-3 md:px-6 max-w-7xl mx-auto no-scrollbar pt-2 pb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Set 1: visible everywhere (wraps on desktop, flows on mobile) */}
        {CATEGORIES.map((cat, idx) => renderPill(cat, `s1-${cat.searchId}-${idx}`))}

        {/* Set 2: rendered ONLY on mobile (md:hidden) to create an infinite seamless loop without jumping */}
        {CATEGORIES.map((cat, idx) => renderPill(cat, `s2-${cat.searchId}-${idx}`, true))}
      </div>
    </div>
  );
}