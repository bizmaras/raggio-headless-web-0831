'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CateringItemCardProps {
  name: string;
  desc?: string;
  half?: string | number;
  full?: string | number;
  servesHalf?: string;
  servesFull?: string;
  halfLabel?: string;
  fullLabel?: string;
}

const FOODTEC_URL = 'https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/Catering';

export default function CateringItemCard({
  name,
  desc,
  half,
  full,
  servesHalf = '8-10',
  servesFull = '15-20',
  halfLabel = 'HALF',
  fullLabel = 'FULL',
}: CateringItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const parsePrice = (priceVal?: string | number): number => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return priceVal;
    return parseFloat(String(priceVal).replace(/[^0-9.]/g, '')) || 0;
  };

  const numericHalf = parsePrice(half);
  const numericFull = parsePrice(full);

  return (
    <>
      <div className="bg-panel border border-panel-border hover:border-gold/50 rounded-xl p-5 transition-all flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-bold text-cream">{name}</h4>
          </div>
          <p className="text-sm text-stone mb-4 line-clamp-2">
            {desc || (halfLabel === 'MEDIANO' 
              ? 'Preparado fresco al momento con ingredientes de primera calidad para sus eventos.' 
              : 'Freshly prepared with premium ingredients for your events.')}
          </p>
        </div>

        <div className="mt-auto space-y-3 pt-2">
          {/* Direct External Links to FoodTec Ordering */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={FOODTEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg border bg-ink border-panel-border hover:border-gold hover:bg-gold/10 transition-all text-center cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-stone group-hover:text-gold uppercase tracking-wider">
                {halfLabel} ({servesHalf})
              </div>
              <div className="text-sm font-extrabold text-gold">
                ${numericHalf.toFixed(2)}
              </div>
            </a>

            <a
              href={FOODTEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg border bg-ink border-panel-border hover:border-gold hover:bg-gold/10 transition-all text-center cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-stone group-hover:text-gold uppercase tracking-wider">
                {fullLabel} ({servesFull})
              </div>
              <div className="text-sm font-extrabold text-gold">
                ${numericFull.toFixed(2)}
              </div>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full text-center text-xs font-semibold text-gold hover:text-gold-bright py-1.5 transition-colors cursor-pointer"
          >
            {halfLabel === 'MEDIANO' ? 'Ver Detalles y Porciones' : 'View Details & Servings'}
          </button>
        </div>
      </div>

      {/* CATERING MODAL DIALOG */}
      {isModalOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-panel border border-panel-border rounded-2xl p-6 sm:p-8 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label={halfLabel === 'MEDIANO' ? 'Cerrar detalles de catering' : 'Close catering details'}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-ink/90 text-stone hover:text-cream flex items-center justify-center border border-panel-border cursor-pointer transition-colors shadow-md"
            >
              ✕
            </button>

            <h3 className="text-xl sm:text-2xl font-extrabold text-cream mb-2">
              {name}
            </h3>

            <p className="text-stone text-sm leading-relaxed mb-6">
              {desc || (halfLabel === 'MEDIANO'
                ? 'Nuestras bandejas de catering se preparan frescas para reuniones corporativas, celebraciones familiares y eventos.'
                : 'Our catering trays are made fresh for corporate meetings, family gatherings, and university tailgates.')}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-ink border border-panel-border text-center">
                <span className="text-xs font-bold text-stone uppercase tracking-wider block mb-1">
                  {halfLabel}
                </span>
                <span className="text-xl font-extrabold text-gold block mb-1">
                  ${numericHalf.toFixed(2)}
                </span>
                <span className="text-xs text-cream/70 font-medium">
                  {halfLabel === 'MEDIANO' ? `Sirve ${servesHalf} personas` : `Serves ${servesHalf} guests`}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-ink border border-panel-border text-center">
                <span className="text-xs font-bold text-stone uppercase tracking-wider block mb-1">
                  {fullLabel}
                </span>
                <span className="text-xl font-extrabold text-gold block mb-1">
                  ${numericFull.toFixed(2)}
                </span>
                <span className="text-xs text-cream/70 font-medium">
                  {fullLabel === 'COMPLETO' ? `Sirve ${servesFull} personas` : `Serves ${servesFull} guests`}
                </span>
              </div>
            </div>

            <a
              href={FOODTEC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gold hover:bg-gold-bright text-ink font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-center text-sm sm:text-base shadow-lg active:scale-[0.98]"
            >
              {halfLabel === 'MEDIANO' ? 'Ordenar Catering en Línea' : 'Order Catering Online'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}