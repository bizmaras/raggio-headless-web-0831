'use client';

/**
 * LazyMount — renders `children` only when the placeholder approaches the viewport.
 * Used for heavy, below-the-fold interactive widgets (catering planner, invoicing
 * panel) so they don't cost parse/hydration time on first load (mobile TBT/LCP).
 * The placeholder reserves height to avoid layout shift.
 */
import { useEffect, useRef, useState } from 'react';

export default function LazyMount({
  children,
  minHeight = 600,
  rootMargin = '900px 0px',
  label,
}: {
  children: React.ReactNode;
  minHeight?: number;
  rootMargin?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setShow(true); return; }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setShow(true); io.disconnect(); } },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  if (show) return <>{children}</>;
  return <div ref={ref} data-lazy-mount={label} aria-hidden="true" style={{ minHeight }} />;
}
