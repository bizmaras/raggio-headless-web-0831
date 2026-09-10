'use client';

import React, { useState, useMemo } from 'react';

interface CateringCalculatorProps {
  dict?: any;
  lang?: string;
}

export default function CateringCalculator({ dict, lang = 'en' }: CateringCalculatorProps) {
  const t = dict?.catering_calculator || {};

  const [guests, setGuests] = useState<number>(30);
  const [eventType, setEventType] = useState<'office' | 'party' | 'gameday' | 'feast'>('office');
  const [copied, setCopied] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const subTrays = Math.ceil(guests / 16);
    const saladTrays = Math.ceil(guests / 22);
    const pastaTrays = Math.ceil(guests / 18);
    const wingTrays = Math.ceil(guests / 25);

    let total = 0;
    let items: { name: string; count: number | string; badge?: string }[] = [];
    let tierName = t?.events?.[eventType]?.tier || 'Package';

    if (eventType === 'office') {
      total = subTrays * 90 + saladTrays * 65 + pastaTrays * 85;
      items = [
        { name: t.sub_trays || 'Assorted Sub/Wrap Trays', count: `${subTrays} ${t.full_tray || 'Full Trays'}` },
        { name: t.salad_trays || 'Fresh Garden Salad Trays', count: `${saladTrays} ${t.full_tray || 'Full Trays'}` },
        { name: t.pasta_trays || 'Baked Ziti Pasta Trays', count: `${pastaTrays} ${t.full_tray || 'Full Trays'}` }
      ];
    } else if (eventType === 'party' || eventType === 'gameday') {
      total = wingTrays * 110 + subTrays * 90 + saladTrays * 65;
      items = [
        { name: t.wing_trays || 'Jumbo Buffalo/BBQ Wings Trays', count: `${wingTrays} ${t.full_tray || 'Full Trays'}` },
        { name: t.sub_trays || 'Assorted Subs / Panini Trays', count: `${subTrays} ${t.full_tray || 'Full Trays'}` },
        { name: t.app_trays || 'Mozzarella Sticks & Poppers', count: `1 ${t.full_tray || 'Full Tray'}` }
      ];
    } else {
      total = pastaTrays * 95 + saladTrays * 65 + 80;
      items = [
        { name: t.pasta_trays || 'Penne alla Vodka / Lasagna Trays', count: `${pastaTrays} ${t.full_tray || 'Full Trays'}` },
        { name: t.salad_trays || 'Caesar Salad with Croutons', count: `${saladTrays} ${t.full_tray || 'Full Trays'}` },
        { name: t.garlic_knots || 'Garlic Knots & Marinara', count: '✓ Included' }
      ];
    }

    const pricePerPerson = guests > 0 ? (total / guests).toFixed(2) : '0.00';

    return {
      total: total.toFixed(2),
      pricePerPerson,
      items,
      tierName
    };
  }, [guests, eventType, t]);

  const handleCopy = () => {
    const summaryText = `Raggio Gourmet & Pizza - Catering Estimate
${guests} Guests • ${calculations.tierName}
Estimated Total: $${calculations.total} (~$${calculations.pricePerPerson} / person)
Phone: +1 302-369-0553 • Newark, DE`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-panel border border-panel-border rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden mb-12">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="border-b border-panel-border pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-1">
            {t.badge || 'FOR PARTIES, OFFICES & EVENTS'}
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gold-bright">
            {t.title || 'Interactive Catering Calculator'}
          </h3>
          <p className="text-xs md:text-sm text-stone mt-1 max-w-xl">
            {t.subtitle || 'Planning an event in Newark? Select your guest count to see recommended trays and estimated pricing instantly.'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-stone block">{t.phone_label || 'Catering Hotline'}</span>
          <a
            href="tel:+13023690553"
            className="text-sm md:text-base font-bold text-gold hover:text-gold-bright hover:underline flex items-center justify-end gap-1.5"
          >
            <span>📞</span>
            <span>(302) 369-0553</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-cream flex items-center gap-2">
                <span>👥</span>
                <span>{t.guests_label || 'How Many Guests?'}</span>
              </label>
              <span className="px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-sm font-black text-gold-bright">
                {guests} {lang === 'es' ? 'Invitados' : 'Guests'}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-panel-2 rounded-lg appearance-none cursor-pointer accent-gold"
              aria-label={t.guests_label || 'How Many Guests?'}
            />
            <div className="flex justify-between text-xs text-stone mt-2 font-medium">
              <span>10</span>
              <span>30</span>
              <span>60</span>
              <span>100+</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setGuests(15)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                guests === 15 ? 'bg-gold text-ink border-gold font-bold' : 'bg-panel-2 border-panel-border text-stone hover:text-cream hover:border-gold/50'
              }`}
            >
              {t.quick_small || '15 Guests'}
            </button>
            <button
              type="button"
              onClick={() => setGuests(30)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                guests === 30 ? 'bg-gold text-ink border-gold font-bold' : 'bg-panel-2 border-panel-border text-stone hover:text-cream hover:border-gold/50'
              }`}
            >
              {t.quick_medium || '30 Guests'}
            </button>
            <button
              type="button"
              onClick={() => setGuests(50)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                guests === 50 ? 'bg-gold text-ink border-gold font-bold' : 'bg-panel-2 border-panel-border text-stone hover:text-cream hover:border-gold/50'
              }`}
            >
              {t.quick_large || '50 Guests'}
            </button>
            <button
              type="button"
              onClick={() => setGuests(100)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                guests === 100 ? 'bg-gold text-ink border-gold font-bold' : 'bg-panel-2 border-panel-border text-stone hover:text-cream hover:border-gold/50'
              }`}
            >
              {t.quick_xlarge || '100+ Guests'}
            </button>
          </div>

          <div>
            <label className="text-sm font-bold text-cream block mb-2">
              🎉 {t.event_type_label || 'Event Type'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setEventType('office')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  eventType === 'office'
                    ? 'border-gold bg-gold/15 shadow-md'
                    : 'border-panel-border bg-panel-2 hover:border-gold/40'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block text-cream">
                  🏢 {t.events?.office?.name || 'Office / Corporate'}
                </span>
                <span className="text-[11px] text-stone block mt-0.5">
                  {t.events?.office?.desc || 'Sub platters & pasta'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEventType('party')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  eventType === 'party'
                    ? 'border-gold bg-gold/15 shadow-md'
                    : 'border-panel-border bg-panel-2 hover:border-gold/40'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block text-cream">
                  🎂 {t.events?.party?.name || 'Party & Celebration'}
                </span>
                <span className="text-[11px] text-stone block mt-0.5">
                  {t.events?.party?.desc || 'Jumbo wings & hot food'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEventType('gameday')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  eventType === 'gameday'
                    ? 'border-gold bg-gold/15 shadow-md'
                    : 'border-panel-border bg-panel-2 hover:border-gold/40'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block text-cream">
                  🏈 {t.events?.gameday?.name || 'Game Day / Sports'}
                </span>
                <span className="text-[11px] text-stone block mt-0.5">
                  {t.events?.gameday?.desc || 'Wings, subs & appetizers'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEventType('feast')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  eventType === 'feast'
                    ? 'border-gold bg-gold/15 shadow-md'
                    : 'border-panel-border bg-panel-2 hover:border-gold/40'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block text-cream">
                  🍝 {t.events?.feast?.name || 'Italian Banquet'}
                </span>
                <span className="text-[11px] text-stone block mt-0.5">
                  {t.events?.feast?.desc || 'Baked pasta & fresh salads'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-ink-2 border border-panel-border rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between border-b border-panel-border pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                {t.trays_breakdown || 'Recommended Trays Breakdown'}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gold/20 text-gold-bright">
                {calculations.tierName}
              </span>
            </div>

            <div className="space-y-2.5 mb-6">
              {calculations.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-panel border border-panel-border/50">
                  <span className="text-cream font-medium">{item.name}</span>
                  <span className="font-extrabold text-gold-bright">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-panel-border pt-4 mt-auto">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-stone">{t.per_person || 'Approx. Per Person'}:</span>
              <span className="text-base font-extrabold text-gold-bright">
                ~$${calculations.pricePerPerson} / {lang === 'es' ? 'persona' : 'person'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-sm font-bold text-cream">{t.estimated_total || 'Estimated Total'}:</span>
              <span className="text-2xl md:text-3xl font-black text-white">
                $${calculations.total}
              </span>
            </div>

            <div className="space-y-2">
              <a
                href="tel:+13023690553"
                className="w-full py-3.5 px-4 rounded-xl bg-gold hover:bg-gold-bright text-ink font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
              >
                <span>📞</span>
                <span>{t.order_button || 'Call to Book Catering'}</span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl border border-panel-border hover:border-gold/50 bg-panel-2 text-xs font-bold text-stone hover:text-cream transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{copied ? '✅' : '📋'}</span>
                <span>{copied ? (t.copied_toast || 'Estimate Copied!') : (t.copy_button || 'Copy Estimate (WhatsApp / Notes)')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
