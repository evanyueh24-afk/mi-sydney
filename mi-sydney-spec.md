# 觅 Mì — Sydney Local Discovery App
### Product & Technical Spec v1 — for Claude Code build handoff

---

## 1. What this is

A Dianping-style (大众点评) local discovery and review app for Sydney: search, browse, and review restaurants, attractions, shopping, recreation, and services, with a strong "what's nearby" and "what's trending" core — built for two audiences at once:

- **Tourists** visiting Sydney who want trustworthy, curated guidance without needing to already know the city
- **Sydney locals aged ~20–30** who want to find new/trending spots, weekend activities, and things to do beyond the obvious

**Explicitly out of scope:** food delivery. Dianping's delivery/Meituan integration is not being replicated — this is a discovery and review product, not a logistics one.

---

## 2. What we're taking from Dianping (research summary)

Dianping's actual feature set, from their own app store listing and marketing material, breaks into these pillars:

1. **吃喝玩乐 (Eat/drink/play)** — restaurant discovery with real reviews, in-app bill discounts, group-buy vouchers
2. **旅游攻略 (Travel guides)** — user-written travel notes/itineraries, discounted attraction tickets, hotel booking, "authoritative rankings" (curated best-of lists)
3. **团购优惠 (Group-buy deals)** — city-wide coupon search, one-tap in-app checkout discounts
4. **电影票 (Movie tickets)** — seat selection, reviews-driven picks
5. **亲子娱乐 (Family entertainment)** — malls, kids' venues, art/tech exhibitions, parks
6. **新奇去处 (Novel experiences)** — this is the one aimed at young people: escape rooms, spontaneous hiking/camping, craft workshops, urban surfing, diving, rock climbing, evening bars, spontaneous group meetups
7. **生活服务 (Life services)** — hair/beauty, wedding photography, fitness, home cleaning/repair, pet care
8. Cross-cutting mechanics: **GPS-based nearby search**, **rich multi-media reviews** (text/photo/video/voice) with **reviewer levels**, **check-ins**, **"must" ranking lists** (必吃/必玩/必逛 — Must-Eat/Must-Play/Must-Shop), a premium curated guide (黑珍珠 "Black Pearl" for fine dining), and recently an **AI search assistant**.

**What we're porting to Mì Sydney**, mapped directly:

| Dianping pillar | Mì Sydney equivalent |
|---|---|
| 吃喝玩乐 | Food category + reviews + ratings |
| 旅游攻略 | **Guides** tab — curated + user-written Sydney itineraries |
| 团购优惠 | Simple **Deals** (no in-app payment in MVP) |
| 电影票 | *Cut* — not relevant to differentiation, adds licensing complexity |
| 亲子娱乐 | Folded into Attractions, tagged "family-friendly" |
| **新奇去处** | **Recreation** category — the flagship section for the 20–30 audience |
| 生活服务 | Services category |
| GPS nearby | **Nearby** tab, map + distance sort |
| Must-lists | **Editorial Collections** ("Sydney Musts", "Hidden Gems", "Free Things to Do") |
| Reviewer levels/check-ins | Phase 2 — see roadmap |
| Delivery | **Cut entirely**, per brief |

---

## 3. Personas

**"Tourist Tara"** — visiting Sydney for 4–7 days, doesn't know suburbs or transit, wants trustworthy picks fast, cares about iconic sights + authentic food, checks reviews before anything, price-sensitive on some things (food) and splurges on others (one big harbour dinner).

**"Local Leo/Lena", 24–29** — lives in Sydney, bored of the same five spots, wants to find what's new/trending, cares about aesthetics and shareability, plans weekend activities with friends (not just meals), responds to "novel experience" framing (something to do, not just somewhere to eat).

Both personas want: real reviews from real people, not just a star average; a sense of what's *currently* good, not a static directory.

---

## 4. Information architecture

Bottom navigation (5 tabs):

1. **Discover** (home) — trending now, category rows, editorial collections, personalized-by-location feed
2. **Nearby** — map-first view, GPS distance sort, filter by category/open-now/price
3. **Guides** — curated itineraries ("First 48 Hours in Sydney", "Best Bites Under $30") + user-submitted travel notes (multi-spot posts, tourist-friendly)
4. **Saved** — favorited spots, saved guides
5. **Profile** — identity, saved count, review count, reviewer level (phase 2), language toggle

Categories (used as filters everywhere, not separate tabs): **Food · Attractions · Recreation · Shopping · Services**

"Recreation" is the new category carrying the 新奇去处 spirit: escape rooms, hiking/camping meetups, rock climbing gyms, surf/dive lessons, pottery/craft workshops, trivia nights, social sport leagues, bars & nightlife. This is the section most directly aimed at the 20–30 local audience and should get equal visual weight to Food on the home screen, not be buried.

---

## 5. Core features by phase

### Phase 1 — MVP (what Claude Code builds first)

- Email/Google auth (Supabase Auth)
- Category browse: Food, Attractions, Recreation, Shopping, Services
- Search (name, suburb, tag) with filters: category, price, rating, open now
- Nearby: GPS-based distance sort (list view; full map can follow in 1b)
- Spot detail: photos, description, address, hours, price level, tags, multi-photo reviews
- Post a review: star rating + text + optional photo
- Favorites/saved
- Editorial Collections: hand-curated lists ("Sydney Musts", "Hidden Gems", "Free Things to Do", "Best Weekend Recreation") — admin-authored, not user-generated yet
- Bilingual UI chrome (EN/ZH toggle) — full content translation is phase 2
- Seed content: 150–300 real, manually curated Sydney spots across all 5 categories (this replaces the placeholder "sample services" from the prototype — real data sourcing is a separate workstream, see §8)

### Phase 2

- Full map view (PostGIS-backed nearby queries, clustering)
- **Guides** tab goes live for user-generated travel notes/itineraries (multi-spot posts)
- Check-ins ("been here") + reviewer levels/badges (reputation system)
- Review helpfulness voting
- Simple Deals/coupons (display only — "10% off weekdays", no in-app payment)
- Business claim flow + basic business dashboard (respond to reviews, edit listing)
- Follow other users, simple social feed of followed users' reviews/check-ins

### Phase 3

- In-app table reservation requests / tap-to-call
- Real payments: voucher purchase, in-app bill discount (needs Stripe + business agreements — this is the most operationally heavy feature Dianping has, budget real time for it)
- Ticket purchase integration for major attractions (affiliate APIs — Klook/Viator, or direct partnerships with Opera House/Taronga/BridgeClimb)
- Push notifications (trending nearby, saved-spot updates)
- Native mobile app (React Native/Expo) once web usage validates demand

**Deliberately never in scope:** food delivery logistics.

---

## 6. Data model (Postgres / Supabase)

```
users
  id, email, display_name, avatar_url, language_pref, is_tourist (bool, self-reported),
  reviewer_level (phase 2), created_at

spots
  id, name, name_zh, category, subcategory, description,
  lat, lng, suburb, address, price_level (0-3), hours_json,
  phone, website, tags text[], hero_image_url,
  status (active/pending/archived), source (curated/business_claimed/user_submitted),
  created_at, updated_at

photos
  id, spot_id, user_id, url, caption, created_at

reviews
  id, spot_id, user_id, rating (1-5),
  rating_food, rating_service, rating_ambience (nullable, phase 2 sub-ratings),
  text, helpful_count, created_at

checkins           -- phase 2
  id, spot_id, user_id, note, created_at

favorites
  user_id, spot_id, created_at

collections         -- editorial + user guides
  id, title, title_zh, type (editorial/user_guide),
  author_id (nullable for editorial), cover_image_url, description,
  target_audience text[] (tourist/local/young_adult), created_at

collection_items
  collection_id, spot_id, sort_order, note

deals               -- phase 2
  id, spot_id, title, description, valid_from, valid_to, terms

follows             -- phase 2
  follower_id, followee_id

business_claims     -- phase 2
  id, spot_id, owner_user_id, status, created_at
```

Use PostGIS (`geography(Point,4326)`) on `spots.lat/lng` for efficient nearby radius queries — this is the one piece worth setting up correctly from day one since retrofitting geospatial indexing later is painful.

---

## 7. Tech stack

- **Frontend:** Next.js (App Router), deployed on **Vercel**
- **Backend/DB/Auth/Storage:** **Supabase** (Postgres + PostGIS extension, Supabase Auth for email/Google login, Supabase Storage for review photos)
- **Maps:** Mapbox GL JS (better pricing/design control than Google Maps for a map-heavy nearby view) — Google Maps is a fine alternative if you'd rather stay in one ecosystem for Places data later
- **Search:** Postgres full-text search + `pg_trgm` for fuzzy matching is sufficient at this scale; revisit (Algolia/Meilisearch) only if search quality becomes a real complaint
- **Version control / CI:** GitHub, with Vercel's GitHub integration for auto-deploy previews on every PR
- **Build tool:** Claude Code, working from this spec + `CLAUDE.md` conventions file

---

## 8. Content sourcing plan (the real bottleneck)

The prototype used 24 hand-picked spots. A "comprehensive" launch needs real breadth. Recommended sequence:

1. **Manual curation first**, 150–300 spots, organized by category and Sydney suburb/precinct (CBD, Surry Hills, Newtown, Bondi/Eastern Suburbs, Inner West, North Shore, Manly). This is genuinely a research task — good news is it's one this chat can help batch through, city guide by city guide, precinct by precinct.
2. **"Claim your business"** self-service flow (Phase 2) — lets the catalogue grow without you sourcing everything by hand.
3. **Google Places API** only if/when volume and budget justify it — useful for backfilling hours/address/phone data on spots you've already manually selected, rather than as a bulk import (ToS and cost make bulk import a bad first move).

Recreation-category sourcing (escape rooms, climbing gyms, surf schools, workshop studios) will need its own pass — this content doesn't show up as reliably in generic "best restaurants" searches, so budget separate research time for it specifically.

---

## 9. Design system (carried over from prototype, for Claude Code to reuse)

- **Colors:** ink `#1B1712`, paper `#F7EFE1`, card `#FFFCF6`, red (primary/brand) `#B23225`, jade (ratings/success) `#2F6E5C`, gold (stars) `#C79A3B`
- **Type:** display/CJK — Noto Serif SC; body/UI — Work Sans; numerals/data — JetBrains Mono
- **Signature motif:** red square "seal" mark (印章-style stamp) as logo and rating badge — ties to Chinese seal-stamp tradition, distinct from generic app iconography
- Mobile-first, max-width app frame, bottom tab nav — matches the working prototype at `mi-sydney.html`, which can be used as the direct visual/behavioral reference for Claude Code

---

## 10. Legal & moderation (flag for early, not late)

- **Defamation exposure (Australia):** need a review reporting/moderation flow and clear content policy before public launch — a business disputing a bad review is a real, not hypothetical, risk here.
- **Privacy Act compliance:** user accounts + reviews + location data all trigger obligations — factor into signup/consent flows.
- **Business claim verification:** need a lightweight process to stop competitors falsely claiming/hijacking listings once that flow ships in Phase 2.
- Fake review policy should exist before user-generated Guides content ships (Phase 2), since travel notes are more susceptible to disguised advertising than short reviews.

---

## 11. Handoff notes for Claude Code

- Reference files: this spec + `/mnt/user-data/outputs/mi-sydney.html` (working prototype, use for visual/interaction reference — same design tokens, same core flows, no real backend)
- First task for Claude Code: scaffold Next.js + Supabase project structure, set up the `spots`/`reviews`/`favorites`/`collections` tables and PostGIS extension, port the prototype's visual design into real components, wire up real auth.
- Suggested first milestone: Phase 1 feature list above, with ~30 seed spots (not 300) to validate the full flow end-to-end before committing to full-scale content curation.
