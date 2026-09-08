'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

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

            animate(el, {
              opacity: [0, 1],
              translateY: direction === 'up' ? [24, 0] : 0,
              duration: 550,
              delay: delay,
              ease: 'outCubic',
              complete: () => {
                el.style.transform = 'none';
              },
            });
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