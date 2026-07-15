import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  CollectionWithSpots,
  Review,
  SpotWithStats,
} from "./types";

// Explicit column list (avoids shipping the geog WKB blob to the client).
const SPOT_COLS =
  "id,name,name_zh,category,subcategory,description,lat,lng,suburb,address," +
  "price_level,hours_json,phone,website,tags,hero_image_url,hero_emoji,status," +
  "source,seed_rating,seed_rating_count,created_at,updated_at,review_count,avg_rating";

function mapSpot(row: unknown): SpotWithStats {
  const r = row as Record<string, unknown>;
  return {
    ...(r as unknown as SpotWithStats),
    review_count: Number(r.review_count ?? 0),
    avg_rating: Number(r.avg_rating ?? 0),
  };
}

export interface SpotFilters {
  category?: Category | "all";
  maxPrice?: number; // 0..3
  minRating?: number; // e.g. 4.0
  search?: string;
}

export async function getSpots(filters: SpotFilters = {}): Promise<SpotWithStats[]> {
  const supabase = createClient();
  let q = supabase.from("spots_full").select(SPOT_COLS).eq("status", "active");

  if (filters.category && filters.category !== "all") {
    q = q.eq("category", filters.category);
  }
  if (typeof filters.maxPrice === "number") {
    q = q.lte("price_level", filters.maxPrice);
  }
  if (typeof filters.minRating === "number" && filters.minRating > 0) {
    q = q.gte("avg_rating", filters.minRating);
  }
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim();
    // name / suburb / description ilike OR tag array contains-ish.
    q = q.or(
      `name.ilike.%${term}%,name_zh.ilike.%${term}%,suburb.ilike.%${term}%,description.ilike.%${term}%`,
    );
  }

  const { data, error } = await q.order("avg_rating", { ascending: false });
  if (error) throw error;
  let rows = (data ?? []).map(mapSpot);

  // Tag search is handled client-side-friendly here (array ilike is awkward in
  // one .or()); if a text search yielded nothing on core fields, also try tags.
  if (filters.search && filters.search.trim() && rows.length === 0) {
    const { data: tagData } = await supabase
      .from("spots_full")
      .select(SPOT_COLS)
      .eq("status", "active")
      .contains("tags", [filters.search.trim()]);
    rows = (tagData ?? []).map(mapSpot);
  }
  return rows;
}

export async function getTrendingSpots(limit = 8): Promise<SpotWithStats[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("spots_full")
    .select(SPOT_COLS)
    .eq("status", "active")
    .order("avg_rating", { ascending: false })
    .order("seed_rating_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapSpot);
}

export async function getSpotsByCategory(
  category: Category,
  limit?: number,
): Promise<SpotWithStats[]> {
  const supabase = createClient();
  let q = supabase
    .from("spots_full")
    .select(SPOT_COLS)
    .eq("status", "active")
    .eq("category", category)
    .order("avg_rating", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapSpot);
}

export async function getSpotById(id: string): Promise<SpotWithStats | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("spots_full")
    .select(SPOT_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapSpot(data) : null;
}

export async function getReviewsForSpot(spotId: string): Promise<Review[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(display_name, avatar_url)")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => {
    const profile = r.profiles as { display_name?: string; avatar_url?: string } | null;
    return {
      ...(r as unknown as Review),
      author_name: profile?.display_name ?? "Guest",
      author_avatar: profile?.avatar_url ?? null,
    };
  });
}

export async function getCollectionsWithSpots(): Promise<CollectionWithSpots[]> {
  const supabase = createClient();
  const { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .eq("type", "editorial")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  if (!collections || collections.length === 0) return [];

  const { data: items } = await supabase
    .from("collection_items")
    .select("collection_id, spot_id, sort_order")
    .order("sort_order", { ascending: true });

  // Fetch all spots referenced, once.
  const spotIds = Array.from(new Set((items ?? []).map((i) => i.spot_id)));
  const spotMap = new Map<string, SpotWithStats>();
  if (spotIds.length) {
    const { data: spots } = await supabase
      .from("spots_full")
      .select(SPOT_COLS)
      .in("id", spotIds);
    (spots ?? []).forEach((s) => spotMap.set((s as unknown as { id: string }).id, mapSpot(s)));
  }

  return collections.map((c) => ({
    ...(c as CollectionWithSpots),
    spots: (items ?? [])
      .filter((i) => i.collection_id === c.id)
      .map((i) => spotMap.get(i.spot_id))
      .filter((s): s is SpotWithStats => Boolean(s)),
  }));
}

export async function getCollectionById(
  id: string,
): Promise<CollectionWithSpots | null> {
  const supabase = createClient();
  const { data: c } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!c) return null;
  const { data: items } = await supabase
    .from("collection_items")
    .select("spot_id, sort_order")
    .eq("collection_id", id)
    .order("sort_order", { ascending: true });
  const ids = (items ?? []).map((i) => i.spot_id);
  const spotMap = new Map<string, SpotWithStats>();
  if (ids.length) {
    const { data: spots } = await supabase
      .from("spots_full")
      .select(SPOT_COLS)
      .in("id", ids);
    (spots ?? []).forEach((s) => spotMap.set((s as unknown as { id: string }).id, mapSpot(s)));
  }
  return {
    ...(c as CollectionWithSpots),
    spots: ids.map((id) => spotMap.get(id)).filter((s): s is SpotWithStats => Boolean(s)),
  };
}

export interface ViewerContext {
  signedIn: boolean;
  userId: string | null;
  favoriteIds: Set<string>;
}

// One round-trip: who's viewing + what they've saved. Used by list pages.
export async function getViewerContext(): Promise<ViewerContext> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, userId: null, favoriteIds: new Set() };
  const { data } = await supabase
    .from("favorites")
    .select("spot_id")
    .eq("user_id", user.id);
  return {
    signedIn: true,
    userId: user.id,
    favoriteIds: new Set((data ?? []).map((f) => f.spot_id)),
  };
}

// Set of spot ids the current user has favorited (empty if signed out).
export async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase
    .from("favorites")
    .select("spot_id")
    .eq("user_id", user.id);
  return new Set((data ?? []).map((f) => f.spot_id));
}

export interface ProfileInfo {
  signedIn: boolean;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  languagePref: "en" | "zh";
  savedCount: number;
  reviewCount: number;
}

export async function getProfileInfo(): Promise<ProfileInfo | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, savedRes, reviewRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, avatar_url, language_pref, email")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("favorites")
      .select("spot_id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return {
    signedIn: true,
    email: profile?.email ?? user.email ?? null,
    displayName:
      profile?.display_name ?? user.email?.split("@")[0] ?? "Guest",
    avatarUrl: profile?.avatar_url ?? null,
    languagePref: (profile?.language_pref as "en" | "zh") ?? "en",
    savedCount: savedRes.count ?? 0,
    reviewCount: reviewRes.count ?? 0,
  };
}

export async function getFavoriteSpots(): Promise<SpotWithStats[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: favs } = await supabase
    .from("favorites")
    .select("spot_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const ids = (favs ?? []).map((f) => f.spot_id);
  if (!ids.length) return [];
  const { data: spots } = await supabase
    .from("spots_full")
    .select(SPOT_COLS)
    .in("id", ids);
  const byId = new Map((spots ?? []).map((s) => [(s as unknown as { id: string }).id, mapSpot(s)]));
  return ids.map((id) => byId.get(id)).filter((s): s is SpotWithStats => Boolean(s));
}
