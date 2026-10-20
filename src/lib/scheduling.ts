import { MEETING_TIME_ZONE } from "@/src/config/scheduling";

// Days are plain UTC-midnight dates: only the calendar day matters, so no time zone can shift it.
const toDateFormatter = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", { timeZone: "UTC", ...options });

// The calendar date and the clock time of an instant in Mexico: "2026-10-21", "10:00".
export function getMeetingParts(instant: Date): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MEETING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}

// "2026-10-21", "10:00" -> "miércoles 21 de octubre a las 10:00"
export function formatMeetingLabel(isoDate: string, time: string): string {
  const parts = toDateFormatter({ weekday: "long", day: "numeric", month: "long" }).formatToParts(
    new Date(`${isoDate}T00:00:00Z`),
  );
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("weekday")} ${part("day")} de ${part("month")} a las ${time}`;
}
