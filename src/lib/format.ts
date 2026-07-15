// Small presentation helpers shared across components.

export function priceStr(level: number, freeLabel = "Free"): string {
  if (level <= 0) return freeLabel;
  return "$".repeat(Math.min(level, 3));
}

export function starString(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
}

// Blend a spot's seed community rating with in-app reviews so newly seeded
// spots aren't rating-less (mirrors the prototype's approach, spec §9 feel).
export function blendedRating(
  seedRating: number | null,
  seedCount: number | null,
  reviewSum: number,
  reviewCount: number,
): number {
  const sWeight = seedCount && seedCount > 0 ? Math.min(seedCount, 25) : 0;
  const sRating = seedRating ?? 0;
  const total = sRating * sWeight + reviewSum;
  const count = sWeight + reviewCount;
  if (count === 0) return 0;
  return Math.round((total / count) * 10) / 10;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
