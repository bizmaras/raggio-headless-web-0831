'use client';

import { MapPin } from 'lucide-react';
import CateringItemCard from './CateringItemCard';
import * as cateringModule from '../data/cateringData';

export default function CateringSection() {
    const rawItems: any[] =
        (cateringModule as any).CATERING_ITEMS ||
        (cateringModule as any).cateringItems ||
        (cateringModule as any).default ||
        [];

    const categoriesMap: Record<string, any[]> = {};
    rawItems.forEach((item) => {
        const catName = item.category || 'Other Catering';
        if (!categoriesMap[catName]) {
            categoriesMap[catName] = [];
        }
        categoriesMap[catName].push(item);
    });

    const categories = Object.keys(categoriesMap);

    return (
        <section id="catering" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[210px]">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-1.5 text-gold mb-2 opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-widest uppercase">Newark, Delaware</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright mb-3">
                    Catering by Raggio
                </h2>
                <p className="text-stone text-sm md:text-base leading-relaxed">
                    Feeding a crowd in Newark? All catering trays are available in Half or Full sizes.
                </p>
            </div>

            {categories.map((categoryName) => {
                const items = categoriesMap[categoryName];

                return (
                    <div key={categoryName} className="mb-16 scroll-mt-[210px]">
                        <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-panel-border text-cream flex items-center justify-between">
                            <span>{categoryName}</span>
                            <span className="text-xs font-normal text-gold-bright">
                                {items.length} items
                            </span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <CateringItemCard
                                    key={item.id || item.name}
                                    name={item.name}
                                    desc={item.description}
                                    half={item.halfTrayPrice}
                                    full={item.fullTrayPrice}
                                    servesHalf={item.servesHalf}
                                    servesFull={item.servesFull}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}