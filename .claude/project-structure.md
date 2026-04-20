---
description: Monorepo directory structure and where to place new code
alwaysApply: true
---

# Project Structure

pnpm workspace monorepo with a TanStack Start app and shared backend packages.

For the **web app's internal layout** (marketing vs app separation, path aliases, cross-read rules), see [`structure.md`](./structure.md).

## Apps

- `apps/web/` — TanStack Start application (Vite + React 19, Cloudflare Workers)
  - `src/app/**` — file-based routes; flat (TanStack Router doesn't support parenthesized route groups at this version)
  - `src/modules/marketing/**` — landing page, blog, marketing components
  - `src/modules/app/**` — dashboard, settings, sidebar, authenticated app shell
  - `src/modules/shared/**` — providers, hooks, auth-client, seo/schema helpers used by both
  - `src/modules/ui/**` — shadcn/ui primitives
  - `src/site.config.ts` — single source of SEO + branding
  - `src/env.ts` — typed env vars
- `apps/api/` — Hono API server, mounted via TanStack Start catch-all at `/api/**`

## Packages

| Package | Purpose |
|---------|---------|
| `packages/api/` | Hono API server — routes (`src/routes/**`), middleware |
| `packages/auth/` | BetterAuth config (Google OAuth, email/password) |
| `packages/db/` | Drizzle ORM with PostgreSQL — schema (`src/schema.ts`), migrations |
| `packages/email/` | Resend + React Email templates |
| `packages/redis/` | Upstash Redis client |
| `packages/stripe/` | Stripe integration — checkout, webhooks, subscription sync |

## Tooling & Config

- `config/` — shared runtime config and types (`@repo/config`)
- `tooling/typescript/` — shared tsconfigs
- `tooling/tailwind/` — shared Tailwind CSS config
- `biome.json` — lint and format (Biome, not ESLint/Prettier)

## Adding new code

- **Marketing UI** (landing sections, blog) → `apps/web/src/modules/marketing/components/`
- **App UI** (dashboard widgets, settings) → `apps/web/src/modules/app/components/`
- **Shared primitive / hook** → `apps/web/src/modules/shared/` (only if used by both)
- **New shadcn primitive** → `apps/web/src/modules/ui/components/`
- **New route** → `apps/web/src/app/<slug>.tsx` (flat; nested via dots: `foo.bar.tsx` → `/foo/bar`)
- **Server endpoint** → `packages/api/src/routes/**`
- **Data model change** → `packages/db/src/schema.ts`, run migrations, update affected services
- **New domain package** → `packages/[domain]/` following existing package structure
