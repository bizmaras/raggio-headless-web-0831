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
    { emoji: '❤️', value: '25+',  label: dict?.stats?.tradition || 'Years of Tradition' },
    { emoji: '⚡', value: '~30 min', label: dict?.stats?.delivery || 'Average Delivery' },
  ];

  // 4× repeat so the -25% translate creates a seamless loop with zero clip
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-panel-border/40 bg-ink/60 py-2"
      aria-hidden="true"
    >
      {/* Left edge fade — keeps first item readable while masking overflow */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ink/90 to-transparent z-10" />
      {/* Right edge fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ink/90 to-transparent z-10" />

      <div
        className="flex gap-0 will-change-transform"
        style={{
          animation: 'trust-marquee 30s linear infinite',
          width: 'max-content',
          /* Nudge left so the first item starts fully visible, not mid-scroll */
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
            {/* Separator */}
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
  );
}