import { clsx } from "@/lib/clsx";

// The red square "seal" (印章) mark — brand logo and rating badge motif.
export function Seal({
  children = "觅",
  className,
  invert = false,
}: {
  children?: React.ReactNode;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div
      className={clsx(
        "seal font-serif select-none",
        invert && "!bg-white !text-red",
        className,
      )}
    >
      {children}
    </div>
  );
}
