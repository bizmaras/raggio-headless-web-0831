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
      }>;
    };
  };
}

const DEFAULT_SLIDES = [
  {
    tag: '100% BEEF PEPPERONI',
    title: 'Crispy Beef Pepperoni',
    description: 'Crafted with savory beef pepperoni, 100% Grande Mozzarella, and homemade marinara on deck-oven stone-baked crust.',
    ctaText: 'Order Beef Pepperoni',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-pepperoni.webp',
    seoAlt: 'Crispy Beef Pepperoni Pizza at Raggio Gourmet Newark DE',
  },
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with beef pepperoni, sausage, bacon, and ham on our deck-oven stone-baked crust for true meat lovers.',
    ctaText: 'Get the Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-meatlover.webp',
    seoAlt: 'Signature Meat Lovers Pizza Delivery in Newark, DE',
  },
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken Pizza',
    description: 'Tender chicken tossed in fiery buffalo sauce with creamy ranch drizzle. A local favorite in Newark.',
    ctaText: 'Try Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-buffalo.webp',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark',
  },
  {
    tag: 'GOURMET SELECTION',
    title: 'Fresh Spinach & Garlic Gourmet',
    description: 'Sauteed fresh spinach, roasted garlic, ricotta, and extra virgin olive oil. Perfect for catering and family dining.',
    ctaText: 'Taste Spinach Gourmet',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-spinach.webp',
    seoAlt: 'Fresh Spinach and Garlic Gourmet Pizza in Newark DE',
  },
];

export default function HeroSlider({ dict }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

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
    const deferTimer = setTimeout(() => setIsHydrated(true), 1200);
    return () => clearTimeout(deferTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  const activeSlide = slides[current] || slides[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-ink py-6 sm:py-10 lg:py-12 select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Gourmet Pizza Specials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SHOWCASE CARD CONTAINER */}
        <div className="relative min-h-[500px] sm:min-h-[480px] md:min-h-[460px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-panel-border bg-gradient-to-br from-panel/95 via-ink to-panel/85 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-14 gap-8 group">
          
          {/* AMBIENT WARMTH & GOLD BACKLIGHT (Appetizing visual glow behind the floating dish) */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gold/10 blur-[100px] pointer-events-none transition-opacity duration-1000" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full bg-amber-500/10 blur-[70px] pointer-events-none" />

          {/* LEFT: SLIDE TEXT & CALL TO ACTION */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center z-10 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 self-center lg:self-start bg-gold/15 border border-gold/30 px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold-bright text-xs font-bold tracking-wider uppercase font-mono">
                {activeSlide.tag}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-[1.15]">
              {activeSlide.title}
            </h2>

            <p className="text-stone text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              {activeSlide.description}
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={activeSlide.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-extrabold px-8 py-3.5 rounded-full text-base transition-all duration-300 shadow-[0_4px_25px_rgba(201,161,92,0.4)] hover:shadow-[0_4px_30px_rgba(201,161,92,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                {activeSlide.ctaText}
              </a>
              <a
                href="#menu"
                className="w-full sm:w-auto text-center border border-panel-border hover:border-gold text-cream hover:text-gold font-bold px-7 py-3.5 rounded-full text-base transition-all duration-300 bg-ink/40 hover:bg-panel cursor-pointer"
              >
                {dict?.hero?.cta || 'View Menu'}
              </a>
            </div>

            <p className="text-[11px] text-stone-dim uppercase tracking-wider font-semibold pt-1">
              {dict?.hero?.badge || '100% Fresh Mozzarella • 48h Fermented Dough • Newark, DE'}
            </p>
          </div>

          {/* RIGHT: FLOATING HERO DISH (40% larger, unboxed, elevated depth with warm 3D shadow) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
            {slides.map((slide, index) => {
              const isCurrent = index === current;
              const shouldRender = isHydrated || index === 0;

              if (!shouldRender) return null;

              return (
                <div
                  key={slide.image}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out transform ${
                    isCurrent
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-90 rotate-6 pointer-events-none'
                  }`}
                  aria-hidden={!isCurrent}
                >
                  <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] drop-shadow-[0_25px_45px_rgba(0,0,0,0.92)] drop-shadow-[0_12px_24px_rgba(201,161,92,0.18)] hover:scale-[1.03] transition-transform duration-500 cursor-pointer">
                    <Image
                      src={slide.image}
                      alt={slide.seoAlt}
                      fill
                      priority={index === 0}
                      quality={75}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 440px"
                      className="object-contain filter contrast-[1.03] brightness-[1.02]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP NAVIGATION CHEVRONS */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous pizza slide"
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-ink/70 border border-panel-border text-cream/70 hover:text-gold hover:border-gold/50 hover:bg-panel transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next pizza slide"
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-ink/70 border border-panel-border text-cream/70 hover:text-gold hover:border-gold/50 hover:bg-panel transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* SLIDER PAGINATION DOTS */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-20">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrent(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  current === dotIdx
                    ? 'w-8 bg-gold shadow-[0_0_8px_rgba(201,161,92,0.6)]'
                    : 'w-2 bg-stone-dim/40 hover:bg-stone-dim'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}