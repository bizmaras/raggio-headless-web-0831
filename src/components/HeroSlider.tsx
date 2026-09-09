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
    image: '/images/apple-card-pepperoni.jpg',
    seoAlt: 'Crispy Beef Pepperoni Pizza at Raggio Gourmet Newark DE',
    highlight: 'Grande Mozzarella & Crispy Crust',
  },
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with beef pepperoni, sausage, bacon, and ham on our deck-oven stone-baked crust for true meat lovers.',
    ctaText: 'Get the Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/apple-card-meatlover.jpg',
    seoAlt: 'Signature Meat Lovers Pizza Delivery in Newark, DE',
    highlight: 'Loaded with 4 Artisan Meats',
  },
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken Pizza',
    description: 'Tender chicken tossed in fiery buffalo sauce with creamy ranch drizzle. A local favorite in Newark.',
    ctaText: 'Try Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/apple-card-buffalo.jpg',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark',
    highlight: 'Fiery Buffalo & Creamy Ranch',
  },
  {
    tag: 'GOURMET SELECTION',
    title: 'Fresh Spinach & Garlic Gourmet',
    description: 'Sauteed fresh spinach, roasted garlic, ricotta, and extra virgin olive oil. Perfect for catering and family dining.',
    ctaText: 'Taste Spinach Gourmet',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/apple-card-spinach.jpg',
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
    }, 6000);
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
      className="relative w-full overflow-hidden bg-ink py-3 sm:py-6 lg:py-8 select-none"
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
        
        {/* APPLE CONCEPT CARD SHOWCASE */}
        <div className="w-full relative aspect-[16/9] max-h-[640px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden border border-white/10 bg-[#0c0d10] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          
          {/* SLIDES */}
          {slides.map((slide, index) => {
            const isCurrent = index === current;
            const shouldRender = isHydrated || index === 0;
            if (!shouldRender) return null;

            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={!isCurrent}
              >
                <Image
                  src={slide.image}
                  alt={slide.seoAlt}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                  className="object-cover object-center"
                />
              </div>
            );
          })}

          {/* INTERACTIVE CLICKABLE HOTSPOTS OVER APPLE BUTTONS */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Primary Order CTA Hotspot */}
            <a
              href={activeSlide.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute pointer-events-auto left-[6%] sm:left-[8%] bottom-[20%] sm:bottom-[23%] lg:bottom-[24%] w-[42%] sm:w-[26%] lg:w-[22%] h-[15%] sm:h-[13%] rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/60"
              aria-label={activeSlide.ctaText}
            />

            {/* Secondary View Menu Hotspot */}
            <a
              href="#menu"
              className="absolute pointer-events-auto left-[50%] sm:left-[36%] lg:left-[31%] bottom-[20%] sm:bottom-[23%] lg:bottom-[24%] w-[28%] sm:w-[18%] lg:w-[15%] h-[15%] sm:h-[13%] rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/60"
              aria-label={dict?.hero?.cta || 'View Menu'}
            />
          </div>

          {/* STORYLINE PROGRESS INDICATOR (Segmented Gold Bars) */}
          <div className="absolute z-30 left-[6%] sm:left-[8%] bottom-[5%] sm:bottom-[7%] flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrent(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className="group py-2 cursor-pointer focus:outline-none"
              >
                <div className="w-6 sm:w-12 h-1 rounded-full bg-white/25 overflow-hidden transition-colors group-hover:bg-white/45">
                  <div
                    className={`h-full bg-gold transition-all duration-500 rounded-full ${
                      current === dotIdx ? 'w-full shadow-[0_0_10px_rgba(201,161,92,0.9)]' : 'w-0'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* NAVIGATION ARROWS */}
          <div className="absolute z-30 right-3 sm:right-6 bottom-3 sm:bottom-6 flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous pizza"
              className="p-2 sm:p-2.5 rounded-full backdrop-blur-md bg-black/60 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all active:scale-95 shadow-lg"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next pizza"
              className="p-2 sm:p-2.5 rounded-full backdrop-blur-md bg-black/60 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all active:scale-95 shadow-lg"
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