import type { HoursJson } from "./types";

// Sydney is Australia/Sydney. We compute "open now" against Sydney wall-clock
// time regardless of where the viewer is, since all spots are in Sydney.
function sydneyNow(): { day: number; minutes: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Sydney",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const weekdayStr = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  let hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  if (hour === 24) hour = 0; // some environments emit "24" at midnight
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return { day: dayMap[weekdayStr] ?? 0, minutes: hour * 60 + minute };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
}

export function isOpenNow(hours: HoursJson | null | undefined): boolean {
  if (!hours) return false;
  const { day, minutes } = sydneyNow();
  const today = hours[day as 0 | 1 | 2 | 3 | 4 | 5 | 6];
  if (!today) return false;
  const open = toMinutes(today.open);
  let close = toMinutes(today.close);
  // Handle venues that close after midnight (e.g. 18:00–02:00).
  if (close <= open) {
    close += 24 * 60;
    const adjusted = minutes < open ? minutes + 24 * 60 : minutes;
    return adjusted >= open && adjusted < close;
  }
  return minutes >= open && minutes < close;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatHours(hours: HoursJson | null | undefined): string[] {
  if (!hours) return [];
  return DAY_LABELS.map((label, i) => {
    const d = hours[i as 0 | 1 | 2 | 3 | 4 | 5 | 6];
    if (!d) return `${label}  ·  Closed`;
    return `${label}  ·  ${d.open}–${d.close}`;
  });
}
