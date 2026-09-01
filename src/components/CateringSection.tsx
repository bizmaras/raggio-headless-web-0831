'use client';

import { MapPin } from 'lucide-react';
import * as cateringModule from '@/data/cateringData';
import CateringItemCard from '@/components/CateringItemCard';

interface CateringItem {
    name?: string;
    desc?: string;
    description?: string;
    half?: number | string;
    full?: number | string;
}

interface CateringCategory {
    category?: string;
    name?: string;
    items?: CateringItem[];
}

export default function CateringSection() {
    // Support named exports (cateringCategories, cateringData) or default export
    const rawCategories: CateringCategory[] =
        (cateringModule as { cateringCategories?: CateringCategory[] }).cateringCategories ||
        (cateringModule as { cateringData?: CateringCategory[] }).cateringData ||
        (cateringModule as { default?: CateringCategory[] }).default ||
        [];

    return (
        <section id="catering" className="bg-ink border-t border-panel-border pt-24 pb-32 px-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-1.5 text-gold mb-3 opacity-90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">Newark, Delaware</span>
                    </div>
                    <span className="inline-block text-xs font-mono tracking-widest text-gold bg-black/50 border border-gold/30 px-3.5 py-1 rounded-full mb-3 uppercase">
                        EVENTS & GROUP ORDERS
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-cream mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        Catering by <span className="text-gold">Raggio</span>
                    </h2>
                    <p className="text-stone text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Feeding a crowd in Newark? All catering trays are available in Half or Full sizes with direct online ordering.
                    </p>
                </div>

                {/* Dynamic Catering Categories Loop */}
                {rawCategories.map((cat: CateringCategory, catIdx: number) => {
                    const categoryName = cat.category || cat.name || 'Catering';
                    const itemsList = cat.items || [];

                    return (
                        <div key={catIdx} className="mb-16">
                            <h3 className="text-2xl font-bold text-cream mb-6 border-b border-panel-border pb-3 flex items-center justify-between">
                                <span>{categoryName}</span>
                                <span className="text-xs font-mono text-gold font-normal">Half / Full Tray</span>
                            </h3>

                            {/* Dynamic Catering Items Grid with Safe Type Parsing */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {itemsList.map((item: CateringItem, itemIdx: number) => {
                                    const itemDescription = item.desc || item.description || '';
                                    const halfPrice =
                                        typeof item.half === 'number'
                                            ? item.half
                                            : parseFloat(String(item.half || 0)) || 0;
                                    const fullPrice =
                                        typeof item.full === 'number'
                                            ? item.full
                                            : parseFloat(String(item.full || 0)) || 0;

                                    return (
                                        <CateringItemCard
                                            key={itemIdx}
                                            name={item.name || 'Catering Item'}
                                            desc={itemDescription}
                                            half={halfPrice}
                                            full={fullPrice}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Full Menu PDF Download CTA */}
                <div className="text-center mt-16">
                    <a
                        href="/raggio-full-menu.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gold hover:bg-gold-bright text-ink font-extrabold px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer text-sm uppercase tracking-wider"
                    >
                        Download Full Menu PDF
                    </a>
                </div>

            </div>
        </section>
    );
}