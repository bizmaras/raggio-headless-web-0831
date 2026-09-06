'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AIChatBot = dynamic(() => import('./AIChatBot'), { ssr: false });
const WelcomePopup = dynamic(() => import('./WelcomePopup'), { ssr: false });

export default function DeferredWidgets() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // Defer mounting heavy interactive widgets until the browser main thread is idle
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(
          () => setShouldMount(true),
          { timeout: 2500 }
        );
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(() => setShouldMount(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!shouldMount) return null;

  return (
    <>
      <AIChatBot />
      <WelcomePopup />
    </>
  );
}
