# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Preferences
- Save bash scripts to ./scripts/ directory
- For ANY bash command that is more than a single simple command, write it to a script file in ./scripts/ and execute the file

## Commands

```bash
npm run dev          # Start dev server with Turbopack on port 3000
npm run build        # prisma generate + next build
npm run lint         # ESLint
npm run db:push      # Sync Prisma schema to DB (no migration history)
npm run db:migrate   # Create and apply migration
npm run db:seed      # Seed DB (tsx prisma/seed.ts)
npm run db:studio    # Open Prisma Studio
```

No test suite is configured.

## Architecture

**Stack**: Next.js 15 App Router, TailwindCSS v4 (CSS-first, no tailwind.config.js), Prisma + PostgreSQL, NextAuth v5 JWT, Stripe, Resend, Leaflet maps, Radix UI.

### Auth & Access Control

- `src/lib/auth.ts` — NextAuth v5 exports (`handlers`, `auth`, `signIn`, `signOut`)
- `src/lib/auth.config.ts` — JWT strategy, Google + Credentials providers, session displacement via `sessionVersion`, beta tier expiry logic
- `src/middleware.ts` — protects `/dashboard`, `/dpe-finder`, `/community`, `/settings`, `/admin`
- `src/lib/tier.ts` — `isPro()`, `isAdmin()`, `hasProAccess()`, `getUserTier()`

**Tier logic**: `tier` field on User = `"free"` | `"pro"` | `"beta"`. Beta auto-downgrades to free on expiry. Session JWT carries `tier`, `role`, `sessionVersion`.

**Admin route check** (`/admin/*`): requires `role === "admin"`.
**Auth-required routes** (`/dashboard`, `/dpe-finder`, `/community`, `/settings`): requires login (any tier).

### Route Structure

```
src/app/
  (public) page.tsx, about/, costs/, equipment/, pricing/, resources/, schools/, tools/
  (auth-required) dashboard/, dpe-finder/, community/, settings/
  (admin) admin/
  auth/           sign-in/sign-up/verify/reset pages
  api/            REST endpoints (admin/, auth/, discussions/, dpe/, equipment/, maintenance/, partner/, progress/, promo/, ratings/, schools/, stories/, stripe/, user/)
```

### Key Library Files

- `src/lib/db.ts` — Prisma singleton
- `src/lib/email.ts` — Resend: verification, password reset, welcome emails
- `src/lib/utils.ts` — `cn()`, `formatCurrency()`, `formatDate()`, `haversineDistance()`, `getInitials()`

### Styling

TailwindCSS v4 CSS-first: CSS variables defined in `src/app/globals.css` (HSL values for `--background`, `--foreground`, `--primary`, `--accent`, etc.). Dark mode class-based (`.dark`). No `tailwind.config.js` — use `@import "tailwindcss"` in CSS.

Theme toggles via `localStorage.getItem('theme')` — dark is default unless `light` is stored.

### Maps

Leaflet/react-leaflet requires dynamic import with `ssr: false`. Never import Leaflet components at the top level.

### DPE MCP Integration

Uses `@modelcontextprotocol/sdk` StdioClientTransport to spawn a child process at `DPE_MCP_PATH` for FAA pass rate data (JSON-RPC over stdio).

### Stripe

Subscription flow via `/api/stripe/` endpoints. Customer and subscription IDs stored on User (`stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`, `stripeCurrentPeriodEnd`).

### Admin Account (dev/staging)
- Email: `admin@iwanttobeapilot.online`
- Password: `floofs!!QQ1209`
