import { Button } from "@/src/components/ui/Button";

type PhaseBar = {
  label: string;
  weeks: string;
  barFlex: number;
  barColor: string;
};

type ProposalSummaryCardProps = {
  projectName: string;
  investment: string;
  weeks: string;
  moduleCount: string;
  hoursLabel: string;
  scopePercent: string;
  phases: PhaseBar[];
  ctaHref: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function ProposalSummaryCard({
  projectName,
  investment,
  weeks,
  moduleCount,
  hoursLabel,
  scopePercent,
  phases,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
}: ProposalSummaryCardProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-[18px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-label">Propuesta preliminar</span>
          <span className="text-base font-semibold">{projectName}</span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.16] px-2.5 py-1 text-xs text-[#D4D4D4]">
          <span className="size-[7px] rounded-full bg-signal shadow-[0_0_10px_var(--signal-glow)]" />
          En vivo
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-label">Inversión estimada</span>
        <span className="text-[clamp(1.3rem,2vw,1.6rem)] font-semibold tracking-[-0.02em] tabular-nums">
          {investment}
        </span>
        <span className="text-xs text-label">MXN, calculado con tarifa de ejemplo</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 p-3">
          <span className="text-xs text-label">Tiempo</span>
          <span className="text-base font-semibold tabular-nums">{weeks}</span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 p-3">
          <span className="text-xs text-label">Módulos</span>
          <span className="text-base font-semibold tabular-nums">{moduleCount}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-xs text-label">
          <span>Alcance del proyecto</span>
          <span className="tabular-nums">{hoursLabel}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-heading shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-[width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ width: scopePercent }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-label">Fases</span>
        <div className="flex h-2 gap-1">
          {phases.map((phase) => (
            <div
              key={phase.label}
              className="rounded"
              style={{ flex: phase.barFlex, background: phase.barColor }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-text-secondary">
          {phases.map((phase) => (
            <span key={phase.label}>
              {phase.label} ({phase.weeks})
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <Button href={ctaHref} size="md" className="w-full">
          {ctaLabel}
        </Button>
        <Button href={secondaryHref} variant="secondary" size="md" className="w-full">
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
