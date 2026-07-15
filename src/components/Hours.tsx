"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { isOpenNow, formatHours } from "@/lib/hours";
import type { HoursJson } from "@/lib/types";
import { clsx } from "@/lib/clsx";

// Rendered client-side only (after mount) so the open/closed state reflects the
// viewer's real "now" without causing a hydration mismatch.
export function OpenNowBadge({ hours }: { hours: HoursJson | null }) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!hours || !mounted) return null;
  const open = isOpenNow(hours);
  return (
    <span
      className={clsx(
        "rounded-full px-[8px] py-[3px] text-[11px] font-bold",
        open ? "bg-jade/15 text-jade" : "bg-red/10 text-red",
      )}
    >
      {open ? `🟢 ${t("spot.open")}` : t("spot.closed")}
    </span>
  );
}

export function HoursDisclosure({ hours }: { hours: HoursJson | null }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  if (!hours) return null;
  const rows = formatHours(hours);
  return (
    <div className="rounded-xl border border-line bg-card px-[14px] py-3 text-[13px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between font-semibold"
      >
        <span>🕒 {t("spot.hours")}</span>
        <span className="text-faint">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-1 font-mono text-[12px] text-muted">
          {rows.map((row, i) => (
            <li key={i}>{row}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
