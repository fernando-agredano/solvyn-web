"use client";

import Link from "next/link";
import { useState } from "react";
import {
  monthParam,
  type MeetingItem,
} from "@/src/lib/admin/leads/calendar-view";
import type { LeadLabelValue } from "@/src/lib/admin/leads/filters";
import {
  buildMonthGrid,
  monthLabel,
  parseIsoDate,
  WEEKDAYS,
  type MonthView,
} from "@/src/lib/calendar";
import { formatStartDate } from "@/src/lib/settings/model";
import { CalendarIcon, ClockIcon } from "./icons";
import { LabelBadge } from "./LabelBadge";
import { StatusBadge } from "./StatusBadge";

interface MeetingsCalendarProps {
  month: MonthView;
  today: string;
  meetingsByDay: Record<string, MeetingItem[]>;
  previousHref: string;
  nextHref: string;
  todayHref: string;
}

const MAX_CHIPS_PER_DAY = 2;
const MAX_DOTS_PER_DAY = 3;

// Same temperature scale as the lead badges: the hotter the lead, the darker the chip.
const CHIP_CLASSES: Record<LeadLabelValue, string> = {
  caliente: "bg-[#18181B] text-white",
  tibio: "bg-[#E4E4E7] text-[#27272A]",
  frio: "border border-[#E4E4E7] bg-[#F4F4F5] text-[#52525B]",
};

const NAV_BUTTON_CLASSES =
  "inline-flex size-8 items-center justify-center rounded-full text-[#52525B] transition-colors duration-150 hover:bg-white hover:text-[#18181B]";

const pluralize = (count: number) => (count === 1 ? "reunión" : "reuniones");

// Today when it is in the month, else the first day that has meetings, else the 1st.
function pickInitialDay(
  month: MonthView,
  today: string,
  meetingsByDay: Record<string, MeetingItem[]>,
) {
  const prefix = monthParam(month);
  if (today.startsWith(prefix)) return today;
  const firstWithMeetings = Object.keys(meetingsByDay)
    .filter((day) => day.startsWith(prefix))
    .sort()[0];
  return firstWithMeetings ?? `${prefix}-01`;
}

// Mount it with a `key` per month: the selected day is initial state, so a new month needs a new instance.
export function MeetingsCalendar({
  month,
  today,
  meetingsByDay,
  previousHref,
  nextHref,
  todayHref,
}: MeetingsCalendarProps) {
  const [selectedDay, setSelectedDay] = useState(() =>
    pickInitialDay(month, today, meetingsByDay),
  );
  const selectedMeetings = meetingsByDay[selectedDay] ?? [];

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            aria-live="polite"
            className="m-0 text-base font-semibold text-[#18181B]"
          >
            {monthLabel(month)}
          </p>
          <div className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] p-1">
            <Link
              href={previousHref}
              scroll={false}
              aria-label="Mes anterior"
              className={NAV_BUTTON_CLASSES}
            >
              <Chevron direction="left" />
            </Link>
            <Link
              href={todayHref}
              scroll={false}
              className="inline-flex h-8 items-center rounded-full px-3 text-sm font-medium text-[#3F3F46] transition-colors duration-150 hover:bg-white hover:text-[#18181B]"
            >
              Hoy
            </Link>
            <Link
              href={nextHref}
              scroll={false}
              aria-label="Mes siguiente"
              className={NAV_BUTTON_CLASSES}
            >
              <Chevron direction="right" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              aria-hidden="true"
              className="pb-1 text-center text-[11px] font-medium tracking-wide text-[#71717A] uppercase"
            >
              {weekday}
            </span>
          ))}
          {buildMonthGrid(month)
            .flat()
            .map((date, index) =>
              date === null ? (
                <span
                  key={`empty-${index}`}
                  aria-hidden="true"
                  className="min-h-14 rounded-lg bg-[#FAFAFA] md:min-h-24"
                />
              ) : (
                <DayCell
                  key={date}
                  date={date}
                  meetings={meetingsByDay[date] ?? []}
                  isToday={date === today}
                  isSelected={date === selectedDay}
                  onSelect={setSelectedDay}
                />
              ),
            )}
        </div>
      </div>

      <aside
        aria-label="Reuniones del día"
        className="flex flex-col gap-4 rounded-b-xl border-t border-[#E4E4E7] bg-[#FAFAFA] p-5 lg:rounded-bl-none lg:border-t-0 lg:border-l"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs font-semibold text-[#3F3F46]">
            {formatStartDate(selectedDay)}
          </span>
          <span className="text-xs text-[#71717A]">
            {selectedMeetings.length} {pluralize(selectedMeetings.length)}
          </span>
        </div>

        {selectedMeetings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#D4D4D8] px-4 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#18181B] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <CalendarIcon />
            </span>
            <p className="m-0 text-sm font-medium text-[#18181B]">
              Sin reuniones este día
            </p>
            <p className="m-0 text-xs text-[#71717A]">
              Aquí aparecerán las que se agenden.
            </p>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {selectedMeetings.map((meeting) => (
              <li key={meeting.id}>
                <Link
                  href={`/admin/leads/${meeting.id}`}
                  className="flex flex-col gap-2.5 rounded-xl border border-[#E4E4E7] bg-white p-3 no-underline shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-150 hover:border-[#A1A1AA]"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                    <span className="text-[#52525B]">
                      <ClockIcon />
                    </span>
                    {meeting.time}
                  </span>
                  <span className="truncate text-sm font-medium text-[#18181B]">
                    {meeting.name}
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <LabelBadge label={meeting.label} />
                    <StatusBadge status={meeting.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

function DayCell({
  date,
  meetings,
  isToday,
  isSelected,
  onSelect,
}: {
  date: string;
  meetings: MeetingItem[];
  isToday: boolean;
  isSelected: boolean;
  onSelect: (date: string) => void;
}) {
  const summary = meetings.length
    ? `, ${meetings.length} ${pluralize(meetings.length)}`
    : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      aria-pressed={isSelected}
      aria-label={`${formatStartDate(date)}${summary}`}
      className={`flex min-h-14 cursor-pointer flex-col items-stretch gap-1 rounded-lg border bg-white p-1.5 text-left transition-colors duration-150 md:min-h-24 ${
        isSelected
          ? "border-[#18181B] shadow-[0_0_0_1px_#18181B]"
          : "border-[#E4E4E7] hover:border-[#A1A1AA]"
      }`}
    >
      <span
        className={`inline-flex size-6 items-center justify-center self-start rounded-full text-xs font-semibold tabular-nums ${
          isToday ? "bg-[#18181B] text-white" : "text-[#3F3F46]"
        }`}
      >
        {parseIsoDate(date).day}
      </span>

      <span className="hidden flex-col gap-1 md:flex">
        {meetings.slice(0, MAX_CHIPS_PER_DAY).map((meeting) => (
          <span
            key={meeting.id}
            className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] leading-tight ${CHIP_CLASSES[meeting.label]}`}
          >
            <span className="flex-none font-semibold tabular-nums">
              {meeting.time}
            </span>
            <span className="truncate">{meeting.name}</span>
          </span>
        ))}
        {meetings.length > MAX_CHIPS_PER_DAY && (
          <span className="px-1 text-[11px] font-medium text-[#71717A]">
            +{meetings.length - MAX_CHIPS_PER_DAY} más
          </span>
        )}
      </span>

      {meetings.length > 0 && (
        <span className="flex gap-1 md:hidden">
          {meetings.slice(0, MAX_DOTS_PER_DAY).map((meeting) => (
            <span
              key={meeting.id}
              className="size-1.5 rounded-full bg-[#18181B]"
            />
          ))}
        </span>
      )}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
