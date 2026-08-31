import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoryRail from '../components/CategoryRail';
import PromotionsSection from '../components/PromotionsSection';
import MenuItemCard from '../components/MenuItemCard';
import CateringItemCard from '../components/CateringItemCard';
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

async function getMenuItems(): Promise<MenuItem[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'raggio_menu.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse<MenuItem>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data;
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
    // High-Intent GEO & Search Engine OfferCatalog Schema
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
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <HeroSlider />
        <CategoryRail />
        <PromotionsSection />

        {/* Dynamic Digital Menu Section */}
        <section id="menu" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[210px]">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright">
              Our Menu
            </h2>

            {/* Downloadable PDF Menu Link for UX + Fast Performance */}
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

        {/* Catering Section */}
        <section id="catering" className="border-t border-panel-border bg-ink-2 px-6 py-20 scroll-mt-[210px]">
          <div className="max-w-7xl mx-auto text-center mb-14">
            <span className="text-xs font-bold tracking-[0.25em] text-gold uppercase mb-3 block">
              Events &amp; Group Orders
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
              Catering by <span className="text-gold-bright">Raggio</span>
            </h2>
            <p className="text-stone text-lg max-w-2xl mx-auto">
              Feeding a crowd? All trays available in Half or Full size. Order online or call us.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}