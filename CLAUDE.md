# CLAUDE.md — conventions for 觅 Mì

Context for future Claude Code sessions working in this repo.

## What this is

Phase 1 MVP of **Mì Sydney**, a Dianping-style local discovery/review app for
Sydney. Full product spec lives outside the repo (`mi-sydney-spec.md`). The
visual/interaction reference is the original prototype (`mi-sydney.html`).

## Stack & conventions

- **Next.js 14 App Router**, TypeScript (strict), Tailwind.
- **Server Components by default.** Add `"use client"` only for interactivity
  (forms, geolocation, toasts, language state). Data fetching happens in Server
  Components via `src/lib/queries.ts`; mutations via Server Actions in
  `src/lib/actions.ts`.
- **Supabase** via `@supabase/ssr`. Three clients: `lib/supabase/client.ts`
  (browser), `server.ts` (RSC/actions), `middleware.ts` (session refresh).
  Never import the server client into a Client Component.
- **RLS is the security boundary** — the anon key is public. Any new table must
  enable RLS and add policies (see `supabase/migrations/0001_init.sql`).
- **Path alias:** `@/*` → `src/*`.
- Data pages set `export const dynamic = "force-dynamic"` (per-request auth).
- Every data page guards with `isSupabaseConfigured()` so the app boots without
  env vars and shows `<SetupNotice />` instead of a 500.

## Design system (spec §9) — reuse, don't reinvent

- Colours/fonts are Tailwind tokens (`tailwind.config.ts`): `ink paper card
  red jade gold`; fonts `font-serif` (Noto Serif SC), `font-sans` (Work Sans),
  `font-mono` (JetBrains Mono).
- The red square **seal** motif is `<Seal>` — use it for brand/badges.
- Layout is a mobile-first centered `max-w-app` frame (`AppFrame`) with a
  fixed 5-tab bottom nav (`BottomNav`).

## i18n

`src/lib/i18n/dictionary.ts` holds **UI-chrome** strings only (EN/ZH). Use
`useLang().t("key")` in client components, or `<T k="key" />` from server
components. Full *content* translation (spot descriptions) is Phase 2 — spot
`name_zh`/`title_zh` are shown where present.

## Data model notes

- `spots.id` is a human-readable slug (e.g. `bennelong`).
- `spots.geog` (PostGIS geography) is kept in sync from `lat/lng` by a trigger.
  Nearby uses the `nearby_spots()` RPC; Phase-1 list sort also computes
  haversine client-side.
- `spot_stats` / `spots_full` views expose a blended display rating
  (seed score + reviews). Query `spots_full`, not `spots`, for list rendering.
- One review per user per spot (unique constraint; `submitReview` upserts).

## Commands

```bash
npm run dev        # local dev
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## Adding spots

Extend `supabase/seed.sql` (idempotent upserts) — include `lat/lng`,
`hours_json` (keys "0"=Sun..​"6"=Sat), `tags`, `hero_emoji`, and a seed rating.
Keep categories within: food, attractions, recreation, shopping, services.
