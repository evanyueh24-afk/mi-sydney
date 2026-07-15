"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Seal } from "./Seal";
import { LanguageToggle } from "./LanguageToggle";

// Sticky app header: brand + language toggle + a tap-to-search bar.
// (The full search UI with filters lives on /search.)
export function Header({ showSearch = true }: { showSearch?: boolean }) {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper px-[18px] pb-3 pt-[18px]">
      <div className="mb-[14px] flex items-center gap-[10px]">
        <Seal className="h-[38px] w-[38px] text-[20px]">觅</Seal>
        <div className="leading-[1.1]">
          <div className="font-serif text-[19px] font-black tracking-[1px]">
            觅 Mì
          </div>
          <div className="text-[10.5px] uppercase tracking-[3px] text-muted">
            {t("brand.tagline")}
          </div>
        </div>
        <LanguageToggle className="ml-auto" />
      </div>
      {showSearch && (
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-xl border border-line bg-card px-[14px] py-[11px] text-[14.5px] text-muted"
        >
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
          {t("search.placeholder")}
        </Link>
      )}
    </header>
  );
}
