import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary, supportedLocales } from "./dictionaries";
import type { Locale } from "./dictionaries";
import DatadogInit from "@/components/DatadogInit";
import RestaurantJsonLd from "@/components/RestaurantJsonLd";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: "#101216",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";

  const title = isEs
    ? "Raggio Gourmet & Pizza | Pizza Autentica en Newark, DE"
    : "Raggio Gourmet & Pizza | Authentic Pizza & Catering in Newark, DE";

  const description = isEs
    ? "Ordena pizzas gourmet frescas, strombolis, calzones, alitas y catering en línea. Entrega rápida en Newark, DE. 681 E Chestnut Hill Rd."
    : "Order fresh artisan stone-baked pizzas, calzones, Philly cheesesteaks, and catering in Newark, DE. Fast local delivery & pickup.";

  return {
    metadataBase: new URL("https://raggiogourmetpizza.com"),
    title,
    description,
    keywords: [
      "Pizza Newark DE",
      "Gourmet Pizza Newark Delaware",
      "Pizza delivery Newark DE",
      "Calzones Newark",
      "Strombolis Newark",
      "Best pizza near University of Delaware",
      "Catering Newark DE",
      "Italian restaurant Newark DE",
      "Raggio Pizza",
    ],
    authors: [{ name: "Raggio Gourmet & Pizza" }],
    creator: "Raggio Gourmet & Pizza",
    publisher: "Raggio Gourmet & Pizza",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", es: "/es" },
    },
    openGraph: {
      title,
      description,
      url: `https://raggiogourmetpizza.com/${lang}`,
      siteName: "Raggio Gourmet & Pizza",
      locale: isEs ? "es_US" : "en_US",
      type: "website",
      images: [
        {
          url: "https://raggiogourmetpizza.com/window.svg",
          width: 1200,
          height: 630,
          alt: "Raggio Gourmet & Pizza Newark DE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://raggiogourmetpizza.com/window.svg"],
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Raggio Pizza",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className="scroll-smooth overflow-x-clip w-full max-w-full">
      <body className="bg-ink text-cream antialiased overflow-x-clip w-full max-w-full relative">
        <RestaurantJsonLd />
        <DatadogInit />
        {children}
      </body>
    </html>
  );
}