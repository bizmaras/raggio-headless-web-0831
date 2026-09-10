import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getMenuItems } from "../../lib/menu";
import { getLocalizedMenuItem } from "../../data/menuTranslations";
import { categoryToSlug, productToSlug } from "../../lib/slug";
import { hasLocale, getDictionary } from "./dictionaries";
import type { Locale } from "./dictionaries";
import Header from "../../components/Header";
import HeroSlider from "../../components/HeroSlider";
import CategoryRail from "../../components/CategoryRail";
import StatsCounter from "../../components/StatsCounter";
import ScrollReveal from "../../components/ScrollReveal";
import DealsSectionWrapper from "../../components/DealsSectionWrapper";
import PromotionsSection from "../../components/PromotionsSection";
import MenuItemCard from "../../components/MenuItemCard";
import { getSizeVariants } from "../../data/sizePricing";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import FAQ from "../../components/FAQ";
import StickyMobileBar from "../../components/StickyMobileBar";

import CateringSection from "../../components/CateringSection";
const GoogleReviewsSection = dynamic(() => import("../../components/GoogleReviewsSection"));
const DeferredWidgets = dynamic(() => import("../../components/DeferredWidgets"));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Raggio Gourmet & Pizza",
  image: "https://www.raggiogourmetpizza.com/images/raggio-logo.png",
  "@id": "https://www.raggiogourmetpizza.com/#restaurant",
  url: "https://www.raggiogourmetpizza.com",
  telephone: "+13023690553",
  priceRange: "$$",
  servesCuisine: ["Pizza", "Italian", "American", "Wings", "Latin American"],
  acceptsReservations: "false",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: "681 E Chestnut Hill Rd",
    addressLocality: "Newark",
    addressRegion: "DE",
    postalCode: "19713",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 39.6385108,
    longitude: -75.7289352,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "09:00",
      closes: "22:00",
    },
  ],
  menu: "https://www.raggiogourmetpizza.com/#menu",
  hasMenu: "https://www.raggiogourmetpizza.com/#menu",
  potentialAction: {
    "@type": "OrderAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://phillystyleexpress.foodtecsolutions.com/",
      inLanguage: "en-US",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    deliveryMethod: [
      "http://purl.org/goodrelations/v1#DeliveryModePickUp",
      "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
    ],
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const menuItems = await getMenuItems();
  const categories = Array.from(
    new Set(menuItems.map((item) => item.Category))
  ).filter(Boolean);

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="min-h-screen bg-ink text-cream w-full max-w-full overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <HeroSlider dict={dict} />
        <CategoryRail categoriesDict={dict.categories} lang={lang} />
        <StatsCounter dict={dict} />

        <section
          id="menu"
          className="max-w-7xl mx-auto px-6 py-12 scroll-mt-[150px] md:scroll-mt-[270px]"
          style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 250px) + 20px)' }}
        >
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gold-bright">
                {dict.menu.title}
              </h2>
              <a
                href="/raggio-full-menu.pdf"
                download
                className="inline-flex items-center gap-2 bg-panel border border-panel-border hover:border-gold text-stone hover:text-cream text-xs font-bold px-4 py-2.5 rounded-full transition-all"
              >
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {dict.menu.download_pdf}
              </a>
            </div>
          </ScrollReveal>

          {categories.map((category, catIdx) => {
            const targetId = categoryToSlug(category);
            const itemsInCategory = menuItems
              .filter((item) => item.Category === category)
              .map((item) => getLocalizedMenuItem(item, lang));
            const displayCategory =
              (dict.categories as Record<string, string>)?.[category] || category;

            return (
              <div
                key={category}
                id={targetId}
                className="mb-16"
                style={{ scrollMarginTop: 'var(--sticky-category-top, 140px)' }}
              >
                <h3
                  style={{ top: 'var(--sticky-category-top, 140px)' }}
                  className="sticky z-[35] bg-ink pt-4 pb-3 mb-6 border-b border-panel-border text-gold-bright flex items-center justify-between text-2xl md:text-3xl font-bold tracking-wide shadow-sm"
                >
                  <Link href={`/${lang}/menu/${targetId}`} className="flex items-baseline gap-2.5 hover:text-gold transition-colors group/title">
                    <span className="group-hover/title:underline decoration-gold/40">{displayCategory}</span>
                    <span className="text-xs sm:text-sm font-normal text-cream/60 md:text-gold-bright tracking-normal">
                      ({itemsInCategory.length})
                    </span>
                  </Link>
                  <Link
                    href={`/${lang}/menu/${targetId}`}
                    className="text-xs sm:text-sm font-semibold text-stone hover:text-cream hover:border-gold transition-all duration-200 px-3.5 py-1.5 rounded-full bg-panel border border-panel-border flex items-center gap-1.5 shadow-sm group"
                  >
                    <span>{dict.menu.view_category || "View Category"}</span>
                    <svg className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </h3>
                <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsInCategory.map((item, idx) => {
                      const basePrice = parseFloat(item.Price) || 0;
                      const sizes = getSizeVariants(item.Category, item["Product Name"], basePrice);
                      const itemSlug = productToSlug(item["Product Name"], item.Slug);
                      return (
                        <MenuItemCard
                          key={idx}
                          name={item["Product Name"]}
                          price={basePrice}
                          description={item.Description}
                          sizes={sizes}
                          lang={lang}
                          categorySlug={targetId}
                          slug={itemSlug}
                          dict={dict}
                        />
                      );
                    })}
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </section>
        <ScrollReveal>
          <PromotionsSection dict={dict} />
        </ScrollReveal>
        <CateringSection dict={dict} lang={lang} />
        <ScrollReveal>
          <FAQ dict={dict} />
        </ScrollReveal>
        <ScrollReveal>
          <GoogleReviewsSection dict={dict} />
        </ScrollReveal>
      </main>
      <Footer dict={dict} />
      <ScrollToTop />
      <StickyMobileBar dict={dict} />
      <DeferredWidgets />
    </>
  );
}