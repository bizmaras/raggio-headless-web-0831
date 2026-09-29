/**
 * Typographic "menu plate" — shown when we have no TRUE photo of a dish.
 * Beats a wrong photo: no "not as pictured" risk, and a page of plates reads like
 * a printed trattoria menu instead of a broken stock-photo grid.
 * Pure server-safe markup, 0 KB of images.
 */
type Family = 'pizza' | 'sicilian' | 'stromboli' | 'sandwich' | 'wings' | 'bowl' | 'plate';

export function familyFor(category: string): Family {
  const c = (category || '').toLowerCase();
  if (c.includes('sicilian')) return 'sicilian';
  if (c.includes('pizza')) return 'pizza';
  if (c.includes('stromboli') || c.includes('calzone')) return 'stromboli';
  if (c.includes('steak') || c.includes('sub') || c.includes('sandwich') || c.includes('burger')) return 'sandwich';
  if (c.includes('wing')) return 'wings';
  if (c.includes('salad') || c.includes('pasta') || c.includes('soup')) return 'bowl';
  return 'plate';
}

function Glyph({ family }: { family: Family }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (family) {
    case 'pizza':
      return (
        <g {...common}>
          <circle cx="32" cy="32" r="22" />
          <circle cx="32" cy="32" r="18" strokeDasharray="1.5 3" />
          <path d="M32 10v44M10 32h44M16.4 16.4l31.2 31.2M47.6 16.4 16.4 47.6" opacity=".55" />
        </g>
      );
    case 'sicilian':
      return (
        <g {...common}>
          <rect x="11" y="11" width="42" height="42" rx="3" />
          <path d="M25 11v42M39 11v42M11 25h42M11 39h42" opacity=".55" />
        </g>
      );
    case 'stromboli':
      return (
        <g {...common}>
          <rect x="8" y="22" width="48" height="20" rx="10" />
          <path d="M20 24c2 6 2 10 0 16M30 23c2 6 2 12 0 18M40 23c2 6 2 12 0 18M50 25c1.5 5 1.5 9 0 14" opacity=".55" />
        </g>
      );
    case 'sandwich':
      return (
        <g {...common}>
          <path d="M8 30c0-6 10-10 24-10s24 4 24 10z" />
          <path d="M9 34c6 2 10-2 16 0s10 2 16 0 9-2 14 0" opacity=".6" />
          <path d="M8 38h48c0 4-10 7-24 7S8 42 8 38z" />
        </g>
      );
    case 'wings':
      return (
        <g {...common}>
          <path d="M18 44c-6-8 0-22 14-24 10-1 16 6 14 14-2 9-14 16-28 10z" />
          <path d="M40 22l8-8M44 26l8-6" opacity=".6" />
        </g>
      );
    case 'bowl':
      return (
        <g {...common}>
          <path d="M8 30h48c0 12-10 20-24 20S8 42 8 30z" />
          <path d="M20 26c2-6 6-8 8-8M32 26c0-6 4-10 8-10M42 27c1-4 4-6 6-6" opacity=".6" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <circle cx="32" cy="34" r="20" />
          <circle cx="32" cy="34" r="13" opacity=".55" />
          <path d="M14 14v10M11 14v6M17 14v6M50 14v20" opacity=".6" />
        </g>
      );
  }
}

export default function DishPlate({
  name,
  category,
  lang = 'en',
  size = 'lg',
}: {
  name: string;
  category: string;
  lang?: 'en' | 'es';
  size?: 'lg' | 'sm';
}) {
  const family = familyFor(category);
  const initial = (name || 'R').trim().charAt(0).toUpperCase();

  if (size === 'sm') {
    return (
      <div aria-hidden="true" className="w-full h-full grid place-items-center bg-ink-2 text-gold/80">
        <svg viewBox="0 0 64 64" className="w-8 h-8"><Glyph family={family} /></svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full overflow-hidden bg-ink-2 text-gold"
      style={{
        backgroundImage:
          'radial-gradient(120% 90% at 80% 0%, rgba(201,161,92,.14), transparent 60%), radial-gradient(80% 60% at 0% 100%, rgba(184,69,43,.10), transparent 60%)',
      }}
    >
      <span className="absolute -right-3 -bottom-10 font-display italic leading-none text-[9rem] text-gold/10 select-none">
        {initial}
      </span>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <svg viewBox="0 0 64 64" className="w-14 h-14 opacity-90"><Glyph family={family} /></svg>
        <span className="font-display italic text-cream/90 text-lg leading-tight line-clamp-2 px-2 pb-0.5">{name}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
          {lang === 'es' ? 'Hecho al momento' : 'Made to order'}
        </span>
      </div>
    </div>
  );
}
