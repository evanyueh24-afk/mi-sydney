"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { CATEGORY_ORDER, CATEGORIES, type Category } from "@/lib/types";
import type { DictKey } from "@/lib/i18n/dictionary";
import { clsx } from "@/lib/clsx";

export function SearchControls() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { t } = useLang();

  const [q, setQ] = useState(params.get("q") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local input in sync if the URL changes externally.
  useEffect(() => {
    setQ(params.get("q") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q")]);

  const pushParams = useCallback(
    (next: URLSearchParams) => {
      const str = next.toString();
      router.replace(str ? `${pathname}?${str}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    pushParams(next);
  }

  function onSearchChange(value: string) {
    setQ(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setParam("q", value.trim() || null), 250);
  }

  const category = (params.get("category") as Category | null) ?? "all";
  const price = params.get("price"); // "1" | "2" | "3"
  const rating = params.get("rating"); // "3.5" | "4" | "4.5"
  const openNow = params.get("open") === "1";

  const hasFilters =
    category !== "all" || price || rating || openNow || params.get("q");

  return (
    <div className="border-b border-line bg-paper px-[18px] pb-3 pt-[18px]">
      {/* search input */}
      <div className="flex items-center gap-2 rounded-xl border border-line bg-card px-[14px] py-[11px]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-55"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("search.placeholder")}
          className="flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-faint"
        />
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="text-[12px] font-semibold text-red"
          >
            {t("search.clear")}
          </button>
        )}
      </div>

      {/* category chips */}
      <div className="no-scrollbar -mx-[2px] mt-3 flex gap-2 overflow-x-auto pb-1">
        <Chip
          active={category === "all"}
          label={t("cat.all")}
          onClick={() => setParam("category", null)}
        />
        {CATEGORY_ORDER.map((c) => (
          <Chip
            key={c}
            active={category === c}
            label={`${CATEGORIES[c].emoji} ${t(`cat.${c}` as DictKey)}`}
            onClick={() => setParam("category", category === c ? null : c)}
          />
        ))}
      </div>

      {/* price + rating + open now */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <FilterGroup label={t("search.price")}>
          {["1", "2", "3"].map((p) => (
            <Chip
              key={p}
              small
              active={price === p}
              label={"$".repeat(Number(p))}
              onClick={() => setParam("price", price === p ? null : p)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label={t("search.minRating")}>
          {["3.5", "4", "4.5"].map((r) => (
            <Chip
              key={r}
              small
              active={rating === r}
              label={`${r}★`}
              onClick={() => setParam("rating", rating === r ? null : r)}
            />
          ))}
        </FilterGroup>

        <Chip
          small
          active={openNow}
          label={`🟢 ${t("search.openNow")}`}
          onClick={() => setParam("open", openNow ? null : "1")}
        />
      </div>
    </div>
  );
}

function Chip({
  active,
  label,
  onClick,
  small,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-shrink-0 whitespace-nowrap rounded-full border font-semibold transition-colors",
        small ? "px-[11px] py-[5px] text-[12px]" : "px-[14px] py-[7px] text-[13px]",
        active ? "border-red bg-red text-white" : "border-line bg-card text-ink",
      )}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-faint">
        {label}
      </span>
      {children}
    </div>
  );
}
