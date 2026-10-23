interface SegmentedControlProps<T extends string> {
  options: readonly { id: T; label: string }[];
  value: T | null;
  onChange: (id: T) => void;
  // Names the group for assistive technology when no fieldset legend does it.
  label?: string;
  // Smaller text and corners, used for display controls rather than form answers.
  compact?: boolean;
}

export function SegmentedControl<T extends string>({ options, value, onChange, label, compact = false }: SegmentedControlProps<T>) {
  return (
    <div
      role={label ? "group" : undefined}
      aria-label={label}
      className={`grid gap-1 border p-1 ${compact ? "rounded-[10px] border-white/14" : "rounded-xl border-white/12"}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`min-h-11 cursor-pointer font-semibold transition-colors duration-200 ${
              compact ? "rounded-[7px] px-2 text-[13px] whitespace-nowrap" : "rounded-[9px] px-2 text-[15px]"
            } ${selected ? "bg-white text-black" : "bg-transparent text-text-secondary"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
