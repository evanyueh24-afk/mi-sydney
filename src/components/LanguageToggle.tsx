"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";
import { clsx } from "@/lib/clsx";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={clsx(
        "flex items-center overflow-hidden rounded-full border border-line bg-card text-[12px] font-semibold",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={clsx(
          "px-[10px] py-[5px] transition-colors",
          lang === "en" ? "bg-red text-white" : "text-muted",
        )}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("zh")}
        className={clsx(
          "px-[10px] py-[5px] font-serif transition-colors",
          lang === "zh" ? "bg-red text-white" : "text-muted",
        )}
        aria-pressed={lang === "zh"}
      >
        中
      </button>
    </div>
  );
}
