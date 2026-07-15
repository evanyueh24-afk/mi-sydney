"use client";

import Link from "next/link";
import { CATEGORIES, type CollectionWithSpots } from "@/lib/types";
import { useLang } from "@/lib/i18n/LanguageProvider";

// Editorial collection preview card — a stacked tile showing the collection
// title and a peek at its spots' category tints.
export function CollectionCard({ collection }: { collection: CollectionWithSpots }) {
  const { lang } = useLang();
  const title = lang === "zh" && collection.title_zh ? collection.title_zh : collection.title;
  const tints = collection.spots.slice(0, 4).map((s) => CATEGORIES[s.category].tint);
  const emojis = collection.spots.slice(0, 4).map((s) => s.hero_emoji ?? CATEGORIES[s.category].emoji);

  return (
    <Link
      href={`/collection/${collection.id}`}
      className="press flex w-[240px] flex-shrink-0 flex-col overflow-hidden rounded-[14px] border border-line bg-card"
    >
      <div className="grid grid-cols-4">
        {tints.map((tint, i) => (
          <div
            key={i}
            className="flex h-[70px] items-center justify-center text-[24px]"
            style={{ background: tint }}
          >
            <span aria-hidden>{emojis[i]}</span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3 pt-[10px]">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-serif text-[11px] font-bold text-red">精选</span>
          <span className="text-[11px] text-faint">
            {collection.spots.length} spots
          </span>
        </div>
        <div className="text-[14px] font-bold leading-tight">{title}</div>
        {collection.description && (
          <div className="mt-1 line-clamp-2 text-[11.5px] text-muted">
            {collection.description}
          </div>
        )}
      </div>
    </Link>
  );
}
