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
import ScrollReveal from "../../components/ScrollReveal";
import PromotionsSection from "../../components/PromotionsSection";
import MenuItemCard from "../../components/MenuItemCard";
import MenuCollection from "../../components/menu/MenuCollection";
import ViewModeToggle from "../../components/menu/ViewModeToggle";
import { getSizeVariants } from "../../data/sizePricing";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import FAQ from "../../components/FAQ";
import StickyMobileBar from "../../components/StickyMobileBar";

import CateringSection from "../../components/CateringSection";
import AnnouncementBar from "../../components/AnnouncementBar";
import OrderTrustBadge from "../../components/OrderTrustBadge";
const GoogleReviewsSection = dynamic(() => import("../../components/GoogleReviewsSection"));
const DeferredWidgets = dynamic(() => import("../../components/DeferredWidgets"));

const HOME_PREVIEW_COUNT = 3;

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
      <AnnouncementBar lang={lang} />
      <Header lang={lang} dict={dict} />
      <main className="min-h-screen bg-ink text-cream w-full max-w-full">
        <HeroSlider dict={dict} lang={lang} />
        <OrderTrustBadge lang={lang} variant="panel" />
        <CategoryRail categoriesDict={dict.categories} lang={lang} />


        {/* ===== LIGHT "TABLE" ZONE: menu, pricing, deals, catering, FAQ, reviews ===== */}
        <div className="surface-milk">
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
              <div className="flex items-center gap-3 flex-wrap justify-center">
              <ViewModeToggle lang={lang} />
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
            </div>
          </ScrollReveal>

          {categories.map((category, catIdx) => {
            const targetId = categoryToSlug(category);
            const allInCategory = menuItems
              .filter((item) => item.Category === category)
              .map((item) => getLocalizedMenuItem(item, lang));
            // Home page shows a preview per category; the full list lives on the
            // indexable category page (/[lang]/menu/[category]). This keeps the home
            // DOM small (was ~8,300 nodes) for LCP/INP without hiding any item from search.
            const itemsInCategory = allInCategory.slice(0, HOME_PREVIEW_COUNT);
            const hiddenCount = allInCategory.length - itemsInCategory.length;
            const displayCategory =
              (dict.categories as Record<string, string>)?.[category] || category;

            return (
              <div
                key={category}
                id={targetId}
                className="mb-16"
                style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 136px) + 20px)' }}
              >
                <h3
                  style={{ top: 'var(--sticky-category-top, 136px)' }}
                  className="sticky z-30 bg-ink pt-4 pb-3 mb-6 border-b border-panel-border text-gold-bright flex items-center justify-between text-2xl md:text-3xl font-bold tracking-wide shadow-sm"
                >
                  <Link href={`/${lang}/menu/${targetId}`} className="flex items-baseline gap-2.5 hover:text-gold transition-colors group/title">
                    <span className="group-hover/title:underline decoration-gold/40">{displayCategory}</span>
                    <span className="text-xs sm:text-sm font-normal text-cream/80 md:text-gold-bright tracking-normal">
                      ({allInCategory.length})
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
                <MenuCollection label={displayCategory}>
                  {itemsInCategory.map((item, idx) => {
                    const basePrice = parseFloat(item.Price) || 0;
                    const itemSlug = productToSlug(item["Product Name"], item.Slug);
                    const sizes = getSizeVariants(item.Category, item["Product Name"], basePrice, itemSlug);
                    return (
                      <MenuItemCard
                        key={idx}
                        name={item["Product Name"]}
                        price={basePrice}
                        description={item.Description}
                        sizes={sizes}
                        category={item.Category}
                        priority={catIdx === 0 && idx < 3}
                        lang={lang}
                        categorySlug={targetId}
                        slug={itemSlug}
                        image={(item as any).Image || (item as any).image}
                        dict={dict}
                      />
                    );
                  })}
                </MenuCollection>
                {hiddenCount > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Link
                      href={`/${lang}/menu/${targetId}`}
                      className="btn-charcoal px-6 py-3 text-sm"
                    >
                      {(dict.menu.view_category || "View Category")} · {displayCategory} ({allInCategory.length})
                    </Link>
                  </div>
                )}
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
        </div>
      </main>
      <Footer dict={dict} lang={lang} />
      <ScrollToTop />
      <StickyMobileBar dict={dict} />
      <DeferredWidgets />
    </>
  );
}