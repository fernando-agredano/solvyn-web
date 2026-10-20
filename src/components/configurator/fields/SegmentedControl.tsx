interface SegmentedControlProps<T extends string> {
  options: readonly { id: T; label: string }[];
  value: T | null;
  onChange: (id: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div
      className="grid gap-1 rounded-xl border border-white/12 p-1"
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
            className={`min-h-11 cursor-pointer rounded-[9px] px-2 text-[15px] font-semibold transition-colors duration-200 ${
              selected ? "bg-white text-black" : "bg-transparent text-text-secondary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
