"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Seal } from "./Seal";
import { LanguageToggle } from "./LanguageToggle";
import { createClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/config";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLang();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(
    params.get("error") === "auth" ? "Sign-in failed. Please try again." : null,
  );

  async function onEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
            emailRedirectTo: `${siteUrl}/auth/callback`,
          },
        });
        if (error) throw error;
        // If email confirmation is on, there's no session yet.
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setMsg(t("auth.checkEmail"));
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/auth/callback` },
    });
    if (error) {
      setMsg(error.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-red px-8 py-12 text-white">
      <div className="flex justify-end">
        <LanguageToggle className="!border-white/30 !bg-white/10" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <Seal invert className="mb-5 h-16 w-16 text-[32px]">
          觅
        </Seal>
        <h1 className="mb-1 font-serif text-[28px] font-black">觅 Mì</h1>
        <p className="mb-7 max-w-[300px] text-center text-[13.5px] leading-relaxed opacity-85">
          {t("auth.welcome")}
        </p>

        <form onSubmit={onEmailAuth} className="w-full max-w-[320px] space-y-3">
          {mode === "signup" && (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("auth.displayName")}
              maxLength={40}
              className="w-full rounded-[10px] px-4 py-[13px] text-[14px] text-ink outline-none"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.email")}
            className="w-full rounded-[10px] px-4 py-[13px] text-[14px] text-ink outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")}
            className="w-full rounded-[10px] px-4 py-[13px] text-[14px] text-ink outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[10px] bg-white py-[13px] text-[14px] font-bold text-red disabled:opacity-70"
          >
            {busy ? "…" : mode === "signup" ? t("auth.signUp") : t("auth.signIn")}
          </button>
        </form>

        <div className="my-4 flex w-full max-w-[320px] items-center gap-3 opacity-70">
          <div className="h-px flex-1 bg-white/40" />
          <span className="text-[12px]">{t("auth.or")}</span>
          <div className="h-px flex-1 bg-white/40" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          disabled={busy}
          className="flex w-full max-w-[320px] items-center justify-center gap-2 rounded-[10px] bg-white/10 py-[13px] text-[14px] font-semibold ring-1 ring-white/40 disabled:opacity-70"
        >
          <GoogleGlyph />
          {t("auth.continueGoogle")}
        </button>

        {msg && (
          <p className="mt-4 max-w-[320px] text-center text-[12.5px] opacity-90">
            {msg}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMsg(null);
          }}
          className="mt-5 text-[13px] underline underline-offset-2 opacity-90"
        >
          {mode === "signin" ? t("auth.needAccount") : t("auth.haveAccount")}
        </button>

        <Link href="/" className="mt-3 text-[12.5px] opacity-70">
          {t("auth.skip")}
        </Link>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.3 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
