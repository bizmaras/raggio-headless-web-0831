'use client';

import { useMenuViewMode, type MenuViewMode } from '@/hooks/useMenuViewMode';

const COPY = {
  en: { group: 'Menu layout', editorial: 'Showcase', list: 'Quick order' },
  es: { group: 'Diseño del menú', editorial: 'Vitrina', list: 'Pedido rápido' },
};

/**
 * Segmented control (two radio buttons). Visible label text on both options —
 * icon-only toggles are the #1 reason users never discover list view.
 */
export default function ViewModeToggle({ lang = 'en', className = '' }: { lang?: string; className?: string }) {
  const [mode, setMode] = useMenuViewMode();
  const t = lang === 'es' ? COPY.es : COPY.en;

  const opt = (value: MenuViewMode, label: string, icon: React.ReactNode) => {
    const active = mode === value;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={active}
        onClick={() => setMode(value)}
        data-dd-action-name={`menu_view_${value}`}
        className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
          active ? 'bg-gold text-ink shadow-sm' : 'text-stone hover:text-cream'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div
      role="radiogroup"
      aria-label={t.group}
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-xl bg-ink-2 border border-panel-border ${className}`}
    >
      {opt(
        'editorial',
        t.editorial,
        <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      )}
      {opt(
        'list',
        t.list,
        <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <path d="M8 6h12M8 12h12M8 18h12" />
          <circle cx="4" cy="6" r="1" fill="currentColor" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="4" cy="18" r="1" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
