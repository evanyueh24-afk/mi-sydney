"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { useToast } from "./Toast";
import { createClient } from "@/lib/supabase/client";
import { submitReview } from "@/lib/actions";
import { clsx } from "@/lib/clsx";

export function ReviewComposer({
  spotId,
  reviewCount,
  signedIn,
}: {
  spotId: string;
  reviewCount: number;
  signedIn: boolean;
}) {
  const router = useRouter();
  const { t } = useLang();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  function openModal() {
    if (!signedIn) {
      toast(t("review.signInFirst"));
      router.push("/login");
      return;
    }
    setStars(0);
    setText("");
    setFile(null);
    setOpen(true);
  }

  async function onSubmit() {
    if (stars === 0) {
      toast(t("review.needStars"));
      return;
    }
    if (!text.trim()) {
      toast(t("review.needText"));
      return;
    }
    startTransition(async () => {
      let photoUrl: string | null = null;

      if (file) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const ext = file.name.split(".").pop() || "jpg";
          const path = `${user.id}/${spotId}-${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("photos")
            .upload(path, file, { upsert: false, cacheControl: "3600" });
          if (!upErr) {
            const { data } = supabase.storage.from("photos").getPublicUrl(path);
            photoUrl = data.publicUrl;
          } else {
            toast(upErr.message);
          }
        }
      }

      const res = await submitReview({ spotId, rating: stars, text, photoUrl });
      if (!res.ok) {
        toast(res.error === "not_authenticated" ? t("review.signInFirst") : "Error");
        return;
      }
      setOpen(false);
      toast(t("review.posted"));
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-bold">
          {t("spot.reviews")} ({reviewCount})
        </h2>
        <button
          type="button"
          onClick={openModal}
          className="rounded-full bg-red px-[14px] py-2 text-[12.5px] font-bold text-white"
        >
          {t("spot.writeReview")}
        </button>
      </div>

      {open && (
        <div
          className="absolute inset-0 z-[80] flex items-end bg-ink/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-[20px] bg-paper p-[22px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-serif text-[17px] font-bold">
              写点评 {t("review.title")}
            </h3>

            {/* Star picker */}
            <div className="mb-[14px]">
              <label className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.5px] text-muted">
                {t("review.yourRating")}
              </label>
              <div className="flex gap-2 text-[26px]">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStars(v)}
                    className={clsx(
                      "text-gold transition-opacity",
                      v <= stars ? "opacity-100" : "opacity-30",
                    )}
                    aria-label={`${v} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="mb-[14px]">
              <label className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.5px] text-muted">
                {t("review.text")}
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("review.textPlaceholder")}
                className="w-full resize-y rounded-[10px] border border-line bg-card px-[13px] py-[11px] text-[14px] outline-none"
              />
            </div>

            {/* Photo */}
            <div className="mb-4">
              <label className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.5px] text-muted">
                {t("review.photo")}
              </label>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-[12.5px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-paper-dim file:px-3 file:py-[6px] file:text-[12px] file:font-semibold file:text-ink"
              />
              {file && (
                <p className="mt-1 truncate text-[11.5px] text-faint">{file.name}</p>
              )}
            </div>

            <div className="mt-[6px] flex gap-[10px]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-[10px] border border-line bg-card py-3 text-[13.5px] font-bold"
              >
                {t("review.cancel")}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={pending}
                className="flex-1 rounded-[10px] bg-red py-3 text-[13.5px] font-bold text-white disabled:opacity-60"
              >
                {pending ? "…" : t("review.submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
