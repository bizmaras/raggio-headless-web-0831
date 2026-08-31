'use client';

import { Phone, MapPin, UtensilsCrossed, Tag, Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-panel-border h-[72px] px-4 md:px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">

        {/* Brand Logo & Schema Context */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gold rounded-lg">
          <img
            src="/images/raggio-logo.png"
            alt="Raggio Gourmet & Pizza - Newark, DE"
            width="160"
            height="40"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* SEO & GEO Optimized Navigation Bar */}
        <nav className="flex items-center gap-2 md:gap-4" aria-label="Main Navigation">
          <a
            href="#"
            className="text-stone hover:text-cream text-sm font-medium transition-colors hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Home className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>Home</span>
          </a>

          <a
            href="#menu"
            className="text-stone hover:text-cream text-sm font-medium transition-colors hidden sm:inline-block px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          >
            Menu
          </a>

          {/* High-Intent SEO/GEO Anchor: Deals & Specials */}
          <a
            href="#promotions"
            className="text-amber-400 hover:text-gold-bright text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 px-3.5 py-1.5 rounded-full hover:bg-amber-500/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
            title="View Current Pizza & Food Deals in Newark, DE"
          >
            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Deals &amp; Specials</span>
          </a>

          <a
            href="#catering"
            className="text-stone hover:text-cream text-sm font-medium transition-colors hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <UtensilsCrossed className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>Catering</span>
          </a>

          {/* Local Geo-Targeted Anchor */}
          <a
            href="#location"
            className="text-stone hover:text-cream text-sm font-medium transition-colors hidden xl:flex items-center gap-1.5 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <MapPin className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>Hours &amp; Location</span>
          </a>

          {/* Accessible Social Icons */}
          <div className="hidden md:flex items-center gap-1 border-l border-panel-border pl-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Raggio Pizza on Facebook" className="text-stone hover:text-cream p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.78 5.6c1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 3h-2.34v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>

            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Raggio Pizza on X" className="text-stone hover:text-cream p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Raggio Pizza on TikTok" className="text-stone hover:text-cream p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.86a6.37 6.37 0 0 0-1-.08A6.34 6.34 0 1 0 15.63 12V8.65a8.27 8.27 0 0 0 4.84 1.56V6.76a4.85 4.85 0 0 1-.88-.07z" />
              </svg>
            </a>

            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to Raggio Pizza on YouTube" className="text-stone hover:text-cream p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold transition-colors">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Connect with Raggio Pizza on LinkedIn" className="text-stone hover:text-cream p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-gold transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z" />
              </svg>
            </a>
          </div>

          {/* Direct Phone Call */}
          <a
            href="tel:+13023690553"
            aria-label="Call Raggio Gourmet & Pizza at 302-369-0553"
            className="text-stone hover:text-gold text-sm font-semibold transition-colors flex items-center gap-1.5 border-l border-panel-border pl-3 md:pl-4 focus:outline-none focus:ring-2 focus:ring-gold rounded-md"
          >
            <Phone className="w-4 h-4 text-gold" aria-hidden="true" />
            <span className="hidden xl:inline">(302) 369-0553</span>
          </a>

          {/* Conversion CTA */}
          <a
            href="https://phillystyleexpress.foodtecsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order online for delivery or pickup via FoodTec"
            className="bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-[#1c1408] font-extrabold text-xs md:text-sm px-4 py-2.5 rounded-full shadow-md hover:shadow-gold/30 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold"
          >
            Order Online
          </a>
        </nav>

      </div>
    </header>
  );
}