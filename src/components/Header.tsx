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

          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <img
              src="/images/raggio-logo.png"
              alt="Raggio Gourmet & Pizza"
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* DESKTOP NAV (Masaüstü Düzeni - Aynen Korundu) */}
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

          {/* DESKTOP RIGHT ACTIONS (Telefon & Buton) */}
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

          {/* MOBILE ONLY CONTROLS (Sadece Mobil / Tablet Ekranında Görünür) */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-ink font-extrabold text-xs px-3 py-2 rounded-lg"
            >
              Order
            </a>

            {/* Hamburger Menü Butonu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-panel border border-panel-border text-cream hover:text-gold transition-colors"
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

      {/* MOBIL AÇILIR MENÜ (Sadece Hamburger İkonuna Basılınca Açılır) */}
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
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-ink text-gold font-bold text-sm border border-panel-border"
            >
              📞 Call (302) 369-0553
            </a>
          </div>
        </div>
      )}
    </header>
  );
}