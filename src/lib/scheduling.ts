import { MEETING_DAYS_COUNT, MEETING_TIME_ZONE } from "@/src/config/scheduling";

export interface MeetingDay {
  // Calendar date in Mexico, "YYYY-MM-DD".
  iso: string;
  weekday: string;
  day: number;
  month: string;
}

const SATURDAY = 6;
const SUNDAY = 0;

// Days are plain UTC-midnight dates: only the calendar day matters, so no time zone can shift it.
const toDateFormatter = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", { timeZone: "UTC", ...options });

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function getTodayInMexico(now: Date): Date {
  const isoDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: MEETING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return new Date(`${isoDate}T00:00:00Z`);
}

// The next business days after today (Mexico date), skipping weekends.
export function getNextBusinessDays(now: Date = new Date(), count: number = MEETING_DAYS_COUNT): MeetingDay[] {
  const weekdayFormatter = toDateFormatter({ weekday: "short" });
  const monthFormatter = toDateFormatter({ month: "short" });
  const days: MeetingDay[] = [];
  const cursor = getTodayInMexico(now);

  while (days.length < count) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekdayIndex = cursor.getUTCDay();
    if (weekdayIndex === SATURDAY || weekdayIndex === SUNDAY) continue;
    days.push({
      iso: cursor.toISOString().slice(0, 10),
      weekday: capitalize(weekdayFormatter.format(cursor)),
      day: cursor.getUTCDate(),
      month: monthFormatter.format(cursor).replace(".", ""),
    });
  }
  return days;
}

// "2026-10-21", "10:00" -> "miércoles 21 de octubre a las 10:00"
export function formatMeetingLabel(isoDate: string, time: string): string {
  const parts = toDateFormatter({ weekday: "long", day: "numeric", month: "long" }).formatToParts(
    new Date(`${isoDate}T00:00:00Z`),
  );
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("weekday")} ${part("day")} de ${part("month")} a las ${time}`;
}
