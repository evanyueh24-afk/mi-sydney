"use client";

import { BottomNav } from "./BottomNav";
import { ToastProvider } from "./Toast";

// Mobile-first, centered, max-width app frame (spec §9 / prototype #app).
// The frame is `relative` so toasts, overlays and the bottom nav anchor to it.
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="relative flex min-h-screen w-full max-w-app flex-col overflow-hidden bg-paper shadow-app">
        <ToastProvider>
          <main className="flex-1 overflow-y-auto pb-[86px]">{children}</main>
          <BottomNav />
        </ToastProvider>
      </div>
    </div>
  );
}
