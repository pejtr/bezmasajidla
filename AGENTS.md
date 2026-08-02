# AGENTS.md — bezmasajidla.cz

Czech vegetarian/vegan restaurant guide. React 19 + Vite + Express + tRPC + Drizzle ORM + MySQL.

## Commands

- `pnpm dev` — dev server (tsx watch, auto-restarts)
- `pnpm build` — Vite client build + esbuild server bundle to `dist/`
- `pnpm start` — runs `dist/index.js`
- `pnpm check` — TypeScript typecheck (`tsc --noEmit`)
- `pnpm format` — Prettier format
- `pnpm test` — Vitest (server-side tests only)
- `pnpm db:push` — Drizzle generate + migrate

## Architecture

```
bezmasajidla/
  client/src/     — React SPA (Vite root: client/)
  server/         — Express + tRPC server
  server/_core/   — Auth, tRPC setup, env, middleware
  shared/         — Shared types and constants
  drizzle/        — Schema (drizzle/schema.ts) + migrations
```

- Server entry: `server/_core/index.ts` (dev) / `server/index.ts` (prod build output)
- Client entry: `client/src/main.tsx` → `App.tsx`
- tRPC API at `/api/trpc`, schema at `drizzle/schema.ts`
- Server auto-finds available port starting from 3000

## Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`

## Key Quirks

- **pnpm only** (pinned 10.4.1). Do not use npm/yarn.
- **Prettier only** — no ESLint. Config: `.prettierrc` (double quotes, trailing commas, 80 width).
- **Tests are server-only**: `server/**/*.test.ts`. No client tests.
- **Database is optional** at runtime — db functions gracefully return empty results when `DATABASE_URL` is missing. Tests may run without a DB.
- **Wouter** (not react-router) for client routing. Patched via `pnpm-workspace.yaml`.
- **shadcn/ui** components (`new-york` style) in `client/src/components/ui/`.
- **SEO redirects** in `server/_core/redirect.ts` (shared between dev & prod entrypoints).
- **Daily AI recipe cron** starts on server boot (`startDailyRecipeCronJob`) — only in production mode.
- **Rate limiting** via tRPC middleware (`server/_core/rateLimit.ts`) on newsletter & contact endpoints.
- **Sitemap & SEO meta** are cached in-memory with 1-hour TTL.
- **Copy `.env.example` to `.env`** and fill in required vars before running dev.
- **Dead code removed**: `server/_core/map.ts`, `dataApi.ts`, `voiceTranscription.ts`, `imageGeneration.ts` (unused).
- **Login info is NOT stored in localStorage** — user state comes from tRPC `auth.me` query only.

## Environment

Required at runtime: `DATABASE_URL` (MySQL). Optional: `JWT_SECRET`, `MAILCHIMP_*`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`.

## Style

- Zod v4 for validation
- superjson transformer for tRPC
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Framer Motion for animations
