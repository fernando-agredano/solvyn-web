import { ClockIcon } from "@/src/components/ui/icons";
import type { ProposalFacts } from "@/src/lib/proposal";
import { SectionCard } from "./SectionCard";

const DEVELOPMENT_PHASE_INDEX = 2;

export function ProposalPhases({ phases }: { phases: ProposalFacts["phases"] }) {
  return (
    <SectionCard id="phases-heading" title="Fases y entregables" description="Cómo se reparte el proyecto en el tiempo." icon={<ClockIcon size={20} />} className="gap-5">
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {phases.map((phase, index) => (
          <li key={phase.name} className="flex flex-col gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex size-8 flex-none items-center justify-center rounded-full border text-[13px] font-semibold tabular-nums ${
                  index === DEVELOPMENT_PHASE_INDEX ? "border-white bg-white text-black" : "border-white/20 text-text-secondary"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold">{phase.name}</span>
              <span className="flex-none rounded-full border border-white/12 px-2.5 py-1 text-xs text-text-secondary tabular-nums">
                {phase.weeks} {phase.weeks === 1 ? "semana" : "semanas"}
              </span>
            </div>
            {/* The bar is the phase's share of the whole project, starting where the previous phase ends. */}
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/7" aria-hidden="true">
              <div
                className={`absolute inset-y-0 rounded-full ${index === DEVELOPMENT_PHASE_INDEX ? "bg-white" : "bg-white/45"}`}
                style={{ left: `${Math.round(phase.startShare * 100)}%`, width: `${Math.round(phase.share * 100)}%` }}
              />
            </div>
            <span className="text-[13px] text-label">
              <span className="text-text-secondary">Entregable:</span> {phase.deliverable}
            </span>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}
