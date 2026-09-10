'use client';

import Image from 'next/image';
import { MapPin, Phone, Clock } from 'lucide-react';
import InstallAppButton from './InstallAppButton';

interface FooterProps {
  dict?: {
    footer?: {
      description?: string;
      address?: string;
      phone?: string;
      store_hours?: string;
      hours_week?: string;
      hours_weekend?: string;
      get_directions?: string;
      all_rights?: string;
      powered_by?: string;
    };
  };
}

export default function Footer({ dict }: FooterProps) {
  const descriptionText = dict?.footer?.description ||
    'Serving Newark, Delaware with artisanal stone-baked pizzas, authentic Philly cheesesteaks, fresh pastas, and full-service event catering.';
  const storeHoursText = dict?.footer?.store_hours || 'Store Hours';
  const hoursWeekText = dict?.footer?.hours_week || 'Sunday – Thursday: 9:00 AM – 9:00 PM';
  const hoursWeekendText = dict?.footer?.hours_weekend || 'Friday – Saturday: 9:00 AM – 10:00 PM';
  const getDirectionsText = dict?.footer?.get_directions || 'Get Directions via Google Maps';
  const allRightsText = dict?.footer?.all_rights || 'All rights reserved.';
  const poweredByText = dict?.footer?.powered_by || 'Online Ordering Powered by FoodTec Solutions';

  return (
    <footer
      id="location"
      className="bg-ink border-t border-panel-border text-cream pt-16 pb-32 lg:pb-20 px-6 scroll-mt-[150px] md:scroll-mt-[270px] min-h-[75vh]"
      style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 250px) + 20px)' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">

        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-48">
              <Image
                src="/images/raggio-logo.png"
                alt="Raggio Gourmet & Pizza"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          <p className="text-stone text-sm leading-relaxed max-w-md">
            {descriptionText}
          </p>

          <div className="space-y-3 text-sm text-stone">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span className="text-stone">681 E Chestnut Hill Rd, Newark, DE 19713</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <a
                href="tel:+13023690553"
                className="hover:text-gold transition-colors font-semibold text-cream py-2.5 inline-flex items-center min-h-[44px]"
              >
                (302) 369-0553
              </a>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-cream font-medium mb-1">{storeHoursText}</p>
                <p className="text-xs text-stone font-medium">{hoursWeekText}</p>
                <p className="text-xs text-stone font-medium">{hoursWeekendText}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <a
              href="https://maps.google.com/?q=681+E+Chestnut+Hill+Rd,+Newark,+DE+19713"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-panel border border-panel-border text-gold-bright hover:bg-gold hover:text-[#1c1408] font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-200"
            >
              {getDirectionsText}
            </a>
            <InstallAppButton />
          </div>
        </div>

        <div className="lg:col-span-7 h-[340px] rounded-2xl overflow-hidden border border-panel-border shadow-2xl relative bg-panel">
          <iframe
            title="Raggio Gourmet & Pizza Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.7663363071374!2d-75.72893522345598!3d39.63851087157648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c703ec5e1b59ef%3A0x6b4f74f762a4d3f2!2s681%20E%20Chestnut%20Hill%20Rd%2C%20Newark%2C%20DE%2019713!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.8) contrast(1.2) invert(0.9) hue-rotate(180deg)' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-panel-border/60 flex flex-col md:flex-row items-center justify-between text-xs text-stone font-medium gap-4">
        <p>© {new Date().getFullYear()} Raggio Gourmet &amp; Pizza. {allRightsText}</p>
        <p>{poweredByText}</p>
      </div>
    </footer>
  );
}