import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { SpotGrid } from "@/components/SpotRail";
import { SetupNotice } from "@/components/SetupNotice";
import { T } from "@/components/T";
import { isSupabaseConfigured } from "@/lib/config";
import { getFavoriteSpots, getViewerContext } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const viewer = await getViewerContext();

  if (!viewer.signedIn) {
    return (
      <section className="p-[18px]">
        <SectionTitle titleKey="nav.saved" zhTag="我的收藏" />
        <div className="py-10 text-center text-[13px] text-faint">
          <p className="mb-3">
            <T k="saved.signInFirst" />
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-red px-5 py-[10px] text-[13px] font-bold text-white"
          >
            <T k="auth.signIn" />
          </Link>
        </div>
      </section>
    );
  }

  const spots = await getFavoriteSpots();

  return (
    <section className="p-[18px]">
      <SectionTitle titleKey="saved.title" zhTag="我的收藏" />
      {spots.length === 0 ? (
        <p className="py-10 text-center text-[13px] leading-relaxed text-faint">
          <T k="saved.empty" />
        </p>
      ) : (
        <SpotGrid
          spots={spots}
          favoriteIds={viewer.favoriteIds}
          signedIn={viewer.signedIn}
        />
      )}
    </section>
  );
}
