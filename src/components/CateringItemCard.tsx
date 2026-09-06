'use client';

import { useState } from 'react';

interface CateringItemCardProps {
  name: string;
  desc?: string;
  half: string | number;
  full: string | number;
  servesHalf?: string;
  servesFull?: string;
}

const FOODTEC_URL = 'https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/Catering';

export default function CateringItemCard({
  name,
  desc,
  half,
  full,
  servesHalf = '8-10',
  servesFull = '15-20',
}: CateringItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parsePrice = (priceVal: string | number): number => {
    if (typeof priceVal === 'number') return priceVal;
    return parseFloat(priceVal.replace(/[^0-9.]/g, '')) || 0;
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
            {desc || 'Freshly prepared with premium ingredients for your events.'}
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
                HALF ({servesHalf})
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
                FULL ({servesFull})
              </div>
              <div className="text-sm font-extrabold text-gold">
                ${numericFull.toFixed(2)}
              </div>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-black/40 hover:bg-black/70 border border-panel-border hover:border-gold/50 text-gold hover:text-gold-bright py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            {/* Inline Info Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gold">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
            <span>View Details & Ingredients</span>
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#1c2127] border border-panel-border rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 bg-[#14181d] p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-panel-border">
              {/* Inline BookOpen Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mb-3 opacity-90">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <h5 className="text-xs font-mono font-bold tracking-widest text-gold uppercase">
                Raggio Gourmet
              </h5>
              <p className="text-[11px] text-stone mt-1">Freshly Prepared</p>
            </div>

            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close details" // SEO ve Lighthouse 100/100 için eklendi
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 text-stone hover:text-cream border border-panel-border hover:border-gold transition-all cursor-pointer"
              >
                {/* Inline X Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>

              <div>
                <div className="flex items-baseline justify-between gap-2 pr-8 mb-2">
                  <h3 className="text-2xl font-extrabold text-cream">{name}</h3>
                </div>

                <div className="flex gap-4 text-xs font-mono text-gold mb-4">
                  <span>Half Tray: ${numericHalf.toFixed(2)}</span>
                  <span>|</span>
                  <span>Full Tray: ${numericFull.toFixed(2)}</span>
                </div>

                <p className="text-stone text-sm leading-relaxed mb-6">
                  {desc || 'Freshly prepared with premium quality ingredients according to traditional deck-oven standards.'}
                </p>
              </div>

              <div className="pt-4 border-t border-panel-border/50">
                <a
                  href={FOODTEC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-bright text-ink font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                >
                  <span>Order Online via FoodTec</span>
                  {/* Inline ExternalLink Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-ink">
                    <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}