import { NearbyClient } from "@/components/NearbyClient";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/config";
import { getSpots, getViewerContext } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NearbyPage() {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }
  // Ship all active spots (with lat/lng) to the client; it computes distance
  // from the browser's geolocation and sorts. Full PostGIS map view is Phase 2.
  const [spots, viewer] = await Promise.all([getSpots(), getViewerContext()]);
  const located = spots.filter((s) => s.lat != null && s.lng != null);

  return (
    <NearbyClient
      spots={located}
      favoriteIds={Array.from(viewer.favoriteIds)}
      signedIn={viewer.signedIn}
    />
  );
}
