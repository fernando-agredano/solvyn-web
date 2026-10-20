import { optionClasses } from "./selection-styles";

interface OptionRowProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionRow({ label, selected, onSelect }: OptionRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`min-h-12 rounded-xl border px-4 text-left text-[15px] font-medium ${optionClasses(selected)} ${
        selected ? "text-heading" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
