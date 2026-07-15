import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
