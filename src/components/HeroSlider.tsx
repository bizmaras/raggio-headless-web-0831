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
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken',
    description: 'Tender chicken tossed in fiery buffalo sauce with creamy ranch drizzle. A local favorite in Newark.',
    ctaText: 'Try Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/card-buffalo-clean.png',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark DE',
  },
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with beef pepperoni, sausage, bacon, and ham on our stone-baked crust for true meat lovers.',
    ctaText: 'Order Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/card-meatlover-clean.png',
    seoAlt: 'Signature Meat Lovers Pizza Delivery in Newark DE',
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
      className="relative w-full overflow-hidden bg-ink py-4 sm:py-6 lg:py-8 select-none"
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
        
        {/* MASTER HERO CARD PRESENTATION */}
        <div className="w-full relative aspect-[1024/458] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden border border-white/10 bg-[#0c0d10] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">

          {/* SLIDES */}
          {slides.map((slide, index) => {
            const isCurrent = index === current;

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
                  quality={95}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                  className="object-contain sm:object-cover object-center"
                />
              </div>
            );
          })}

          {/* LIVE MODEL 2 BUTTONS OVERLAY */}
          <div className="absolute left-[8.2%] sm:left-[8.6%] bottom-[24.5%] sm:bottom-[25.5%] z-20 flex items-center gap-2.5 sm:gap-3.5">
            <a
              href={activeSlide.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-[11px] sm:text-xs lg:text-sm font-extrabold shadow-xl"
            >
              <span>{activeSlide.ctaText}</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>

            <a
              href="#menu"
              className="btn-charcoal px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 text-[11px] sm:text-xs lg:text-sm font-bold shadow-xl"
            >
              <span>{dict?.hero?.cta || 'View Menu'}</span>
            </a>
          </div>

          {/* STORYLINE PROGRESS INDICATOR (Segmented Gold Bars) */}
          <div className="absolute z-30 left-[9.5%] bottom-[8%] flex items-center gap-1.5 sm:gap-2">
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
                    className={`h-full bg-gradient-to-r from-[#f2dc98] via-[#e6c884] to-[#d8b467] transition-all duration-500 rounded-full ${
                      current === dotIdx ? 'w-full shadow-[0_0_10px_rgba(216,180,103,0.9)]' : 'w-0'
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
              className="p-2 sm:p-2.5 rounded-xl backdrop-blur-md bg-black/60 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all active:scale-95 shadow-lg cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next pizza"
              className="p-2 sm:p-2.5 rounded-xl backdrop-blur-md bg-black/60 border border-white/15 text-cream hover:text-gold hover:border-gold/60 transition-all active:scale-95 shadow-lg cursor-pointer"
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
