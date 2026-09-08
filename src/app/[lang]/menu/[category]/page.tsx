import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMenuItems } from "@/lib/menu";
import { getLocalizedMenuItem } from "@/data/menuTranslations";
import { getSizeVariants } from "@/data/sizePricing";
import { categoryToSlug, slugToCategory, productToSlug } from "@/lib/slug";
import { hasLocale, getDictionary, supportedLocales } from "../../dictionaries";
import type { Locale } from "../../dictionaries";
import Header from "@/components/Header";
import CategoryRail from "@/components/CategoryRail";
import MenuItemCard from "@/components/MenuItemCard";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileBar from "@/components/StickyMobileBar";
import DeferredWidgets from "@/components/DeferredWidgets";

interface CategoryPageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

export async function generateStaticParams() {
  const menuItems = await getMenuItems();
  const rawCategories = Array.from(new Set(menuItems.map((item) => item.Category))).filter(Boolean);

  const paths: { lang: string; category: string }[] = [];
  for (const lang of supportedLocales) {
    for (const cat of rawCategories) {
      paths.push({
        lang,
        category: categoryToSlug(cat),
      });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, category: categorySlug } = await params;
  if (!hasLocale(lang)) return {};

  const menuItems = await getMenuItems();
  const allCategories = Array.from(new Set(menuItems.map((item) => item.Category))).filter(Boolean);
  const matchedCategory = slugToCategory(categorySlug, allCategories);

  if (!matchedCategory) return {};

  const dict = await getDictionary(lang as Locale);
  const displayCategory = (dict.categories as Record<string, string>)?.[matchedCategory] || matchedCategory;
  const isEs = lang === "es";

  const title = isEs
    ? `${displayCategory} en Newark, DE | Raggio Gourmet & Pizza`
    : `${displayCategory} in Newark, DE | Raggio Gourmet & Pizza`;

  const description = isEs
    ? `Disfruta de ${displayCategory} fresco preparado con queso 100% Grande Mozzarella en Raggio Gourmet Newark, DE. Entrega rápida y para llevar.`
    : `Explore delicious freshly prepared ${displayCategory} made with 100% Grande Mozzarella at Raggio Gourmet in Newark, DE. Fast delivery & takeout.`;

  return {
    title,
    description,
    keywords: [
      `${matchedCategory} Newark DE`,
      `${matchedCategory} near me`,
      "Raggio Gourmet Pizza Newark",
      "Pizza Delivery Newark Delaware",
    ],
    alternates: {
      canonical: `/${lang}/menu/${categorySlug}`,
      languages: {
        en: `/en/menu/${categorySlug}`,
        es: `/es/menu/${categorySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://raggiogourmetpizza.com/${lang}/menu/${categorySlug}`,
      siteName: "Raggio Gourmet & Pizza",
      images: [
        {
          url: "https://raggiogourmetpizza.com/images/hero-pizza.png",
          width: 1200,
          height: 630,
          alt: `${displayCategory} - Raggio Gourmet`,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, category: categorySlug } = await params;

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

  const itemsInCategory = menuItems
    .filter((item) => item.Category === matchedCategory)
    .map((item) => getLocalizedMenuItem(item, lang as Locale));

  const displayCategory =
    (dict.categories as Record<string, string>)?.[matchedCategory] || matchedCategory;

  const breadcrumbHome = dict.menu.breadcrumb_home || (lang === "es" ? "Inicio" : "Home");
  const breadcrumbMenu = dict.menu.breadcrumb_menu || (lang === "es" ? "Menú" : "Menu");
  const backToFullMenu = dict.menu.back_to_full_menu || (lang === "es" ? "Volver al Menú Completo" : "Back to Full Menu");
  const itemsAvailable = dict.menu.items_available || (lang === "es" ? "platos disponibles" : "dishes available");

  return (
    <>
      <Header dict={dict} lang={lang as Locale} />

      {/* Persistent Category Navigation Rail with Active Category Selected */}
      <CategoryRail
        categoriesDict={dict.categories as Record<string, string>}
        lang={lang}
        activeSlug={categorySlug}
      />

      <main className="min-h-screen bg-ink pt-6 pb-20 overflow-x-clip w-full max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs & Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-panel-border/60 mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone">
              <Link href={`/${lang}`} className="hover:text-gold transition-colors">
                {breadcrumbHome}
              </Link>
              <span className="text-stone-dim">/</span>
              <Link href={`/${lang}#menu`} className="hover:text-gold transition-colors">
                {breadcrumbMenu}
              </Link>
              <span className="text-stone-dim">/</span>
              <span className="text-gold font-semibold">{displayCategory}</span>
            </nav>

            <Link
              href={`/${lang}#${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone hover:text-cream bg-panel border border-panel-border hover:border-gold px-3.5 py-1.5 rounded-full transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {backToFullMenu}
            </Link>
          </div>

          {/* Category Banner Header */}
          <div className="mb-10 bg-panel/70 border border-panel-border rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold block mb-2">
                RAGGIO GOURMET SELECTION
              </span>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cream tracking-tight">
                  {displayCategory}
                </h1>
                <span className="text-sm font-semibold text-gold-bright bg-ink/60 border border-panel-border px-3 py-1 rounded-full w-fit">
                  {itemsInCategory.length} {itemsAvailable}
                </span>
              </div>
              <p className="text-sm sm:text-base text-stone mt-3 max-w-2xl leading-relaxed">
                {lang === "es"
                  ? "Preparado fresco al momento con queso 100% Grande Mozzarella, masa artesanal horneada a la piedra e ingredientes de máxima calidad."
                  : "Prepared fresh to order with 100% Grande Mozzarella, stone-baked artisanal crust, and premium quality ingredients."}
              </p>
            </div>
          </div>

          {/* Menu Items Grid with Identical Card Structure & Size Variant Pills */}
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
                  categorySlug={categorySlug}
                  slug={itemSlug}
                  dict={dict}
                />
              );
            })}
          </div>

          {/* Quick Return to All Categories */}
          <div className="mt-16 pt-8 border-t border-panel-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-cream">
                {lang === "es" ? "Deseas explorar otros platos?" : "Looking for something else?"}
              </h4>
              <p className="text-xs text-stone mt-0.5">
                {lang === "es"
                  ? "Explora nuestras pizzas gourmet, calzones, alitas y más especialidades."
                  : "Browse our signature gourmet pizzas, calzones, jumbo wings, and dinners."}
              </p>
            </div>
            <Link
              href={`/${lang}#menu`}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-bright text-ink font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-gold/20"
            >
              {backToFullMenu}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer dict={dict} />
      <ScrollToTop />
      <StickyMobileBar dict={dict} />
      <DeferredWidgets />
    </>
  );
}
