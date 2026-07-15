// Domain types mirroring the Supabase schema (spec §6).

export type Category =
  | "food"
  | "attractions"
  | "recreation"
  | "shopping"
  | "services";

export type SpotStatus = "active" | "pending" | "archived";
export type SpotSource = "curated" | "business_claimed" | "user_submitted";
export type CollectionType = "editorial" | "user_guide";

// hours_json shape: per-weekday open/close in 24h "HH:MM", or null when closed.
// day keys are 0 (Sunday) .. 6 (Saturday) to match JS getDay().
export interface DayHours {
  open: string; // "09:00"
  close: string; // "17:00"
}
export type HoursJson = Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, DayHours | null>>;

export interface Spot {
  id: string;
  name: string;
  name_zh: string | null;
  category: Category;
  subcategory: string | null;
  description: string | null;
  lat: number | null;
  lng: number | null;
  suburb: string | null;
  address: string | null;
  price_level: number; // 0..3
  hours_json: HoursJson | null;
  phone: string | null;
  website: string | null;
  tags: string[] | null;
  hero_image_url: string | null;
  hero_emoji: string | null;
  status: SpotStatus;
  source: SpotSource;
  seed_rating: number | null; // starting community score (blends with reviews)
  seed_rating_count: number | null;
  created_at: string;
  updated_at: string;
}

// Convenience shape returned by list queries that also compute aggregates.
export interface SpotWithStats extends Spot {
  review_count: number;
  avg_rating: number; // blended display rating
  distance_km?: number | null;
  is_favorited?: boolean;
}

export interface Review {
  id: string;
  spot_id: string;
  user_id: string;
  rating: number; // 1..5
  rating_food: number | null;
  rating_service: number | null;
  rating_ambience: number | null;
  text: string | null;
  helpful_count: number;
  created_at: string;
  // joined
  author_name?: string | null;
  author_avatar?: string | null;
  photo_url?: string | null;
}

export interface Photo {
  id: string;
  spot_id: string;
  user_id: string | null;
  url: string;
  caption: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  language_pref: "en" | "zh";
  is_tourist: boolean | null;
  reviewer_level: number | null;
  created_at: string;
}

export interface Collection {
  id: string;
  title: string;
  title_zh: string | null;
  type: CollectionType;
  author_id: string | null;
  cover_image_url: string | null;
  description: string | null;
  target_audience: string[] | null;
  created_at: string;
}

export interface CollectionWithSpots extends Collection {
  spots: SpotWithStats[];
}

export const CATEGORIES: Record<
  Category,
  { label: string; zh: string; emoji: string; tint: string }
> = {
  food: { label: "Food", zh: "美食", emoji: "🍜", tint: "#F3D9C4" },
  attractions: { label: "Attractions", zh: "景点", emoji: "🏛️", tint: "#D7E4DC" },
  recreation: { label: "Recreation", zh: "玩乐", emoji: "🎯", tint: "#F0E1C8" },
  shopping: { label: "Shopping", zh: "购物", emoji: "🛍️", tint: "#E9DCEF" },
  services: { label: "Services", zh: "服务", emoji: "🧖", tint: "#DCE6EF" },
};

export const CATEGORY_ORDER: Category[] = [
  "food",
  "attractions",
  "recreation",
  "shopping",
  "services",
];
