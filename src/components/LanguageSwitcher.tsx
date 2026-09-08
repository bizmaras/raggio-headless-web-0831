'use client';

import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLang: string;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname() || '';
  const router = useRouter();

  const handleSwitch = (newLang: string) => {
    if (newLang === currentLang) return;

    // Replace the /en or /es prefix in current URL
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'es') {
      segments[1] = newLang;
      router.push(segments.join('/') || `/${newLang}`);
    } else {
      router.push(`/${newLang}${pathname}`);
    }
  };

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-[#14181d] border border-panel-border text-xs font-bold text-stone shadow-inner">
      <button
        type="button"
        onClick={() => handleSwitch('en')}
        aria-label="Switch to English"
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
          currentLang === 'en'
            ? 'bg-gold text-ink font-extrabold shadow-sm'
            : 'text-stone hover:text-cream hover:bg-panel'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSwitch('es')}
        aria-label="Cambiar a Español"
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
          currentLang === 'es'
            ? 'bg-gold text-ink font-extrabold shadow-sm'
            : 'text-stone hover:text-cream hover:bg-panel'
        }`}
      >
        ES
      </button>
    </div>
  );
}
