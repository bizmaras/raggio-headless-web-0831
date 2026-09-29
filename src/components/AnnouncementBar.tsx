'use client';

/**
 * AnnouncementBar — replaces WelcomePopup.tsx
 *
 * Why:
 * - The old modal fired 3s after load, covered the page on mobile (Google's
 *   "intrusive interstitial" pattern) and closed with a confirmshaming link
 *   ("No thanks, I'll pay full price.").
 * - It collected name/email/phone into a Google Apps Script, THEN told the user to
 *   register again on FoodTec to actually get the 20% — which FoodTec already
 *   offers in its own "SUBSCRIBE AND GET 20% OFF — 20% Off on your first web order"
 *   popup. Customers were asked for the same data twice, on two brands.
 * - This bar collects nothing. It states the real offer, where it is claimed, and
 *   can be dismissed with a neutral "Dismiss" control.
 *
 * Zero-CLS dismissal: an inline script (runs during HTML parse, before paint)
 * sets html[data-offer-dismissed] so returning visitors never see a flash.
 */

import { useCallback } from 'react';
import { ORDER_LINKS } from '@/config/ordering';

const STORAGE_KEY = 'raggio_offer_bar_dismissed_v1';

const COPY = {
  en: {
    label: 'New to online ordering?',
    offer: '20% off your first web order',
    how: 'when you sign up on our ordering page.',
    cta: 'Start my order',
    dismiss: 'Dismiss offer banner',
  },
  es: {
    label: '¿Primera vez ordenando en línea?',
    offer: '20% de descuento en tu primer pedido web',
    how: 'al registrarte en nuestra página de pedidos.',
    cta: 'Empezar pedido',
    dismiss: 'Cerrar aviso de oferta',
  },
} as const;

export default function AnnouncementBar({ lang = 'en' }: { lang?: string }) {
  const t = lang === 'es' ? COPY.es : COPY.en;

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* private mode — fall through */
    }
    document.documentElement.setAttribute('data-offer-dismissed', '1');
  }, []);

  return (
    <>
      <script
        // Runs before the bar is painted; avoids flash + layout shift.
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem('${STORAGE_KEY}'))document.documentElement.setAttribute('data-offer-dismissed','1')}catch(e){}`,
        }}
      />
      <div
        role="region"
        aria-label={t.label}
        className="offer-bar relative z-[60] w-full bg-sand text-espresso border-b border-hairline"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-10 py-2 pl-3 pr-11 sm:px-12 flex items-center justify-center gap-3 text-[13px] sm:text-sm leading-snug">
          <p className="text-center">
            <span className="hidden sm:inline text-cocoa">{t.label} </span>
            <strong className="font-semibold">{t.offer}</strong>{' '}
            <span className="text-cocoa">{t.how}</span>{' '}
            <a
              href={ORDER_LINKS.pizza}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="font-semibold underline decoration-gold-deep/50 underline-offset-4 hover:decoration-gold-deep whitespace-nowrap"
            >
              {t.cta} →
            </a>
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t.dismiss}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-cocoa hover:text-espresso hover:bg-parchment transition-colors cursor-pointer"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
