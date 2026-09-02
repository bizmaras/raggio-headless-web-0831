'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-ink/95 backdrop-blur-md border-b border-panel-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">

        {/* Logo and Mobile Home Button Container */}
        <div className="flex items-center gap-3">
          {/* Main Brand Logo */}
          <Link href="/" className="flex items-center focus:outline-none" aria-label="Raggio Gourmet Home">
            <span className="text-xl font-bold text-cream tracking-wider">
              RAGGIO
            </span>
          </Link>

          {/* Mobile-Only Home Navigation Button */}
          <Link
            href="/"
            aria-label="Navigate to Home"
            className="md:hidden flex items-center justify-center p-2 rounded-full bg-[#14181d] border border-panel-border text-stone-300 hover:text-gold hover:border-gold transition-colors active:scale-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        </div>

        {/* Right Section (Cart, etc.) */}
        <div className="flex items-center">
          {/* Mevcut sepet (CartDrawer) butonunuz burada yer alacak */}
        </div>

      </div>
    </header>
  );
}