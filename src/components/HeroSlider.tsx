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

  // Merge localized slides if present
  const activeSlides = DEFAULT_SLIDES.map((slide, idx) => {
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

  const badgeText = dict?.hero?.badge || '100% Fresh Mozzarella • 48h Fermented Dough • Newark, DE';

  useEffect(() => {
    const deferTimer = setTimeout(() => setIsHydrated(true), 1200);
    return () => clearTimeout(deferTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    } else if (isRightSwipe) {
      setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-ink py-10 lg:py-16 select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Pizza Specials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[500px] sm:min-h-[460px] md:min-h-[440px] lg:min-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-panel-border bg-gradient-to-br from-panel/95 via-ink to-panel/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-14 gap-8">
          
          {/* LEFT: SLIDE TEXT CONTENT */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center z-10 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 self-center lg:self-start bg-gold/15 border border-gold/30 px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold-bright text-xs font-bold tracking-wider uppercase">
                {activeSlides[current].tag}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream tracking-tight leading-tight transition-all duration-500">
              {activeSlides[current].title}
            </h1>

            <p className="text-sm sm:text-base text-stone max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-500 font-normal">
              {activeSlides[current].description}
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={activeSlides[current].ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-gold hover:bg-gold-bright text-ink font-extrabold px-8 py-3.5 rounded-xl text-base transition-all duration-200 shadow-lg hover:shadow-gold/25 cursor-pointer active:scale-95"
              >
                {activeSlides[current].ctaText}
              </a>
              <a
                href="#menu"
                className="w-full sm:w-auto text-center border border-panel-border hover:border-gold text-cream hover:text-gold font-bold px-6 py-3.5 rounded-xl text-base transition-all duration-200 bg-ink/40 cursor-pointer"
              >
                {dict?.hero?.cta || 'View Menu'}
              </a>
            </div>

            <p className="text-[11px] text-stone-dim uppercase tracking-wider font-semibold pt-1">
              {badgeText}
            </p>
          </div>

          {/* RIGHT: PIZZA HERO IMAGE */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[220px] sm:min-h-[280px] lg:min-h-[360px]">
            {activeSlides.map((slide, index) => {
              const isCurrent = index === current;
              const shouldRender = isHydrated || index === 0;

              if (!shouldRender) return null;

              return (
                <div
                  key={slide.image}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out transform ${
                    isCurrent
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-95 rotate-3 pointer-events-none'
                  }`}
                  aria-hidden={!isCurrent}
                >
                  <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]">
                    <Image
                      src={slide.image}
                      alt={slide.seoAlt}
                      fill
                      priority={index === 0}
                      quality={70}
                      sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 380px"
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SLIDER DOTS */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2.5 z-20">
            {activeSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrent(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  current === dotIdx
                    ? 'w-8 bg-gold'
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