import { starString } from "@/lib/format";
import { clsx } from "@/lib/clsx";

export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className={clsx("text-gold tracking-[1px] text-[11px]", className)}
      aria-label={`${rating} out of 5`}
    >
      {starString(rating)}
    </span>
  );
}
