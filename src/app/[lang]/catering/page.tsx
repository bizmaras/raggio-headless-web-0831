import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { hasLocale, getDictionary, supportedLocales } from "../dictionaries";
import type { Locale } from "../dictionaries";
import Header from "@/components/Header";
import CategoryRail from "@/components/CategoryRail";
import CateringSection from "@/components/CateringSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileBar from "@/components/StickyMobileBar";
import DeferredWidgets from "@/components/DeferredWidgets";

const SITE = "https://www.raggiogourmetpizza.com";

export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const es = lang === "es";
  const title = es
    ? "Catering en Newark, DE — bandejas de pizza, pasta y alitas | Raggio"
    : "Catering in Newark, DE — pizza, pasta & wing trays | Raggio";
  const description = es
    ? "Catering de Raggio Gourmet & Pizza en Newark, Delaware: media bandeja para 8–10 personas, bandeja completa para 15–20, planificador de cantidades y factura corporativa."
    : "Raggio Gourmet & Pizza catering in Newark, Delaware: half trays feed 8–10, full trays 15–20. Headcount planner, corporate invoicing and online ordering.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/catering`,
      languages: { en: "/en/catering", es: "/es/catering", "x-default": "/en/catering" },
    },
    openGraph: { title, description, url: `/${lang}/catering`, images: ["/images/og/raggio-og.jpg"] },
  };
}

export default async function CateringPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const es = lang === "es";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: es ? "Inicio" : "Home", item: `${SITE}/${lang}` },
      { "@type": "ListItem", position: 2, name: "Catering", item: `${SITE}/${lang}/catering` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header dict={dict} lang={lang as Locale} />
      <CategoryRail categoriesDict={dict.categories as Record<string, string>} lang={lang} activeSlug="catering" />
      <main className="min-h-screen bg-ink text-cream w-full max-w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone">
            <Link href={`/${lang}`} className="hover:text-gold transition-colors">{es ? "Inicio" : "Home"}</Link>
            <span aria-hidden="true" className="text-stone-dim">/</span>
            <span aria-current="page" className="text-gold font-semibold">Catering</span>
          </nav>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-tight text-cream max-w-3xl">
            {es ? "Catering en Newark, Delaware" : "Catering in Newark, Delaware"}
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-stone leading-relaxed">
            {es
              ? "Bandejas de pizza, pasta, alitas y ensaladas para oficinas, equipos, eventos universitarios y fiestas. Calcula cantidades y solicita factura corporativa."
              : "Pizza, pasta, wing and salad trays for offices, teams, campus events and parties. Plan quantities for your headcount and request a corporate invoice."}
          </p>
        </div>
        <div className="surface-milk">
          <CateringSection dict={dict} lang={lang} />
        </div>
      </main>
      <Footer dict={dict} lang={lang} />
      <ScrollToTop />
      <StickyMobileBar dict={dict} />
      <DeferredWidgets />
    </>
  );
}
