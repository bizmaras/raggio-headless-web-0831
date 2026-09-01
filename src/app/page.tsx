import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoryRail from '../components/CategoryRail';
import PromotionsSection from '../components/PromotionsSection';
import MenuItemCard from '../components/MenuItemCard';
import CateringItemCard from '../components/CateringItemCard';
import CateringSection from '../components/CateringSection';
import Footer from '../components/Footer';
import { Download } from 'lucide-react';

interface MenuItem {
  'Product Name': string;
  Description: string;
  Price: string;
  Category: string;
  Slug: string;
  Featured: string;
}

// Eksik olan Calzone çeşitleri
const EXTRA_CALZONES: MenuItem[] = [
  {
    Category: 'Strombolis + Calzones',
    'Product Name': 'Cheese Calzone',
    Price: '15.99',
    Description: 'Folded pizza dough stuffed with Grande Mozzarella, creamy Ricotta cheese, and served with a side of homemade marinara sauce.',
    Slug: 'cheese-calzone',
    Featured: 'false'
  }
];

async function getMenuItems(): Promise<MenuItem[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'raggio_menu.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse<MenuItem>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // CSV verileri ile eksik Calzone'ları birleştiriyoruz
  return [...parsed.data, ...EXTRA_CALZONES];
}

export default async function HomePage() {
  const menuItems = await getMenuItems();
  const categories = Array.from(new Set(menuItems.map((item) => item.Category))).filter(Boolean);

  // 100/100 Google SEO, GEO & Rich Snippets JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Raggio Gourmet & Pizza',
    image: 'https://raggio.pizza/images/raggio-logo.png',
    '@id': 'https://raggio.pizza/#restaurant',
    url: 'https://raggio.pizza',
    telephone: '+13023690553',
    priceRange: '$$',
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
      latitude: 39.6385108,
      longitude: -75.7289352,
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Weekly Pizza & Catering Specials',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MenuItem',
            name: '2 Large Plain Cheese Pizzas Special',
            description: 'Two 16" stone-baked deck-oven cheese pizzas with 100% Grande Mozzarella.',
          },
          price: '29.99',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MenuItem',
            name: 'Delaware Family Bundle',
            description: '16" 1-topping pizza, 10 wings, and 2-liter soda.',
          },
          price: '31.99',
          priceCurrency: 'USD',
        },
      ],
    },
    menu: 'https://raggio.pizza/#menu',
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-ink text-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <HeroSlider />
        <CategoryRail />
        <PromotionsSection />

        <section id="menu" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[210px]">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright">
              Our Menu
            </h2>

            <a
              href="/raggio-full-menu.pdf"
              download
              className="inline-flex items-center gap-2 bg-panel border border-panel-border hover:border-gold text-stone hover:text-cream text-xs font-bold px-4 py-2.5 rounded-full transition-all"
            >
              <Download className="w-4 h-4 text-gold" />
              Download Full PDF Menu
            </a>
          </div>

          {categories.map((category) => {
            const itemsInCategory = menuItems.filter((item) => item.Category === category);
            const targetId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

            return (
              <div key={category} id={targetId} className="mb-16 scroll-mt-[210px]">
                <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-panel-border text-cream flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-sm font-normal text-gold-bright">
                    {itemsInCategory.length} items
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {itemsInCategory.map((item, idx) => (
                    <MenuItemCard
                      key={idx}
                      name={item['Product Name']}
                      price={parseFloat(item.Price) || 0}
                      description={item.Description}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <CateringSection />
      </main>

      <Footer />
    </>
  );
}