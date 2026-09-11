'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import InstallAppButton from './InstallAppButton';

interface PinItem {
  label: string;
  top: number;
  left: number;
}

interface SlideItem {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  seoAlt: string;
  pins: PinItem[];
  glowColor: string;
}

interface HeroSliderProps {
  lang?: string;
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

const DEFAULT_SLIDES: SlideItem[] = [
  {
    tag: 'SPECIALTY PIZZA',
    title: 'Signature Meat Lover’s',
    description: 'Packed with beef pepperoni, sausage, bacon, and ham on our stone-baked crust for true meat lovers.',
    ctaText: 'Order Meat Lover’s',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-meatlover-clean.png',
    seoAlt: 'Signature Meat Lovers Pizza - Raggio Gourmet Newark DE',
    pins: [
      { label: 'Loaded with 4 Artisan Meats', top: 22, left: 24 },
      { label: 'Grande Mozzarella', top: 18, left: 62 },
    ],
    glowColor: 'rgba(212, 154, 85, 0.28)',
  },
  {
    tag: 'HOUSE FAVORITE',
    title: 'Spicy Buffalo Chicken',
    description: 'Tender chicken tossed in fiery buffalo glaze with artisanal spiral ranch drizzle and melted mozzarella on stone-baked crust.',
    ctaText: 'Try Buffalo Chicken',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-buffalo-clean.png',
    seoAlt: 'Spicy Buffalo Chicken Pizza - Raggio Gourmet Newark DE',
    pins: [
      { label: 'Fiery Buffalo Glaze', top: 24, left: 22 },
      { label: 'Creamy Ranch Drizzle', top: 54, left: 58 },
    ],
    glowColor: 'rgba(234, 88, 12, 0.26)',
  },
  {
    tag: 'CLASSIC SPECIALTY',
    title: 'Artisanal Pepperoni',
    description: 'Crispy cupped beef pepperoni, melted Grande Mozzarella, rich San Marzano tomato sauce, and fresh basil on stone-baked crust.',
    ctaText: 'Order Pepperoni',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-pepperoni-clean.png',
    seoAlt: 'Artisanal Pepperoni Pizza - Raggio Gourmet Newark DE',
    pins: [
      { label: 'Crispy Cupped Pepperoni', top: 26, left: 30 },
      { label: 'Fresh Basil Leaves', top: 46, left: 48 },
    ],
    glowColor: 'rgba(225, 29, 72, 0.25)',
  },
  {
    tag: "CHEF'S SIGNATURE",
    title: 'White Spinach & Ricotta',
    description: 'Fresh baby spinach, velvety whole-milk ricotta, garlic-infused olive oil, and melted mozzarella on stone-baked blistered crust.',
    ctaText: 'Try White Spinach',
    ctaLink: 'https://phillystyleexpress.foodtecsolutions.com/',
    image: '/images/pizza-spinach-clean.png',
    seoAlt: 'White Spinach and Ricotta Pizza - Raggio Gourmet Newark DE',
    pins: [
      { label: 'Whole Milk Ricotta', top: 28, left: 50 },
      { label: 'Garlic Infused Oil', top: 52, left: 38 },
    ],
    glowColor: 'rgba(34, 197, 94, 0.22)',
  },
];

export default function HeroSlider({ dict, lang = 'en' }: HeroSliderProps) {
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
      className="relative w-full overflow-hidden bg-ink pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-16 lg:pb-24 select-none"
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

      {/* CONSTRAINED LUXURY CONTAINER: Anchored to max-w-7xl to prevent wide-screen dispersion */}
      <div className="max-w-7xl 2xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 overflow-visible relative">
        
        {/* MASTER HERO CARD PRESENTATION */}
        <div className="w-full relative min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] xl:min-h-[640px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-gradient-to-b from-[#15171d]/90 via-[#101216]/95 to-[#0b0c0f] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center overflow-visible">

          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-12 xl:px-14 py-8 lg:py-12 relative overflow-visible">

            {/* LEFT EDITORIAL COLUMN */}
            <div className="w-full lg:max-w-[48%] xl:max-w-[46%] z-20 flex flex-col justify-center text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#e6c884] mb-3 sm:mb-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#d8b467] shadow-[0_0_8px_rgba(216,180,103,0.9)]" />
                <span>{activeSlide.tag}</span>
              </div>

              {/* Title - Bold & Impactful */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.06] mb-3 sm:mb-4 drop-shadow-md">
                {activeSlide.title}
              </h2>

              {/* Description */}
              <p className="text-white/70 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md mb-6 sm:mb-8">
                {activeSlide.description}
              </p>

              {/* SIGNATURE FLAT BUTTONS (NO GRADIENTS) */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <a
                  href={activeSlide.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-bold shadow-md"
                >
                  <span>{activeSlide.ctaText}</span>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>

                <a
                  href="#menu"
                  className="btn-charcoal px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-medium shadow-md"
                >
                  <span>{dict?.hero?.cta || 'View Menu'}</span>
                </a>

                <InstallAppButton lang={lang}>
                  <button
                    type="button"
                    className="btn-charcoal px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-medium shadow-md inline-flex items-center gap-2 text-gold hover:text-gold-bright hover:border-gold/50 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{lang === 'es' ? 'Instalar App' : 'Install App'}</span>
                  </button>
                </InstallAppButton>
              </div>

              {/* STORYLINE PROGRESS INDICATOR (Segmented Gold Bars) */}
              <div className="flex items-center gap-2 mt-8 lg:mt-12">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrent(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className="py-2 cursor-pointer focus:outline-none group"
                  >
                    <div className="w-8 sm:w-14 h-1 rounded-full bg-white/20 overflow-hidden transition-colors group-hover:bg-white/40">
                      <div
                        className={`h-full bg-[#c9a15c] transition-all duration-500 rounded-full ${
                          current === dotIdx ? 'w-full shadow-[0_0_10px_rgba(201,161,92,0.9)]' : 'w-0'
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* RIGHT 3D PRODUCT COLUMN WITH OVERFLOW (ANCHORED & PROPORTIONAL) */}
            <div className="w-full lg:w-auto lg:absolute lg:right-[-6%] xl:right-[-7%] 2xl:right-[-8%] lg:top-[53%] lg:-translate-y-1/2 flex items-center justify-center overflow-visible z-20 pointer-events-none mt-6 lg:mt-0">
              
              {/* Ambient Glow */}
              <div
                className="absolute w-[340px] sm:w-[480px] lg:w-[680px] xl:w-[760px] 2xl:w-[820px] h-[340px] sm:h-[480px] lg:h-[680px] xl:h-[760px] 2xl:h-[820px] rounded-full blur-3xl pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(circle, ${activeSlide.glowColor} 0%, transparent 65%)`,
                }}
              />

              {/* 3D Overflowing Product Container */}
              <div className="relative w-[320px] sm:w-[460px] md:w-[560px] lg:w-[680px] xl:w-[760px] 2xl:w-[820px] aspect-[16/11] overflow-visible">
                
                {/* Hotspot Pins */}
                {activeSlide.pins && activeSlide.pins.map((pin, pIdx) => (
                  <div
                    key={pIdx}
                    style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                    className="absolute z-30 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121417]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.6)] pointer-events-auto select-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e3c383] shadow-[0_0_6px_#e3c383]" />
                    <span>{pin.label}</span>
                  </div>
                ))}

                <Image
                  src={activeSlide.image}
                  alt={activeSlide.seoAlt}
                  fill
                  priority
                  quality={92}
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 640px, (max-width: 1440px) 980px, 1120px"
                  className="object-contain filter drop-shadow-[0_28px_40px_rgba(0,0,0,0.85)] select-none"
                />
              </div>

            </div>

            {/* GLOBAL NAVIGATION ARROWS (BOTTOM RIGHT) */}
            <div className="absolute z-30 right-4 sm:right-8 lg:right-10 bottom-4 sm:bottom-6 flex items-center gap-2">
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

      </div>
    </section>
  );
}