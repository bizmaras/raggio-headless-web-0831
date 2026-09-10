---
name: brand-identity
description: >-
  Enforce bespoke brand design, avoid generic AI styling (anti-slop), guide typography hierarchy,
  color tokens, glassmorphism, micro-interactions, dark/light themes, and tactile UI patterns for the project.
---

# Brand Design & Identity Skill

Enforce tailored, high-craft brand design across UI components, landing pages, and interactive features.
Prevents "AI slop", sterile templates, and inconsistent styles.

## Brand Principles for Raggio

1. **Craftsmanship over Templates:**
   - Avoid generic bootstrap/shadcn defaults with no personality.
   - Use nuanced borders (`border-white/10`, `border-amber-500/20`), subtle glows, and tactile shadows.
2. **Color Palette & Lighting:**
   - **Primary Dark Canvas:** Warm volcanic slate / charcoal (`#0d0e12`, `#14161f`, `zinc-950/900`).
   - **Warm Brand Accents:** Fire-brick terracotta, warm amber, olive gold, and soft cream (`amber-500`, `orange-600`, `stone-100`).
   - **Glassmorphism:** Frosted blur (`backdrop-blur-md bg-black/40` or `bg-white/5`) with crisp hairline borders.
3. **Typography & Hierarchy:**
   - Editorial serif / bold grotesque for headlines (warmth, Italian culinary tradition).
   - High-legibility sans-serif for UI, numbers, sliders, and pricing.
4. **Motion & Feedback:**
   - Tactile button presses (`active:scale-[0.98] transition-transform`).
   - Subtle spring physics for cards, modals, and ingredient pins.
   - Respect `prefers-reduced-motion`.
5. **Bilingual Consistency:**
   - Ensure layouts accommodate text length differences between English and Spanish without breaking badge alignments or padding.
