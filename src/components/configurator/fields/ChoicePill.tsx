import { optionClasses } from "./selection-styles";

interface ChoicePillProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function ChoicePill({ label, selected, onSelect }: ChoicePillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`min-h-[46px] rounded-full border px-[18px] text-[15px] font-medium ${optionClasses(selected)} ${
        selected ? "text-heading" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
