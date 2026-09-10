'use client';

import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  relativeTime: string;
  text: string;
  authorPhoto?: string;
}

interface GooglePlacesData {
  rating: number;
  userRatingCount: number;
  openNow: boolean;
  googleMapsUri: string;
  reviews: ReviewItem[];
}

interface GoogleReviewsSectionProps {
  dict?: {
    reviews?: {
      badge?: string;
      title?: string;
      subtitle?: string;
      view_on_google?: string;
      write_review?: string;
      based_on?: string;
      verified_customer?: string;
    };
  };
}

const INITIAL_DATA: GooglePlacesData = {
  rating: 4.2,
  userRatingCount: 211,
  openNow: true,
  googleMapsUri: 'https://maps.google.com/?cid=15455648801844789852',
  reviews: [
    {
      id: 'rev-1',
      author: 'J S',
      rating: 5,
      relativeTime: '1 month ago',
      text: 'Food here was amazing! I ordered a Philly cheesesteak pizza with white sauce and a beef pepperoni pizza. It was fresh, well portioned, and the guy who made them was very nice. I will be coming back here.',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjUpCa3SGa0vsjPDBpfebzvTXs4PRrWmHr1EvV_YDqxVGfjDfjz2=s128-c0x00000000-cc-rp-mo-ba3',
    },
    {
      id: 'rev-2',
      author: 'John McConnell',
      rating: 5,
      relativeTime: 'a year ago',
      text: 'Very clean and very friendly. The owner is a really nice guy, very passionate about his food. The cheesesteaks are really good, filled just right. Great crust on the pizza, thin on the deck and holds really well. True mozzarella! This family cares about quality.',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjXuHG4DVp8ysQYUSB9pv9NwcXOrmE_DkZ9iXo3NdP5G71pT8mbN=s128-c0x00000000-cc-rp-mo-ba3',
    },
    {
      id: 'rev-3',
      author: 'Brad Beebe',
      rating: 5,
      relativeTime: '3 months ago',
      text: 'The cook is from El Salvador. The empanadas are legit, don\'t sleep on the pupusas. Lots of other fare... cheesesteaks, subs, breakfast. Very steady traffic, very accommodating.',
      authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocLxMU66Ut8c8CjwwFpxBnH9AH78LCV05lmG4oMTFfTSdldrRQ=s128-c0x00000000-cc-rp-mo-ba5',
    },
    {
      id: 'rev-4',
      author: 'Colleen Mooney',
      rating: 5,
      relativeTime: '9 months ago',
      text: 'Tried them tonight. Pizza was very cheesy with large slices. Thicker than most, but good! Wings were tasty. Very personable staff.',
      authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocKht-TPD0HKik3j4TgFu8pXDhCt8nDRjuhbO1eJvPmvLySD9A=s128-c0x00000000-cc-rp-mo',
    },
  ],
};

export default function GoogleReviewsSection({ dict }: GoogleReviewsSectionProps) {
  const [data, setData] = useState<GooglePlacesData>(INITIAL_DATA);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/google-places')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json && json.reviews?.length > 0) {
          setData(json);
        }
      })
      .catch(() => {
        // Keeps graceful INITIAL_DATA fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const badgeText = dict?.reviews?.badge || 'VERIFIED GOOGLE REVIEWS';
  const titleText = dict?.reviews?.title || 'Loved by Newark Locals';
  const subtitleText =
    dict?.reviews?.subtitle ||
    'Real feedback from our neighbors, families, and university students across Delaware.';
  const viewOnGoogleText = dict?.reviews?.view_on_google || 'View on Google Maps';
  const writeReviewText = dict?.reviews?.write_review || 'Write a Review';
  const basedOnText = dict?.reviews?.based_on || `Based on ${data.userRatingCount}+ verified reviews`;
  const verifiedCustomerText = dict?.reviews?.verified_customer || 'Verified Customer';

  const writeReviewUrl = `https://search.google.com/local/writereview?placeid=ChIJ37Ox2q8Ax4kRXAKgVjHqfNY`;

  return (
    <section
      id="reviews"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-[150px] md:scroll-mt-[270px]"
      style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 250px) + 20px)' }}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 px-3 py-1 rounded-full shadow-sm mb-3">
            {/* Google G Multi-Color Icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span className="text-gold-bright text-xs font-bold tracking-wider uppercase">
              {badgeText}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-cream tracking-tight">
            {titleText}
          </h2>
          <p className="text-stone text-sm sm:text-base mt-2 max-w-xl">
            {subtitleText}
          </p>
        </div>

        {/* Global Rating & Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-panel border border-panel-border px-4 py-3 rounded-2xl">
            <span className="text-3xl font-extrabold text-gold-bright">{data.rating.toFixed(1)}</span>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(data.rating)
                        ? 'fill-gold text-gold'
                        : i < data.rating
                        ? 'fill-gold/50 text-gold'
                        : 'text-stone-dim'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-stone font-medium block mt-0.5">
                {basedOnText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={data.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-ink border border-panel-border hover:border-gold text-cream hover:text-gold text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <span>{viewOnGoogleText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-4 py-2.5 text-xs sm:text-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{writeReviewText}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.reviews.map((review) => (
          <div
            key={review.id}
            className="bg-panel border border-panel-border rounded-2xl p-6 flex flex-col justify-between hover:border-gold hover:shadow-[0_0_22px_rgba(201,161,92,0.35)] hover:-translate-y-0.5 transition-all duration-300 group relative"
          >
            <div>
              {/* Header: Author Avatar & Stars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.authorPhoto ? (
                    <img
                      src={review.authorPhoto}
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover border border-gold/30"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 text-gold font-bold flex items-center justify-center text-sm">
                      {review.author.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-bold text-cream group-hover:text-gold-bright transition-colors line-clamp-1">
                      {review.author}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-stone">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{verifiedCustomerText}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gold">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone leading-relaxed italic line-clamp-5">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>

            {/* Footer Relative Date & Google attribution */}
            <div className="pt-4 mt-4 border-t border-panel-border/50 flex items-center justify-between text-[11px] text-stone-dim">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {review.relativeTime}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-gold/60">
                Google Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
