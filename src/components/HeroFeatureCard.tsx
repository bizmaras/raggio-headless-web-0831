'use client';

import Image from 'next/image';

export interface PinItem {
  label: string;
  top: number; // percentage (e.g. 25)
  left: number; // percentage (e.g. 35)
}

export interface HeroFeatureCardProps {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  seoAlt: string;
  pins?: PinItem[];
  glowColor?: string;
  priority?: boolean;
}

export default function HeroFeatureCard({
  tag,
  title,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText = 'View Menu',
  secondaryCtaLink = '#menu',
  image,
  seoAlt,
  pins,
  glowColor = 'rgba(212, 154, 85, 0.22)',
  priority = false,
}: HeroFeatureCardProps) {
  return (
    <div className="w-full relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-gradient-to-b from-[#14171d]/85 via-[#101217]/90 to-[#0c0e12]/95 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 sm:p-8 lg:p-12 flex items-center overflow-visible">
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center overflow-visible">
        
        {/* LEFT EDITORIAL COLUMN */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-left z-20">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#e6c884] mb-3 sm:mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#d8b467] shadow-[0_0_8px_rgba(216,180,103,0.9)]" />
            <span>{tag}</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-extrabold text-white tracking-tight leading-[1.08] mb-3 sm:mb-4 drop-shadow-md">
            {title}
          </h2>

          {/* Appetizing Description */}
          <p className="text-white/70 text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-lg mb-6 sm:mb-8 line-clamp-3">
            {description}
          </p>

          {/* SIGNATURE MODEL 2 BUTTONS (SATIN GOLD & FROSTED CHARCOAL) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-extrabold shadow-lg"
            >
              <span>{ctaText}</span>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>

            <a
              href={secondaryCtaLink}
              className="btn-charcoal px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-bold"
            >
              <span>{secondaryCtaText}</span>
            </a>
          </div>

        </div>

        {/* RIGHT 3D OVERFLOW PRODUCT COLUMN */}
        <div className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center lg:justify-end overflow-visible min-h-[260px] sm:min-h-[340px] lg:min-h-[440px]">
          
          {/* Ambient Per-Product Background Glow (Static, High Performance) */}
          <div
            className="absolute w-[280px] sm:w-[360px] lg:w-[480px] h-[280px] sm:h-[360px] lg:h-[480px] rounded-full blur-3xl pointer-events-none -z-10"
            style={{
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            }}
          />

          {/* 3D Overflowing Product Container - Visually overflows past the right card boundary on desktop */}
          <div className="relative w-[280px] sm:w-[360px] md:w-[420px] lg:w-[500px] xl:w-[560px] aspect-[16/11] lg:translate-x-12 xl:translate-x-16 transition-none overflow-visible">
            
            {/* Interactive Hotspot Pins */}
            {pins && pins.map((pin, pIdx) => (
              <div
                key={pIdx}
                style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                className="absolute z-30 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121417]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.6)] pointer-events-auto select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e3c383] shadow-[0_0_6px_#e3c383]" />
                <span>{pin.label}</span>
              </div>
            ))}

            {/* Dominant Artisanal Pizza Image (NO WOODEN BOARD, 3D TILT, NATURAL SHADOW) */}
            <Image
              src={image}
              alt={seoAlt}
              fill
              priority={priority}
              quality={92}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 560px"
              className="object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] select-none pointer-events-none"
            />
          </div>

        </div>

      </div>

    </div>
  );
}