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
    { emoji: '🔥', value: '171+', label: dict?.stats?.menu_items || 'Artisanal Menu Items' },
    { emoji: '🧀', value: '100%', label: dict?.stats?.mozzarella || 'Grande Mozzarella' },
    { emoji: '❤️',  value: '25+',  label: dict?.stats?.tradition || 'Years of Tradition' },
    { emoji: '⚡', value: '~30 min', label: dict?.stats?.delivery || 'Average Delivery' },
  ];

  // Duplicate for seamless infinite loop
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-panel-border/40 bg-ink/60 py-2"
      aria-hidden="true"
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink/80 to-transparent z-10" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink/80 to-transparent z-10" />

      <div
        className="flex gap-0 will-change-transform"
        style={{
          animation: 'trust-marquee 32s linear infinite',
          width: 'max-content',
        }}
      >
        {repeated.map((item, i) => (
          <React.Fragment key={i}>
            <span className="inline-flex items-center gap-1.5 px-5 text-xs font-semibold text-stone-dim whitespace-nowrap select-none">
              <span className="text-sm leading-none">{item.emoji}</span>
              <span className="text-gold-bright font-extrabold tabular-nums">{item.value}</span>
              <span className="text-cream/50">{item.label}</span>
            </span>
            {/* Gold bullet separator */}
            <span className="inline-flex items-center text-gold/30 text-xs select-none" aria-hidden="true">
              •
            </span>
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes trust-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform { animation: none !important; }
        }
      `}</style>
    </div>
  );
}