---
name: error-handling-patterns
description: >-
  Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful
  degradation to build resilient applications. Use when implementing error handling, designing APIs, or improving application reliability.
---

# Error Handling Patterns

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to Use This Skill
- Implementing error handling in new features or API routes.
- Designing error-resilient client components (React 19 error boundaries).
- Debugging production or build-time issues.
- Handling headless CMS (Contentful) network drops or empty payloads.
- Implementing retry, fallback, and circuit breaker patterns.

## Core Rules for Next.js & TypeScript
1. **Graceful Fallbacks:** Never crash the entire application when external services or CMS APIs fail; show meaningful localized fallback UI.
2. **Deterministic Errors:** Avoid generic `catch (e) {}` blocks that swallow root causes. Always log descriptive context in development.
3. **User-Facing Safety:** Do not expose sensitive stack traces, API keys, or raw database errors to the client UI.
4. **Bilingual Messages:** Error toasts and inline warnings must support both English and Spanish locales.
