import { Header } from "@/components/Header";
import { CategoryChips } from "@/components/CategoryChips";
import { SectionTitle } from "@/components/SectionTitle";
import { SpotRail } from "@/components/SpotRail";
import { CollectionCard } from "@/components/CollectionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/config";
import {
  getTrendingSpots,
  getSpotsByCategory,
  getCollectionsWithSpots,
  getViewerContext,
} from "@/lib/queries";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Header showSearch={false} />
        <SetupNotice />
      </>
    );
  }

  const [trending, collections, viewer] = await Promise.all([
    getTrendingSpots(8),
    getCollectionsWithSpots(),
    getViewerContext(),
  ]);

  const categoryRows = await Promise.all(
    CATEGORY_ORDER.map(async (cat) => ({
      cat,
      spots: await getSpotsByCategory(cat, 8),
    })),
  );

  const { favoriteIds, signedIn } = viewer;

  return (
    <>
      <Header />
      <CategoryChips active="all" />

      <section className="px-[18px] pb-[6px] pt-[18px]">
        <SectionTitle titleKey="discover.trending" zhTag="热门" />
        <SpotRail spots={trending} favoriteIds={favoriteIds} signedIn={signedIn} />
      </section>

      {collections.length > 0 && (
        <section className="px-[18px] py-[6px]">
          <SectionTitle titleKey="discover.collections" zhTag="精选合集" />
          <div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px] pb-1">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        </section>
      )}

      {categoryRows.map(({ cat, spots }) =>
        spots.length === 0 ? null : (
          <section key={cat} className="px-[18px] py-[6px]">
            <SectionTitle
              title={`${CATEGORIES[cat].emoji} ${CATEGORIES[cat].label}`}
              zhTag={CATEGORIES[cat].zh}
              seeAllHref={`/category/${cat}`}
            />
            <SpotRail spots={spots} favoriteIds={favoriteIds} signedIn={signedIn} />
          </section>
        ),
      )}

      <p className="px-8 pb-4 pt-2 text-center text-[11px] leading-relaxed text-faint">
        Food, attractions, recreation & shopping reflect real Sydney venues.
        Some services listings are representative samples. Ratings blend a
        starting community score with reviews posted here.
      </p>
    </>
  );
}
