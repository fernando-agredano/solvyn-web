import type { ProposalFacts } from "@/src/lib/proposal";
import { SectionCard } from "./SectionCard";

const DEVELOPMENT_PHASE_INDEX = 2;

export function ProposalPhases({ phases }: { phases: ProposalFacts["phases"] }) {
  return (
    <SectionCard id="phases-heading" title="Fases y entregables" className="gap-[22px]">
      <ol className="m-0 flex list-none flex-col gap-[18px] p-0">
        {phases.map((phase, index) => (
          <li key={phase.name} className="flex flex-col gap-2">
            <div className="flex justify-between gap-3 text-[15px]">
              <span className="semi font-semibold">
                {index + 1}. {phase.name}
              </span>
              <span className="text-text-secondary tabular-nums">
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
            <span className="text-[13px] text-label">Entregable: {phase.deliverable}</span>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}
