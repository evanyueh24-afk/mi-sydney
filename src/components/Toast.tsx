"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { clsx } from "@/lib/clsx";

type ToastFn = (msg: string) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((message: string) => {
    setMsg(message);
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className={clsx(
          "pointer-events-none absolute left-1/2 z-[120] -translate-x-1/2 rounded-full bg-ink px-[18px] py-[10px] text-[12.5px] text-white transition-all duration-200",
          show ? "bottom-[100px] opacity-100" : "bottom-[90px] opacity-0",
        )}
      >
        {msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  // Safe no-op if used outside a provider (e.g. during SSR edge cases).
  return ctx ?? (() => {});
}
