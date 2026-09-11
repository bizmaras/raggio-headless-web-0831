'use client';

import { useState } from 'react';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  lang?: string;
  dict?: {
    nav?: {
      menu?: string;
      deals?: string;
      reviews?: string;
      catering?: string;
      hours_location?: string;
      order?: string;
    };
  };
}

export default function Header({ lang = 'en', dict }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: dict?.nav?.menu || 'Menu', href: `/${lang}#menu` },
    { name: dict?.nav?.deals || 'Deals & Specials', href: `/${lang}#deals` },
    { name: dict?.nav?.reviews || 'Reviews', href: `/${lang}#reviews` },
    { name: dict?.nav?.catering || 'Catering', href: `/${lang}#catering` },
    { name: dict?.nav?.hours_location || 'Hours & Location', href: `/${lang}#location` },
  ];

  const orderText = dict?.nav?.order || 'Order Online';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (typeof window === 'undefined') return;

    const isSamePage =
      window.location.pathname === `/${lang}` ||
      window.location.pathname === `/${lang}/` ||
      window.location.pathname === '/';

    if (isSamePage && href.includes('#')) {
      const hash = href.split('#')[1];
      const target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        const headerEl = document.querySelector('header');
        const railEl = document.querySelector('div.sticky');
        const headerH = headerEl ? headerEl.getBoundingClientRect().height : 80;
        const railH = railEl ? railEl.getBoundingClientRect().height : 0;
        const totalOffset = headerH + railH + 20;

        const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, targetTop - totalOffset),
          behavior: 'smooth',
        });
        window.history.pushState(null, '', href);
        return;
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full h-20 bg-ink/95 backdrop-blur-md border-b border-panel-border isolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          {/* LEFT: LOGO & MOBILE HOME BUTTON */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a href={`/${lang}`} className="flex items-center shrink-0" aria-label="Raggio Gourmet Pizza Home">
              <Image
                src="/images/raggio-logo.png"
                alt="Raggio Gourmet & Pizza"
                width={160}
                height={45}
                quality={85}
                sizes="(max-width: 640px) 48px, (max-width: 1024px) 120px, 160px"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain drop-shadow-md"
              />
            </a>

            {/* Mobile Only Home Button */}
            <a
              href={`/${lang}`}
              aria-label="Back to Home"
              className="flex lg:hidden items-center justify-center p-2.5 rounded-xl bg-[#14181d] border border-gold/60 text-gold shadow-[0_0_8px_rgba(212,175,55,0.12)] hover:bg-gold/20 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </a>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 rounded-lg text-base font-semibold text-cream hover:text-gold hover:bg-panel transition-all cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-5">
            <LanguageSwitcher currentLang={lang} />

            <a
              href="tel:3023690553"
              className="text-base font-bold text-cream hover:text-gold-bright transition-colors flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-panel border border-transparent hover:border-panel-border"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-ember/15 text-ember border border-ember/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span>(302) 369-0553</span>
            </a>
            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-6 py-2.5 text-base"
            >
              {orderText}
            </a>
          </div>

          {/* RIGHT: MOBILE CONTROLS */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher currentLang={lang} />

            <a
              href="tel:3023690553"
              aria-label="Call Raggio Gourmet Pizza"
              className="flex items-center justify-center p-2.5 rounded-xl bg-ember/15 border border-ember/50 text-ember shadow-[0_0_12px_rgba(229,77,46,0.2)] hover:bg-ember hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>

            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs px-3.5 py-2"
            >
              {orderText === 'Ordenar Ahora' ? 'Ordenar' : 'Order'}
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2.5 rounded-xl bg-[#14181d] border border-panel-border text-cream hover:text-gold hover:border-gold/60 transition-colors cursor-pointer active:scale-95"
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-panel-border bg-panel px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-lg font-bold text-cream hover:text-gold hover:bg-ink transition-colors cursor-pointer"
            >
              <span>{link.name}</span>
              {link.href === '#reviews' && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-gold/15 border border-gold/40 text-gold px-2.5 py-1 rounded-full">
                  ★ 4.2 (211+)
                </span>
              )}
            </a>
          ))}
          <div className="pt-4 border-t border-panel-border/50">
            <a
              href="tel:3023690553"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-ink text-gold font-bold text-base border border-gold/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {lang === 'es' ? 'Llamar al (302) 369-0553' : 'Call (302) 369-0553'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}