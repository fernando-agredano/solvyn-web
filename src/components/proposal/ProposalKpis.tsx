import type { ReactNode } from "react";
import { ChartIcon, ClockIcon, LayersIcon, WalletIcon } from "@/src/components/ui/icons";
import { formatMXN } from "@/src/lib/pricing";
import type { ProposalFacts } from "@/src/lib/proposal";

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  note?: string;
  highlighted?: boolean;
  children?: ReactNode;
}

function KpiCard({ icon, label, value, note, highlighted = false, children }: KpiCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border p-4 text-center sm:p-5 ${
        highlighted ? "max-[980px]:col-span-2" : ""
      } ${
        highlighted ? "border-white/30 bg-linear-to-b from-white/[0.08] to-white/[0.02]" : "border-white/12 bg-linear-to-b from-white/[0.035] to-transparent"
      }`}
    >
      {highlighted && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-signal/60" />}
      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-white">
        {icon}
      </span>
      <span className="text-xs text-label">{label}</span>
      <span className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-tight font-semibold tracking-[-0.01em] tabular-nums">{value}</span>
      {note && <span className="text-xs text-label">{note}</span>}
      {children}
    </div>
  );
}

const COMPLEXITY_BARS = [1, 2, 3] as const;

export function ProposalKpis({ facts }: { facts: ProposalFacts }) {
  const { investment, weeks, urgency, activeModuleCount, modules, totalHours, complexity, complexityLevel } = facts;
  return (
    <div className="grid grid-cols-4 gap-3 max-[980px]:grid-cols-2">
      <KpiCard
        highlighted
        icon={<WalletIcon size={18} />}
        label="Inversión estimada"
        value={`${formatMXN(investment.min)} – ${formatMXN(investment.max)}`}
        note="MXN, antes de IVA"
      />
      <KpiCard
        icon={<ClockIcon size={18} />}
        label="Tiempo de desarrollo"
        value={`${weeks.min}–${weeks.max} semanas`}
        note={urgency === "asap" ? "Inicio prioritario disponible" : "Inicio a partir de la firma"}
      />
      <KpiCard icon={<LayersIcon size={18} />} label="Módulos" value={`${activeModuleCount} de ${modules.length}`} note={`${totalHours} horas estimadas`} />
      <KpiCard icon={<ChartIcon size={18} />} label="Complejidad" value={complexity.charAt(0).toUpperCase() + complexity.slice(1)}>
        <div className="flex w-full max-w-[140px] gap-1 pt-1" aria-hidden="true">
          {COMPLEXITY_BARS.map((level) => (
            <span key={level} className={`h-1 flex-1 rounded-sm ${level <= complexityLevel ? "bg-white" : "bg-white/12"}`} />
          ))}
        </div>
      </KpiCard>
    </div>
  );
}
