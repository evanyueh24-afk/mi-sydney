import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSpotById, getReviewsForSpot, getViewerContext } from "@/lib/queries";
import { CATEGORIES } from "@/lib/types";
import { priceStr, formatDate } from "@/lib/format";
import { Stars } from "@/components/Stars";
import { FavoriteButton } from "@/components/FavoriteButton";
import { OpenNowBadge, HoursDisclosure } from "@/components/Hours";
import { ReviewComposer } from "@/components/ReviewComposer";
import { T } from "@/components/T";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function SpotDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const spot = await getSpotById(params.id);
  if (!spot) notFound();

  const [reviews, viewer] = await Promise.all([
    getReviewsForSpot(spot.id),
    getViewerContext(),
  ]);
  const cat = CATEGORIES[spot.category];
  const favorited = viewer.favoriteIds.has(spot.id);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div
        className="relative flex h-[190px] flex-shrink-0 items-center justify-center text-[64px]"
        style={{ background: cat.tint }}
      >
        {spot.hero_image_url ? (
          <Image
            src={spot.hero_image_url}
            alt={spot.name}
            fill
            sizes="460px"
            className="object-cover"
            priority
          />
        ) : (
          <span aria-hidden>{spot.hero_emoji ?? cat.emoji}</span>
        )}
        <Link
          href="/"
          className="absolute left-[14px] top-[14px] z-[5] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/90 text-[16px]"
          aria-label="Back"
        >
          ←
        </Link>
        <span className="absolute right-[14px] top-[14px]">
          <FavoriteButton
            spotId={spot.id}
            initial={favorited}
            size="lg"
            signedIn={viewer.signedIn}
          />
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h1 className="mb-1 text-[22px] font-bold">{spot.name}</h1>
        {spot.name_zh && (
          <div className="mb-[10px] font-serif text-[14px] font-bold text-red">
            {spot.name_zh}
          </div>
        )}

        <div className="mb-[14px] flex flex-wrap items-center gap-[10px] text-[13px] text-muted">
          <div className="flex items-center gap-[6px] rounded-lg border border-line bg-card px-[10px] py-[5px]">
            <Stars rating={spot.avg_rating} />
            <span className="font-mono font-semibold text-jade">
              {spot.avg_rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-faint">({spot.review_count})</span>
          </div>
          <span>
            {cat.emoji} {cat.label}
          </span>
          <span className="font-mono">{priceStr(spot.price_level)}</span>
          <span>{spot.suburb}</span>
          <OpenNowBadge hours={spot.hours_json} />
        </div>

        {spot.tags && spot.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-[6px]">
            {spot.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-paper-dim px-[10px] py-1 text-[11px] font-semibold text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {spot.description && (
          <p className="mb-[18px] text-[14px] leading-[1.6] text-[#3a342b]">
            {spot.description}
          </p>
        )}

        {/* Address + contact */}
        <div className="mb-4 flex items-start gap-[10px] rounded-xl border border-line bg-card px-[14px] py-3 text-[13px]">
          <span aria-hidden>📍</span>
          <div className="flex-1">
            <div>{spot.address}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
              {spot.lat != null && spot.lng != null && (
                <a
                  className="font-semibold text-jade"
                  href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T k="spot.directions" /> →
                </a>
              )}
              {spot.phone && (
                <a className="font-semibold text-jade" href={`tel:${spot.phone}`}>
                  <T k="spot.call" />
                </a>
              )}
              {spot.website && (
                <a
                  className="font-semibold text-jade"
                  href={spot.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T k="spot.website" /> →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hours */}
        {spot.hours_json && <HoursDisclosure hours={spot.hours_json} />}

        <div className="my-[18px] h-px bg-[rgba(27,23,18,0.12)]" />

        {/* Reviews */}
        <ReviewComposer
          spotId={spot.id}
          reviewCount={spot.review_count}
          signedIn={viewer.signedIn}
        />

        <div id="reviews" className="mt-2">
          {reviews.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-faint">
              <T k="spot.noReviews" />
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-line py-[14px] last:border-none">
                <div className="mb-1 flex justify-between">
                  <span className="text-[13px] font-bold">{r.author_name}</span>
                  <span className="text-[11px] text-faint">
                    {formatDate(r.created_at)}
                  </span>
                </div>
                <div className="mb-1">
                  <Stars rating={r.rating} />
                </div>
                {r.text && (
                  <p className="text-[13.5px] leading-[1.5] text-[#3a342b]">{r.text}</p>
                )}
                {r.photo_url && (
                  <div className="relative mt-2 h-40 w-full overflow-hidden rounded-lg">
                    <Image
                      src={r.photo_url}
                      alt="Review photo"
                      fill
                      sizes="420px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
