"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import { clsx } from "@/lib/clsx";

const TABS: { href: string; icon: string; key: DictKey; match: (p: string) => boolean }[] = [
  { href: "/", icon: "🧭", key: "nav.discover", match: (p) => p === "/" },
  { href: "/nearby", icon: "📍", key: "nav.nearby", match: (p) => p.startsWith("/nearby") },
  { href: "/search", icon: "🔍", key: "nav.search", match: (p) => p.startsWith("/search") || p.startsWith("/browse") },
  { href: "/saved", icon: "♡", key: "nav.saved", match: (p) => p.startsWith("/saved") },
  { href: "/profile", icon: "👤", key: "nav.profile", match: (p) => p.startsWith("/profile") },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  // Hide the nav on the full-screen login page.
  if (pathname.startsWith("/login")) return null;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 flex h-[70px] border-t border-line bg-card">
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] font-semibold",
              active ? "text-red" : "text-faint",
            )}
          >
            <span className="text-[19px] leading-none">{tab.icon}</span>
            {t(tab.key)}
          </Link>
        );
      })}
    </nav>
  );
}
