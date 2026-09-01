'use client';

import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

interface CateringItemCardProps {
  name: string;
  desc?: string;
  half: number;
  full: number;
}

export default function CateringItemCard({ name, desc, half, full }: CateringItemCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [addedSize, setAddedSize] = useState<'half' | 'full' | null>(null);

  const handleAdd = (size: 'half' | 'full') => {
    const price = size === 'half' ? half : full;
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

      {/* Half Tray & Full Tray Selection Buttons */}
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
              {addedSize === 'half' ? 'Added!' : 'Half Tray'}
            </div>
            <div className="text-sm font-extrabold text-gold">${half.toFixed(2)}</div>
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
              {addedSize === 'full' ? 'Added!' : 'Full Tray'}
            </div>
            <div className="text-sm font-extrabold text-gold">${full.toFixed(2)}</div>
          </button>
        </div>
      </div>
    </div>
  );
}