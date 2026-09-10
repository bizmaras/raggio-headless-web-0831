'use client';

import { useState, useEffect } from 'react';

interface StickyMobileBarProps {
  dict?: {
    sticky_bar?: {
      call?: string;
      order_online?: string;
    };
  };
}

export default function StickyMobileBar({ dict }: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  const orderOnlineText = dict?.sticky_bar?.order_online || 'Order Online';
  const phoneText = dict?.sticky_bar?.call || '(302) 369-0553';

  useEffect(() => {
    let lastState = false;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 180;
          if (shouldShow !== lastState) {
            lastState = shouldShow;
            setIsVisible(shouldShow);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-label="Quick order mobile navigation"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-md border-t border-panel-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]' : 'translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <a
          href="tel:3023690553"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl btn-ember text-white font-bold text-sm active:scale-95 transition-all shadow-md"
          aria-label="Call Raggio Gourmet Pizza at (302) 369-0553"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white shrink-0"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{phoneText}</span>
        </a>

        <a
          href="https://phillystyleexpress.foodtecsolutions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-gold py-2.5 px-4 text-sm"
          aria-label="Order Online via FoodTec"
        >
          <span>{orderOnlineText}</span>
          <svg
            className="w-4 h-4 text-ink shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
