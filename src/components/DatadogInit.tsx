'use client';

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

export default function DatadogInit() {
  useEffect(() => {
    const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
    const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;
    const site = process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com';
    const service = process.env.NEXT_PUBLIC_DATADOG_SERVICE || 'raggio-headless-web';
    const env = process.env.NEXT_PUBLIC_DATADOG_ENV || process.env.NODE_ENV || 'development';

    if (!applicationId || !clientToken) {
      return;
    }

    try {
      datadogRum.init({
        applicationId,
        clientToken,
        site,
        service,
        env,
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
  }, []);

  return null;
}
