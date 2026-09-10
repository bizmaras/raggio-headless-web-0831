'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface SignatureDishShowcaseProps {
  dict?: any;
  lang?: string;
}

export default function SignatureDishShowcase({ dict, lang = 'en' }: SignatureDishShowcaseProps) {
  const t = dict?.showcase || {};
  const [currentDish, setCurrentDish] = useState<'pepperoni' | 'meatlover' | 'buffalo'>('pepperoni');
  const [activeSpot, setActiveSpot] = useState<number>(1);
  const tiltRef = useRef<HTMLDivElement>(null);

  const images = {
    pepperoni: '/images/pizza-pepperoni-clean.png',
    meatlover: '/images/pizza-meatlover-clean.png',
    buffalo: '/images/pizza-buffalo-clean.png'
  };

  const dish = t?.dishes?.[currentDish] || {
    name: 'Raggio Artisan Pepperoni',
    price: '$21.99',
    topping_badge: 'Crispy Cupped Pepperoni',
    topping_sub: 'Cup & Char',
    crust_title: '48-Hour Cold-Fermented Dough',
    crust_desc: 'Naturally fermented for 48 hours with Italian flour. Super light, airy cornicione crust that never feels heavy.',
    sauce_title: 'San Marzano D.O.P. Plum Tomato Sauce',
    sauce_desc: 'Sun-ripened tomatoes grown in the volcanic soil of Mount Vesuvius, crushed raw with extra virgin olive oil and oregano.',
    cheese_title: 'Whole-Milk Fior di Latte Mozzarella',
    cheese_desc: '100% whole milk creamy mozzarella that melts into rich golden blisters across every single slice.',
    topping_title: 'Crispy Cupped (Cup & Char) Pepperoni',
    topping_desc: 'Beef pepperoni that crisps into savory chalices under high stone-oven heat, releasing rich smoky aroma.'
  };

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 14;
    const rotateY = (x / (rect.width / 2)) * 14;
    tiltRef.current.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTilt = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const getActiveSpotData = () => {
    switch (activeSpot) {
      case 1:
        return { icon: '🌿', title: dish.crust_title, desc: dish.crust_desc };
      case 2:
        return { icon: '🍅', title: dish.sauce_title, desc: dish.sauce_desc };
      case 3:
        return { icon: '🧀', title: dish.cheese_title, desc: dish.cheese_desc };
      case 4:
      default:
        return { icon: '🥩', title: dish.topping_title, desc: dish.topping_desc };
    }
  };

  const activeData = getActiveSpotData();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[560px] md:h-[560px] bg-gradient-to-tr from-gold/20 via-orange-500/15 to-amber-300/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-xs text-gold-bright font-semibold tracking-wider uppercase mb-3">
          {t.badge || 'SIGNATURE ARTISANAL PIZZAS'}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright mb-2">
          {t.title || 'Crafted with Passion, Stone-Baked to Perfection'}
        </h2>
        <p className="text-stone text-xs md:text-sm leading-relaxed">
          {t.subtitle || 'Explore our signature pizzas in detail. Hover or tap the markers to discover our authentic Italian ingredients and craftsmanship.'}
        </p>
      </div>

      {/* Dish Selector Tabs */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button
          type="button"
          onClick={() => { setCurrentDish('pepperoni'); setActiveSpot(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
            currentDish === 'pepperoni'
              ? 'bg-gold text-ink shadow-gold/20'
              : 'bg-panel-2 border border-panel-border text-stone hover:text-cream hover:border-gold/40'
          }`}
        >
          🍕 {t.dishes?.pepperoni?.name || 'Raggio Artisan Pepperoni'}
        </button>

        <button
          type="button"
          onClick={() => { setCurrentDish('meatlover'); setActiveSpot(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
            currentDish === 'meatlover'
              ? 'bg-gold text-ink shadow-gold/20'
              : 'bg-panel-2 border border-panel-border text-stone hover:text-cream hover:border-gold/40'
          }`}
        >
          🥩 {t.dishes?.meatlover?.name || "Meat Lover's Feast"}
        </button>

        <button
          type="button"
          onClick={() => { setCurrentDish('buffalo'); setActiveSpot(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
            currentDish === 'buffalo'
              ? 'bg-gold text-ink shadow-gold/20'
              : 'bg-panel-2 border border-panel-border text-stone hover:text-cream hover:border-gold/40'
          }`}
        >
          🍗 {t.dishes?.buffalo?.name || 'Buffalo Chicken & Ranch'}
        </button>
      </div>

      {/* Main Showcase Area */}
      <div className="flex flex-col items-center justify-center">
        {/* 3D Tilt Container */}
        <div
          ref={tiltRef}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          className="relative w-80 h-80 sm:w-[460px] sm:h-[460px] md:w-[520px] md:h-[520px] flex items-center justify-center select-none cursor-pointer transition-transform duration-150 ease-out"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {/* Ground shadow */}
          <div className="absolute w-[82%] h-[32%] bottom-2 bg-black/90 rounded-full blur-2xl pointer-events-none -z-10 transform scale-90" />

          {/* Pizza Image Cutout */}
          <div className="relative w-full h-full">
            <Image
              src={images[currentDish]}
              alt={dish.name}
              fill
              sizes="(max-width: 768px) 320px, 520px"
              priority
              className="object-contain pointer-events-none drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)]"
            />
          </div>

          {/* HOTSPOT 1: CRUST */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveSpot(1); }}
            style={{ top: '12%', left: '6%' }}
            className="absolute z-20 transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label={dish.crust_title}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-2xl transition-colors ${
              activeSpot === 1 ? 'bg-ink/95 border-2 border-gold text-gold-bright' : 'bg-ink/80 border border-gold/60 text-white hover:border-gold'
            }`}>
              <span className="w-2 h-2 rounded-full bg-gold-bright animate-ping" />
              <span className="text-xs font-bold text-gold-bright">
                🌿 {lang === 'es' ? '48h Masa Crujiente' : '48h Crust'}
              </span>
            </div>
          </button>

          {/* HOTSPOT 2: SAUCE */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveSpot(2); }}
            style={{ top: '36%', right: '4%' }}
            className="absolute z-20 transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label={dish.sauce_title}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-2xl transition-colors ${
              activeSpot === 2 ? 'bg-ink/95 border-2 border-gold text-gold-bright' : 'bg-ink/80 border border-gold/60 text-white hover:border-gold'
            }`}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-white">
                🍅 {lang === 'es' ? 'Salsa San Marzano' : 'San Marzano Sauce'}
              </span>
            </div>
          </button>

          {/* HOTSPOT 3: CHEESE */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveSpot(3); }}
            style={{ bottom: '24%', left: '4%' }}
            className="absolute z-20 transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label={dish.cheese_title}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-2xl transition-colors ${
              activeSpot === 3 ? 'bg-ink/95 border-2 border-gold text-gold-bright' : 'bg-ink/80 border border-gold/60 text-white hover:border-gold'
            }`}>
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              <span className="text-xs font-bold text-white">
                🧀 {lang === 'es' ? 'Mozzarella Fresca' : 'Fior di Latte'}
              </span>
            </div>
          </button>

          {/* HOTSPOT 4: TOPPING */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveSpot(4); }}
            style={{ bottom: '12%', right: '8%' }}
            className="absolute z-20 transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label={dish.topping_title}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-2xl transition-colors ${
              activeSpot === 4 ? 'bg-ink/95 border-2 border-gold text-gold-bright' : 'bg-ink/80 border border-gold/60 text-white hover:border-gold'
            }`}>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-xs font-bold text-white">
                🥩 {dish.topping_badge}
              </span>
            </div>
          </button>
        </div>

        {/* INGREDIENT DETAIL CARD */}
        <div className="w-full max-w-2xl mt-4 bg-panel border border-panel-border rounded-2xl p-5 shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-panel-border pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeData.icon}</span>
              <h3 className="text-base font-extrabold text-gold-bright">
                {activeData.title}
              </h3>
            </div>
            <span className="text-xs text-gold font-bold px-2 py-0.5 rounded bg-gold/15 uppercase">
              {t.secret_badge || "Chef's Secret"}
            </span>
          </div>
          <p className="text-xs md:text-sm text-cream/90 leading-relaxed mb-4">
            {activeData.desc}
          </p>

          {/* 4 Bottom Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-panel-border">
            <button
              type="button"
              onClick={() => setActiveSpot(1)}
              className={`p-2.5 rounded-xl text-left transition-all ${
                activeSpot === 1 ? 'bg-gold/20 border border-gold' : 'bg-panel-2 border border-panel-border hover:border-gold/40'
              }`}
            >
              <span className={`text-xs font-bold block ${activeSpot === 1 ? 'text-gold-bright' : 'text-cream'}`}>
                🌿 {t.crust_tab || '1. Crust'}
              </span>
              <span className="text-[10px] text-stone block">48h Ferment</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSpot(2)}
              className={`p-2.5 rounded-xl text-left transition-all ${
                activeSpot === 2 ? 'bg-gold/20 border border-gold' : 'bg-panel-2 border border-panel-border hover:border-gold/40'
              }`}
            >
              <span className={`text-xs font-bold block ${activeSpot === 2 ? 'text-gold-bright' : 'text-cream'}`}>
                🍅 {t.sauce_tab || '2. Sauce'}
              </span>
              <span className="text-[10px] text-stone block">San Marzano</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSpot(3)}
              className={`p-2.5 rounded-xl text-left transition-all ${
                activeSpot === 3 ? 'bg-gold/20 border border-gold' : 'bg-panel-2 border border-panel-border hover:border-gold/40'
              }`}
            >
              <span className={`text-xs font-bold block ${activeSpot === 3 ? 'text-gold-bright' : 'text-cream'}`}>
                🧀 {t.cheese_tab || '3. Cheese'}
              </span>
              <span className="text-[10px] text-stone block">Fior di Latte</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSpot(4)}
              className={`p-2.5 rounded-xl text-left transition-all ${
                activeSpot === 4 ? 'bg-gold/20 border border-gold' : 'bg-panel-2 border border-panel-border hover:border-gold/40'
              }`}
            >
              <span className={`text-xs font-bold block ${activeSpot === 4 ? 'text-gold-bright' : 'text-cream'}`}>
                🥩 {t.topping_tab || '4. Topping'}
              </span>
              <span className="text-[10px] text-stone block">{dish.topping_sub}</span>
            </button>
          </div>
        </div>

        {/* Immediate Order Bar */}
        <div className="w-full max-w-2xl mt-4 flex items-center justify-between p-4 rounded-2xl bg-ink-2 border border-panel-border shadow-xl">
          <div>
            <span className="text-xs text-stone block">
              {t.size_label || 'Large 16" Stone-Baked'}
            </span>
            <span className="text-2xl font-black text-gold-bright">
              {dish.price}
            </span>
          </div>
          <a
            href="https://phillystyleexpress.foodtecsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-bright text-ink text-xs font-extrabold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>🛒</span>
            <span>{t.order_pizza || 'Order This Pizza'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
