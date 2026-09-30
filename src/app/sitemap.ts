import type { MetadataRoute } from 'next';
import { getMenuItems } from '@/lib/menu';
import { categoryToSlug } from '@/lib/slug';

const SITE = 'https://www.raggiogourmetpizza.com';
const LOCALES = ['en', 'es'] as const;

function entry(path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly'): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE}/en${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}${path}`])) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getMenuItems();
  const categories = Array.from(new Set(items.map((i) => i.Category))).filter(Boolean) as string[];
  const paths: MetadataRoute.Sitemap = [entry('', 1, 'weekly'), entry('/catering', 0.9, 'weekly')];
  for (const c of categories) paths.push(entry(`/menu/${categoryToSlug(c)}`, 0.8, 'weekly'));
  // Spanish URLs as their own entries too (each with the same hreflang cluster).
  return paths.flatMap((p) => [p, { ...p, url: p.url.replace(`${SITE}/en`, `${SITE}/es`) }]);
}
