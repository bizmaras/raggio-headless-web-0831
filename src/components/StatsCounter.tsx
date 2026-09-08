'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Award, Flame, Clock, Heart, Star } from 'lucide-react';

interface StatsCounterProps {
  dict?: {
    stats?: {
      menu_items?: string;
      mozzarella?: string;
      tradition?: string;
      delivery?: string;
    };
  };
}

export default function StatsCounter({ dict }: StatsCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Mobile Marquee Items (stays 100% identical on mobile)
  const mobileItems = [
    { emoji: '⭐', value: '4.2', label: 'Google Rating (211+ Reviews)' },
    { emoji: '🔥', value: '171+', label: dict?.stats?.menu_items || 'Artisanal Menu Items' },
    { emoji: '🧀', value: '100%', label: dict?.stats?.mozzarella || 'Grande Mozzarella' },
    { emoji: '❤️', value: '25+',  label: dict?.stats?.tradition || 'Years of Tradition' },
    { emoji: '⚡', value: '~30 min', label: dict?.stats?.delivery || 'Average Delivery' },
  ];
  const repeated = [...mobileItems, ...mobileItems, ...mobileItems, ...mobileItems];

  // Desktop 4-Box Stats
  const desktopStats = [
    { id: 'dstat-1', targetNumber: 171, suffix: '+', label: dict?.stats?.menu_items || 'Artisanal Menu Items', icon: Flame },
    { id: 'dstat-2', targetNumber: 100, suffix: '%', label: dict?.stats?.mozzarella || 'Grande Mozzarella', icon: Award },
    { id: 'dstat-3', targetNumber: 25, suffix: '+', label: dict?.stats?.tradition || 'Years of Tradition', icon: Heart },
    { id: 'dstat-4', targetNumber: 30, suffix: ' Min', label: dict?.stats?.delivery || 'Average Delivery', icon: Clock },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(container);

            desktopStats.forEach((stat) => {
              const numEl = document.getElementById(`counter-${stat.id}`);
              if (!numEl) return;

              const obj = { val: 0 };
              animate(obj, {
                val: stat.targetNumber,
                duration: 1600,
                ease: 'outExpo',
                onUpdate: () => {
                  numEl.textContent = Math.round(obj.val) + stat.suffix;
                },
              });
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* MOBILE: Ultra-thin infinite marquee (unchanged, zero mobile footprint) */}
      <div
        className="md:hidden relative overflow-hidden border-y border-panel-border/40 bg-ink/60 py-2"
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ink/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ink/90 to-transparent z-10" />

        <div
          className="flex gap-0 will-change-transform"
          style={{
            animation: 'trust-marquee 30s linear infinite',
            width: 'max-content',
            transform: 'translateX(0)',
          }}
        >
          {repeated.map((item, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center gap-1.5 px-5 text-xs font-semibold whitespace-nowrap select-none">
                <span className="text-sm leading-none">{item.emoji}</span>
                <span className="text-gold-bright font-extrabold tabular-nums">{item.value}</span>
                <span className="text-cream/40">{item.label}</span>
              </span>
              <span className="inline-flex items-center text-gold/25 text-xs select-none px-1" aria-hidden="true">
                ·
              </span>
            </React.Fragment>
          ))}
        </div>

        <style>{`
          @keyframes trust-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .will-change-transform {
              animation: none !important;
              transform: none !important;
            }
          }
        `}</style>
      </div>

      {/* DESKTOP: Full-width 4-box luxury stats grid with counter animations */}
      <section ref={containerRef} className="hidden md:block py-8 bg-panel/60 border-y border-panel-border/60">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-6 text-center">
          {desktopStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-ink/40 border border-panel-border/40 hover:border-gold/40 transition-all duration-300 shadow-sm hover:shadow-gold/10"
              >
                <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  id={`counter-${stat.id}`}
                  className="text-3xl font-extrabold text-gold-bright tracking-tight"
                >
                  0{stat.suffix}
                </span>
                <span className="text-sm font-medium text-cream/70 mt-1">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}