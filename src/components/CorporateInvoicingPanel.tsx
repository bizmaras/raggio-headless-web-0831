'use client';

/**
 * Stage 3 — B2B Corporate Trust & Invoicing
 * Three editorial "folios": UDel P-Card · W-9 & EIN · Tax-exempt orders.
 *
 * Every identifier comes from config/b2b.ts (env-driven). If the owner has not
 * supplied a value, the UI says "available on request" instead of printing a
 * placeholder — a wrong EIN on a public page is worse than none.
 */

import React, { useState } from 'react';
import { B2B, UDEL_RULES } from '@/config/b2b';
import { ORDER_LINKS } from '@/config/ordering';

type Tab = 'pcard' | 'w9' | 'exempt';

const T = {
  en: {
    kicker: 'For universities, hospitals & offices',
    title: 'Paperwork your AP office will approve the first time.',
    tabs: { pcard: 'UDel P-Card', w9: 'W-9 & EIN', exempt: 'Tax-exempt orders' } as Record<Tab, string>,
  },
  es: {
    kicker: 'Para universidades, hospitales y oficinas',
    title: 'Documentación que su oficina de cuentas aprobará a la primera.',
    tabs: { pcard: 'P-Card UDel', w9: 'W-9 y EIN', exempt: 'Pedidos exentos' } as Record<Tab, string>,
  },
} as const;

const Row = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <li className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-panel-border py-4 first:border-t-0">
    <span className="font-display text-xl tabular-nums text-gold">{n}</span>
    <div className="text-sm leading-relaxed text-cream">{children}</div>
  </li>
);

export default function CorporateInvoicingPanel({ lang = 'en' }: { lang?: string }) {
  const es = lang === 'es';
  const t = T[es ? 'es' : 'en'];
  const [tab, setTab] = useState<Tab>('pcard');
  const mail = B2B.concierge.managerEmail;
  const mailto = (subject: string, body: string) =>
    mail ? `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : undefined;

  const limit = `$${UDEL_RULES.singleTransactionLimit.toLocaleString('en-US')}`;

  return (
    <section id="corporate-invoicing" className="mb-14 rounded-[28px] border border-panel-border bg-panel px-6 py-9 md:px-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{t.kicker}</p>
      <h2 className="font-display mt-3 max-w-3xl text-3xl leading-[1.08] text-cream md:text-[40px]">{t.title}</h2>

      <div role="tablist" aria-label="Invoicing" className="mt-8 flex flex-wrap gap-6 border-b border-panel-border">
        {(Object.keys(t.tabs) as Tab[]).map((k) => (
          <button
            key={k}
            role="tab"
            id={`inv-tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`inv-panel-${k}`}
            onClick={() => setTab(k)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
              tab === k ? 'border-cream text-cream' : 'border-transparent text-stone hover:text-cream'
            }`}
          >
            {t.tabs[k]}
          </button>
        ))}
      </div>

      {/* ---------- UDel P-Card ---------- */}
      {tab === 'pcard' && (
        <div role="tabpanel" id="inv-panel-pcard" aria-labelledby="inv-tab-pcard" className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <ol>
            <Row n="01">
              {es ? 'Arme el pedido en el planificador y copie la lista.' : 'Build the order in the planner above and copy the checklist.'}{' '}
              {es ? 'Pegue su número de centro de costo o subvención en el campo PO.' : 'Put your cost center or grant number in the PO field — it prints on the checklist.'}
            </Row>
            <Row n="02">
              {es ? 'Pague en FoodTec con su UD Credit Card.' : 'Pay on FoodTec with your UD Credit Card.'}{' '}
              <strong>{es ? `Máximo ${limit} por transacción` : `Max ${limit} per transaction`}</strong>
              {es
                ? ' — la política de la UD prohíbe dividir una compra en varias transacciones. Pedidos mayores: orden de compra en UDX.'
                : ' — UD policy prohibits splitting one purchase into several charges. Larger orders go through a UDX purchase order.'}
              {B2B.udxOnboarded ? (
                <span className="ml-1 text-gold">{es ? 'Somos proveedor registrado en UDX.' : 'We are an onboarded UDX supplier.'}</span>
              ) : (
                <span className="ml-1 text-stone">
                  {es
                    ? 'Si aún no estamos en UDX, su departamento puede enviar el Supplier Request form; completaremos el registro en el portal Jaggaer.'
                    : 'Not in UDX yet? Your department submits a Supplier Request form; we self-register in the Jaggaer portal when invited.'}
                </span>
              )}
            </Row>
            <Row n="03">
              {es ? 'Recibirá un recibo detallado del comerciante con:' : 'You receive a merchant-produced itemized receipt showing:'}
              <span className="mt-1 block text-stone">
                {es
                  ? 'nombre y dirección del comerciante · fecha · descripción de cada artículo · cantidad e importe · total.'
                  : 'merchant name & address · date · description of each item · quantity & amount · total charge.'}
              </span>
              <span className="mt-1 block text-xs text-stone">
                {es
                  ? `El cargo aparece como ${B2B.merchantOfRecord}, ${B2B.address} — nuestra cocina hermana en la misma dirección.`
                  : `The charge posts as ${B2B.merchantOfRecord}, ${B2B.address} — our sister kitchen at the same address. Attach this note if your reconciler asks.`}
              </span>
            </Row>
            <Row n="04">
              {es
                ? 'En Concur: adjunte el recibo (obligatorio para gastos de $25 o más), la lista de asistentes y el propósito de negocio.'
                : `In Concur: attach the receipt (required for every expense of $${UDEL_RULES.receiptThreshold} or more), the attendee list, and the bona fide business purpose.`}
            </Row>
          </ol>

          <aside className="rounded-2xl bg-ink-2 p-6 text-xs leading-relaxed text-stone">
            <p className="font-display text-lg text-cream">{es ? 'Antes de reservar' : 'Before you book'}</p>
            <p className="mt-3">
              {es
                ? 'Si su evento se realiza en un espacio de la UD con participantes externos, la política de la UD exige University Conference Services y University Dining Services. Confírmelo primero con su coordinador.'
                : 'If your event is in a UD facility with external participants, UD policy requires University Conference Services and University Dining Services. Confirm with your event coordinator first.'}
            </p>
            <p className="mt-3">
              {es
                ? 'Para reuniones internas del departamento, entregamos en el edificio y sala que indique.'
                : 'For internal department meetings, we deliver to the building and room you list on the checklist.'}
            </p>
            <a href={ORDER_LINKS.catering} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5 inline-flex rounded-full px-5 py-2.5 text-xs font-semibold">
              {es ? 'Abrir catering en FoodTec' : 'Open FoodTec catering'} ↗
            </a>
          </aside>
        </div>
      )}

      {/* ---------- W-9 & EIN ---------- */}
      {tab === 'w9' && (
        <div role="tabpanel" id="inv-panel-w9" aria-labelledby="inv-tab-w9" className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <dl className="divide-y divide-panel-border text-sm">
            <div className="grid grid-cols-[9rem_1fr] gap-3 py-3">
              <dt className="text-stone">{es ? 'Razón social' : 'Legal name'}</dt>
              <dd className="text-cream">{B2B.legalName ?? (es ? 'Disponible a solicitud' : 'Available on request')}</dd>
            </div>
            <div className="grid grid-cols-[9rem_1fr] gap-3 py-3">
              <dt className="text-stone">DBA</dt>
              <dd className="text-cream">{B2B.dba}</dd>
            </div>
            <div className="grid grid-cols-[9rem_1fr] gap-3 py-3">
              <dt className="text-stone">EIN</dt>
              <dd className="font-display tabular-nums text-cream">{B2B.ein ?? (es ? 'En el W-9 firmado' : 'Provided on the signed W-9')}</dd>
            </div>
            <div className="grid grid-cols-[9rem_1fr] gap-3 py-3">
              <dt className="text-stone">{es ? 'Dirección' : 'Address'}</dt>
              <dd className="text-cream">{B2B.address}</dd>
            </div>
          </dl>

          <div className="rounded-2xl bg-ink-2 p-6">
            {B2B.w9Url ? (
              <>
                <a href={B2B.w9Url} download className="btn-gold inline-flex rounded-full px-5 py-3 text-sm font-semibold">
                  {es ? 'Descargar Formulario W-9 (PDF)' : 'Download Form W-9 (PDF)'}
                </a>
                {B2B.w9SignedOn && (
                  <p className="mt-3 text-xs text-stone">
                    {es ? 'Firmado el' : 'Signed'} {B2B.w9SignedOn} · IRS Form W-9 (Rev. March 2024)
                  </p>
                )}
              </>
            ) : (
              <a
                href={mailto('W-9 request — Raggio catering', 'Please send your signed Form W-9.\nOrganization:\nAP contact:') ?? B2B.concierge.phoneHref}
                className="btn-gold inline-flex rounded-full px-5 py-3 text-sm font-semibold"
              >
                {es ? 'Solicitar W-9 firmado' : 'Request signed W-9'}
              </a>
            )}
            <p className="mt-4 text-xs leading-relaxed text-stone">
              {es
                ? 'Universidad de Delaware: los proveedores nacionales ya no envían el W-9 sustituto de la UD — el registro se hace en el portal UDX (Jaggaer) por invitación de su departamento.'
                : 'University of Delaware: domestic suppliers no longer submit UD’s substitute W-9 — onboarding happens in the UDX (Jaggaer) portal by department invitation. Other organizations can use the PDF above.'}
            </p>
          </div>
        </div>
      )}

      {/* ---------- Tax-exempt ---------- */}
      {tab === 'exempt' && (
        <div role="tabpanel" id="inv-panel-exempt" aria-labelledby="inv-tab-exempt" className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="font-display text-2xl leading-snug text-cream">
              {es ? 'En Delaware no hay impuesto sobre ventas — para nadie.' : 'Delaware has no sales tax — for anyone.'}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone">
              {es
                ? 'Su recibo mostrará $0.00 de impuesto sobre ventas, sea o no una entidad exenta. Los certificados de exención de impuestos sobre ventas no aplican en Delaware. El impuesto de ingresos brutos de Delaware lo paga el vendedor y no puede trasladarse al cliente, así que nunca verá un recargo por ello.'
                : 'Your receipt shows $0.00 sales tax whether or not you are exempt — sales-tax exemption certificates are not applicable in Delaware. Delaware’s gross receipts tax is paid by the seller and may not be passed on to the customer, so you will never see it as a surcharge.'}
            </p>
            <ol className="mt-6">
              <Row n="01">
                {es
                  ? 'Escuelas y 501(c)(3): pida el pedido a nombre legal de su organización (campo Organización del planificador).'
                  : 'Schools & 501(c)(3)s: order in your organization’s legal name (the planner’s Organization field prints on the checklist).'}
              </Row>
              <Row n="02">
                {es
                  ? 'Si su política interna exige archivar su carta de determinación del IRS o certificado de exención de su estado, envíelo — lo guardamos con su pedido.'
                  : 'If your own policy requires you to file your IRS determination letter or home-state exemption certificate with the vendor, send it — we keep it with your order.'}
              </Row>
              <Row n="03">
                {es ? 'Pague con tarjeta de la organización en FoodTec, o llame para una orden de compra.' : 'Pay with an organization card on FoodTec, or call to arrange a purchase order.'}
              </Row>
            </ol>
          </div>
          <aside className="rounded-2xl bg-ink-2 p-6 text-sm">
            <p className="text-stone">{es ? 'Documentos y órdenes de compra' : 'Documents & purchase orders'}</p>
            {mail ? (
              <a href={mailto('Tax-exempt catering order', 'Organization:\nEvent date:\nPO #:\n(Attach exemption letter if your policy requires it)')} className="mt-2 block break-all text-cream underline underline-offset-4">
                {mail}
              </a>
            ) : null}
            <a href={B2B.concierge.phoneHref} className="font-display mt-3 block text-2xl text-cream">{B2B.concierge.phoneDisplay}</a>
            {B2B.concierge.managerName && <p className="mt-1 text-xs text-stone">{B2B.concierge.managerName}</p>}
          </aside>
        </div>
      )}
    </section>
  );
}
