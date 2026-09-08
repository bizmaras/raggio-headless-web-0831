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

const DEFAULT_SLIDES = [
  {
    tag: '100% BEEF PEPPERONI',
    title: 'Crispy Beef Pepperoni',
    description: 'Crafted with savory beef pepperoni, 100% Grande Mozzarella, and homemade marinara on deck-oven stone-baked crust.',
    ctaText: 'Order Beef Pepperoni',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-pepperoni.webp',
    seoAlt: 'Crispy Beef Pepperoni Pizza at Raggio Gourmet Newark DE',
    highlight: 'Grande Mozzarella & Crispy Crust',
  },
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with beef pepperoni, sausage, bacon, and ham on our deck-oven stone-baked crust for true meat lovers.',
    ctaText: 'Get the Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-meatlover.webp',
    seoAlt: 'Signature Meat Lovers Pizza Delivery in Newark, DE',
    highlight: 'Loaded with 4 Artisan Meats',
  },
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken Pizza',
    description: 'Tender chicken tossed in fiery buffalo sauce with creamy ranch drizzle. A local favorite in Newark.',
    ctaText: 'Try Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-buffalo.webp',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark',
    highlight: 'Fiery Buffalo & Creamy Ranch',
  },
  {
    tag: 'GOURMET SELECTION',
    title: 'Fresh Spinach & Garlic Gourmet',
    description: 'Sauteed fresh spinach, roasted garlic, ricotta, and extra virgin olive oil. Perfect for catering and family dining.',
    ctaText: 'Taste Spinach Gourmet',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-spinach.webp',
    seoAlt: 'Fresh Spinach and Garlic Gourmet Pizza in Newark DE',
    highlight: 'Roasted Garlic & Ricotta',
  },
];

export default function HeroSlider({ dict }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
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
      highlight: localized.highlight || slide.highlight,
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
    // Only trigger slide if horizontal swipe is clearly dominant over vertical scrolling
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
      {/* Semantic H1 for SEO & Accessibility */}
      <h1 className="sr-only">
        Raggio Gourmet &amp; Pizza - Artisanal Stone-Baked Pizzas &amp; Italian Kitchen in Newark, DE
      </h1>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CINEMATIC SPLIT-BLEED SHOWCASE CARD */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-panel-border bg-ink shadow-2xl flex flex-col-reverse lg:flex-row items-stretch min-h-[480px] lg:min-h-[540px]">

          {/* EDITORIAL TEXT & ACTIONS (Bottom on mobile, Left on desktop) */}
          <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-center p-5 sm:p-8 lg:p-12 z-20 space-y-3.5 sm:space-y-6 relative bg-ink lg:bg-gradient-to-r lg:from-ink lg:via-ink/95 lg:to-ink/60">
            
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 self-start bg-gold/15 border border-gold/40 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold-bright text-xs font-bold tracking-wider uppercase font-mono">
                {activeSlide.tag}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-cream tracking-tight drop-shadow-md leading-[1.15]">
              {activeSlide.title}
            </h2>

            {/* Appetizing Description */}
            <p className="text-stone text-xs sm:text-sm lg:text-base leading-relaxed font-normal max-w-md">
              {activeSlide.description}
            </p>

            {/* CTAs */}
            <div className="pt-1 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={activeSlide.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-extrabold px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base transition-all duration-300 shadow-[0_4px_25px_rgba(201,161,92,0.45)] hover:shadow-[0_4px_35px_rgba(201,161,92,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                {activeSlide.ctaText}
              </a>
              <a
                href="#menu"
                className="w-full sm:w-auto text-center border border-panel-border hover:border-gold text-cream hover:text-gold font-bold px-5 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base transition-all duration-300 bg-panel/60 hover:bg-panel active:scale-95 cursor-pointer"
              >
                {dict?.hero?.cta || 'View Menu'}
              </a>
            </div>

            {/* Trust Footer */}
            <div className="pt-1 flex items-center gap-2 text-[11px] sm:text-xs text-stone-dim uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0" />
              <span className="truncate">{dict?.hero?.badge || '100% Fresh Mozzarella • Stone-Baked Crust • Newark, DE'}</span>
            </div>

            {/* SLIDER DOTS */}
            <div className="flex items-center gap-2 sm:gap-2.5 pt-2 sm:pt-4">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrent(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    current === dotIdx
                      ? 'w-8 sm:w-10 bg-gold shadow-[0_0_10px_rgba(201,161,92,0.7)]'
                      : 'w-2.5 bg-panel-border hover:bg-stone-dim'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* FULL-BLEED CINEMATIC PHOTOGRAPHY (Top on mobile, Right on desktop) */}
          <div className="w-full lg:w-[54%] xl:w-[56%] relative min-h-[300px] xs:min-h-[340px] sm:min-h-[420px] lg:min-h-[540px] overflow-hidden bg-black">
            
            {/* Edge-to-Edge Pizza Images with Subtle Ken Burns Motion */}
            {slides.map((slide, index) => {
              const isCurrent = index === current;
              const shouldRender = isHydrated || index === 0;

              if (!shouldRender) return null;

              return (
                <div
                  key={slide.image}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  aria-hidden={!isCurrent}
                >
                  <Image
                    src={slide.image}
                    alt={slide.seoAlt}
                    fill
                    priority={index === 0}
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                      isCurrent ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  {/* Subtle cinema vignette on the food */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
                </div>
              );
            })}

            {/* Seamless Left-Edge Dark Blend into Text Column (Desktop only) */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink via-ink/80 to-transparent z-15 pointer-events-none" />

            {/* Seamless Bottom Dark Blend into Text Column (Mobile only) */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink via-ink/80 to-transparent z-15 pointer-events-none" />

            {/* Floating Glassmorphism Highlight Tag on the Dish */}
            <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 backdrop-blur-md bg-ink/75 border border-gold/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-xl flex items-center gap-2 max-w-[85%]">
              <span className="w-2 h-2 shrink-0 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-cream tracking-wide truncate">
                {activeSlide.highlight}
              </span>
            </div>

            {/* NAVIGATION ARROWS ON IMAGE */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous pizza"
                className="p-2.5 sm:p-3 rounded-full backdrop-blur-md bg-black/65 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all cursor-pointer active:scale-95 shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next pizza"
                className="p-2.5 sm:p-3 rounded-full backdrop-blur-md bg-black/65 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all cursor-pointer active:scale-95 shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}