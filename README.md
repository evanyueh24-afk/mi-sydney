# 觅 Mì — Sydney Local Discovery

A Dianping-style local discovery & review app for Sydney — food, attractions,
recreation, shopping and services. Built for tourists and 20–30 Sydney locals.

This is **Phase 1 (MVP)** of the product spec: browse, search, nearby,
reviews, favorites, editorial collections and a bilingual (EN/ZH) UI.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS
- **Backend:** Supabase (Postgres + PostGIS, Auth, Storage)
- **Deploy:** Vercel

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run **`supabase/migrations/0001_init.sql`** (schema,
   PostGIS, RLS, storage bucket), then **`supabase/seed.sql`** (~33 real
   Sydney spots + editorial collections).
3. Enable auth providers under **Authentication → Providers**:
   - **Email** — on by default.
   - **Google** — add your Google OAuth client ID/secret, and set the
     redirect URL to `https://<your-domain>/auth/callback` (and
     `http://localhost:3000/auth/callback` for local dev).

### 3. Configure environment

Copy the example and fill in your project values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> The anon key is safe to expose in the browser — Row Level Security protects
> your data. **Never** put the `service_role` key in this file.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Before Supabase is
configured, the app renders a friendly setup notice instead of crashing.

---

## Project structure

```
src/
  app/                      App Router pages
    page.tsx                Discover (trending, categories, collections)
    category/[category]/    Category browse grid
    search/                 Search + filters (category, price, rating, open now)
    nearby/                 GPS distance sort (list; PostGIS map is Phase 2)
    spot/[id]/              Spot detail + reviews + write-a-review
    collection/[id]/        Editorial collection detail
    saved/                  Saved spots
    profile/                Profile: name, counts, language, sign out
    login/                  Email + Google auth
    auth/callback/          OAuth / email-confirm code exchange
  components/               UI (cards, nav, seal motif, review composer, …)
  lib/
    supabase/               Browser + server + middleware clients
    queries.ts              Read queries (server)
    actions.ts              Server actions (favorite, review, profile, sign out)
    i18n/                   EN/ZH chrome dictionary + provider
    types.ts, format.ts, hours.ts, config.ts
supabase/
  migrations/0001_init.sql  Schema + PostGIS + RLS + storage
  seed.sql                  ~33 Sydney spots + collections
```

## Design system (spec §9)

- **Colours:** ink `#1B1712`, paper `#F7EFE1`, card `#FFFCF6`, red `#B23225`,
  jade `#2F6E5C`, gold `#C79A3B`
- **Type:** Noto Serif SC (display/CJK), Work Sans (UI), JetBrains Mono (data)
- **Motif:** the red square "seal" (印章) mark — logo and rating badge
- Mobile-first, centered max-width app frame with a bottom tab nav

## Ratings

Each spot carries a small seeded community score so newly-seeded venues aren't
rating-less; in-app reviews blend into that score (see `spot_stats` view and
`blendedRating`). This mirrors the prototype's behaviour.

## What's Phase 2 (not built here)

Full map view, user-generated Guides, check-ins & reviewer levels, review
helpfulness voting, Deals, business claim flow, follows/social feed, and full
content translation. See the product spec §5.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the three env vars from `.env.example` in **Project → Settings →
   Environment Variables** (set `NEXT_PUBLIC_SITE_URL` to your Vercel URL).
4. Add `https://<your-vercel-domain>/auth/callback` to Supabase's Google
   provider redirect URLs and to **Authentication → URL Configuration**.
