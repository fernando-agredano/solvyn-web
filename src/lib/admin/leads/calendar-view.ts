import { parseIsoDate, type MonthView } from "@/src/lib/calendar";
import type { LeadLabelValue, LeadStatus } from "./filters";
import type { LeadSummary } from "./records";
import { toMexicoDay } from "./series";

// A meeting as the calendar shows it: only what the screen needs, with the time already formatted.
export interface MeetingItem {
  id: string;
  name: string;
  label: LeadLabelValue;
  status: LeadStatus;
  time: string;
}

const MONTH_PARAM = /^(\d{4})-(0[1-9]|1[0-2])$/;

export const monthParam = ({ year, month }: MonthView) =>
  `${year}-${String(month + 1).padStart(2, "0")}`;

export const buildCalendarHref = (view: MonthView) =>
  `/admin/leads?vista=calendario&mes=${monthParam(view)}`;

// "mes=2026-11" in the URL, or the current month when it is missing or malformed.
export function parseCalendarMonth(
  param: string | undefined,
  today: string,
): MonthView {
  const match = param ? MONTH_PARAM.exec(param) : null;
  if (match) return { year: Number(match[1]), month: Number(match[2]) - 1 };
  const { year, month } = parseIsoDate(today);
  return { year, month };
}

// Meetings keyed by their Mexico City day. Leads without a meeting are skipped.
export function groupMeetingsByDay(
  leads: LeadSummary[],
  formatTime: (date: Date) => string,
): Record<string, MeetingItem[]> {
  const byDay: Record<string, MeetingItem[]> = {};
  for (const lead of leads) {
    if (!lead.meetingAt) continue;
    const day = toMexicoDay(lead.meetingAt);
    (byDay[day] ??= []).push({
      id: lead.id,
      name: lead.name,
      label: lead.label,
      status: lead.status,
      time: formatTime(lead.meetingAt),
    });
  }
  return byDay;
}

export const countMeetingsInMonth = (
  byDay: Record<string, MeetingItem[]>,
  view: MonthView,
) =>
  Object.entries(byDay)
    .filter(([day]) => day.startsWith(monthParam(view)))
    .reduce((total, [, meetings]) => total + meetings.length, 0);
