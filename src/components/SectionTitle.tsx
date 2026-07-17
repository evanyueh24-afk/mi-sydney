"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";

// Section header: localized title on the left, a small red CJK accent tag on
// the right (prototype .section-title). Optionally a "See all" link.
export function SectionTitle({
  titleKey,
  title,
  zhTag,
  seeAllHref,
}: {
  titleKey?: DictKey;
  title?: string;
  zhTag: string;
  seeAllHref?: string;
}) {
  const { t } = useLang();
  const heading = titleKey ? t(titleKey) : title;
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[16px] font-bold">{heading}</h2>
      {seeAllHref ? (
        <Link href={seeAllHref} className="font-serif text-[12px] font-bold text-red">
          {t("discover.seeAll")} →
        </Link>
      ) : (
        <span className="font-serif text-[12px] font-bold text-red">{zhTag}</span>
      )}
    </div>
  );
}
