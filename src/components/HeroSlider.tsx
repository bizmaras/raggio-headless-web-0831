'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const activeSlide = slides[current] || slides[0];

  return (
    <section
      className="relative h-[520px] md:h-[580px] w-full overflow-hidden border-b border-panel-border bg-ink"
      aria-label="Raggio Gourmet Pizza Specials in Newark, DE"
    >
      {/* Background Images Layer (Optimized with next/image for sub-1.5s LCP) */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.seoAlt}
              title={slide.seoAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className={`object-cover saturate-125 contrast-110 transition-transform duration-[4000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'
                }`}
            />

            {/* Dark Overlay Gradients for Enhanced Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/50 to-transparent" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        );
      })}

      {/* Hero Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto h-full px-6 flex flex-col items-center justify-center text-center">
        {/* GEO Location Badge */}
        <div className="flex items-center gap-1.5 text-gold-bright mb-4 opacity-90 drop-shadow-md">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Newark, Delaware</span>
        </div>

        {/* Brand Logo */}
        <div className="relative w-48 md:w-64 h-16 mb-4">
          <Image
            src="/images/raggio-logo.png"
            alt="Raggio Gourmet & Pizza - Newark, DE"
            fill
            priority
            className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
          />
        </div>

        <div key={current} className="transition-all duration-500">
          <span className="inline-block text-[11px] font-mono tracking-widest text-gold bg-black/50 backdrop-blur-sm border border-gold/30 px-3.5 py-1 rounded-full mb-3 uppercase shadow-lg">
            {activeSlide.tag}
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-cream mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {activeSlide.title}
          </h1>

          <p className="text-cream/90 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
            {activeSlide.description}
          </p>

          <a
            href={activeSlide.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            title={`Order ${activeSlide.title} Online`}
            className="inline-block bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-[#1c1408] font-extrabold px-8 py-3.5 rounded-full shadow-[0_4px_25px_rgba(201,161,92,0.6)] hover:shadow-[0_6px_35px_rgba(201,161,92,0.8)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {activeSlide.ctaText}
          </a>
        </div>

        {/* Navigation Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous image"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all hover:scale-110 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all hover:scale-110 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots (Optimized Touch Targets for WCAG Accessibility Standards) */}
        <div className="absolute bottom-4 flex gap-1 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`View slide ${index + 1}`}
              className="p-3 flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <span
                className={`h-2 rounded-full transition-all duration-500 ${current === index ? 'w-8 bg-gold-bright' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}