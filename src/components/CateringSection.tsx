'use client';

// Import the catering data
import { CATERING_ITEMS } from '@/data/cateringData';

export default function CateringSection() {
    return (
        <section id="catering" className="py-16 bg-slate-950 text-slate-100 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 text-center">

                {/* Header Section */}
                <span className="px-3 py-1 text-xs font-semibold tracking-widest text-amber-400 uppercase rounded-full bg-amber-500/10 border border-amber-500/20">
                    Events & Group Orders
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-amber-100 mt-3">
                    Catering by Raggio
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-2 mb-10">
                    Feeding a crowd in Newark? All catering trays are available in Half or Full sizes.
                </p>

                {/* Catering Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {CATERING_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl"
                        >
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-lg font-bold text-slate-100">{item.name}</h3>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 whitespace-nowrap">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs md:text-sm mt-2 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Pricing Section */}
                            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Half Tray ({item.servesHalf})
                                    </span>
                                    <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
                                        {item.halfTrayPrice}
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Full Tray ({item.servesFull})
                                    </span>
                                    <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
                                        {item.fullTrayPrice}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer & Call to Action */}
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 max-w-2xl mx-auto text-center">
                    <h4 className="text-base font-bold text-amber-200">Need a Custom Catering Package?</h4>
                    <p className="text-slate-300 text-xs md:text-sm mt-1 mb-4">
                        We accommodate special event requests, corporate lunches, and custom portions.
                    </p>
                    <a
                        href="https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/Catering"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                    >
                        Order Catering Online via FoodTec
                    </a>
                </div>
            </div>
        </section>
    );
}