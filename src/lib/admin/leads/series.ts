export const SERIES_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

// YYYY-MM-DD in Mexico City, so a lead created late in the evening counts for the day the owner sees it.
export const toMexicoDay = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(
    date,
  );

// One entry per day, oldest first, ending today, including the days with no leads.
export function buildDailySeries(
  createdAt: Date[],
  now: Date,
  days = SERIES_DAYS,
): { date: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const date of createdAt) {
    const key = toMexicoDay(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from({ length: days }, (_, index) => {
    const key = toMexicoDay(new Date(now.getTime() - (days - 1 - index) * DAY_MS));
    return { date: key, count: counts.get(key) ?? 0 };
  });
}
