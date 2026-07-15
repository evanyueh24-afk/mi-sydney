"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { SpotGrid } from "./SpotRail";
import { Seal } from "./Seal";
import { haversineKm } from "@/lib/format";
import type { SpotWithStats } from "@/lib/types";

type GeoState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "ready"; lat: number; lng: number }
  | { status: "denied" };

// Sydney CBD fallback so the list is still useful before location is granted.
const SYDNEY_CBD = { lat: -33.8688, lng: 151.2093 };

export function NearbyClient({
  spots,
  favoriteIds,
  signedIn,
}: {
  spots: SpotWithStats[];
  favoriteIds: string[];
  signedIn: boolean;
}) {
  const { t } = useLang();
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });
  const favSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "denied" });
      return;
    }
    setGeo({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setGeo({
          status: "ready",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setGeo({ status: "denied" }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  // Auto-request on mount (the browser will prompt for permission).
  useEffect(() => {
    requestLocation();
  }, []);

  const origin =
    geo.status === "ready" ? { lat: geo.lat, lng: geo.lng } : SYDNEY_CBD;

  const sorted = useMemo(() => {
    return spots
      .map((s) => ({
        ...s,
        distance_km: haversineKm(origin.lat, origin.lng, s.lat!, s.lng!),
      }))
      .sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0));
  }, [spots, origin.lat, origin.lng]);

  return (
    <section className="p-[18px]">
      <div className="mb-1 flex items-center gap-[10px]">
        <Seal className="h-[34px] w-[34px] text-[16px]">附</Seal>
        <div>
          <h1 className="text-[18px] font-bold">{t("nearby.title")}</h1>
          <p className="text-[12px] text-muted">
            {geo.status === "ready"
              ? t("nearby.subtitle")
              : geo.status === "locating"
                ? t("nearby.locating")
                : t("nearby.subtitle") + " · Sydney CBD"}
          </p>
        </div>
      </div>

      {geo.status === "denied" && (
        <div className="mb-3 mt-2 rounded-xl border border-line bg-card p-3 text-[12.5px] text-muted">
          {t("nearby.denied")}
          <button
            type="button"
            onClick={requestLocation}
            className="ml-2 font-semibold text-red"
          >
            {t("nearby.enable")}
          </button>
        </div>
      )}

      <div className="mt-3">
        <SpotGrid spots={sorted} favoriteIds={favSet} signedIn={signedIn} />
      </div>
    </section>
  );
}
