type ProposalModuleCardProps = {
  name: string;
  description: string;
  hoursLabel: string;
  optional: boolean;
  enabled: boolean;
  onToggle: () => void;
};

export function ProposalModuleCard({
  name,
  description,
  hoursLabel,
  optional,
  enabled,
  onToggle,
}: ProposalModuleCardProps) {
  return (
    <div
      className={`flex min-h-[168px] flex-col gap-3.5 rounded-[14px] border p-5 transition-[border-color,background-color] duration-300 ${
        enabled ? "border-white/[0.28] bg-white/5" : "border-white/[0.09] bg-white/[0.01]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={`semi text-[17px] font-semibold ${enabled ? "text-heading" : "text-label"}`}>{name}</span>
          <span className="text-[13px] text-label tabular-nums">{hoursLabel}</span>
        </div>

        {/* The switch button is 48x44 (touch target); the visible track is 48x28, as in the design. */}
        {optional ? (
          <button
            type="button"
            aria-pressed={enabled}
            aria-label={`${enabled ? "Quitar" : "Agregar"} ${name}`}
            onClick={onToggle}
            className="flex h-11 w-12 flex-none cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          >
            <span
              aria-hidden="true"
              className={`relative block h-7 w-12 rounded-full border border-white/25 transition-colors duration-250 ${
                enabled ? "bg-signal" : "bg-white/[0.06]"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] size-5 rounded-full transition-transform duration-250 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  enabled ? "translate-x-5 bg-black" : "bg-text-secondary"
                }`}
              />
            </span>
          </button>
        ) : (
          <span className="flex-none rounded-full border border-white/[0.16] px-2.5 py-[5px] text-xs text-[#D4D4D4]">
            Incluido
          </span>
        )}
      </div>

      <p className={`m-0 text-sm leading-[1.55] ${enabled ? "text-text-secondary" : "text-muted"}`}>{description}</p>
    </div>
  );
}
