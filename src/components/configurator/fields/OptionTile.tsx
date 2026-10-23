import type { ReactNode } from "react";
import { CheckIcon } from "@/src/components/ui/icons";
import { iconBoxClasses, optionClasses } from "./selection-styles";

interface OptionTileProps {
  label: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

// A compact single-choice option: the icon above the label, a check in the corner when selected.
export function OptionTile({
  label,
  icon,
  selected,
  onSelect,
}: OptionTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex min-h-[104px] flex-col items-center justify-center gap-2.5 rounded-xl border p-3 text-center text-foreground ${optionClasses(selected)}`}
    >
      <span className={`${iconBoxClasses(selected)} size-11 rounded-xl`}>
        {icon}
      </span>
      <span className="text-sm leading-tight font-semibold">{label}</span>
      {selected && (
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-white text-black"
        >
          <CheckIcon size={12} />
        </span>
      )}
    </button>
  );
}
