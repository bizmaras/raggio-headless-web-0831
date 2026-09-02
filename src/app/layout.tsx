import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://raggiogourmetpizza.com'),
  title: 'Raggio Gourmet & Pizza | Authentic Pizza & Catering in Newark, DE',
  description: 'Order fresh gourmet pizzas, strombolis, calzones, wings, and catering online directly via FoodTec. Fast delivery and pickup in Newark, DE.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Raggio Gourmet & Pizza | Newark, DE',
    description: 'Fresh gourmet pizzas, handcrafted strombolis, wings, and full catering services.',
    url: 'https://raggiogourmetpizza.com',
    siteName: 'Raggio Gourmet & Pizza',
    images: [
      {
        url: '/images/raggio-logo.png',
        width: 1200,
        height: 630,
        alt: 'Raggio Gourmet & Pizza Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raggio Gourmet & Pizza',
    description: 'Fresh gourmet pizzas, calzones, and catering in Newark, DE.',
    images: ['/images/raggio-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload primary hero image to eliminate LCP delay and achieve 100/100 performance */}
        <link
          rel="preload"
          href="/images/hero-pepperoni.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body className="bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}