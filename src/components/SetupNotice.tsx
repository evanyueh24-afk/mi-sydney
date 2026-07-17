import { Seal } from "./Seal";

// Shown when Supabase env vars aren't configured yet, so the app renders
// something friendly instead of crashing on first boot.
export function SetupNotice() {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <Seal className="mb-5 h-16 w-16 text-[32px]">觅</Seal>
      <h1 className="mb-2 font-serif text-[22px] font-black">觅 Mì — almost there</h1>
      <p className="mb-4 max-w-[300px] text-[13.5px] leading-relaxed text-muted">
        Supabase isn&apos;t connected yet. Add your{" "}
        <code className="font-mono text-[12px]">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="font-mono text-[12px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
        <code className="font-mono text-[12px]">.env.local</code>, run the SQL in{" "}
        <code className="font-mono text-[12px]">supabase/</code>, and restart.
      </p>
      <p className="max-w-[300px] text-[12px] text-faint">
        See <code className="font-mono">README.md</code> → “Getting started”.
      </p>
    </div>
  );
}
