import type { Metadata, Viewport } from "next";
import { Work_Sans, Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { AppFrame } from "@/components/AppFrame";
import { createClient } from "@/lib/supabase/server";
import type { Lang } from "@/lib/i18n/dictionary";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["500", "700", "900"],
  variable: "--font-noto-serif-sc",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "觅 Mì — Sydney Discovery",
  description:
    "A local discovery & review app for Sydney — food, attractions, recreation, shopping and services.",
};

export const viewport: Viewport = {
  themeColor: "#B23225",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Seed the language from the signed-in user's saved preference (if any).
  let initialLang: Lang = "en";
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("language_pref")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.language_pref === "zh" || data?.language_pref === "en") {
        initialLang = data.language_pref;
      }
    }
  } catch {
    // env not configured yet — fall back to English.
  }

  return (
    <html lang={initialLang === "zh" ? "zh-CN" : "en"}>
      <body
        className={`${workSans.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable}`}
      >
        <LanguageProvider initialLang={initialLang}>
          <AppFrame>{children}</AppFrame>
        </LanguageProvider>
      </body>
    </html>
  );
}
