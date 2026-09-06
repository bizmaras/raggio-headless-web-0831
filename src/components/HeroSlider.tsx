'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
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

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
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
    <>
      {/* Mobile Static Brand H1 Banner: Positioned outside slider to preserve full pizza visibility on mobile */}
      <div className="lg:hidden w-full bg-ink border-b border-panel-border px-4 py-2.5 text-center">
        <div className="flex items-center justify-center gap-1.5 text-gold-bright text-[11px] font-bold uppercase tracking-widest mb-0.5">
          <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Newark, Delaware</span>
        </div>
        <h1 className="text-base sm:text-lg font-extrabold text-cream tracking-tight">
          Raggio Gourmet &amp; Pizza
        </h1>
        <p className="text-xs text-stone font-medium">
          Artisanal Stone-Baked Pizzas &amp; Gourmet Kitchen
        </p>
      </div>

      <section
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[65vh] lg:h-[77vh] w-full flex flex-col justify-center overflow-hidden border-b border-panel-border bg-ink touch-pan-y"
        aria-label="Raggio Gourmet Pizza Specials in Newark, DE"
      >
        {/* Desktop Static Brand H1 Banner: Elegant floating gold badge over hero space */}
        <div className="hidden lg:flex absolute top-6 left-0 right-0 z-20 justify-center px-6 pointer-events-none">
          <div className="inline-flex items-center gap-3 bg-ink/85 backdrop-blur-md border border-gold/40 px-6 py-2.5 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.7)] pointer-events-auto">
            <div className="flex items-center gap-1.5 text-gold-bright text-xs font-bold uppercase tracking-widest">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Newark, Delaware</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <h1 className="text-sm font-extrabold text-cream tracking-wide">
              Raggio Gourmet &amp; Pizza
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <span className="text-xs font-medium text-stone">
              Artisanal Stone-Baked Pizzas &amp; Gourmet Kitchen
            </span>
          </div>
        </div>

        {/* Background Images with LCP Optimization (First slide high-priority preload, others lazy) */}
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.seoAlt}
                title={slide.seoAlt}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'low'}
                loading={index === 0 ? 'eager' : 'lazy'}
                quality={index === 0 ? 68 : 72}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 100vw, 1920px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/50" />
            </div>
          );
        })}

        {/* Dynamic Center Slide Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-6 lg:mt-8">
          <div key={current} className="transition-all duration-300">
            <span className="inline-block text-[11px] font-mono tracking-widest text-gold bg-black/60 border border-gold/40 px-3.5 py-1 rounded-full mb-3 uppercase shadow-lg backdrop-blur-sm">
              {activeSlide.tag}
            </span>

            {/* Semantic H2 Product Name for each slide (maintains perfect SEO hierarchy under static H1) */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-cream mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {activeSlide.title}
            </h2>

            <p className="text-cream/90 text-sm md:text-lg max-w-2xl mx-auto mb-8 font-medium leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              {activeSlide.description}
            </p>

            <a
              href={activeSlide.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              title={`${activeSlide.ctaText} Online`}
              className="inline-block bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-[#1c1408] font-extrabold px-8 py-3.5 md:px-10 md:py-4 rounded-full shadow-[0_4px_25px_rgba(201,161,92,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95"
            >
              {activeSlide.ctaText}
            </a>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`View slide ${index + 1}`}
              className="p-2 flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index ? 'w-8 bg-gold-bright' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous image"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-all cursor-pointer active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-all cursor-pointer active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>
    </>
  );
}