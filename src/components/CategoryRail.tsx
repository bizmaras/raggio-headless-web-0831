'use client';

/**
 * CategoryRail v2 (Stage 2)
 *
 * Drop-in: same default export, same props, `CATEGORIES` still exported.
 *
 * What changed and why
 *  1. NO AUTO-SCROLLING MARQUEE on mobile. v1 animated the pills for 65 s on loop
 *     (WCAG 2.2.2 Pause/Stop/Hide failure), rendered every link twice (48 links for
 *     screen readers), and asked thumbs to hit moving targets. v2 = one row,
 *     native horizontal scroll with scroll-snap and edge fades.
 *  2. ONE ROW ON DESKTOP TOO. v1 wrapped 24 pills into 2–3 rows, so the sticky
 *     stack (header + rail) reached ~260 px — a third of a laptop viewport — above
 *     every card. v2 is a single scrollable row with prev/next buttons (~56 px).
 *  3. DEMAND ORDER. "Pizza" was pill #22 of 24. Pizza-first now; the long tail after.
 *  4. VIEW TOGGLE SLOT. The Showcase / Quick-order switch lives in the sticky rail,
 *     so regulars can flip to Speed Order from anywhere on the page.
 *  5. TOKENS, NOT HEX. v1 hard-coded #181c22 (Stage-0 blue-black) inside the Stage-1
 *     warm-obsidian theme; v2 uses bg-panel / border-panel-border / text-gold.
 *  6. No emoji in labels ("⭐ Reviews (4.2)" → "Reviews 4.2").
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ViewModeToggle from './menu/ViewModeToggle';

interface CategoryRailProps {
  categoriesDict?: Record<string, string>;
  lang?: string;
  activeSlug?: string;
  /** Show the Showcase / Quick-order toggle at the rail's right edge (default true). */
  showViewToggle?: boolean;
}

export const CATEGORIES = [
  { label: 'Deals & Specials', searchId: 'deals' },
  { label: 'Pizza', searchId: 'pizza' },
  { label: 'Gourmet Pizza', searchId: 'gourmet-pizza' },
  { label: 'Sicilian Pizza', searchId: 'sicilian-pizza' },
  { label: 'Chicken Wings', searchId: 'chicken-wings' },
  { label: 'Cheesesteaks', searchId: 'cheesesteaks' },
  { label: 'Strombolis & Calzones', searchId: 'strombolis-and-calzones' },
  { label: 'Fresh Burgers', searchId: 'fresh-burgers' },
  { label: 'Appetizers', searchId: 'appetizers' },
  { label: 'Subs & Grinders', searchId: 'subs-and-grinders' },
  { label: 'Hot Sandwiches', searchId: 'hot-sandwiches' },
  { label: 'Latin Food', searchId: 'latin-food' },
  { label: 'Quesadillas', searchId: 'quesadillas' },
  { label: 'Pasta', searchId: 'pasta' },
  { label: 'Fresh Salads', searchId: 'fresh-salads' },
  { label: 'Complete Dinners', searchId: 'complete-dinners' },
  { label: 'Seafood', searchId: 'seafood' },
  { label: 'Breakfast', searchId: 'breakfast' },
  { label: 'Desserts', searchId: 'desserts' },
  { label: 'Soups', searchId: 'soups' },
  { label: 'Side Orders', searchId: 'side-orders' },
  { label: 'Drinks', searchId: 'drinks' },
  { label: 'Catering', searchId: 'catering' },
  { label: 'Reviews 4.2', searchId: 'reviews' },
];

const HOME_ANCHORS = new Set(['deals', 'reviews']);
// Routes that live on their own page (not a home anchor or a menu category).
const PAGE_ROUTES: Record<string, string> = { catering: 'catering' };

export default function CategoryRail({ categoriesDict, lang = 'en', activeSlug, showViewToggle = true }: CategoryRailProps) {
  const router = useRouter();
  const [spyActive, setActive] = useState<string>('deals');
  const active = activeSlug || spyActive;
  const [edges, setEdges] = useState({ start: true, end: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Keep the active pill visible — only when it changes, never while the user is dragging.
  useEffect(() => {
    const track = trackRef.current;
    const pill = track?.querySelector<HTMLElement>(`[data-cat-pill="${active}"]`);
    if (!track || !pill) return;
    const l = pill.offsetLeft - track.clientWidth / 2 + pill.offsetWidth / 2;
    track.scrollTo({ left: Math.max(0, l), behavior: 'smooth' });
  }, [active]);

  // Edge fades / arrow state
  const updateEdges = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    updateEdges();
    const t = trackRef.current;
    t?.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => { t?.removeEventListener('scroll', updateEdges); window.removeEventListener('resize', updateEdges); };
  }, [updateEdges]);

  // Scroll-spy (homepage only)
  useEffect(() => {
    if (activeSlug || typeof window === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-150px 0px -60% 0px' }
    );
    const timer = window.setTimeout(() => {
      CATEGORIES.forEach((c) => { const el = document.getElementById(c.searchId); if (el) io.observe(el); });
    }, 400);
    return () => { window.clearTimeout(timer); io.disconnect(); };
  }, [activeSlug]);

  // --sticky-category-top = header + rail (consumed by sticky section headers + scroll-margin)
  useEffect(() => {
    const update = () => {
      const header = document.querySelector('header');
      const rail = containerRef.current;
      if (!header || !rail) return;
      document.documentElement.style.setProperty('--sticky-category-top', `${Math.round(header.offsetHeight + rail.offsetHeight)}px`);
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    const header = document.querySelector('header');
    if (ro && containerRef.current) ro.observe(containerRef.current);
    if (ro && header) ro.observe(header);
    window.addEventListener('resize', update, { passive: true });
    return () => { ro?.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  const hrefFor = (id: string) =>
    PAGE_ROUTES[id] ? `/${lang}/${PAGE_ROUTES[id]}` : activeSlug ? (HOME_ANCHORS.has(id) ? `/${lang}/#${id}` : `/${lang}/menu/${id}`) : `#${id}`;

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      setActive(id);
      if (activeSlug || PAGE_ROUTES[id]) {
        const href = hrefFor(id);
        // Page's first node is the sticky header (always "in view"), so Next's
        // automatic scroll-to-segment never fires — reset scroll ourselves.
        if (!href.includes('#')) window.scrollTo(0, 0);
        if (href.includes('#')) router.push(href); else router.push(href, { scroll: false });
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      const offset = (document.querySelector('header')?.offsetHeight ?? 80) + (containerRef.current?.offsetHeight ?? 56);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', `#${id}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSlug, lang, router]
  );

  const nudge = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * (trackRef.current.clientWidth * 0.7), behavior: 'smooth' });

  const arrow = (dir: 1 | -1, hidden: boolean) => (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={() => nudge(dir)}
      className={`hidden md:grid shrink-0 place-items-center w-9 h-9 rounded-full border border-panel-border bg-panel text-stone hover:text-cream hover:border-gold transition-opacity cursor-pointer ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === 1 ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
      </svg>
    </button>
  );

  return (
    <div ref={containerRef} className="sticky top-20 z-40 bg-ink/95 backdrop-blur border-b border-panel-border isolate">
      <nav aria-label={lang === 'es' ? 'Categorías del menú' : 'Menu categories'} className="max-w-7xl mx-auto flex items-center gap-2 px-3 md:px-4 py-2.5">
        {arrow(-1, edges.start)}
        <div className="relative min-w-0 flex-1">
          <div
            ref={trackRef}
            className="flex gap-1.5 overflow-x-auto overscroll-x-contain snap-x snap-proximity [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              maskImage: `linear-gradient(to right, ${edges.start ? '#000' : 'transparent'}, #000 24px, #000 calc(100% - 24px), ${edges.end ? '#000' : 'transparent'})`,
              WebkitMaskImage: `linear-gradient(to right, ${edges.start ? '#000' : 'transparent'}, #000 24px, #000 calc(100% - 24px), ${edges.end ? '#000' : 'transparent'})`,
            }}
          >
            {CATEGORIES.map((c) => {
              const isActive = active === c.searchId;
              return (
                <a
                  key={c.searchId}
                  data-cat-pill={c.searchId}
                  href={hrefFor(c.searchId)}
                  onClick={(e) => onClick(e, c.searchId)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`snap-start shrink-0 inline-flex items-center h-9 px-3.5 rounded-full text-[13px] whitespace-nowrap border transition-colors duration-150 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    isActive
                      ? 'bg-gold text-ink border-gold font-bold'
                      : 'bg-panel text-cream/85 border-panel-border font-medium hover:text-gold-bright hover:border-gold/50'
                  }`}
                >
                  {categoriesDict?.[c.label] || c.label}
                </a>
              );
            })}
          </div>
        </div>
        {arrow(1, edges.end)}
        {showViewToggle && (
          <div className="hidden md:block shrink-0">
            <ViewModeToggle lang={lang} />
          </div>
        )}
      </nav>
    </div>
  );
}
