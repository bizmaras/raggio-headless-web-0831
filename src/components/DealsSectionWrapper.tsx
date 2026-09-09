'use client';

import { useState, useEffect } from 'react';

export default function DealsSectionWrapper({ children }: { children: React.ReactNode }) {
  const [showDeals, setShowDeals] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#deals') {
      setShowDeals(true);
    }

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ show: boolean }>;
      const shouldShow = customEvent.detail.show;
      setShowDeals(shouldShow);
      if (shouldShow) {
        setTimeout(() => {
          const el = document.getElementById('deals');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 60);
      }
    };

    window.addEventListener('toggle-deals', handleToggle);
    return () => window.removeEventListener('toggle-deals', handleToggle);
  }, []);

  if (!showDeals) return null;

  return (
    <div id="deals" className="scroll-mt-[190px] animate-in fade-in duration-300">
      {children}
    </div>
  );
}