/**
 * RestaurantJsonLd — the ONE site-wide structured-data block (rendered in [lang]/layout).
 *
 * Previously two Restaurant blocks shipped on the home page (layout + page.tsx) with
 * conflicting @id hosts (apex vs www) and conflicting geo coordinates. Google treats
 * that as ambiguous entity data. This single @graph is now the source of truth.
 *
 * Canonical host: https://www.raggiogourmetpizza.com (apex 308-redirects to www).
 * NAP + hours must match Google Business Profile and src/config/ordering.ts.
 * OWNER-CONFIRM: geo coordinates — verify against the Google Business Profile pin.
 */
import { ORDER_LINKS, STORE } from '@/config/ordering';

const SITE = 'https://www.raggiogourmetpizza.com';

export default function RestaurantJsonLd({ lang = 'en' }: { lang?: string }) {
  const inLanguage = lang === 'es' ? 'es-US' : 'en-US';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        '@id': `${SITE}/#restaurant`,
        name: 'Raggio Gourmet & Pizza',
        url: SITE,
        logo: `${SITE}/images/raggio-logo.png`,
        image: [
          `${SITE}/images/og/raggio-og.jpg`,
          `${SITE}/images/dishes/pizza-buffalo-chicken-pizza-luxury-8k.png`,
          `${SITE}/images/dishes/cheesesteak-philly-cheesesteak-luxury-8k.png`,
        ],
        telephone: '+1-302-369-0553',
        priceRange: '$$',
        servesCuisine: ['Pizza', 'Italian', 'American', 'Cheesesteaks', 'Chicken Wings', 'Latin American'],
        acceptsReservations: false,
        currenciesAccepted: 'USD',
        paymentAccepted: 'Cash, Credit Card',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '681 E Chestnut Hill Rd',
          addressLocality: 'Newark',
          addressRegion: 'DE',
          postalCode: '19713',
          addressCountry: 'US',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 39.6644, longitude: -75.7297 },
        hasMap: 'https://www.google.com/maps/search/?api=1&query=681+E+Chestnut+Hill+Rd,+Newark,+DE+19713',
        areaServed: [
          { '@type': 'City', name: 'Newark, Delaware' },
          { '@type': 'CollegeOrUniversity', name: 'University of Delaware' },
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: STORE.hours[0].open,
            closes: STORE.hours[0].close,
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Friday', 'Saturday'],
            opens: STORE.hours[5].open,
            closes: STORE.hours[5].close,
          },
        ],
        hasMenu: `${SITE}/${lang}#menu`,
        potentialAction: {
          '@type': 'OrderAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: ORDER_LINKS.pizza,
            inLanguage,
            actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
          },
          deliveryMethod: [
            'http://purl.org/goodrelations/v1#DeliveryModePickUp',
            'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'Raggio Gourmet & Pizza',
        inLanguage: ['en-US', 'es-US'],
        publisher: { '@id': `${SITE}/#restaurant` },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE}/${lang}#webpage`,
        url: `${SITE}/${lang}`,
        name: lang === 'es'
          ? 'Raggio Gourmet & Pizza — Pizza gourmet, cheesesteaks y catering en Newark, DE'
          : 'Raggio Gourmet & Pizza — Gourmet pizza, cheesesteaks & catering in Newark, DE',
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#restaurant` },
        primaryImageOfPage: `${SITE}/images/og/raggio-og.jpg`,
        inLanguage,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
