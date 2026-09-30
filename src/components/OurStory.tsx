import Image from 'next/image';
import { STORE } from '@/config/ordering';

/**
 * "Our story" — DRAFT COPY, OWNER MUST APPROVE before production.
 * Uses only facts already published on the site (address, daily hours from 9 AM,
 * deck oven, 100% Grande Mozzarella, Philly Express sister kitchen). No founding
 * year, awards or founder claims are made until the owner supplies them.
 */
const COPY = {
  en: {
    eyebrow: 'Our story',
    title: 'A neighborhood pizzeria, done the careful way.',
    body: [
      'Raggio is an independent kitchen on East Chestnut Hill Road in Newark. We bake our pies right on the stone deck of our deck oven, top them with 100% Grande Mozzarella, and cook every order when you place it.',
      'Our sister kitchen, Philly Express, cooks the cheesesteaks and hoagies at the same address and runs our online checkout. So one order can include pizza, steaks, wings and trays for a group.',
    ],
    pillars: [
      { k: 'Deck oven', v: 'Baked right on the stone' },
      { k: 'Grande Mozzarella', v: '100%, on every pie' },
      { k: 'Open daily', v: 'From 9 AM' },
    ],
    alt: 'Whole cheese pizza from Raggio Gourmet & Pizza, Newark DE',
  },
  es: {
    eyebrow: 'Nuestra historia',
    title: 'Una pizzería de barrio, hecha con cuidado.',
    body: [
      'Raggio es una cocina independiente en East Chestnut Hill Road, en Newark. Horneamos nuestras pizzas directamente sobre la piedra de nuestro horno de piso, con queso 100% Grande Mozzarella, y preparamos cada pedido en el momento.',
      'Nuestra cocina hermana, Philly Express, prepara los cheesesteaks y hoagies en la misma dirección y gestiona el pago en línea. Así, un solo pedido puede incluir pizza, steaks, alitas y bandejas para grupos.',
    ],
    pillars: [
      { k: 'Horno de piso', v: 'Directo sobre la piedra' },
      { k: 'Grande Mozzarella', v: '100%, en cada pizza' },
      { k: 'Abierto a diario', v: 'Desde las 9 AM' },
    ],
    alt: 'Pizza de queso entera de Raggio Gourmet & Pizza, Newark DE',
  },
} as const;

export default function OurStory({ lang = 'en' }: { lang?: string }) {
  const t = COPY[lang === 'es' ? 'es' : 'en'];
  return (
    <section id="story" aria-labelledby="story-heading" className="bg-ink border-y border-panel-border">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-panel-border">
          <Image
            src="/images/dishes/pizza-plain-cheese-pizza-luxury-8k.png"
            alt={t.alt}
            fill
            loading="lazy"
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{t.eyebrow}</p>
          <h2 id="story-heading" className="mt-3 font-display text-3xl md:text-5xl font-semibold leading-tight text-cream">
            {t.title}
          </h2>
          {t.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 text-base md:text-lg leading-relaxed text-stone max-w-xl">{p}</p>
          ))}
          <dl className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
            {t.pillars.map((x) => (
              <div key={x.k} className="rounded-2xl border border-panel-border bg-panel p-3 sm:p-4">
                <dt className="text-sm font-semibold text-cream">{x.k}</dt>
                <dd className="mt-1 text-xs text-stone">{x.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-stone">
            <span className="text-cream font-medium">{STORE.address}</span> ·{' '}
            <a href={STORE.phoneHref} className="underline underline-offset-4 decoration-gold/50 hover:text-cream">{STORE.phoneDisplay}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
