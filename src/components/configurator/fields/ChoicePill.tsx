import { optionClasses } from "./selection-styles";

interface ChoicePillProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

// A short option. Selected fills white, so the answer stands out at a glance in a crowded step.
export function ChoicePill({
  label,
  selected,
  onSelect,
}: ChoicePillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`inline-flex min-h-11 flex-auto items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium lg:min-h-9 lg:[@media(max-height:780px)]:min-h-8 lg:px-2.5 lg:text-[13px] ${
        selected
          ? "cursor-pointer border-white bg-white text-black"
          : `${optionClasses(false)} text-text-secondary`
      }`}
    >
      {label}
    </button>
  );
}
