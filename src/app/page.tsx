import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoryRail from '../components/CategoryRail';
import PromotionsSection from '../components/PromotionsSection';
import MenuItemCard from '../components/MenuItemCard';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

// Lazy loading heavy bottom-page components for maximum performance
// Removed { ssr: false } to comply with Next.js Server Component rules
const CateringSection = dynamic(() => import('../components/CateringSection'));
const AIChatBot = dynamic(() => import('../components/AIChatBot'));
const WelcomePopup = dynamic(() => import('../components/WelcomePopup'));

interface MenuItem {
  'Product Name': string;
  Description: string;
  Price: string;
  Category: string;
  Slug: string;
  Featured: string;
}

const EXTRA_CALZONES: MenuItem[] = [
  {
    Category: 'Strombolis + Calzones',
    'Product Name': 'Cheese Calzone',
    Price: '15.99',
    Description: 'Folded pizza dough stuffed with Grande Mozzarella, creamy Ricotta cheese, and served with a side of homemade marinara sauce.',
    Slug: 'cheese-calzone',
    Featured: 'false',
  },
];

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'raggio_menu.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse<MenuItem>(fileContent, { header: true, skipEmptyLines: true });
    return [...parsed.data, ...EXTRA_CALZONES];
  } catch (error) {
    console.error("CSV loading error:", error);
    return EXTRA_CALZONES;
  }
}

export default async function HomePage() {
  const menuItems = await getMenuItems();
  const categories = Array.from(new Set(menuItems.map((item) => item.Category))).filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Raggio Gourmet & Pizza',
    image: 'https://www.raggiogourmetpizza.com/images/raggio-logo.png',
    '@id': 'https://www.raggiogourmetpizza.com/#restaurant',
    url: 'https://www.raggiogourmetpizza.com',
    telephone: '+13023690553',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: '681 E Chestnut Hill Rd', addressLocality: 'Newark', addressRegion: 'DE', postalCode: '19713', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 39.6385108, longitude: -75.7289352 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '09:00', closes: '22:00' },
    ],
    menu: 'https://www.raggiogourmetpizza.com/#menu',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ink text-cream">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <HeroSlider />
        <CategoryRail />

        <div id="deals" className="scroll-mt-[190px]">
          <PromotionsSection />
        </div>

        <section id="menu" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[210px]">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright">Our Menu</h2>
            <a href="/raggio-full-menu.pdf" download className="inline-flex items-center gap-2 bg-panel border border-panel-border hover:border-gold text-stone hover:text-cream text-xs font-bold px-4 py-2.5 rounded-full transition-all">
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Full PDF Menu
            </a>
          </div>

          {categories.map((category) => {
            /* Safe ID generator to prevent app crash on invalid characters */
            const targetId = String(category)
              .toLowerCase()
              .replace(/\s*\+\s*|\s*&\s*/g, '-and-')
              .replace(/[^a-z0-9\-]+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            const itemsInCategory = menuItems.filter((item) => item.Category === category);

            return (
              <div key={category} id={targetId} className="mb-16 scroll-mt-[250px]">
                {/* Adjusted sticky offsets for desktop (180px on md, 220px on lg) */}
                <h3 className="sticky top-[138px] md:top-[180px] lg:top-[220px] z-[35] bg-ink/95 backdrop-blur-md pt-4 pb-3 mb-6 border-b border-panel-border text-gold-bright flex items-center justify-between text-2xl md:text-3xl font-bold tracking-wide shadow-sm">
                  <span>{category}</span>
                  <span className="text-sm font-normal text-cream/60 md:text-gold-bright tracking-normal">{itemsInCategory.length} items</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {itemsInCategory.map((item, idx) => (
                    <MenuItemCard key={idx} name={item['Product Name']} price={parseFloat(item.Price) || 0} description={item.Description} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
        <CateringSection />
      </main>
      <Footer />
      <ScrollToTop />
      <AIChatBot />
      {/* Welcome Popup for email collection */}
      <WelcomePopup />
    </>
  );
}