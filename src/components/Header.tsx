'use client';

import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Menu', href: '#menu' },
    { name: 'Deals & Specials', href: '#deals' },
    { name: 'Catering', href: '#catering' },
    { name: 'Hours & Location', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-ink/95 backdrop-blur-md border-b border-panel-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Live GEO Badge */}
          <a href="#" className="flex items-center gap-3">
            <img
              src="/images/raggio-logo.png"
              alt="Raggio Gourmet & Pizza"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-stone hover:text-gold hover:bg-panel transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:3023690553"
              className="text-sm font-bold text-cream hover:text-gold transition-colors flex items-center gap-2"
            >
              📞 (302) 369-0553
            </a>
            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-bright text-ink font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
            >
              Order Online
            </a>
          </div>

          {/* MOBILE ONLY ENHANCED CONTROLS (Utilizing Empty Space) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Call Button */}
            <a
              href="tel:3023690553"
              aria-label="Call Raggio Gourmet Pizza"
              className="p-2 rounded-xl bg-panel border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all flex items-center justify-center cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>

            {/* Quick Order Button */}
            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-ink font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md"
            >
              Order
            </a>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-panel border border-panel-border text-cream hover:text-gold transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-panel-border bg-panel px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-base font-semibold text-cream hover:text-gold hover:bg-ink transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-panel-border/50">
            <a
              href="tel:3023690553"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-ink text-gold font-bold text-sm border border-gold/30"
            >
              📞 Call (302) 369-0553
            </a>
          </div>
        </div>
      )}
    </header>
  );
}