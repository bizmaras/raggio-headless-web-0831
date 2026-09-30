'use client';

import { useId, useRef } from 'react';
import type { SizeVariant } from '@/data/sizePricing';

interface Props {
  sizes: SizeVariant[];
  value: number;
  onChange: (idx: number) => void;
  lang?: 'en' | 'es';
  density?: 'comfortable' | 'compact';
  /** Accessible name, e.g. "Size for Veggie Pizza". */
  label: string;
}

/**
 * WAI-ARIA radiogroup with roving tabindex (←/→/↑/↓, Home/End).
 * Every option shows label + inches (when known) + price, so the customer
 * compares sizes without opening anything. Min target 44×44 on comfortable.
 */
export default function SizeSelector({ sizes, value, onChange, lang = 'en', density = 'comfortable', label }: Props) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();

  const move = (next: number) => {
    const n = (next + sizes.length) % sizes.length;
    onChange(n);
    refs.current[n]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(value + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(value - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(sizes.length - 1); }
  };

  const compact = density === 'compact';

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={`grid grid-flow-col auto-cols-fr gap-1 p-1 rounded-xl bg-ink-2 border border-panel-border`}
    >
      {sizes.map((s, i) => {
        const checked = i === value;
        return (
          <button
            key={s.id}
            id={`${id}-${s.id}`}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={(e) => { e.stopPropagation(); onChange(i); }}
            className={`flex flex-col items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${
              compact ? 'min-h-[36px] px-1 py-1' : 'min-h-[48px] px-1 py-1.5'
            } ${checked ? 'bg-gold text-ink' : 'text-stone hover:text-cream hover:bg-panel-2'}`}
          >
            <span className={`font-bold leading-none tracking-wide ${compact ? 'text-[10.5px]' : 'text-[11px]'}`}>
              {s.label}
              {s.inches && !compact ? <span className="font-medium"> {s.inches}</span> : null}
            </span>
            {!compact && (
              <span className={`mt-1 text-[11.5px] tabular-nums leading-none ${checked ? 'font-bold' : 'font-medium text-stone-dim'}`}>
                ${s.price.toFixed(2)}
              </span>
            )}
            <span className="sr-only">{` — ${s.fullName[lang]}${compact ? ` $${s.price.toFixed(2)}` : ''}`}</span>
          </button>
        );
      })}
    </div>
  );
}
