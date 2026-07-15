import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, type SpotWithStats } from "@/lib/types";
import { priceStr, formatDistance } from "@/lib/format";
import { Stars } from "./Stars";
import { FavoriteButton } from "./FavoriteButton";
import { clsx } from "@/lib/clsx";

export function SpotCard({
  spot,
  wide = false,
  favorited = false,
  signedIn = false,
}: {
  spot: SpotWithStats;
  wide?: boolean;
  favorited?: boolean;
  signedIn?: boolean;
}) {
  const cat = CATEGORIES[spot.category];
  return (
    <Link
      href={`/spot/${spot.id}`}
      className={clsx(
        "press flex flex-col overflow-hidden rounded-[14px] border border-line bg-card transition-transform",
        wide && "w-[180px] flex-shrink-0",
      )}
    >
      <div
        className="relative flex h-24 items-center justify-center text-[34px]"
        style={{ background: cat.tint }}
      >
        {spot.hero_image_url ? (
          <Image
            src={spot.hero_image_url}
            alt={spot.name}
            fill
            sizes="180px"
            className="object-cover"
          />
        ) : (
          <span aria-hidden>{spot.hero_emoji ?? cat.emoji}</span>
        )}
        <span className="absolute left-[6px] top-[6px] rounded-full bg-black/35 px-[7px] py-[2px] text-[9px] font-semibold uppercase tracking-[0.5px] text-white">
          {cat.zh} {cat.label}
        </span>
        <span className="absolute right-[6px] top-[6px]">
          <FavoriteButton spotId={spot.id} initial={favorited} signedIn={signedIn} />
        </span>
      </div>
      <div className="px-[11px] pb-3 pt-[10px]">
        <div className="mb-[3px] text-[13.5px] font-bold leading-[1.25]">
          {spot.name}
        </div>
        <div className="mb-[6px] truncate text-[11.5px] text-muted">
          {spot.suburb}
        </div>
        <div className="flex items-center gap-[6px] text-[12px]">
          <Stars rating={spot.avg_rating} />
          <span className="font-mono font-semibold text-jade">
            {spot.avg_rating.toFixed(1)}
          </span>
          <span className="font-mono text-[#8a8074]">
            {priceStr(spot.price_level)}
          </span>
          {typeof spot.distance_km === "number" && (
            <span className="ml-auto font-mono text-[11px] text-faint">
              {formatDistance(spot.distance_km)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
