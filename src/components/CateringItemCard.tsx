'use client';

import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Info, X, BookOpen, ExternalLink } from 'lucide-react';

interface CateringItemCardProps {
  name: string;
  desc?: string;
  half: string | number;
  full: string | number;
  servesHalf?: string;
  servesFull?: string;
}

export default function CateringItemCard({
  name,
  desc,
  half,
  full,
  servesHalf = '8-10',
  servesFull = '15-20',
}: CateringItemCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [addedSize, setAddedSize] = useState<'half' | 'full' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parsePrice = (priceVal: string | number): number => {
    if (typeof priceVal === 'number') return priceVal;
    return parseFloat(priceVal.replace(/[^0-9.]/g, '')) || 0;
  };

  const numericHalf = parsePrice(half);
  const numericFull = parsePrice(full);

  const handleAdd = (size: 'half' | 'full') => {
    const price = size === 'half' ? numericHalf : numericFull;
    const label = size === 'half' ? 'Half Tray' : 'Full Tray';
    addToCart({ name: `${name} (${label})`, price });
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1200);
  };

  return (
    <>
      {/* MAIN CATERING CARD */}
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
          {/* Half & Full Tray Order Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAdd('half')}
              className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer ${addedSize === 'half'
                  ? 'bg-gold border-gold font-extrabold'
                  : 'bg-ink border-panel-border hover:border-gold'
                }`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-wider ${addedSize === 'half' ? 'text-ink' : 'text-stone'
                  }`}
              >
                {addedSize === 'half' ? 'Added!' : `HALF (${servesHalf})`}
              </div>
              <div
                className={`text-sm font-extrabold ${addedSize === 'half' ? 'text-ink' : 'text-gold'
                  }`}
              >
                ${numericHalf.toFixed(2)}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAdd('full')}
              className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer ${addedSize === 'full'
                  ? 'bg-gold border-gold font-extrabold'
                  : 'bg-ink border-panel-border hover:border-gold'
                }`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-wider ${addedSize === 'full' ? 'text-ink' : 'text-stone'
                  }`}
              >
                {addedSize === 'full' ? 'Added!' : `FULL (${servesFull})`}
              </div>
              <div
                className={`text-sm font-extrabold ${addedSize === 'full' ? 'text-ink' : 'text-gold'
                  }`}
              >
                ${numericFull.toFixed(2)}
              </div>
            </button>
          </div>

          {/* View Details & Ingredients Trigger */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-black/40 hover:bg-black/70 border border-panel-border hover:border-gold/50 text-gold hover:text-gold-bright py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Info className="w-4 h-4 text-gold" />
            <span>View Details & Ingredients</span>
          </button>
        </div>
      </div>

      {/* DETAILS & INGREDIENTS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#1c2127] border border-panel-border rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">

            {/* Modal Left Branding Side */}
            <div className="md:col-span-5 bg-[#14181d] p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-panel-border">
              <BookOpen className="w-12 h-12 text-gold mb-3 opacity-90" />
              <h5 className="text-xs font-mono font-bold tracking-widest text-gold uppercase">
                Raggio Gourmet
              </h5>
              <p className="text-[11px] text-stone mt-1">Freshly Prepared</p>
            </div>

            {/* Modal Right Content Side */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 text-stone hover:text-cream border border-panel-border hover:border-gold transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
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

              {/* Order Buttons Inside Modal */}
              <div className="space-y-3 pt-4 border-t border-panel-border/50">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAdd('half');
                      setIsModalOpen(false);
                    }}
                    className="bg-gold hover:bg-gold-bright text-ink font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Order Half (${numericHalf.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleAdd('full');
                      setIsModalOpen(false);
                    }}
                    className="bg-gold hover:bg-gold-bright text-ink font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Order Full (${numericFull.toFixed(2)})
                  </button>
                </div>

                <a
                  href="https://phillystyleexpress.foodtecsolutions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-panel hover:bg-black border border-gold/40 text-cream font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <span>Order Online</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}