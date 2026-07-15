import Link from "next/link";
import { Seal } from "@/components/Seal";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-8 py-24 text-center">
      <Seal className="mb-5 h-16 w-16 text-[32px]">觅</Seal>
      <h1 className="mb-2 text-[20px] font-bold">Not found</h1>
      <p className="mb-5 text-[13px] text-muted">
        We couldn&apos;t find that page or spot.
      </p>
      <Link
        href="/"
        className="rounded-full bg-red px-5 py-[10px] text-[13px] font-bold text-white"
      >
        觅 Mì — Discover
      </Link>
    </div>
  );
}
