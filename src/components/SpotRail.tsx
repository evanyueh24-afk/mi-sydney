import { SpotCard } from "./SpotCard";
import type { SpotWithStats } from "@/lib/types";

// Horizontal scrolling rail of wide spot cards (prototype .hlist).
export function SpotRail({
  spots,
  favoriteIds,
  signedIn,
}: {
  spots: SpotWithStats[];
  favoriteIds: Set<string>;
  signedIn: boolean;
}) {
  return (
    <div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px] pb-1">
      {spots.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          wide
          favorited={favoriteIds.has(spot.id)}
          signedIn={signedIn}
        />
      ))}
    </div>
  );
}

// Responsive 2-col grid of spot cards (prototype .grid).
export function SpotGrid({
  spots,
  favoriteIds,
  signedIn,
}: {
  spots: SpotWithStats[];
  favoriteIds: Set<string>;
  signedIn: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {spots.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          favorited={favoriteIds.has(spot.id)}
          signedIn={signedIn}
        />
      ))}
    </div>
  );
}
