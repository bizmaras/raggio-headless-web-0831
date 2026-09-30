import type { NextConfig } from 'next';

// 'unsafe-eval' is only needed by the Next.js dev server (React refresh); never ship it.
const isDev = process.env.NODE_ENV !== 'production';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://*.datadoghq.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.googleusercontent.com https://*.googleapis.com https://*.gstatic.com https://images.ctfassets.net https://raggiogourmetpizza.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://*.datadoghq.com https://*.browser-intake-datadoghq.com https://places.googleapis.com https://*.googleapis.com https://*.google.com https://script.google.com https://*.foodtecsolutions.com https://raggiogourmetpizza.com;
  frame-src 'self' https://www.google.com https://maps.google.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://*.foodtecsolutions.com;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=(), fullscreen=(self)',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  // No Cross-Origin-Embedder-Policy: the site needs no SharedArrayBuffer, and COEP
  // blocked the Google Maps embed (Lighthouse "Blocked by cross-origin policy").
  {
    key: 'Access-Control-Allow-Origin',
    value: 'https://www.raggiogourmetpizza.com',
  },
  {
    // Legacy XSS auditor is removed from modern browsers and can introduce leaks; OWASP recommends 0.
    key: 'X-XSS-Protection',
    value: '0',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;