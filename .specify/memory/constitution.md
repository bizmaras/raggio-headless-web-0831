# Raggio Headless Web - Constitution

## Core Principles

### I. Next.js 16 & Modern Frontend Stack
- Next.js 16 with App Router, React 19, Tailwind CSS v4.
- High-performance, SEO-friendly, mobile-first responsive design.
- Respect Next.js breaking changes and avoid outdated patterns.

### II. Headless CMS & Data Decoupling
- Contentful is the single source of truth for dynamic content (Menu, Catering, Testimonials, Announcements).
- Graceful fallbacks: If Contentful credentials are not present during build or runtime, the app must fall back cleanly without breaking the build.

### III. Bilingual First (EN / ES)
- All user-facing components, forms, calculators, and messages must support both English (en) and Spanish (es).
- Clear localization keys, no hardcoded unlocalized strings in production UI.

### IV. Security & Zero Secrets in Git
- No API keys, space IDs, tokens, or private secrets committed to version control.
- All secrets must reside exclusively in `.env.local` and Vercel project settings.

### V. Component Craftsmanship & Anti-Slop
- Micro-interactions, clean glassmorphism, responsive typography, and tactile UI feedback.
- Every major new feature or refactor must go through the Spec-Driven flow (Specify -> Plan -> Tasks -> Implement).

## Governance
- This constitution guides all AI-assisted development across this repository.
- Changes require documented rationale.

**Version**: 1.0.0 | **Ratified**: 2026-09-10
