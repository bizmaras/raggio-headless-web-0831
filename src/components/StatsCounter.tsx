'use client';

import React from 'react';

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
  const items = [
    { emoji: '⭐', value: '4.2', label: 'Google Rating (211+ Reviews)' },
    { emoji: '🔥', value: '171+', label: dict?.stats?.menu_items || 'Artisanal Menu Items' },
    { emoji: '🧀', value: '100%', label: dict?.stats?.mozzarella || 'Grande Mozzarella' },
    { emoji: '❤️', value: '25+',  label: dict?.stats?.tradition || 'Years of Tradition' },
    { emoji: '⚡', value: '~30 min', label: dict?.stats?.delivery || 'Average Delivery' },
  ];

  // 4x repeat so -25% translate creates a seamless infinite loop
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-panel-border/40 bg-ink/70 py-2.5 md:py-3 w-full max-w-full select-none"
      style={{ overflow: 'clip', contain: 'paint' }}
      aria-hidden="true"
    >
      {/* Edge gradient fades for seamless emergence */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-ink to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-ink to-transparent z-10" />

      <div
        className="flex gap-0 will-change-transform"
        style={{
          animation: 'trust-marquee 32s linear infinite',
          width: 'max-content',
          transform: 'translateX(0)',
        }}
      >
        {repeated.map((item, i) => (
          <React.Fragment key={i}>
            <span className="inline-flex items-center gap-2 px-5 md:px-8 text-xs md:text-sm font-semibold whitespace-nowrap">
              <span className="text-sm md:text-base leading-none">{item.emoji}</span>
              <span className="text-gold-bright font-extrabold tracking-tight tabular-nums">{item.value}</span>
              <span className="text-cream/60 font-medium">{item.label}</span>
            </span>
            {/* Elegant gold separator dot */}
            <span className="inline-flex items-center text-gold/35 text-xs md:text-sm select-none px-1" aria-hidden="true">
              •
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
  );
}