import { optionClasses } from "./selection-styles";

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  // "checkbox" for multiple choice (indicator on the left), "radio" for a single choice (indicator on the right).
  indicator: "checkbox" | "radio";
}

export function OptionCard({ label, description, selected, onSelect, indicator }: OptionCardProps) {
  const indicatorBorder = selected ? "border-white" : "border-white/30";
  const text = (
    <span className="flex flex-col gap-1">
      <span className="semi text-[17px] font-semibold">{label}</span>
      {description && <span className="text-sm leading-normal text-text-secondary">{description}</span>}
    </span>
  );

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex gap-3.5 rounded-[14px] border text-left text-foreground ${optionClasses(selected)} ${
        indicator === "checkbox" ? "min-h-[92px] items-start p-[18px]" : "min-h-16 items-center justify-between px-5 py-[18px]"
      }`}
    >
      {indicator === "checkbox" ? (
        <>
          <span
            aria-hidden="true"
            className={`mt-0.5 flex size-[22px] flex-none items-center justify-center rounded-md border ${indicatorBorder} ${
              selected ? "bg-white" : "bg-transparent"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={selected ? "opacity-100" : "opacity-0"}>
              <path d="M5 12l5 5 9-10" />
            </svg>
          </span>
          {text}
        </>
      ) : (
        <>
          {text}
          <span aria-hidden="true" className={`flex size-5 flex-none items-center justify-center rounded-full border ${indicatorBorder}`}>
            <span className={`size-2.5 rounded-full bg-white ${selected ? "opacity-100" : "opacity-0"}`} />
          </span>
        </>
      )}
    </button>
  );
}
