'use client';

import { MapPin } from 'lucide-react';

const cateringCategories = [
    {
        category: "Subs & Trays",
        items: [
            { name: 'Sub Tray', tag: 'SUBS', description: 'Assortment of fresh subs prepared for group events.', image: '/images/cat-subs.jpg' },
            { name: 'Wrap Tray', tag: 'SUBS', description: 'Assortment of fresh wraps perfect for any gathering.', image: '/images/cat-wraps.jpg' },
        ]
    },
    {
        category: "Appetizers",
        items: [
            { name: 'Cinnamon Bites', tag: 'APPETIZERS', description: 'Sweet and delicious cinnamon bites.', image: '/images/cat-cinnamon.jpg' },
            { name: 'Jalapeno Poppers', tag: 'APPETIZERS', description: 'Served with Ranch Dressing.', image: '/images/cat-jalapeno.jpg' },
        ]
    }
];

export default function CateringSection() {
    return (
        <section id="catering" className="bg-ink border-t border-panel-border pt-24 pb-32 px-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-1.5 text-gold-bright mb-4 opacity-90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">Newark, Delaware</span>
                    </div>
                    <h2 className="text-sm font-mono tracking-widest text-gold bg-black/50 border border-gold/30 px-3.5 py-1 rounded-full mb-3 uppercase inline-block">
                        EVENTS & GROUP ORDERS
                    </h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-cream mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        Catering by <span className="text-gold">Raggio</span>
                    </h1>
                    <p className="text-cream text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Feeding a crowd in Newark? All catering trays are available in Half or Full sizes.
                    </p>
                </div>

                {cateringCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="mb-20">
                        <h3 className="text-2xl font-bold text-cream mb-8 border-b border-panel-border pb-3">
                            {cat.category}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {cat.items.map((item, itemIdx) => (
                                <div
                                    key={itemIdx}
                                    className="flex flex-col justify-between p-8 rounded-3xl bg-panel border border-gold/10 shadow-[0_5px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_60px_rgba(201,161,92,0.3)] hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* HATA VEREN BÖLÜMÜN DÜZELTİLMİŞ HALİ */}
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <h4 className="text-2xl font-bold text-cream">{item.name}</h4>
                                            <span className="text-xs font-mono font-bold text-gold bg-ink/50 px-3 py-1 rounded-full border border-gold/40">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <p className="text-stone text-sm md:text-base mb-12 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="border-t border-panel-border pt-8 mt-auto">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-bold text-cream">Starting from:</span>
                                            <div className="flex items-end gap-2">
                                                <span className="text-sm text-stone line-through">$100.00</span>
                                                <span className="text-3xl font-extrabold text-gold">$90.00</span>
                                                <span className="text-xs text-stone-dim">Full Tray</span>
                                            </div>
                                        </div>
                                        <button className="w-full mt-6 flex items-center justify-center gap-2 text-gold font-bold text-sm bg-panel border-2 border-gold/40 hover:bg-gold hover:text-ink px-6 py-3 rounded-full transition-all duration-300">
                                            View Details & Ingredients
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="text-center mt-20">
                    <button className="bg-gold hover:bg-gold-bright text-ink font-extrabold px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105">
                        Download Catering Menu
                    </button>
                </div>

            </div>
        </section>
    );
}