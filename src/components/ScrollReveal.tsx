'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'none';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === 'undefined') return;

    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      hasAnimated.current = true;
      return;
    }

    // GPU-friendly initial state for offscreen elements
    el.style.opacity = '0';
    if (direction === 'up') {
      el.style.transform = 'translateY(24px)';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(el);

            if (delay > 0) {
              setTimeout(() => {
                el.style.transition = 'opacity 500ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'none';
              }, delay);
            } else {
              requestAnimationFrame(() => {
                el.style.transition = 'opacity 500ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'none';
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delay, direction]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}