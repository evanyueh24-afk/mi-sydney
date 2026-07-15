import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { CategoryChips } from "@/components/CategoryChips";
import { SectionTitle } from "@/components/SectionTitle";
import { SpotGrid } from "@/components/SpotRail";
import { getSpotsByCategory, getViewerContext } from "@/lib/queries";
import { CATEGORIES, CATEGORY_ORDER, type Category } from "@/lib/types";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category as Category;
  if (!CATEGORY_ORDER.includes(category)) notFound();
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [spots, viewer] = await Promise.all([
    getSpotsByCategory(category),
    getViewerContext(),
  ]);
  const meta = CATEGORIES[category];

  return (
    <>
      <Header />
      <CategoryChips active={category} />
      <section className="p-[18px]">
        <SectionTitle
          title={`${meta.emoji} ${meta.label}`}
          zhTag={meta.zh}
        />
        {spots.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-faint">
            No spots in this category yet.
          </p>
        ) : (
          <SpotGrid
            spots={spots}
            favoriteIds={viewer.favoriteIds}
            signedIn={viewer.signedIn}
          />
        )}
      </section>
    </>
  );
}
