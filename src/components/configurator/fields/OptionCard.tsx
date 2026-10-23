import type { ReactNode } from "react";
import { CheckIcon } from "@/src/components/ui/icons";
import { iconBoxClasses, optionClasses } from "./selection-styles";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  // "checkbox" for multiple choice (rounded square), "radio" for a single choice (circle).
  indicator: "checkbox" | "radio";
}

// A wide option: icon, text and the selection mark on the right.
export function OptionCard({
  label,
  description,
  icon,
  selected,
  onSelect,
  indicator,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex min-h-[68px] items-center gap-3.5 rounded-xl border px-4 py-3 text-left text-foreground ${optionClasses(selected)}`}
    >
      {icon && (
        <span className={`${iconBoxClasses(selected)} size-10`}>{icon}</span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] leading-tight font-semibold">{label}</span>
        {description && (
          <span className="text-[13px] leading-snug text-text-secondary">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`flex size-5 flex-none items-center justify-center border transition-colors duration-200 ${
          indicator === "checkbox" ? "rounded-md" : "rounded-full"
        } ${selected ? "border-white bg-white text-black" : "border-white/30 text-transparent"}`}
      >
        <CheckIcon size={13} />
      </span>
    </button>
  );
}
