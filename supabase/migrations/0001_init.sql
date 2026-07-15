-- ============================================================================
-- Mì Sydney — initial schema (spec §6)
-- Postgres + PostGIS. Run this in the Supabase SQL editor (or via CLI).
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists postgis;      -- geospatial (nearby radius queries)
create extension if not exists pg_trgm;      -- fuzzy text search
create extension if not exists "uuid-ossp";

-- ============================================================================
-- profiles  (extends Supabase auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  language_pref text not null default 'en' check (language_pref in ('en','zh')),
  is_tourist boolean,
  reviewer_level int not null default 1,   -- phase 2 reputation
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- spots
-- ============================================================================
create table if not exists public.spots (
  id text primary key,                       -- human-friendly slug id
  name text not null,
  name_zh text,
  category text not null check (category in ('food','attractions','recreation','shopping','services')),
  subcategory text,
  description text,
  lat double precision,
  lng double precision,
  geog geography(Point, 4326),               -- derived from lat/lng (trigger below)
  suburb text,
  address text,
  price_level int not null default 0 check (price_level between 0 and 3),
  hours_json jsonb,
  phone text,
  website text,
  tags text[] default '{}',
  hero_image_url text,
  hero_emoji text,                           -- presentation fallback (prototype motif)
  status text not null default 'active' check (status in ('active','pending','archived')),
  source text not null default 'curated' check (source in ('curated','business_claimed','user_submitted')),
  seed_rating numeric(2,1) default 0,        -- starting community score
  seed_rating_count int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep geog in sync with lat/lng automatically.
create or replace function public.spots_sync_geog()
returns trigger language plpgsql as $$
begin
  if new.lat is not null and new.lng is not null then
    new.geog := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  else
    new.geog := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists spots_geog_trg on public.spots;
create trigger spots_geog_trg
  before insert or update of lat, lng on public.spots
  for each row execute function public.spots_sync_geog();

create index if not exists spots_geog_gix on public.spots using gist (geog);
create index if not exists spots_category_idx on public.spots (category);
create index if not exists spots_name_trgm on public.spots using gin (name gin_trgm_ops);
create index if not exists spots_tags_gin on public.spots using gin (tags);

-- ============================================================================
-- photos
-- ============================================================================
create table if not exists public.photos (
  id uuid primary key default uuid_generate_v4(),
  spot_id text not null references public.spots(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);
create index if not exists photos_spot_idx on public.photos (spot_id);

-- ============================================================================
-- reviews
-- ============================================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  spot_id text not null references public.spots(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  rating_food int check (rating_food between 1 and 5),        -- phase 2 sub-ratings
  rating_service int check (rating_service between 1 and 5),
  rating_ambience int check (rating_ambience between 1 and 5),
  text text,
  photo_url text,
  helpful_count int not null default 0,
  created_at timestamptz not null default now(),
  unique (spot_id, user_id)                  -- one review per user per spot
);
create index if not exists reviews_spot_idx on public.reviews (spot_id);
create index if not exists reviews_user_idx on public.reviews (user_id);

-- ============================================================================
-- favorites
-- ============================================================================
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  spot_id text not null references public.spots(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, spot_id)
);
create index if not exists favorites_spot_idx on public.favorites (spot_id);

-- ============================================================================
-- collections  (editorial + user guides)
-- ============================================================================
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  title_zh text,
  type text not null default 'editorial' check (type in ('editorial','user_guide')),
  author_id uuid references auth.users(id) on delete set null,
  cover_image_url text,
  description text,
  target_audience text[] default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  spot_id text not null references public.spots(id) on delete cascade,
  sort_order int not null default 0,
  note text,
  primary key (collection_id, spot_id)
);

-- ============================================================================
-- Aggregate view: blended display rating + review count per spot.
-- Blends the seed community score (weighted up to 25) with real reviews.
-- ============================================================================
create or replace view public.spot_stats
with (security_invoker = on) as
select
  s.id as spot_id,
  count(r.id) as review_count,
  round(
    (
      coalesce(s.seed_rating, 0) * least(coalesce(s.seed_rating_count, 0), 25)
      + coalesce(sum(r.rating), 0)
    )
    / nullif(least(coalesce(s.seed_rating_count, 0), 25) + count(r.id), 0)
  , 1) as avg_rating
from public.spots s
left join public.reviews r on r.spot_id = s.id
group by s.id, s.seed_rating, s.seed_rating_count;

-- Combined view: every spot column plus its blended stats. Used by list pages.
create or replace view public.spots_full
with (security_invoker = on) as
select s.*, st.review_count, st.avg_rating
from public.spots s
join public.spot_stats st on st.spot_id = s.id;

grant select on public.spot_stats to anon, authenticated;
grant select on public.spots_full to anon, authenticated;

-- ============================================================================
-- RPC: nearby spots by distance (PostGIS). Phase-1 uses this for list sort;
-- Phase-2 map view reuses it.
-- ============================================================================
create or replace function public.nearby_spots(
  in_lat double precision,
  in_lng double precision,
  in_category text default null,
  in_limit int default 60
)
returns table (
  id text,
  distance_m double precision
)
language sql stable as $$
  select s.id,
         st_distance(s.geog, st_setsrid(st_makepoint(in_lng, in_lat), 4326)::geography) as distance_m
  from public.spots s
  where s.status = 'active'
    and s.geog is not null
    and (in_category is null or s.category = in_category)
  order by s.geog <-> st_setsrid(st_makepoint(in_lng, in_lat), 4326)::geography
  limit in_limit;
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.spots enable row level security;
alter table public.photos enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

-- profiles: public read, self write
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update using (auth.uid() = id);
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert with check (auth.uid() = id);

-- spots: public read of active spots
drop policy if exists spots_read on public.spots;
create policy spots_read on public.spots for select using (status = 'active');

-- photos: public read, authenticated insert (own), own delete
drop policy if exists photos_read on public.photos;
create policy photos_read on public.photos for select using (true);
drop policy if exists photos_insert on public.photos;
create policy photos_insert on public.photos for insert with check (auth.uid() = user_id);
drop policy if exists photos_delete on public.photos;
create policy photos_delete on public.photos for delete using (auth.uid() = user_id);

-- reviews: public read, own insert/update/delete
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select using (true);
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert with check (auth.uid() = user_id);
drop policy if exists reviews_update on public.reviews;
create policy reviews_update on public.reviews for update using (auth.uid() = user_id);
drop policy if exists reviews_delete on public.reviews;
create policy reviews_delete on public.reviews for delete using (auth.uid() = user_id);

-- favorites: only the owner can see/manage their favorites
drop policy if exists favorites_read on public.favorites;
create policy favorites_read on public.favorites for select using (auth.uid() = user_id);
drop policy if exists favorites_insert on public.favorites;
create policy favorites_insert on public.favorites for insert with check (auth.uid() = user_id);
drop policy if exists favorites_delete on public.favorites;
create policy favorites_delete on public.favorites for delete using (auth.uid() = user_id);

-- collections: public read (editorial content)
drop policy if exists collections_read on public.collections;
create policy collections_read on public.collections for select using (true);
drop policy if exists collection_items_read on public.collection_items;
create policy collection_items_read on public.collection_items for select using (true);

-- ============================================================================
-- Storage bucket for review/spot photos (public read).
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "photos public read" on storage.objects;
create policy "photos public read"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "photos authenticated upload" on storage.objects;
create policy "photos authenticated upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos');

drop policy if exists "photos owner delete" on storage.objects;
create policy "photos owner delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and owner = auth.uid());
