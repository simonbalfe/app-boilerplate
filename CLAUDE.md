# CLAUDE.md

## Project Overview

SaaS Boilerplate built with TanStack Start, BetterAuth, Drizzle ORM, and Stripe. Frontend: TanStack Start (Vite + React 19), Backend: Hono API, Auth: BetterAuth, DB: PostgreSQL via Drizzle, Payments: Stripe.

Turborepo + pnpm workspaces. All internal packages use `@repo/` scope with `workspace:*` dependencies.

## Reference

| File | Scope |
|------|-------|
| [`.claude/coding-style.md`](.claude/coding-style.md) | No comments, early returns, type derivation, business logic hygiene, file organization |
| [`.claude/frontend.md`](.claude/frontend.md) | React components, TanStack Router, hooks, styling, module organization |
| [`.claude/backend.md`](.claude/backend.md) | Layered architecture, Hono + Zod routes, API design, security |
| [`.claude/project-structure.md`](.claude/project-structure.md) | Monorepo layout, package descriptions, where to place new code |

## Commands

```bash
pnpm dev                # Start all apps (turbo)
pnpm build              # Build all packages (turbo)
pnpm lint               # Biome check
pnpm type-check         # TypeScript type checking
pnpm clean              # Clean build outputs
pnpm db:generate        # Generate Drizzle client
pnpm db:push            # Push schema to database
pnpm db:migrate         # Run Drizzle migrations
pnpm db:studio          # Open Drizzle Studio
pnpm knip               # Find unused code/dependencies
```

## Deployment

GitHub Actions deploys to Cloudflare Workers on push to `main` (`.github/workflows/deploy.yml`). Triggers on changes to `apps/web/`, `packages/`, `config/`, or `pnpm-lock.yaml`. Runs lint and type-check before deploying. All env vars are stored as GitHub repository secrets and pushed via `wrangler secret:bulk`.

## Core Rules

- **No comments**: code must be self-explanatory
- **Use pnpm**: never bun/npm/yarn
- **No silent error swallowing**: never use empty catch blocks
- **Import from `@repo/*`**: not relative paths across package boundaries
- **`import type`** for type-only imports
- **Theme tokens only**: `bg-primary`, `text-muted-foreground`, never `bg-blue-500`
- **Biome** for linting and formatting (not ESLint/Prettier): line width 100, 2 spaces, single quotes, no semicolons

## Linting Details

- Unused imports: error
- `useImportType`: error
- `noExplicitAny`: warn
- `useOptionalChain`: error
- Generated files (`*.gen.ts`, `*.gen.js`) excluded

## Environment

Env vars loaded from `.env` at root. Key vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `VITE_APP_URL`, Google OAuth credentials, Stripe keys, Upstash Redis, Resend API key. Client-side vars prefixed with `VITE_`.
