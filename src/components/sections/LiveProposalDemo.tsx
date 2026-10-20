"use client";

import { useState } from "react";
import { DEFAULT_HOURLY_RATE_MXN, PROJECT_PHASES } from "@/src/config/pricing";
import { DEMO_MODULES, DEMO_PROJECT_NAME } from "@/src/config/demo-proposal";
import { track } from "@/src/lib/analytics";
import {
  estimateInvestmentRange,
  estimatePhaseWeeks,
  estimateWeekRange,
  formatMXN,
} from "@/src/lib/pricing";
import { ProposalModuleCard } from "./ProposalModuleCard";
import { ProposalSummaryCard } from "./ProposalSummaryCard";

function initialOptionalIds() {
  return new Set(DEMO_MODULES.filter((module) => module.optional && module.startsEnabled).map((module) => module.id));
}

export function LiveProposalDemo() {
  const [enabledOptionalIds, setEnabledOptionalIds] = useState(initialOptionalIds);

  const toggleModule = (id: string) => {
    track("module_toggled", { moduleId: id });
    setEnabledOptionalIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const modules = DEMO_MODULES.map((module) => ({
    ...module,
    enabled: !module.optional || enabledOptionalIds.has(module.id),
  }));
  const enabledModules = modules.filter((module) => module.enabled);
  const selectedHours = enabledModules.reduce((total, module) => total + module.hours, 0);
  const totalHours = DEMO_MODULES.reduce((total, module) => total + module.hours, 0);

  const investment = estimateInvestmentRange(selectedHours, DEFAULT_HOURLY_RATE_MXN);
  const weeks = estimateWeekRange(selectedHours);

  return (
    <div className="grid items-start gap-6 max-[860px]:grid-cols-1 min-[861px]:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <ProposalSummaryCard
        projectName={DEMO_PROJECT_NAME}
        investment={`${formatMXN(investment.min)} – ${formatMXN(investment.max)}`}
        weeks={`${weeks.min}–${weeks.max} semanas`}
        moduleCount={`${enabledModules.length} de ${modules.length}`}
        hoursLabel={`${selectedHours} h estimadas`}
        scopePercent={`${Math.round((selectedHours / totalHours) * 100)}%`}
        phases={PROJECT_PHASES.map((phase) => ({
          label: phase.label,
          weeks: `${estimatePhaseWeeks(selectedHours, phase.share)} sem`,
          barFlex: phase.barFlex,
          barColor: phase.barColor,
        }))}
        ctaHref="/configurar"
        ctaLabel="Crear mi propia propuesta"
        secondaryHref="#contacto"
        secondaryLabel="Descargar PDF"
      />

      <div className="grid grid-cols-2 gap-3.5 max-[860px]:grid-cols-1">
        {modules.map((module) => (
          <ProposalModuleCard
            key={module.id}
            name={module.name}
            description={module.description}
            hoursLabel={`~${module.hours} h`}
            optional={module.optional}
            enabled={module.enabled}
            onToggle={() => toggleModule(module.id)}
          />
        ))}
      </div>
    </div>
  );
}
