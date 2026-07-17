import Link from "next/link";
import { SetupNotice } from "@/components/SetupNotice";
import { Seal } from "@/components/Seal";
import { ProfileEditor } from "@/components/ProfileEditor";
import { T } from "@/components/T";
import { isSupabaseConfigured } from "@/lib/config";
import { getProfileInfo } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const info = await getProfileInfo();

  if (!info) {
    return (
      <section className="p-[18px]">
        <div className="mt-6 rounded-2xl border border-line bg-card p-6 text-center">
          <Seal className="mx-auto mb-3 h-16 w-16 text-[32px]">觅</Seal>
          <h1 className="mb-1 font-serif text-[18px] font-black">觅 Mì</h1>
          <p className="mb-4 text-[13px] text-muted">
            <T k="auth.welcome" />
          </p>
          <Link
            href="/login"
            className="inline-block w-full rounded-[10px] bg-red py-3 text-[14px] font-bold text-white"
          >
            <T k="auth.signIn" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="p-[18px]">
      <div className="mb-[18px] rounded-2xl border border-line bg-card p-[22px] text-center">
        <Seal className="mx-auto mb-3 h-[52px] w-[52px] text-[24px]">
          {info.displayName.charAt(0).toUpperCase()}
        </Seal>
        <div className="text-[16px] font-bold">{info.displayName}</div>
        <div className="mt-1 text-[12px] text-faint">
          <T k="profile.member" />
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="text-center">
            <div className="font-mono text-[18px] font-bold text-jade">
              {info.savedCount}
            </div>
            <div className="text-[10px] uppercase tracking-[0.5px] text-faint">
              <T k="profile.saved" />
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-[18px] font-bold text-jade">
              {info.reviewCount}
            </div>
            <div className="text-[10px] uppercase tracking-[0.5px] text-faint">
              <T k="profile.reviews" />
            </div>
          </div>
        </div>
      </div>

      <ProfileEditor
        initialName={info.displayName}
        initialLang={info.languagePref}
        email={info.email}
      />
    </section>
  );
}
