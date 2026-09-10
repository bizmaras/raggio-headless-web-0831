import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Raggio Gourmet & Pizza',
    short_name: 'Raggio Pizza',
    description: 'Authentic stone-baked pizza, strombolis, calzones, cheesesteaks and gourmet catering in Newark, DE.',
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    background_color: '#101216',
    theme_color: '#101216',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}