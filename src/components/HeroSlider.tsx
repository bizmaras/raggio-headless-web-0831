'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    tag: 'DECK OVEN CLASSIC',
    title: 'Artisanal Pepperoni Pizza',
    description: 'Loaded with crispy pepperoni and 100% Grande Mozzarella on stone-baked crust. Best in Newark, DE.',
    ctaText: 'Order Pepperoni Pizza',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-pepperoni.jpg',
    seoAlt: 'Artisanal Pepperoni Pizza at Raggio Gourmet in Newark, Delaware',
  },
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with pepperoni, sausage, bacon, and ham on our deck-oven crust for true meat lovers.',
    ctaText: 'Order Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-meatlover.jpg',
    seoAlt: 'Signature Meat Lovers Pizza Delivery in Newark, DE',
  },
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken Pizza',
    description: 'Tender chicken tossed in spicy buffalo sauce with creamy ranch drizzle. A Delaware local favorite.',
    ctaText: 'Order Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-buffalo.jpg',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark',
  },
  {
    tag: 'GOURMET SELECTION',
    title: 'Fresh Spinach & Garlic Gourmet',
    description: 'Sauteed fresh spinach, garlic, ricotta, and extra virgin olive oil. Perfect for catering and events.',
    ctaText: 'Order Gourmet Pizza',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/hero-spinach.jpg',
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
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      /* Shorter on mobile, near full-screen (85vh) on desktop */
      className="relative h-[65vh] lg:h-[85vh] w-full flex flex-col justify-center overflow-hidden border-b border-panel-border bg-ink touch-pan-y"
      aria-label="Raggio Gourmet Pizza Specials in Newark, DE"
    >
      {/* Background Images */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.seoAlt}
              title={slide.seoAlt}
              fill
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              quality={index === 0 ? 65 : 55}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/40 to-[#121417]/60" />
          </div>
        );
      })}

      {/* Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12 lg:mt-0">

        {/* Location Tag */}
        <div className="flex items-center gap-1.5 text-gold-bright mb-4 opacity-90 drop-shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-bold tracking-widest uppercase">Newark, Delaware</span>
        </div>

        {/* Typography Gold Badge */}
        <div className="mb-4">
          <span className="text-[#D4AF37] font-extrabold text-sm md:text-base tracking-[0.25em] uppercase drop-shadow-md">
            RAGGIO GOURMET PIZZA
          </span>
        </div>

        <div key={current} className="transition-all duration-300">
          <span className="inline-block text-[11px] font-mono tracking-widest text-gold bg-black/50 border border-gold/30 px-3.5 py-1 rounded-full mb-3 uppercase shadow-lg">
            {activeSlide.tag}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-cream mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {activeSlide.title}
          </h1>

          <p className="text-cream/90 text-sm md:text-lg max-w-2xl mx-auto mb-8 font-medium leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
            {activeSlide.description}
          </p>

          <a
            href={activeSlide.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            title={`Order ${activeSlide.title} Online`}
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
              className={`h-2 rounded-full transition-all duration-300 ${current === index ? 'w-8 bg-gold-bright' : 'w-2 bg-white/60 hover:bg-white'
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
  );
}