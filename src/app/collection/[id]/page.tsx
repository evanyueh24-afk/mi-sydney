import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionById, getViewerContext } from "@/lib/queries";
import { SpotGrid } from "@/components/SpotRail";
import { CollectionHeading } from "@/components/CollectionHeading";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [collection, viewer] = await Promise.all([
    getCollectionById(params.id),
    getViewerContext(),
  ]);
  if (!collection) notFound();

  return (
    <section className="p-[18px]">
      <Link href="/" className="mb-3 inline-block text-[13px] font-semibold text-red">
        ← 觅 Mì
      </Link>
      <CollectionHeading
        title={collection.title}
        titleZh={collection.title_zh}
        description={collection.description}
        count={collection.spots.length}
      />
      <SpotGrid
        spots={collection.spots}
        favoriteIds={viewer.favoriteIds}
        signedIn={viewer.signedIn}
      />
    </section>
  );
}
