export default function RestaurantJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://raggiogourmetpizza.com/#restaurant',
    name: 'Raggio Gourmet & Pizza',
    image: [
      'https://raggiogourmetpizza.com/images/raggio-logo.png',
      'https://raggiogourmetpizza.com/window.svg',
    ],
    url: 'https://raggiogourmetpizza.com',
    telephone: '+1-302-369-0553',
    priceRange: '$$',
    menu: 'https://raggiogourmetpizza.com/en#menu',
    servesCuisine: [
      'Pizza',
      'Italian',
      'Gourmet Pizza',
      'Calzones',
      'Strombolis',
      'Philly Cheesesteaks',
      'Chicken Wings',
      'Catering',
    ],
    acceptsReservations: 'False',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '681 E Chestnut Hill Rd',
      addressLocality: 'Newark',
      addressRegion: 'DE',
      postalCode: '19713',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.6644,
      longitude: -75.7297,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '09:00',
        closes: '22:00',
      },
    ],
    hasMap: 'https://maps.google.com/?q=681+E+Chestnut+Hill+Rd,+Newark,+DE+19713',
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://raggiogourmetpizza.com/en#menu',
        inLanguage: ['en', 'es'],
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: [
        'http://purl.org/goodrelations/v1#DeliveryModePickUp',
        'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
