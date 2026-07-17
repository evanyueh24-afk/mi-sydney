"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";

export function CollectionHeading({
  title,
  titleZh,
  description,
  count,
}: {
  title: string;
  titleZh: string | null;
  description: string | null;
  count: number;
}) {
  const { lang } = useLang();
  const heading = lang === "zh" && titleZh ? titleZh : title;
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-serif text-[12px] font-bold text-red">精选合集</span>
        <span className="text-[11px] text-faint">{count} spots</span>
      </div>
      <h1 className="text-[22px] font-bold">{heading}</h1>
      {description && (
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
