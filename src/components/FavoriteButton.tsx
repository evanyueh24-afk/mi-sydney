"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/lib/actions";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/Toast";
import { clsx } from "@/lib/clsx";

export function FavoriteButton({
  spotId,
  initial,
  size = "sm",
  signedIn,
}: {
  spotId: string;
  initial: boolean;
  size?: "sm" | "lg";
  signedIn: boolean;
}) {
  const [fav, setFav] = useState(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useLang();
  const toast = useToast();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!signedIn) {
      toast(t("saved.signInFirst"));
      router.push("/login");
      return;
    }
    // Optimistic flip.
    const next = !fav;
    setFav(next);
    startTransition(async () => {
      const res = await toggleFavorite(spotId);
      if (!res.ok) {
        setFav(!next); // revert
        return;
      }
      toast(res.favorited ? t("fav.saved") : t("fav.removed"));
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={fav}
      aria-label={fav ? "Saved" : "Save"}
      className={clsx(
        "flex items-center justify-center rounded-full bg-white/85",
        size === "sm" ? "h-6 w-6 text-[13px]" : "h-[34px] w-[34px] text-[16px]",
        fav ? "text-red" : "text-ink",
      )}
    >
      {fav ? "♥" : "♡"}
    </button>
  );
}
