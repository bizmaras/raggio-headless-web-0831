'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Award, Flame, Clock, Heart } from 'lucide-react';

interface StatItem {
  id: string;
  targetNumber: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATS: StatItem[] = [
  { id: 'stat-1', targetNumber: 171, suffix: '+', label: 'Artisanal Menu Items', icon: Flame },
  { id: 'stat-2', targetNumber: 100, suffix: '%', label: 'Grande Mozzarella', icon: Award },
  { id: 'stat-3', targetNumber: 25, suffix: '+', label: 'Years of Tradition', icon: Heart },
  { id: 'stat-4', targetNumber: 30, suffix: ' Min', label: 'Average Delivery', icon: Clock },
];

export default function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(container);

            STATS.forEach((stat) => {
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
    <section ref={containerRef} className="py-8 bg-panel/60 border-y border-panel-border/60">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-ink/40 border border-panel-border/40 hover:border-gold/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-2">
                <Icon className="w-5 h-5" />
              </div>
              <span
                id={`counter-${stat.id}`}
                className="text-2xl sm:text-3xl font-extrabold text-gold-bright tracking-tight"
              >
                0{stat.suffix}
              </span>
              <span className="text-xs sm:text-sm font-medium text-cream/70 mt-1">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}