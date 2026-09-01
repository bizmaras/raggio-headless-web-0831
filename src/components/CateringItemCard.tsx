'use client';

import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

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
  servesHalf,
  servesFull,
}: CateringItemCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [addedSize, setAddedSize] = useState<'half' | 'full' | null>(null);

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
    <div className="bg-panel border border-panel-border hover:border-gold/50 rounded-xl p-5 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-cream">{name}</h4>
        </div>
        {desc && (
          <p className="text-sm text-stone mb-4 line-clamp-2">
            {desc}
          </p>
        )}
      </div>

      <div className="mt-auto space-y-2 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleAdd('half')}
            className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer ${addedSize === 'half'
                ? 'bg-gold text-ink border-gold font-extrabold'
                : 'bg-ink border-panel-border hover:border-gold text-cream'
              }`}
          >
            <div className="text-[10px] text-stone font-bold uppercase tracking-wider">
              {addedSize === 'half' ? 'Added!' : `Half (${servesHalf || '8-10'})`}
            </div>
            <div className="text-sm font-extrabold text-gold">
              ${numericHalf.toFixed(2)}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAdd('full')}
            className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer ${addedSize === 'full'
                ? 'bg-gold text-ink border-gold font-extrabold'
                : 'bg-ink border-panel-border hover:border-gold text-cream'
              }`}
          >
            <div className="text-[10px] text-stone font-bold uppercase tracking-wider">
              {addedSize === 'full' ? 'Added!' : `Full (${servesFull || '15-20'})`}
            </div>
            <div className="text-sm font-extrabold text-gold">
              ${numericFull.toFixed(2)}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}