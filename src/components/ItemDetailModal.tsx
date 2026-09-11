'use client';

import { X, Utensils, ExternalLink } from 'lucide-react';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  price: number;
  description: string;
  image?: string;
  ingredients?: string[];
}

export default function ItemDetailModal({
  isOpen,
  onClose,
  name,
  price,
  description,
  image,
  ingredients = ['Grande Mozzarella', 'Fresh Garlic', 'Extra Virgin Olive Oil', 'Signature House Sauce']
}: ItemDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        className="relative w-full max-w-2xl bg-ink-2 border border-panel-border rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-stone hover:text-cream hover:bg-black transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Container */}
        <div className="flex flex-col md:flex-row">
          {/* Left: Product Image */}
          <div className="md:w-1/2 h-56 md:h-auto relative bg-panel overflow-hidden">
            <img
              src={image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop'}
              alt={name}
              className="w-full h-full object-cover saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent md:hidden" />
          </div>

          {/* Right: Product Details & Ingredients */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 id="item-modal-title" className="text-2xl font-extrabold text-cream leading-tight">
                  {name}
                </h3>
                <span className="text-xl font-bold text-gold-bright shrink-0">
                  ${price.toFixed(2)}
                </span>
              </div>

              <p className="text-stone text-xs md:text-sm leading-relaxed mb-6">
                {description || 'Prepared fresh daily with premium artisanal ingredients.'}
              </p>

              {/* Ingredients List */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold text-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  Key Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-panel border border-panel-border text-cream/90 px-2.5 py-1 rounded-md"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Order CTA */}
            <a
              href="https://phillystyleexpress.foodtecsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-[#1c1408] font-extrabold text-sm py-3 rounded-xl shadow-lg hover:shadow-gold/30 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              Order Online
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}