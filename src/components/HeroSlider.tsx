'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSliderProps {
  dict?: {
    hero?: {
      tagline?: string;
      subtitle?: string;
      cta?: string;
      cta_order?: string;
      badge?: string;
      slides?: Array<{
        tag: string;
        title: string;
        description: string;
        ctaText: string;
        seoAlt: string;
        highlight?: string;
      }>;
    };
  };
}

interface SlideItem {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  seoAlt: string;
  pins: Array<{ label: string; top: number; left: number }>;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken',
    description: 'Tender chicken tossed in fiery buffalo sauce with creamy ranch drizzle on our stone-baked crust. A local Newark favorite.',
    ctaText: 'Try Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-buffalo-wood-cutout.png',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark DE',
    pins: [
      { label: 'Fiery Buffalo Chicken', top: 18, left: 15 },
      { label: 'Creamy Ranch Drizzle', top: 76, left: 52 },
    ],
  },
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with savory beef pepperoni, sausage crumbles, crispy bacon, and ham on deck-oven crust for true meat lovers.',
    ctaText: 'Order Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-meatlover-wood-cutout.png',
    seoAlt: 'Signature Meat Lovers Pizza Delivery in Newark DE',
    pins: [
      { label: 'Loaded with 4 Artisan Meats', top: 18, left: 20 },
      { label: 'Grande Mozzarella', top: 78, left: 55 },
    ],
  },
  {
    tag: '100% BEEF PEPPERONI',
    title: 'Crispy Beef Pepperoni',
    description: 'Crafted with savory beef pepperoni, 100% Grande Mozzarella, and homemade marinara on deck-oven stone-baked crust.',
    ctaText: 'Order Beef Pepperoni',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-pepperoni-wood-cutout.png',
    seoAlt: 'Crispy Beef Pepperoni Pizza at Raggio Gourmet Newark DE',
    pins: [
      { label: '100% Beef Pepperoni', top: 18, left: 18 },
      { label: 'Stone-Baked Crust', top: 76, left: 54 },
    ],
  },
  {
    tag: 'GOURMET SELECTION',
    title: 'Fresh Spinach & Garlic',
    description: 'Sautéed fresh spinach, roasted garlic, creamy ricotta, and extra virgin olive oil. Perfect for catering and family dining.',
    ctaText: 'Taste Spinach Gourmet',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-spinach-wood-cutout.png',
    seoAlt: 'Fresh Spinach and Garlic Gourmet Pizza in Newark DE',
    pins: [
      { label: 'Roasted Garlic & Ricotta', top: 18, left: 18 },
      { label: 'Fresh Baby Spinach', top: 76, left: 52 },
    ],
  },
];

export default function HeroSlider({ dict }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const slides = DEFAULT_SLIDES.map((slide, idx) => {
    const localized = dict?.hero?.slides?.[idx];
    if (!localized) return slide;
    return {
      ...slide,
      tag: localized.tag || slide.tag,
      title: localized.title || slide.title,
      description: localized.description || slide.description,
      ctaText: localized.ctaText || slide.ctaText,
      seoAlt: localized.seoAlt || slide.seoAlt,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const activeSlide = slides[current] || slides[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-ink py-4 sm:py-8 lg:py-10 select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Cinematic Featured Specials"
    >
      {/* Semantic Headings for SEO & Accessibility */}
      <h1 className="sr-only">
        Raggio Gourmet &amp; Pizza - Artisanal Stone-Baked Pizzas &amp; Italian Kitchen in Newark, DE
      </h1>
      <h2 className="sr-only">{activeSlide.title}</h2>
      <p className="sr-only">{activeSlide.description}</p>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* MASTER 3D SHOWCASE CONTAINER */}
        <div className="w-full relative min-h-[500px] sm:min-h-[520px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-[#0c0d10] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 sm:p-7 lg:p-10 flex items-center overflow-visible">

          {/* INNER FROSTED GLASS CARD */}
          <div className="w-full relative rounded-xl sm:rounded-2xl lg:rounded-[24px] bg-gradient-to-b from-[#14171d]/75 to-[#0e1014]/90 backdrop-blur-xl border border-white/10 p-5 sm:p-8 lg:p-12 overflow-visible">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* LEFT EDITORIAL COLUMN */}
              <div key={`text-${current}`} className="lg:col-span-7 flex flex-col justify-center text-left z-20 animate-fadeIn">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-cream/90 mb-3 sm:mb-4 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-ember shadow-[0_0_8px_#e54d2e]" />
                  {activeSlide.tag}
                </div>

                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08] mb-3 sm:mb-4 drop-shadow-md">
                  {activeSlide.title}
                </h2>

                {/* Description */}
                <p className="text-stone text-xs sm:text-sm lg:text-base leading-relaxed max-w-lg mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3">
                  {activeSlide.description}
                </p>

                {/* LUXURY MODEL 2 BUTTONS (SATIN GOLD & CHARCOAL) */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <a
                    href={activeSlide.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-5 sm:px-7 py-3 text-xs sm:text-sm lg:text-base font-extrabold shadow-lg"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>

                  <a
                    href="#menu"
                    className="btn-charcoal px-4 sm:px-6 py-3 text-xs sm:text-sm lg:text-base font-bold"
                  >
                    <span>{dict?.hero?.cta || 'View Menu'}</span>
                  </a>
                </div>

                {/* STORYLINE PROGRESS INDICATOR (Segmented Gold Bars) */}
                <div className="flex items-center gap-2 mt-8 sm:mt-12">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrent(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className="py-2 cursor-pointer focus:outline-none group"
                    >
                      <div className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                        current === dotIdx
                          ? 'w-8 sm:w-14 bg-gradient-to-r from-[#f2dc98] via-[#e6c884] to-[#d8b467] shadow-[0_0_12px_rgba(216,180,103,0.85)]'
                          : 'w-4 sm:w-6 bg-white/20 group-hover:bg-white/40'
                      }`} />
                    </button>
                  ))}
                </div>

              </div>

              {/* RIGHT 3D OVERFLOW PRODUCT COLUMN */}
              <div key={`img-${current}`} className="lg:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] animate-fadeIn">
                
                {/* Ambient Oven Glow Halo */}
                <div className="absolute w-[280px] sm:w-[340px] lg:w-[420px] h-[280px] sm:h-[340px] lg:h-[420px] rounded-full bg-radial from-ember/30 via-gold/20 to-transparent blur-3xl pointer-events-none -z-10" />

                {/* Interactive Topping Hotspots / Pins */}
                {activeSlide.pins.map((pin, pIdx) => (
                  <div
                    key={pIdx}
                    style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                    className="absolute z-30 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121417]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-cream shadow-[0_4px_16px_rgba(0,0,0,0.6)] pointer-events-auto"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-bright shadow-[0_0_6px_#e3c383]" />
                    <span>{pin.label}</span>
                  </div>
                ))}

                {/* The 3D Overflowing Product Image */}
                <div className="relative w-[280px] sm:w-[360px] lg:w-[440px] aspect-square lg:scale-110 lg:translate-x-6 transition-transform duration-500">
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.seoAlt}
                    fill
                    priority
                    quality={92}
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 440px"
                    className="object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* GLOBAL NAVIGATION ARROWS (BOTTOM RIGHT) */}
          <div className="absolute z-40 right-6 sm:right-10 bottom-6 sm:bottom-10 flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous pizza"
              className="p-2.5 sm:p-3 rounded-xl backdrop-blur-md bg-[#16181d]/85 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all active:scale-95 shadow-lg cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next pizza"
              className="p-2.5 sm:p-3 rounded-xl backdrop-blur-md bg-[#16181d]/85 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all active:scale-95 shadow-lg cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
