import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMenuItems } from "@/lib/menu";
import { getLocalizedMenuItem } from "@/data/menuTranslations";
import { getSizeVariants } from "@/data/sizePricing";
import { categoryToSlug, slugToCategory, productToSlug } from "@/lib/slug";
import { hasLocale, getDictionary, supportedLocales } from "../../../dictionaries";
import type { Locale } from "../../../dictionaries";
import Header from "@/components/Header";
import CategoryRail from "@/components/CategoryRail";
import ProductDetailView from "@/components/ProductDetailView";
import MenuItemCard from "@/components/MenuItemCard";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileBar from "@/components/StickyMobileBar";
import DeferredWidgets from "@/components/DeferredWidgets";

interface ProductPageProps {
  params: Promise<{
    lang: string;
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const menuItems = await getMenuItems();
  const paths: { lang: string; category: string; slug: string }[] = [];

  for (const lang of supportedLocales) {
    for (const item of menuItems) {
      if (!item["Product Name"] || !item.Category) continue;
      const catSlug = categoryToSlug(item.Category);
      const itemSlug = productToSlug(item["Product Name"], item.Slug);

      paths.push({
        lang,
        category: catSlug,
        slug: itemSlug,
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { lang, category: categorySlug, slug: itemSlug } = await params;
  if (!hasLocale(lang)) return {};

  const menuItems = await getMenuItems();
  const allCategories = Array.from(new Set(menuItems.map((item) => item.Category))).filter(Boolean);
  const matchedCategory = slugToCategory(categorySlug, allCategories);

  if (!matchedCategory) return {};

  const matchedItem = menuItems.find(
    (item) =>
      item.Category === matchedCategory &&
      productToSlug(item["Product Name"], item.Slug) === itemSlug
  );

  if (!matchedItem) return {};

  const localizedItem = getLocalizedMenuItem(matchedItem, lang as Locale);
  const itemName = localizedItem["Product Name"];
  const itemDesc = localizedItem.Description || "Prepared fresh to order with premium Grande Mozzarella.";
  const price = parseFloat(matchedItem.Price) || 0;

  const title = `${itemName} | Raggio Gourmet & Pizza Newark, DE`;
  const description = `${itemDesc} Order ${itemName} ($${price.toFixed(2)}) fresh from Raggio Gourmet & Pizza in Newark, DE. Fast local delivery & takeout.`;

  return {
    title,
    description,
    keywords: [
      itemName,
      `${itemName} Newark DE`,
      `${matchedCategory} Newark`,
      "Raggio Gourmet & Pizza Newark Delaware",
    ],
    alternates: {
      canonical: `/${lang}/menu/${categorySlug}/${itemSlug}`,
      languages: {
        en: `/en/menu/${categorySlug}/${itemSlug}`,
        es: `/es/menu/${categorySlug}/${itemSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://raggiogourmetpizza.com/${lang}/menu/${categorySlug}/${itemSlug}`,
      siteName: "Raggio Gourmet & Pizza",
      images: [
        {
          url: "https://raggiogourmetpizza.com/images/hero-pizza.png",
          width: 1200,
          height: 630,
          alt: itemName,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, category: categorySlug, slug: itemSlug } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  const menuItems = await getMenuItems();
  const allCategories = Array.from(new Set(menuItems.map((item) => item.Category))).filter(Boolean);
  const matchedCategory = slugToCategory(categorySlug, allCategories);

  if (!matchedCategory) {
    notFound();
  }

  const rawItem = menuItems.find(
    (item) =>
      item.Category === matchedCategory &&
      productToSlug(item["Product Name"], item.Slug) === itemSlug
  );

  if (!rawItem) {
    notFound();
  }

  const localizedItem = getLocalizedMenuItem(rawItem, lang as Locale);
  const itemName = localizedItem["Product Name"];
  const basePrice = parseFloat(rawItem.Price) || 0;
  const description =
    localizedItem.Description ||
    dict.menu.default_description ||
    "Prepared fresh to order with premium ingredients.";

  const displayCategory =
    (dict.categories as Record<string, string>)?.[matchedCategory] || matchedCategory;

  const sizes = getSizeVariants(rawItem.Category, rawItem["Product Name"], basePrice);

  // Suggested complementary items (e.g. Wings, Drinks, Appetizers)
  const complementaryItems = menuItems
    .filter(
      (item) =>
        item["Product Name"] !== rawItem["Product Name"] &&
        (item.Category === "Chicken Wings" ||
          item.Category === "Appetizers" ||
          item.Category === "Drinks")
    )
    .slice(0, 3)
    .map((item) => getLocalizedMenuItem(item, lang as Locale));

  const breadcrumbHome = dict.menu.breadcrumb_home || (lang === "es" ? "Inicio" : "Home");
  const breadcrumbMenu = dict.menu.breadcrumb_menu || (lang === "es" ? "Menú" : "Menu");
  const backToCategoryText = lang === "es" ? `Volver a ${displayCategory}` : `Back to ${displayCategory}`;

  // JSON-LD Structured Data for Google Rich Snippets
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: itemName,
    description: description,
    image: "https://raggiogourmetpizza.com/images/hero-pizza.png",
    offers: {
      "@type": "Offer",
      price: basePrice.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://raggiogourmetpizza.com/${lang}/menu/${categorySlug}/${itemSlug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }}
      />

      <Header dict={dict} lang={lang as Locale} />

      <CategoryRail
        categoriesDict={dict.categories as Record<string, string>}
        lang={lang}
        activeSlug={categorySlug}
      />

      <main className="min-h-screen bg-ink pt-8 md:pt-10 pb-20 overflow-x-clip w-full max-w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-panel-border/60 mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone flex-wrap">
              <Link href={`/${lang}`} className="hover:text-gold transition-colors">
                {breadcrumbHome}
              </Link>
              <span className="text-stone-dim">/</span>
              <Link href={`/${lang}#menu`} className="hover:text-gold transition-colors">
                {breadcrumbMenu}
              </Link>
              <span className="text-stone-dim">/</span>
              <Link href={`/${lang}/menu/${categorySlug}`} className="hover:text-gold transition-colors">
                {displayCategory}
              </Link>
              <span className="text-stone-dim">/</span>
              <span className="text-gold font-semibold">{itemName}</span>
            </nav>

            <Link
              href={`/${lang}/menu/${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone hover:text-cream bg-panel border border-panel-border hover:border-gold px-3.5 py-1.5 rounded-full transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {backToCategoryText}
            </Link>
          </div>

          {/* Interactive Product Presentation */}
          <ProductDetailView
            name={itemName}
            categoryName={displayCategory}
            categorySlug={categorySlug}
            basePrice={basePrice}
            description={description}
            sizes={sizes}
            lang={lang as "en" | "es"}
            dict={dict}
          />

          {/* Complementary Add-ons / Pair With */}
          {complementaryItems.length > 0 && (
            <div className="mt-16 pt-10 border-t border-panel-border/60">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold block mb-1">
                    {lang === "es" ? "Completa tu Pedido" : "Perfect Pairings"}
                  </span>
                  <h3 className="text-2xl font-extrabold text-cream">
                    {lang === "es" ? "Acompaña tu Plato Con" : "Frequently Ordered Together"}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {complementaryItems.map((item, idx) => {
                  const compPrice = parseFloat(item.Price) || 0;
                  const compSizes = getSizeVariants(item.Category, item["Product Name"], compPrice);
                  return (
                    <MenuItemCard
                      key={idx}
                      name={item["Product Name"]}
                      price={compPrice}
                      description={item.Description}
                      sizes={compSizes}
                      image={(item as any).Image || (item as any).image}
                      lang={lang}
                      dict={dict}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer dict={dict} />
      <ScrollToTop />
      <StickyMobileBar dict={dict} />
      <DeferredWidgets />
    </>
  );
}
