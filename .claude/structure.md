---
description: Web app folder map. Marketing/SEO surface vs authenticated app surface, cleanly separated. Single domain.
alwaysApply: true
---

# Structure

All files live under `apps/web/src/`. Routes are flat in `app/` (TanStack Router file-based).

---

## 🌐 MARKETING / SEO surface

Public, indexable, crawler-facing. Everything SEO-related lives here. **This is the only surface to read for blog, landing, copy, schema, sitemap work.**

### Routes (`app/`)

| File | URL | Purpose |
|------|-----|---------|
| `index.tsx` | `/` | Landing page |
| `robots.txt.tsx` | `/robots.txt` | Crawl directives (driven by `site.config.ts`) |
| `sitemap.xml.tsx` | `/sitemap.xml` | Sitemap (add new marketing URLs here) |
| `llms.txt.tsx` | `/llms.txt` | AI search discoverability |
| `manifest.webmanifest.tsx` | `/manifest.webmanifest` | PWA manifest |

Future blog/pricing/alternatives pages go here as `app/blog.tsx`, `app/pricing.tsx`, etc.

### Components (`modules/marketing/components/`)

`navbar.tsx`, `footer.tsx`, `hero-section.tsx`, `features-section.tsx`, `how-it-works-section.tsx`, `tech-stack-section.tsx`, `cta-section.tsx`, `section-header.tsx`

### SEO helpers (`modules/marketing/lib/`)

- `seo.ts` — `seo()` helper: meta tags, canonical, OG, Twitter
- `schema.ts` — JSON-LD builders: `organizationSchema`, `websiteSchema`, `softwareAppSchema`, `breadcrumbSchema`, `faqSchema`, `articleSchema`

### Config

- `site.config.ts` — **single source of truth** for name, URL, description, OG image, Twitter handle, keywords, disallow paths

---

## 🔒 AUTHENTICATED APP surface

Gated, `noindex, nofollow`. **Do not read this when working on marketing/SEO.**

### Routes (`app/`)

| File | URL |
|------|-----|
| `auth.tsx` | `/auth` |
| `auth.reset-password.tsx` | `/auth/reset-password` |
| `dashboard.tsx` | `/dashboard` |
| `settings.tsx` | `/settings` |

### Components + lib (`modules/app/`)

- `components/app-sidebar.tsx`
- `components/layout-content.tsx` (renders sidebar for authenticated routes)
- `lib/checkout-api.ts`

---

## 🤝 SHARED (touched by both surfaces)

`modules/shared/`

- `components/providers/` — theme, posthog
- `components/theme-toggle.tsx`
- `hooks/use-user.ts`, `hooks/use-mobile.ts`
- `lib/auth-client.ts`, `lib/api-client.ts`

`modules/ui/` — shadcn primitives, zero domain logic.

`app/__root.tsx` — root route for both surfaces (meta, fonts, providers, global JSON-LD). Imports from `@marketing/lib/seo` + `@marketing/lib/schema` to set baseline SEO defaults.

`app/test.tsx` — internal design-system demo, `noindex`.

`app/api/$.ts` — catch-all proxy to `packages/api` Hono server.

---

## Path aliases

| Alias | Resolves to |
|-------|-------------|
| `@marketing/*` | `src/modules/marketing/*` |
| `@app/*` | `src/modules/app/*` |
| `@shared/*` | `src/modules/shared/*` |
| `@ui/*` | `src/modules/ui/*` |
| `@/src/*` | `src/*` |

---

## Cross-read rule

| Working on… | Read | Don't read |
|-------------|------|-----------|
| **Marketing / SEO / blog** | 🌐 section + 🤝 shared | 🔒 app section |
| **Dashboard / settings / auth** | 🔒 section + 🤝 shared | 🌐 marketing section |
| **Server / DB / payments** | `packages/auth/`, `packages/db/`, `packages/stripe/`, `apps/api/` | web UI modules |
| **Primitives** | `modules/ui/`, `modules/shared/` | domain modules |
