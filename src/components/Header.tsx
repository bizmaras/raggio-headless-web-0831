'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'Deals & Specials', href: '#deals' },
    { name: 'Catering', href: '#catering' },
    { name: 'Hours & Location', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-ink/95 backdrop-blur-md border-b border-panel-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* LEFT: LOGO (Büyütüldü) & MOBILE HOME BUTTON */}
          <div className="flex items-center gap-5 sm:gap-6">
            <a href="#" className="flex items-center shrink-0" aria-label="Raggio Gourmet Pizza Home">
              <Image
                src="/images/raggio-logo.png"
                alt="Raggio Gourmet & Pizza"
                width={200}
                height={64}
                priority
                quality={90}
                /* h-10'dan h-14 (mobil) ve h-16 (masaüstü) seviyesine çıkarıldı */
                className="h-14 md:h-16 w-auto object-contain drop-shadow-md"
              />
            </a>

            {/* Sadece Mobilde Görünen Home Butonu */}
            <a
              href="#"
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
          <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
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
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:3023690553"
              className="text-sm font-bold text-cream hover:text-gold transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (302) 369-0553
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

          {/* RIGHT: MOBILE CONTROLS */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="tel:3023690553"
              aria-label="Call Raggio Gourmet Pizza"
              className="flex items-center justify-center p-2.5 rounded-xl bg-[#14181d] border border-gold/60 text-gold shadow-[0_0_8px_rgba(212,175,55,0.12)] hover:bg-gold hover:text-ink transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>

            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-bright text-ink font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
            >
              Order
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2.5 rounded-xl bg-[#14181d] border border-panel-border text-cream hover:text-gold hover:border-gold/60 transition-colors cursor-pointer active:scale-95"
              aria-label="Toggle Menu"
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call (302) 369-0553
            </a>
          </div>
        </div>
      )}
    </header>
  );
}