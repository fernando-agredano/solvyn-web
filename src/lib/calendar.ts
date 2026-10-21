// Calendar math for the date picker, on plain "YYYY-MM-DD" strings. UTC dates keep the day the same in every timezone.
export interface MonthView {
  year: number;
  month: number; // 0 to 11
}

// Short weekday names, Sunday first (the es-MX convention).
export const WEEKDAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"] as const;

const pad = (value: number) => String(value).padStart(2, "0");

export const toIsoDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

export function parseIsoDate(isoDate: string): MonthView & { day: number } {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function addDays(isoDate: string, days: number): string {
  const { year, month, day } = parseIsoDate(isoDate);
  const date = new Date(Date.UTC(year, month, day + days));
  return toIsoDate(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
}

export function shiftMonth(view: MonthView, delta: number): MonthView {
  const date = new Date(Date.UTC(view.year, view.month + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

export function monthLabel({ year, month }: MonthView): string {
  const name = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

// Weeks of the month, Sunday first. Days outside the month are null.
export function buildMonthGrid({
  year,
  month,
}: MonthView): (string | null)[][] {
  const offset = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = Array.from(
    { length: Math.ceil((offset + daysInMonth) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1;
      return day >= 1 && day <= daysInMonth
        ? toIsoDate(year, month, day)
        : null;
    },
  );
  return Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
}
