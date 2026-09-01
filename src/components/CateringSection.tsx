'use client';

import { MapPin } from 'lucide-react';
import * as cateringModule from '../data/cateringData';
import CateringItemCard from './CateringItemCard';

interface CateringItem {
    name: string;
    desc?: string;
    description?: string;
    half: number | string;
    full: number | string;
}

interface CateringCategory {
    category: string;
    items: CateringItem[];
}

export default function CateringSection() {
    // Defensive export check supporting named (cateringCategories / cateringData) or default exports
    const categories: CateringCategory[] =
        (cateringModule as { cateringCategories?: CateringCategory[] }).cateringCategories ||
        (cateringModule as { cateringData?: CateringCategory[] }).cateringData ||
        (cateringModule as { default?: CateringCategory[] }).default ||
        [];

    return (
        <section id="catering" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[210px]">
            {/* Section Header */}
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

            {/* Dynamic Catering Categories Grid */}
            {categories.map((cat, catIdx) => (
                <div key={catIdx} className="mb-16 scroll-mt-[210px]">
                    <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-panel-border text-cream flex items-center justify-between">
                        <span>{cat.category}</span>
                        <span className="text-xs font-normal text-gold-bright">
                            {cat.items?.length || 0} items
                        </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cat.items?.map((item, itemIdx) => {
                            const halfPrice = typeof item.half === 'number' ? item.half : parseFloat(String(item.half)) || 0;
                            const fullPrice = typeof item.full === 'number' ? item.full : parseFloat(String(item.full)) || 0;
                            const description = item.desc || item.description || '';

                            return (
                                <CateringItemCard
                                    key={itemIdx}
                                    name={item.name}
                                    desc={description}
                                    half={halfPrice}
                                    full={fullPrice}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </section>
    );
}