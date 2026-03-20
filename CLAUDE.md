# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaaS Boilerplate built with TanStack Start, BetterAuth, Drizzle ORM, and Stripe. Frontend: TanStack Start (Vite + React 19), Backend: Hono API, Auth: BetterAuth, DB: PostgreSQL via Drizzle, Payments: Stripe.

## Monorepo Structure

Turborepo + pnpm workspaces. All internal packages use `@repo/` scope with `workspace:*` dependencies.

- **apps/web** — TanStack Start app (Vite, React 19, TanStack Router, file-based routing)
- **apps/api** — Hono API server, mounted via TanStack Start API routes
- **packages/auth** — BetterAuth config (Google OAuth, email/password)
- **packages/db** — Drizzle ORM with PostgreSQL
- **packages/email** — Resend + React Email templates
- **packages/redis** — Upstash Redis client
- **packages/stripe** — Stripe integration (checkout, webhooks, subscription sync)
- **config/** — Centralized app config (`@repo/config`)
- **tooling/typescript** — Shared tsconfigs (base)
- **tooling/tailwind** — Shared Tailwind CSS config

## Common Commands

```bash
pnpm dev                # Start all apps (turbo)
pnpm build              # Build all packages (turbo)
pnpm lint               # Biome check
pnpm type-check         # TypeScript type checking
pnpm clean              # Clean build outputs
```

### Database (via turbo)

```bash
pnpm db:generate        # Generate Drizzle client
pnpm db:push            # Push schema to database
pnpm db:migrate         # Run Drizzle migrations
pnpm db:studio          # Open Drizzle Studio
```

### Docker

```bash
pnpm docker:build       # Build Docker image
pnpm docker:run         # Run container on port 3000
pnpm docker:stop        # Stop container
pnpm docker:logs        # Tail container logs
```

## Architecture Patterns

### API Routing

Hono API server in `packages/api` mounted via TanStack Start catch-all API route. Auth routes handled by BetterAuth at `/api/auth/**`.

### Auth Flow

BetterAuth manages all auth. Drizzle schema is defined in `packages/db`. Providers: Google OAuth, email/password.

### Web App Conventions

- TanStack Router with file-based routing in `apps/web/src/app/`
- UI components use shadcn/ui patterns in `apps/web/src/components/ui/`
- Styling: Tailwind CSS v4 with CSS theme variables
- State: TanStack Query for server state
- `cn()` utility (clsx + tailwind-merge)

## Linting & Formatting

Biome handles both linting and formatting (not ESLint/Prettier). Key rules:
- Unused imports are errors
- `useImportType`: error (use `import type` for type-only imports)
- `noExplicitAny`: warn
- `useOptionalChain`: error
- Generated files (`*.gen.ts`, `*.gen.js`) are excluded
- Line width: 100, indent: 2 spaces, single quotes, no semicolons

## Coding Rules

### Never write comments
Code should be self-explanatory through clear naming and structure. No inline comments, no JSDoc, no block comments.

### Use pnpm, never bun/npm/yarn
This project uses pnpm workspaces. Always use `pnpm` for package management.

### Styling — Use theme tokens, never hardcoded colors
Use CSS variable theme tokens (`bg-primary`, `text-muted-foreground`, etc.), not raw Tailwind color classes like `bg-blue-500`.

### Error handling — No silent swallowing
Never use empty catch blocks. Always handle or log errors with context.

### Imports — Use workspace packages
Import from `@repo/*` packages, not relative paths across package boundaries.

## Environment

Env vars loaded from `.env` at root. Key vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `VITE_APP_URL`, Google OAuth credentials, Stripe keys, Upstash Redis, Resend API key. Client-side vars prefixed with `VITE_`.
