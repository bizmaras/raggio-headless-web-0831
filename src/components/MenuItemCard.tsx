'use client';

/**
 * MenuItemCard v3 — "Editorial Plate" / "Speed Order" (Stage 2)
 *
 * Drop-in: same default export, every v2 prop still accepted. New optional props:
 *   category  — website category (e.g. "Gourmet Pizza"); unlocks catalog prices, claims, plates
 *   variant   — 'auto' (default, follows the view toggle) | 'editorial' | 'list'
 *   priority  — true for the first row above the fold (eager image, fetchpriority high)
 *
 * What changed vs v2 and why
 *  1. PRICES FROM FOODTEC CATALOG. Sizes/prices resolve from src/data/foodtecCatalog.ts
 *     by SLUG (language-independent). v2 took derived ladders from sizePricing.ts.
 *  2. HONEST CHECKOUT LINK. FoodTec has no item URLs, so the CTA opens the exact FoodTec
 *     category and the card prints the FoodTec item label ("On checkout: Stromboli › Italian").
 *  3. CLAIMS FROM A LEDGER. Only evidenced craft claims render (craftClaims.ts). v2's modal
 *     hard-coded "48h Soğuk Fermente", "San Marzano Sos", "%100 Grande Peyniri" — Turkish
 *     strings on the EN/ES site, none of them evidenced except Grande.
 *  4. REAL IMAGES, RIGHT SIZE. next/image with `sizes` → AVIF/WebP at card width. v2 used
 *     <img> and shipped the 1.5–2.4 MB source PNG/JPG into a 72×72 thumbnail.
 *  5. NO WRONG PHOTOS. Blocklisted pairings never render; missing photos become a
 *     typographic plate; "representative" photos get a caption.
 *  6. NATIVE <dialog>. Focus trap, Esc, inert background and focus return for free.
 *  7. NO EMOJI UI. Emoji render differently per OS and read as cheap next to Fraunces.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SizeVariant } from '@/data/sizePricing';
import { resolveCatalogEntry, foodtecUrl, FOODTEC_CATEGORY } from '@/data/foodtecCatalog';
import { claimsFor, type CraftClaim } from '@/data/craftClaims';
import { imageMeta, isBlocked } from '@/data/dishImages';
import { optimizeContentfulImage } from '@/lib/contentfulImage';
import { ORDER_LINKS, STORE } from '@/config/ordering';
import { useMenuViewMode } from '@/hooks/useMenuViewMode';
import SizeSelector from './menu/SizeSelector';
import DishPlate from './menu/DishPlate';

type Lang = 'en' | 'es';

interface MenuItemCardProps {
  item?: {
    id?: string;
    name?: string;
    price?: string | number;
    description?: string;
    ingredients?: string[];
    image?: string;
    orderUrl?: string;
  };
  name?: string;
  price?: string | number;
  description?: string;
  ingredients?: string[];
  image?: string;
  orderUrl?: string;
  sizes?: SizeVariant[] | null;
  lang?: string;
  categorySlug?: string;
  slug?: string;
  /** NEW — website category name, e.g. "Gourmet Pizza". */
  category?: string;
  /** NEW — 'auto' follows the page's view toggle. */
  variant?: 'auto' | 'editorial' | 'list';
  /** NEW — eager-load the image (first row only). */
  priority?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: any;
}

const T = {
  en: {
    order: 'Order',
    details: 'Details',
    onCheckout: 'On checkout',
    dishPage: 'Full dish page',
    close: 'Close',
    sizeFor: (n: string) => `Size for ${n}`,
    menuPrice: 'Price from our menu — confirm at checkout',
    checkoutBy: `Checkout by ${STORE.checkoutBrand} · same kitchen`,
    ingredients: 'On this',
    from: 'from',
  },
  es: {
    order: 'Ordenar',
    details: 'Detalles',
    onCheckout: 'Al pagar',
    dishPage: 'Página del plato',
    close: 'Cerrar',
    sizeFor: (n: string) => `Tamaño de ${n}`,
    menuPrice: 'Precio del menú — confirme al pagar',
    checkoutBy: `Pago con ${STORE.checkoutBrand} · misma cocina`,
    ingredients: 'Lleva',
    from: 'desde',
  },
};

const money = (n: number) => `$${n.toFixed(2)}`;

function toNumber(p: unknown): number {
  if (typeof p === 'number') return p;
  const n = parseFloat(String(p ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Categories where the eyebrow should read like a menu section. */
function eyebrowFor(category: string, dict?: Record<string, string>) {
  return (dict?.[category] || category || '').toUpperCase();
}

export default function MenuItemCard(props: MenuItemCardProps) {
  const lang: Lang = props.lang === 'es' ? 'es' : 'en';
  const t = T[lang];
  const [viewMode] = useMenuViewMode();
  const variant = props.variant && props.variant !== 'auto' ? props.variant : viewMode;

  const name = props.name || props.item?.name || 'Menu Item';
  const slug = (props.slug || '').toLowerCase();
  const category = props.category || '';
  const description =
    props.description ||
    props.item?.description ||
    (category === 'Drinks'
      ? ''
      : props.dict?.menu?.default_description || (lang === 'es' ? 'Preparado al momento.' : 'Made to order.'));
  const ingredients = props.ingredients || props.item?.ingredients || [];

  // ---------- checkout truth ----------
  const entry = useMemo(
    () => resolveCatalogEntry(category, slug, toNumber(props.price ?? props.item?.price)),
    [category, slug, props.price, props.item?.price]
  );

  const sizes: SizeVariant[] | null = useMemo(() => {
    if (entry.sizes) return entry.sizes.map((s) => ({ ...s }));
    return props.sizes && props.sizes.length ? props.sizes : null;
  }, [entry.sizes, props.sizes]);

  const defaultIdx = useMemo(() => {
    if (!sizes) return 0;
    const i = sizes.findIndex((s) => s.id === (entry.defaultSizeId || 'lrg'));
    return i >= 0 ? i : 0;
  }, [sizes, entry.defaultSizeId]);

  const [sizeIdx, setSizeIdx] = useState(defaultIdx);
  const active = sizes ? sizes[sizeIdx] ?? sizes[0] : null;
  const unitPrice = active ? active.price : entry.price ?? toNumber(props.price ?? props.item?.price);

  const orderUrl =
    props.orderUrl || props.item?.orderUrl || (category ? foodtecUrl(entry.foodtecCategory) : ORDER_LINKS.root);
  const checkoutPath = entry.foodtecItem
    ? `${FOODTEC_CATEGORY[entry.foodtecCategory]} › ${entry.foodtecItem}`
    : FOODTEC_CATEGORY[entry.foodtecCategory];

  // ---------- image ----------
  const rawImage = props.image || props.item?.image || '';
  const safeImage = rawImage && !isBlocked(slug, rawImage) ? rawImage : '';
  const meta = imageMeta(slug);
  const isLocal = safeImage.startsWith('/');
  const imageSrc = isLocal ? safeImage : optimizeContentfulImage(safeImage, { width: 800, quality: 75, format: 'webp', fit: 'fill' }) || '';
  const alt = `${name} — Raggio Gourmet & Pizza, Newark DE`;

  // ---------- claims ----------
  const claims = useMemo(() => claimsFor(category, slug), [category, slug]);

  const productUrl = props.categorySlug && slug ? `/${lang}/menu/${props.categorySlug}/${slug}` : null;

  // ---------- detail dialog ----------
  // Mounted lazily: 170 closed <dialog>s on the homepage would be pure DOM weight.
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dialogMounted, setDialogMounted] = useState(false);
  const [wantOpen, setWantOpen] = useState(0);
  const open = () => { setDialogMounted(true); setWantOpen((n) => n + 1); };
  const close = () => dialogRef.current?.close();
  useEffect(() => {
    const d = dialogRef.current;
    if (!d || !wantOpen) return;
    if (!d.open) d.showModal();
    document.documentElement.style.overflow = 'hidden';
    const onClose = () => { document.documentElement.style.overflow = ''; };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, [wantOpen, dialogMounted]);

  const orderLabel = `${t.order}${active ? ` · ${active.label}` : ''} ${money(unitPrice)}`;
  const orderAnalytics = { 'data-dd-action-name': `order_click:${slug || name}:${active?.id ?? 'one'}` };

  const orderButton = (compact: boolean) => (
    <a
      href={orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      {...orderAnalytics}
      aria-label={`${orderLabel} — ${name} (${t.onCheckout}: ${checkoutPath})`}
      className={
        compact
          ? 'shrink-0 inline-flex items-center justify-center gap-1 h-10 min-w-10 px-3 rounded-lg bg-ember hover:bg-ember-hover text-white text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
          : 'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-ember hover:bg-ember-hover text-white text-sm font-bold tracking-wide transition-colors shadow-[0_6px_18px_-6px_rgba(184,69,43,.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
      }
    >
      <span>{compact ? t.order : orderLabel}</span>
      <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );

  const claimChips = (list: CraftClaim[], max: number) =>
    list.length ? (
      <ul className="flex flex-wrap gap-1.5" aria-label={lang === 'es' ? 'Detalles del oficio' : 'Craft details'}>
        {list.slice(0, max).map((c) => (
          <li
            key={c.id}
            title={c.status === 'owner-confirm' ? 'Preview only — awaiting owner confirmation' : undefined}
            className={`text-[11px] font-semibold leading-none px-2 py-1.5 rounded-md text-cream/90 bg-ink-2 border ${
              c.status === 'owner-confirm' ? 'border-dashed border-gold/60' : 'border-panel-border'
            }`}
          >
            {c.chip[lang]}
          </li>
        ))}
      </ul>
    ) : null;

  const title = () =>
    productUrl ? (
      <Link href={productUrl} className="hover:text-gold-bright transition-colors">
        {name}
      </Link>
    ) : (
      <span>{name}</span>
    );

  // ====================== SPEED ORDER (list) ======================
  const listRow = (
    <div role="listitem" className="group flex items-center gap-3 py-3 lg:border-b lg:border-panel-border">
      <button
        type="button"
        onClick={open}
        aria-label={`${t.details}: ${name}`}
        className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-panel-border focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
      >
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill sizes="56px" className="object-cover" unoptimized={!isLocal} />
        ) : (
          <DishPlate name={name} category={category} lang={lang} size="sm" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="min-w-0 truncate text-[15px] font-semibold text-cream">
            {title()}
          </h3>
          <span className="shrink-0 font-display text-[15px] font-semibold text-gold tabular-nums">{money(unitPrice)}</span>
        </div>
        <p className="truncate text-xs text-stone">{description}</p>
        {sizes && (
          <div className="mt-1.5 max-w-[320px]">
            <SizeSelector sizes={sizes} value={sizeIdx} onChange={setSizeIdx} lang={lang} density="compact" label={t.sizeFor(name)} />
          </div>
        )}
      </div>

      {orderButton(true)}
    </div>
  );

  // ====================== EDITORIAL SHOWCASE ======================
  const editorialCard = (
    <div role="listitem" className="group flex flex-col">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-panel-border bg-ink-2">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={!!props.priority}
            className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.03]"
            style={meta?.focal ? { objectPosition: meta.focal } : undefined}
            unoptimized={!isLocal}
          />
        ) : (
          <DishPlate name={name} category={category} lang={lang} />
        )}

        {/* bottom scrim only where text sits */}
        {imageSrc && <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />}

        {active?.inches && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-bold tracking-wide text-white">
            {active.inches} {active.label}
          </span>
        )}
        {imageSrc && meta?.kind === 'representative' && meta.caption && (
          <span className="absolute bottom-2.5 left-3 text-[10.5px] italic text-white/85">{meta.caption[lang]}</span>
        )}
        <button
          type="button"
          onClick={open}
          className="absolute bottom-2.5 right-3 inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-black/55 backdrop-blur-sm text-[11px] font-semibold text-white hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
        >
          {t.details}
          <svg aria-hidden="true" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 pt-4">
        <p className="text-[10.5px] font-semibold tracking-[0.18em] text-gold">{eyebrowFor(category, props.dict?.categories)}</p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.375rem] leading-[1.15] font-semibold text-cream" style={{ fontVariationSettings: '"SOFT" 50, "opsz" 36' }}>
            {title()}
          </h3>
          <span className="shrink-0 font-display text-[1.375rem] font-semibold text-gold tabular-nums">{money(unitPrice)}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-stone line-clamp-2">{description}</p>

        <div className="mt-3">{claimChips(claims, 3)}</div>

        {sizes && (
          <div className="mt-4">
            <SizeSelector sizes={sizes} value={sizeIdx} onChange={setSizeIdx} lang={lang} label={t.sizeFor(name)} />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-panel-border flex items-center justify-between gap-3 mt-auto">
          <p className="min-w-0 text-[11px] leading-snug text-stone">
            <span className="block font-semibold text-cream/80">{t.onCheckout}</span>
            <span className="block truncate">{checkoutPath}</span>
          </p>
          {orderButton(false)}
        </div>
        {entry.priceSource === 'menu-data' && <p className="mt-2 text-[10.5px] text-stone-dim">{t.menuPrice}</p>}
      </div>
    </div>
  );

  return (
    <>
      {variant === 'list' ? listRow : editorialCard}

      {dialogMounted && (
      <dialog
        ref={dialogRef}
        aria-labelledby={`dlg-${slug || name}`}
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        className="m-auto w-[min(100vw-1.5rem,56rem)] max-h-[90dvh] p-0 rounded-3xl bg-panel text-cream border border-panel-border shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm overflow-hidden"
      >
        <div className="grid md:grid-cols-2 max-h-[90dvh]">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full bg-ink-2">
            {imageSrc ? (
              <Image src={imageSrc} alt={alt} fill sizes="(min-width:768px) 448px, 100vw" className="object-cover" unoptimized={!isLocal} />
            ) : (
              <DishPlate name={name} category={category} lang={lang} />
            )}
            {imageSrc && meta?.kind === 'representative' && meta.caption && (
              <span className="absolute bottom-3 left-4 text-xs italic text-white/90 drop-shadow">{meta.caption[lang]}</span>
            )}
          </div>

          <div className="relative p-6 sm:p-8 overflow-y-auto">
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full border border-panel-border text-stone hover:text-cream hover:border-gold cursor-pointer"
            >
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            <p className="text-[10.5px] font-semibold tracking-[0.18em] text-gold">{eyebrowFor(category, props.dict?.categories)}</p>
            <h2 id={`dlg-${slug || name}`} className="mt-1 pr-12 font-display text-3xl leading-tight font-semibold">
              {name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone">{description}</p>

            {claims.length > 0 && (
              <dl className="mt-5 space-y-3">
                {claims.map((c) => (
                  <div key={c.id} className={`pl-3 border-l-2 ${c.status === 'owner-confirm' ? 'border-dashed border-gold/60' : 'border-gold'}`}>
                    <dt className="text-xs font-bold text-cream">{c.chip[lang]}</dt>
                    <dd className="text-xs leading-relaxed text-stone">{c.story[lang]}</dd>
                  </div>
                ))}
              </dl>
            )}

            {ingredients.length > 0 && (
              <p className="mt-5 text-xs text-stone">
                <span className="font-semibold text-cream/80">{t.ingredients}: </span>
                {ingredients.join(' · ')}
              </p>
            )}

            {sizes && (
              <div className="mt-6">
                <SizeSelector sizes={sizes} value={sizeIdx} onChange={setSizeIdx} lang={lang} label={t.sizeFor(name)} />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              {orderButton(false)}
              <p className="text-[11px] text-stone">
                {t.onCheckout}: <span className="text-cream/85">{checkoutPath}</span> · {t.checkoutBy}
              </p>
              {entry.priceSource === 'menu-data' && <p className="text-[11px] text-stone-dim">{t.menuPrice}</p>}
              {productUrl && (
                <Link href={productUrl} className="mt-1 text-xs font-semibold text-gold underline underline-offset-4 decoration-gold/40 hover:text-gold-bright w-fit">
                  {t.dishPage}
                </Link>
              )}
            </div>
          </div>
        </div>
      </dialog>
      )}
    </>
  );
}
