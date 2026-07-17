"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { CATEGORY_ORDER, CATEGORIES, type Category } from "@/lib/types";
import type { DictKey } from "@/lib/i18n/dictionary";
import { clsx } from "@/lib/clsx";

// Horizontal category filter rail (prototype .chiprow).
export function CategoryChips({ active }: { active?: Category | "all" }) {
  const { t } = useLang();
  const chips: { key: Category | "all"; emoji: string; dictKey: DictKey; href: string }[] = [
    { key: "all", emoji: "✨", dictKey: "cat.all", href: "/" },
    ...CATEGORY_ORDER.map((c) => ({
      key: c,
      emoji: CATEGORIES[c].emoji,
      dictKey: `cat.${c}` as DictKey,
      href: `/category/${c}`,
    })),
  ];

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-[18px] pb-[2px] pt-3">
      {chips.map((chip) => {
        const isActive = (active ?? "all") === chip.key;
        return (
          <Link
            key={chip.key}
            href={chip.href}
            className={clsx(
              "flex flex-shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full border px-[15px] py-2 text-[13px] font-semibold transition-colors",
              isActive
                ? "border-red bg-red text-white"
                : "border-line bg-card text-ink",
            )}
          >
            <span aria-hidden>{chip.emoji}</span>
            {t(chip.dictKey)}
          </Link>
        );
      })}
    </div>
  );
}
