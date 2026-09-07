import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary, supportedLocales } from "./dictionaries";
import type { Locale } from "./dictionaries";
import "../globals.css";

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
  return {
    metadataBase: new URL("https://raggiogourmetpizza.com"),
    title: isEs
      ? "Raggio Gourmet & Pizza | Pizza Autentica en Newark, DE"
      : "Raggio Gourmet & Pizza | Authentic Pizza & Catering in Newark, DE",
    description: isEs
      ? "Ordena pizzas gourmet frescas, strombolis, calzones, alitas y catering en linea. Entrega rapida en Newark, DE."
      : "Order fresh gourmet pizzas, strombolis, calzones, wings, and catering online. Fast delivery in Newark, DE.",
    alternates: {
      languages: { en: "/en", es: "/es" },
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
    <html lang={lang} className="scroll-smooth">
      <body className="bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}