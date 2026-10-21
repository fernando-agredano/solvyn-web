"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  addDays,
  buildMonthGrid,
  monthLabel,
  parseIsoDate,
  shiftMonth,
  WEEKDAYS,
  type MonthView,
} from "@/src/lib/settings/calendar";
import { formatStartDate } from "@/src/lib/settings/model";
import { todayInMexico } from "@/src/lib/settings/schema";
import { ADMIN_CONTROL_CLASSES } from "./styles";

interface DatePickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const NAV_BUTTON_CLASSES =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#52525B] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#18181B]";
const FOOTER_BUTTON_CLASSES =
  "cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-[#52525B] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#18181B]";

const toView = (isoDate: string): MonthView => {
  const { year, month } = parseIsoDate(isoDate);
  return { year, month };
};

// A calendar in the panel's own style: the browser's native date popup can't be styled. The chosen date travels
// in a hidden input, so the form still submits it. Past days are blocked, as the server also requires.
export function DatePicker({ id, name, value, onChange }: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<MonthView>({ year: 2026, month: 0 });
  const [focusedDate, setFocusedDate] = useState("");

  // Today is read when the calendar opens, never during the first render, so server and browser can't disagree.
  const today = isOpen ? todayInMexico() : "";

  const open = () => {
    const start = value || todayInMexico();
    setView(toView(start));
    setFocusedDate(start);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const select = (date: string) => {
    if (date < today) return;
    onChange(date);
    close();
  };

  const moveFocus = (date: string) => {
    setFocusedDate(date);
    setView(toView(date));
  };

  useEffect(() => {
    if (!isOpen) return;
    containerRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${focusedDate}"]`)
      ?.focus();
  }, [isOpen, focusedDate]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key in steps) {
      event.preventDefault();
      moveFocus(addDays(focusedDate, steps[event.key]));
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const next = shiftMonth(
        toView(focusedDate),
        event.key === "PageUp" ? -1 : 1,
      );
      moveFocus(`${next.year}-${String(next.month + 1).padStart(2, "0")}-01`);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`${ADMIN_CONTROL_CLASSES} flex cursor-pointer items-center justify-between gap-2 text-left`}
      >
        <span className={value ? "text-[#18181B]" : "text-[#A1A1AA]"}>
          {value ? formatStartDate(value) : "Sin fecha"}
        </span>
        <CalendarIcon />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Elegir fecha"
          onKeyDown={handleKeyDown}
          className="absolute top-full left-0 z-30 mt-2 w-[19rem] rounded-xl border border-[#E4E4E7] bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => setView((current) => shiftMonth(current, -1))}
              className={NAV_BUTTON_CLASSES}
            >
              <Chevron direction="left" />
            </button>
            <p
              aria-live="polite"
              className="m-0 text-sm font-semibold text-[#18181B]"
            >
              {monthLabel(view)}
            </p>
            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => setView((current) => shiftMonth(current, 1))}
              className={NAV_BUTTON_CLASSES}
            >
              <Chevron direction="right" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                aria-hidden="true"
                className="py-1 text-[11px] font-medium text-[#71717A]"
              >
                {weekday}
              </span>
            ))}
            {buildMonthGrid(view)
              .flat()
              .map((date, index) =>
                date === null ? (
                  <span key={`empty-${index}`} />
                ) : (
                  <DayButton
                    key={date}
                    date={date}
                    isSelected={date === value}
                    isToday={date === today}
                    isDisabled={date < today}
                    isFocusable={date === focusedDate}
                    onSelect={select}
                  />
                ),
              )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[#F4F4F5] pt-2">
            <button
              type="button"
              onClick={() => {
                onChange("");
                close();
              }}
              className={FOOTER_BUTTON_CLASSES}
            >
              Quitar fecha
            </button>
            <button
              type="button"
              onClick={() => select(today)}
              className={FOOTER_BUTTON_CLASSES}
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DayButton({
  date,
  isSelected,
  isToday,
  isDisabled,
  isFocusable,
  onSelect,
}: {
  date: string;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isFocusable: boolean;
  onSelect: (date: string) => void;
}) {
  const stateClasses = isSelected
    ? "bg-[#18181B] font-semibold text-white"
    : isDisabled
      ? "cursor-not-allowed text-[#D4D4D8]"
      : "cursor-pointer text-[#18181B] hover:bg-[#F4F4F5]";

  return (
    <button
      type="button"
      data-date={date}
      tabIndex={isFocusable ? 0 : -1}
      aria-label={formatStartDate(date)}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      aria-current={isToday ? "date" : undefined}
      onClick={() => onSelect(date)}
      className={`mx-auto inline-flex size-9 items-center justify-center rounded-lg text-sm tabular-nums transition-colors duration-150 ${stateClasses} ${
        isToday && !isSelected ? "ring-1 ring-[#18181B] ring-inset" : ""
      }`}
    >
      {parseIsoDate(date).day}
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#71717A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
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
