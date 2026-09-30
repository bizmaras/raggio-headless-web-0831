import Image from 'next/image';
import Link from 'next/link';
import { ORDER_LINKS } from '@/config/ordering';

/** Home-page teaser. The full catering catalog, planner and invoicing live on /[lang]/catering. */
export default function CateringTeaser({ lang = 'en' }: { lang?: string }) {
  const es = lang === 'es';
  return (
    <section id="catering" aria-labelledby="catering-teaser-heading" className="max-w-7xl mx-auto px-6 py-14 md:py-20"
      style={{ scrollMarginTop: 'calc(var(--sticky-category-top, 136px) + 20px)' }}>
      <div className="grid overflow-hidden rounded-3xl border border-panel-border bg-panel md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
          <Image
            src="/images/dishes/appetizer-sampler-platter-luxury-8k.png"
            alt={es ? 'Bandeja de aperitivos para catering — Raggio, Newark DE' : 'Appetizer platter for catering — Raggio, Newark DE'}
            fill loading="lazy" sizes="(max-width: 767px) 100vw, 50vw" className="object-cover"
          />
        </div>
        <div className="p-7 md:p-10 flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{es ? 'Catering' : 'Catering'}</p>
          <h2 id="catering-teaser-heading" className="mt-3 font-display text-3xl md:text-4xl font-semibold leading-tight text-cream">
            {es ? 'Bandejas para oficinas, equipos y fiestas.' : 'Trays for offices, teams and parties.'}
          </h2>
          <p className="mt-4 text-stone leading-relaxed">
            {es
              ? 'Media bandeja para 8–10 personas, bandeja completa para 15–20. Calcula cantidades y solicita factura corporativa.'
              : 'Half trays feed 8–10, full trays 15–20. Plan quantities for your headcount and request a corporate invoice.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${lang}/catering`} className="btn-gold px-6 py-3 text-sm">
              {es ? 'Ver menú de catering' : 'See the catering menu'}
            </Link>
            <a href={ORDER_LINKS.catering} target="_blank" rel="noopener noreferrer" className="btn-charcoal px-6 py-3 text-sm">
              {es ? 'Pedir catering' : 'Order catering'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
