'use client';

import { useState } from 'react';
import { ShoppingBag, Plus, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface CateringItemCardProps {
  name: string;
  desc?: string;
  half: number;
  full: number;
}

type TraySize = 'half' | 'full';

export default function CateringItemCard({ name, desc, half, full }: CateringItemCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState<TraySize | null>(null);

  const handleAdd = (size: TraySize) => {
    const price = size === 'half' ? half : full;
    const label = size === 'half' ? 'Half Tray' : 'Full Tray';
    addToCart({ name: `${name} (${label})`, price });
    setAdded(size);
    setTimeout(() => setAdded(null), 1400);
  };

  return (
    <div className="group bg-panel border border-panel-border hover:border-gold/50 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,161,92,0.12)] flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="font-bold text-cream text-base mb-1 group-hover:text-gold transition-colors duration-200">
          {name}
        </h4>
        {desc && <p className="text-xs text-stone leading-relaxed">{desc}</p>}
      </div>

      <div className="flex gap-3">
        {/* Half Tray Selection Button */}
        <button
          type="button"
          onClick={() => handleAdd('half')}
          aria-label={`Add Half Tray of ${name} for $${half.toFixed(2)}`}
          className={`
            relative flex-1 rounded-lg p-3 text-center border transition-all duration-200 min-h-[52px]
            overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50
            ${added === 'half'
              ? 'bg-gold border-gold scale-95'
              : 'bg-ink border-panel-border hover:bg-gold/10 hover:border-gold hover:scale-[1.02] active:scale-95'
            }
          `}
        >
          {added === 'half' ? (
            <span className="flex flex-col items-center justify-center gap-0.5 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-ink mx-auto" />
              <span className="text-[9px] font-bold text-ink uppercase tracking-wider">Added!</span>
            </span>
          ) : (
            <>
              <p className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 group-hover:text-gold transition-colors">
                Half Tray
              </p>
              <p className="text-gold font-extrabold text-sm">${half.toFixed(2)}</p>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <Plus className="w-3.5 h-3.5 text-gold absolute top-1 right-1 opacity-80" />
              </span>
            </>
          )}
        </button>

        {/* Full Tray Selection Button */}
        <button
          type="button"
          onClick={() => handleAdd('full')}
          aria-label={`Add Full Tray of ${name} for $${full.toFixed(2)}`}
          className={`
            relative flex-1 rounded-lg p-3 text-center border transition-all duration-200 min-h-[52px]
            overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50
            ${added === 'full'
              ? 'bg-gold border-gold scale-95'
              : 'bg-ink border-panel-border hover:bg-gold/10 hover:border-gold hover:scale-[1.02] active:scale-95'
            }
          `}
        >
          {added === 'full' ? (
            <span className="flex flex-col items-center justify-center gap-0.5 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-ink mx-auto" />
              <span className="text-[9px] font-bold text-ink uppercase tracking-wider">Added!</span>
            </span>
          ) : (
            <>
              <p className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 group-hover:text-gold transition-colors">
                Full Tray
              </p>
              <p className="text-gold font-extrabold text-sm">${full.toFixed(2)}</p>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <Plus className="w-3.5 h-3.5 text-gold absolute top-1 right-1 opacity-80" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Hover Cart Hint */}
      <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <ShoppingBag className="w-3.5 h-3.5 text-gold" />
        <span className="text-[11px] text-stone font-medium">Click Half or Full Tray to add to order</span>
      </div>
    </div>
  );
}