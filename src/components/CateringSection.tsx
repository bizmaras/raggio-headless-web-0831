'use client';

import { useState } from 'react';
import { CATERING_ITEMS } from '@/data/cateringData';
import { PlusCircle, Info } from 'lucide-react';
import ItemDetailModal from './ItemDetailModal';

export default function CateringSection() {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // FoodTec Catering Sipariş Linki
    const orderUrl = "https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/Catering";

    return (
        <section id="catering" className="border-t border-panel-border bg-ink-2 px-6 py-20 scroll-mt-[210px]">
            <div className="max-w-7xl mx-auto text-center mb-14">
                <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
                    Events & Group Orders
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
                    Catering by <span className="text-gold-bright">Raggio</span>
                </h2>
                <p className="text-stone text-lg max-w-2xl mx-auto">
                    Feeding a crowd in Newark? All catering trays are available in Half or Full sizes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {CATERING_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col justify-between p-6 rounded-2xl bg-panel border border-panel-border hover:border-gold/50 transition-colors duration-300"
                    >
                        <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <h3 className="text-xl font-bold text-cream">{item.name}</h3>
                                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-ink text-gold border border-panel-border uppercase tracking-wider whitespace-nowrap">
                                    {item.category}
                                </span>
                            </div>
                            <p className="text-stone text-sm leading-relaxed mb-5">
                                {item.description}
                            </p>

                            {/* View Details Butonu (Tıklanınca Modal Açılır) */}
                            <button
                                onClick={() => setSelectedItem(item)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-panel-border hover:border-gold bg-transparent transition-all duration-300 group mb-6"
                                aria-label={`View details for ${item.name}`}
                            >
                                <Info className="w-4 h-4 text-gold group-hover:text-gold-bright transition-colors" />
                                <span className="text-sm font-medium text-cream group-hover:text-gold-bright transition-colors">
                                    View Details & Ingredients
                                </span>
                            </button>
                        </div>

                        {/* Fiyat ve Sipariş Butonları (Doğrudan FoodTec'e Yönlendirir) */}
                        <div className="pt-5 border-t border-panel-border/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <a
                                href={orderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between px-4 py-2.5 rounded-full border border-panel-border bg-transparent hover:border-gold transition-colors duration-300"
                            >
                                <div className="flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4 text-stone group-hover:text-gold transition-colors" />
                                    <span className="text-xs font-medium text-stone group-hover:text-cream transition-colors">
                                        Half Tray <span className="opacity-50">({item.servesHalf})</span>
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gold-bright">
                                    {item.halfTrayPrice}
                                </span>
                            </a>

                            <a
                                href={orderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between px-4 py-2.5 rounded-full border border-panel-border bg-transparent hover:border-gold transition-colors duration-300"
                            >
                                <div className="flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4 text-stone group-hover:text-gold transition-colors" />
                                    <span className="text-xs font-medium text-stone group-hover:text-cream transition-colors">
                                        Full Tray <span className="opacity-50">({item.servesFull})</span>
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gold-bright">
                                    {item.fullTrayPrice}
                                </span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-panel border border-panel-border max-w-2xl mx-auto text-center">
                <h4 className="text-lg font-bold text-cream">Need a Custom Catering Package?</h4>
                <p className="text-stone text-sm mt-2 mb-6">
                    We accommodate special event requests, corporate lunches, and custom portions.
                </p>
                <a
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold rounded-full bg-gold text-ink hover:bg-gold-bright transition-colors duration-300"
                >
                    Order Catering Online via FoodTec
                </a>
            </div>

            {/* Tıklanan Öğenin Detay Penceresi (Modal) */}
            {selectedItem && (
                <ItemDetailModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    name={selectedItem.name}
                    price={parseFloat(selectedItem.halfTrayPrice.replace(/[^0-9.]/g, '')) || 0}
                    description={selectedItem.description}
                />
            )}
        </section>
    );
}