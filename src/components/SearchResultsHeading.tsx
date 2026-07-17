"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";

export function SearchResultsHeading({ count }: { count: number }) {
  const { t, lang } = useLang();
  const label = t("search.results");
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[16px] font-bold">
        {lang === "zh" ? `${count} ${label}` : `${count} ${label}`}
      </h2>
      <span className="font-serif text-[12px] font-bold text-red">结果</span>
    </div>
  );
}
