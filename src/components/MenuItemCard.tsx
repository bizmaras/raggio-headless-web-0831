'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import ItemDetailModal from './ItemDetailModal';

interface MenuItemCardProps {
  name: string;
  price: number;
  description: string;
  image?: string;
}

export default function MenuItemCard({ name, price, description, image }: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-panel/70 border border-panel-border hover:border-gold/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-lg font-bold text-cream leading-snug">
              {name}
            </h4>
            <span className="text-base font-bold text-gold-bright shrink-0">
              ${price.toFixed(2)}
            </span>
          </div>

          <p className="text-stone text-xs line-clamp-2 leading-relaxed mb-6">
            {description || 'Prepared fresh with premium artisanal ingredients.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 bg-ink-2 hover:bg-panel border border-panel-border hover:border-gold-deep text-cream text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-gold" />
          View Details &amp; Ingredients
        </button>
      </div>

      <ItemDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        price={price}
        description={description}
        image={image}
      />
    </>
  );
}