"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { useToast } from "./Toast";
import { updateProfile, signOut } from "@/lib/actions";
import { clsx } from "@/lib/clsx";

export function ProfileEditor({
  initialName,
  initialLang,
  email,
}: {
  initialName: string;
  initialLang: "en" | "zh";
  email: string | null;
}) {
  const router = useRouter();
  const { t, setLang } = useLang();
  const toast = useToast();
  const [name, setName] = useState(initialName);
  const [lang, setLocalLang] = useState<"en" | "zh">(initialLang);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateProfile({ displayName: name, languagePref: lang });
      if (!res.ok) {
        toast("Error");
        return;
      }
      setLang(lang); // apply chrome language immediately
      toast(t("profile.saved_toast"));
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {email && (
        <div className="text-[12px] text-faint">{email}</div>
      )}

      <div>
        <label className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.5px] text-muted">
          {t("profile.displayName")}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          className="w-full rounded-[10px] border border-line bg-card px-[13px] py-[11px] text-[14px] outline-none"
        />
      </div>

      <div>
        <label className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.5px] text-muted">
          {t("profile.language")}
        </label>
        <div className="flex gap-2">
          {(["en", "zh"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocalLang(l);
                setLang(l);
              }}
              className={clsx(
                "flex-1 rounded-[10px] border py-[10px] text-[13px] font-bold",
                lang === l ? "border-red bg-red text-white" : "border-line bg-card",
              )}
            >
              {l === "en" ? "English" : "中文"}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="w-full rounded-[10px] bg-red py-3 text-[14px] font-bold text-white disabled:opacity-60"
      >
        {pending ? "…" : t("profile.save")}
      </button>

      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-[10px] border border-line bg-card py-3 text-[13px] font-semibold text-muted"
        >
          {t("profile.signOut")}
        </button>
      </form>
    </div>
  );
}
