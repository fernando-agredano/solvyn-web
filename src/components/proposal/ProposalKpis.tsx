import type { ReactNode } from "react";
import { formatMXN } from "@/src/lib/pricing";
import type { ProposalFacts } from "@/src/lib/proposal";

interface KpiCardProps {
  label: string;
  value: string;
  note?: string;
  highlighted?: boolean;
  children?: ReactNode;
}

function KpiCard({ label, value, note, highlighted = false, children }: KpiCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-[14px] border p-5 ${
        highlighted
          ? "border-white/30 bg-linear-to-b from-white/8 to-white/2 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
          : "border-white/12"
      }`}
    >
      <span className="text-[13px] text-label">{label}</span>
      <span className="wide text-xl font-semibold tracking-[-0.02em] tabular-nums">{value}</span>
      {note && <span className="text-xs text-label">{note}</span>}
      {children}
    </div>
  );
}

const COMPLEXITY_BARS = [1, 2, 3] as const;

export function ProposalKpis({ facts }: { facts: ProposalFacts }) {
  const { investment, weeks, urgency, activeModuleCount, modules, totalHours, complexity, complexityLevel } = facts;
  return (
    <div className="grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2">
      <KpiCard highlighted label="Inversión estimada" value={`${formatMXN(investment.min)} – ${formatMXN(investment.max)}`} note="MXN, antes de IVA" />
      <KpiCard
        label="Tiempo de desarrollo"
        value={`${weeks.min}–${weeks.max} semanas`}
        note={urgency === "asap" ? "Inicio prioritario disponible" : "Inicio a partir de la firma"}
      />
      <KpiCard label="Módulos" value={`${activeModuleCount} de ${modules.length}`} note={`${totalHours} horas estimadas`} />
      <KpiCard label="Complejidad" value={complexity.charAt(0).toUpperCase() + complexity.slice(1)}>
        <div className="flex gap-1 pt-1" aria-hidden="true">
          {COMPLEXITY_BARS.map((level) => (
            <span key={level} className={`h-1 flex-1 rounded-sm ${level <= complexityLevel ? "bg-white" : "bg-white/12"}`} />
          ))}
        </div>
      </KpiCard>
    </div>
  );
}
