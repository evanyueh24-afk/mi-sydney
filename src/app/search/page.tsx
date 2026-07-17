import { Suspense } from "react";
import { SearchControls } from "@/components/SearchControls";
import { SpotGrid } from "@/components/SpotRail";
import { SetupNotice } from "@/components/SetupNotice";
import { SearchResultsHeading } from "@/components/SearchResultsHeading";
import { T } from "@/components/T";
import { isSupabaseConfigured } from "@/lib/config";
import { getSpots, getViewerContext, type SpotFilters } from "@/lib/queries";
import { isOpenNow } from "@/lib/hours";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }

  const filters: SpotFilters = {
    search: searchParams.q,
    category: (searchParams.category as Category) ?? "all",
    maxPrice: searchParams.price ? Number(searchParams.price) : undefined,
    minRating: searchParams.rating ? Number(searchParams.rating) : undefined,
  };

  const [all, viewer] = await Promise.all([
    getSpots(filters),
    getViewerContext(),
  ]);

  // "Open now" is time-based, so filter it in app code (Sydney time).
  const results =
    searchParams.open === "1" ? all.filter((s) => isOpenNow(s.hours_json)) : all;

  return (
    <>
      {/* useSearchParams needs a Suspense boundary during prerender. */}
      <Suspense fallback={<div className="h-[160px] border-b border-line" />}>
        <SearchControls />
      </Suspense>
      <section className="p-[18px]">
        <SearchResultsHeading count={results.length} />
        {results.length === 0 ? (
          <SearchEmpty />
        ) : (
          <SpotGrid
            spots={results}
            favoriteIds={viewer.favoriteIds}
            signedIn={viewer.signedIn}
          />
        )}
      </section>
    </>
  );
}

function SearchEmpty() {
  return (
    <p className="py-10 text-center text-[13px] text-faint">
      <T k="search.noResults" />
    </p>
  );
}
