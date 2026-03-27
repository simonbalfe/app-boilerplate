# TanStack Start Boilerplate

Full-stack TypeScript boilerplate with auth, a Hono API, and Postgres. Built for shipping personal tools and demos fast.

**Stack:** TanStack Start (Vite + React 19), Hono, BetterAuth, Drizzle ORM, PostgreSQL, Tailwind CSS v4, shadcn/ui

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- A PostgreSQL database (get one free at [neon.tech](https://neon.tech) in 30 seconds)

### Automated setup

```bash
git clone <repo-url> && cd tanstack-boilerplate
pnpm install
pnpm setup
```

The setup script:
- Checks prerequisites
- Generates `BETTER_AUTH_SECRET` automatically
- Prompts for your `DATABASE_URL` (the only thing you need to provide)
- Optionally configures Google OAuth
- Installs dependencies
- Pushes the database schema

Then `pnpm dev` and open [http://localhost:3000](http://localhost:3000).

### Manual setup

If you prefer to do it yourself, create `.env` from the example and fill in two values:

```bash
cp .env.example .env
```

| Variable | What it is | How to get it |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | [neon.tech](https://neon.tech), Supabase, or any Postgres |
| `BETTER_AUTH_SECRET` | Random string for signing sessions | `openssl rand -base64 32` |

```bash
pnpm install && pnpm db:push && pnpm dev
```

Everything else is optional.

## Optional Services

The boilerplate includes packages for Stripe, Redis, email, analytics, and error tracking. They all default to empty strings and the app runs fine without them. Enable what you need.

### Google OAuth

For "Sign in with Google" on the auth page.

| Variable | Where to get it |
|---|---|
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Same |

Set the OAuth redirect URI to `http://localhost:3000/api/auth/callback/google` (swap for your production URL when deploying).

### Email (Resend)

Enables email verification, password reset, and welcome emails.

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) (free tier: 100 emails/day) |
| `RESEND_FROM` | Your verified sender address in Resend |

Without this, email/password signups still work. The `emailVerified` field stays false but users can sign in.

### Stripe (Payments)

Full checkout, subscription, and webhook handling. Skip entirely for personal tools.

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard webhook settings |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard |
| `VITE_STRIPE_PRICE_ID` | Create a price in Stripe Dashboard |

Local webhook testing: `pnpm --filter @repo/web stripe` (requires Stripe CLI).

### Redis (Upstash)

Caches Stripe subscription state. Only needed if you enable Stripe.

| Variable | Where to get it |
|---|---|
| `UPSTASH_REDIS_REST_URL` | [upstash.com](https://upstash.com) (free tier) |
| `UPSTASH_REDIS_REST_TOKEN` | Same |

### Analytics (PostHog)

| Variable | Where to get it |
|---|---|
| `VITE_POSTHOG_KEY` | [posthog.com](https://posthog.com) (generous free tier) |
| `VITE_POSTHOG_HOST` | Defaults to `https://us.i.posthog.com` |

### Error Tracking (Sentry)

| Variable | Where to get it |
|---|---|
| `VITE_SENTRY_DSN` | [sentry.io](https://sentry.io) |

## Project Structure

```
apps/web/             TanStack Start app (routes, pages, UI)
apps/api/             Hono API server (mounted at /api)
packages/auth/        BetterAuth config
packages/db/          Drizzle ORM + PostgreSQL schema
packages/email/       Resend + React Email templates       (optional)
packages/redis/       Upstash Redis client                 (optional)
packages/stripe/      Stripe checkout/subscriptions        (optional)
config/               Centralized env validation (Zod)
tooling/typescript/   Shared tsconfig
tooling/tailwind/     Shared Tailwind config
```

## Commands

```bash
pnpm setup            # Interactive first-time setup
pnpm dev              # Start dev server
pnpm build            # Build everything
pnpm deploy           # Interactive deploy (Docker or Cloudflare)
pnpm lint             # Biome lint + format check
pnpm type-check       # TypeScript checking
```

### Database

```bash
pnpm db:push          # Push schema changes to database
pnpm db:generate      # Generate Drizzle client after schema changes
pnpm db:migrate       # Run Drizzle migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

### API Docs

Auto-generated OpenAPI docs at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

## Deployment

### One command

```bash
pnpm deploy
```

Interactive script that builds and deploys to either Docker or Cloudflare Workers. Reads secrets from your `.env` and sets them on the target platform.

### Docker (Railway, Fly.io, any VPS)

```bash
pnpm docker:build
pnpm docker:run
```

Produces a minimal Node.js 20 Alpine image running on port 3000.

`VITE_*` vars are baked in at build time (client bundle). Server vars (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) are read at runtime.

**Build with only the vars you need:**

```bash
docker build \
  --build-arg VITE_APP_URL=https://yourdomain.com \
  -t your-app .
```

Skip any `VITE_*` build args you don't use. They default to empty strings.

**Runtime env:** pass via `--env-file .env` or your platform's env config.

### Cloudflare Workers (CI/CD)

GitHub Actions deploys to Cloudflare Workers on push to `main`. Triggers on changes to `apps/web/`, `packages/`, `config/`, or `pnpm-lock.yaml`. Can also be triggered manually via `workflow_dispatch`.

The pipeline runs: `pnpm install` > `pnpm lint` > `pnpm type-check` > `pnpm build` (in `apps/web`) > `wrangler deploy` > pushes all secrets via `wrangler secret:bulk`.

#### Setup GitHub Secrets

All environment variables and Cloudflare credentials must be stored as GitHub repository secrets. Use the setup script to load them from your local `.env`:

```bash
pnpm setup:secrets
```

This reads your `.env` and sets each variable as a GitHub secret, then prompts for `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (required for deployment but not in `.env`).

Or set secrets manually:

```bash
gh secret set -f .env
gh secret set CLOUDFLARE_API_TOKEN --body "your-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"
gh secret list  # verify
```

#### Manual Deploy (local)

```bash
cd apps/web
pnpm build
npx wrangler deploy
```

Set server-side secrets via `wrangler secret put`:

```bash
cd apps/web
echo "your-value" | npx wrangler secret put DATABASE_URL
echo "your-value" | npx wrangler secret put BETTER_AUTH_SECRET
```

Only set the secrets for services you're actually using. `DATABASE_URL` and `BETTER_AUTH_SECRET` are the only required ones.

Add your custom domain in the Cloudflare dashboard under Workers & Pages > your worker > Settings > Domains & Routes.

### Production Checklist

- [ ] `VITE_APP_URL` set to production URL
- [ ] `BETTER_AUTH_SECRET` is a strong random value (different from dev)
- [ ] `DATABASE_URL` points to production database
- [ ] Google OAuth redirect URI updated to production URL (if using)
- [ ] Stripe webhook endpoint set to `https://yourdomain.com/api/webhooks/stripe` (if using)

## Working With the Code

**New pages:** Add route files in `apps/web/src/app/` (file-based routing via TanStack Router).

**New API routes:** Add to `packages/api/src/routes/`, register in `packages/api/src/app.ts`.

**New database tables:** Add to `packages/db/src/schema.ts`, then `pnpm db:push`.

**UI components:** shadcn/ui patterns in `apps/web/src/components/ui/`.

## Linting and Formatting

Biome handles both (not ESLint/Prettier). 2-space indent, single quotes, no semicolons, 100 char line width.

```bash
pnpm lint             # Check
pnpm lint --write     # Auto-fix
```

## Tech Stack

| Category | Tool | Purpose |
|---|---|---|
| Monorepo | Turborepo, pnpm workspaces | Task orchestration, package management |
| Language | TypeScript 5.9 | Type system across all packages |
| Framework | TanStack Start (Vite + React 19) | Full-stack SSR framework |
| Routing | TanStack Router | File-based routing |
| Server State | TanStack Query | Data fetching and caching |
| API | Hono | Lightweight API framework |
| API Docs | hono-openapi, Scalar | OpenAPI spec and reference UI |
| Database | PostgreSQL (Neon serverless) | Primary data store |
| ORM | Drizzle ORM + Drizzle Kit | Type-safe queries, migrations |
| Auth | BetterAuth | Google OAuth, email/password |
| Payments | Stripe | Checkout, subscriptions, webhooks |
| Email | Resend, React Email | Transactional emails with JSX templates |
| Caching | Upstash Redis | Serverless Redis |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Components | shadcn/ui, Radix UI, Lucide | UI primitives, icons |
| Charts | Recharts | Data visualization |
| Validation | Zod v4 | Schema validation |
| Analytics | PostHog | Product analytics |
| Error Tracking | Sentry | Error monitoring |
| Linting | Biome | Linter and formatter |
| Deployment | Docker (Node 20), Cloudflare Workers | Container or edge deployment |
