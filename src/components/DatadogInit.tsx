'use client';

import { useEffect } from 'react';

export default function DatadogInit() {
  useEffect(() => {
    const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
    const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

    if (!applicationId || !clientToken) {
      return;
    }

    import('@datadog/browser-rum').then(({ datadogRum }) => {
      try {
        datadogRum.init({
          applicationId,
          clientToken,
          site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
          service: process.env.NEXT_PUBLIC_DATADOG_SERVICE || 'raggio-headless-web',
          env: process.env.NEXT_PUBLIC_DATADOG_ENV || process.env.NODE_ENV || 'development',
          version: '1.0.0',
          sessionSampleRate: 100,
          sessionReplaySampleRate: 20,
          trackUserInteractions: true,
          trackResources: true,
          trackLongTasks: true,
          defaultPrivacyLevel: 'mask-user-input',
        });
      } catch (e) {
        console.warn('Datadog RUM initialization skipped or already active:', e);
      }
    });
  }, []);

  return null;
}
