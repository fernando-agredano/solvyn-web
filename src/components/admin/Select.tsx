"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ADMIN_CONTROL_CLASSES } from "./styles";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  options: SelectOption[];
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

// A dropdown in the panel's own style: the browser's native list can't be styled. It follows the "select-only
// combobox" pattern (focus stays on the button, arrows move through the options) and submits its value in a
// hidden input, so it works inside plain forms. Pass `value` and `onChange` to control it.
export function Select({
  name,
  options,
  id,
  value,
  defaultValue,
  onChange,
}: SelectProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const listId = `${baseId}-list`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const current = value ?? internalValue;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === current),
  );

  const open = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const choose = (index: number) => {
    const next = options[index].value;
    setInternalValue(next);
    onChange?.(next);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document
      .getElementById(`${baseId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex, baseId]);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={current} />
      <button
        id={baseId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          isOpen ? `${baseId}-option-${activeIndex}` : undefined
        }
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        className={`${ADMIN_CONTROL_CLASSES} flex cursor-pointer items-center justify-between gap-2 text-left transition-colors duration-150 hover:border-[#A1A1AA]`}
      >
        <span className="truncate">{options[selectedIndex]?.label}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full left-0 z-30 m-0 mt-1.5 max-h-64 min-w-full list-none overflow-auto rounded-xl border border-[#E4E4E7] bg-white p-1 shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === current;
            return (
              <li
                key={option.value}
                id={`${baseId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap ${
                  index === activeIndex ? "bg-[#F4F4F5]" : ""
                } ${isSelected ? "font-medium text-[#18181B]" : "text-[#3F3F46]"}`}
              >
                {option.label}
                {isSelected && <CheckIcon />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#71717A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`flex-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#18181B"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
