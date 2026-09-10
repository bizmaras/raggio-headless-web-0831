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

  // Motion physics refs (GPU translate3d based, NO scrollLeft layout thrashing)
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const isInteracting = useRef(false);
  const dragStartX = useRef(0);
  const dragStartCurrentX = useRef(0);
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

  // Set exact --sticky-category-top CSS variable (Header height + Rail height)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStickyOffsets = () => {
      const headerEl = document.querySelector('header');
      const railEl = containerRef.current;
      if (headerEl && railEl) {
        const headerH = headerEl.offsetHeight;
        const railH = railEl.offsetHeight;
        const totalTop = Math.round(headerH + railH);
        document.documentElement.style.setProperty('--sticky-category-top', `${totalTop}px`);
      }
    };

    updateStickyOffsets();
    const t1 = setTimeout(updateStickyOffsets, 150);
    const t2 = setTimeout(updateStickyOffsets, 600);
    window.addEventListener('resize', updateStickyOffsets, { passive: true });
    window.addEventListener('orientationchange', updateStickyOffsets, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updateStickyOffsets);
      window.removeEventListener('orientationchange', updateStickyOffsets);
    };
  }, []);

  // Endless Leftward Auto-Scroll Loop on Mobile via GPU Transform (translate3d)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animId: number;
    let lastTime = performance.now();
    const PIXELS_PER_SECOND = 24; // Calm, legible, premium speed

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const track = trackRef.current;
      if (track && window.innerWidth < 768) {
        // Track width consists of Set 1 + Set 2. Half-width is exactly Set 1 width.
        const halfWidth = track.scrollWidth / 2;

        if (halfWidth > 0) {
          if (!isInteracting.current && !isDragging.current) {
            currentX.current -= PIXELS_PER_SECOND * dt;
          }

          // Seamless infinite wrap around
          if (currentX.current <= -halfWidth) {
            currentX.current += halfWidth;
          } else if (currentX.current > 0) {
            currentX.current -= halfWidth;
          }

          // Apply directly via hardware-accelerated translate3d (zero layout reflow)
          track.style.transform = `translate3d(${currentX.current.toFixed(2)}px, 0, 0)`;
        }
      } else if (track) {
        track.style.transform = 'none';
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Touch and Drag handlers for mobile
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    isDragging.current = true;
    isInteracting.current = true;
    dragStartX.current = e.clientX;
    dragStartCurrentX.current = currentX.current;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStartX.current;
    currentX.current = dragStartCurrentX.current + deltaX;

    const track = trackRef.current;
    if (track) {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        if (currentX.current <= -halfWidth) {
          currentX.current += halfWidth;
          dragStartCurrentX.current += halfWidth;
        } else if (currentX.current > 0) {
          currentX.current -= halfWidth;
          dragStartCurrentX.current -= halfWidth;
        }
      }
      track.style.transform = `translate3d(${currentX.current.toFixed(2)}px, 0, 0)`;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 1500); // Resume auto-scroll after 1.5s pause
  };

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, searchId: string) => {
    e.preventDefault();
    setActiveCategory(searchId);

    // Pause auto-scroll briefly when user taps a pill
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2500);

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
    <div
      ref={containerRef}
      className="sticky top-20 z-40 bg-ink border-b border-panel-border py-2.5 md:py-5 shadow-sm overflow-hidden select-none"
    >
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex items-center md:flex-wrap md:justify-center gap-2.5 md:gap-3 px-3 md:px-6 max-w-7xl mx-auto w-max md:w-full touch-pan-y"
        style={{
          touchAction: 'pan-y',
        }}
      >
        {/* Set 1: visible everywhere (flows endlessly on mobile, wraps neatly on desktop) */}
        {CATEGORIES.map((cat, idx) => renderPill(cat, `s1-${cat.searchId}-${idx}`))}

        {/* Set 2: mobile-only duplicate for seamless infinite loop */}
        {CATEGORIES.map((cat, idx) => renderPill(cat, `s2-${cat.searchId}-${idx}`, true))}
      </div>
    </div>
  );
}