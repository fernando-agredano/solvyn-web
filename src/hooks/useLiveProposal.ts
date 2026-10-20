import { useMemo } from "react";
import { useSettings } from "@/src/components/settings/SettingsProvider";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { buildModules, type ModuleKind } from "@/src/lib/modules";
import {
  calculateTotalHours,
  estimateInvestmentRange,
  estimateWeekRange,
  formatMXN,
  getComplexity,
  getSizeMultiplier,
} from "@/src/lib/pricing";

export interface LiveProposal {
  modules: { id: string; name: string; kind: ModuleKind; hours: number }[];
  investment: string;
  duration: string;
  complexity: string;
}

// What the live panel shows for the current answers; null until the visitor picks a goal.
export function useLiveProposal(): LiveProposal | null {
  const { hourlyRateMxn } = useSettings();
  const goals = useConfiguratorStore((state) => state.goals);
  const users = useConfiguratorStore((state) => state.users);
  const platform = useConfiguratorStore((state) => state.platform);
  const integrations = useConfiguratorStore((state) => state.integrations);
  const size = useConfiguratorStore((state) => state.size);
  const disabledModules = useConfiguratorStore((state) => state.disabledModules);
  const enabledExtras = useConfiguratorStore((state) => state.enabledExtras);

  return useMemo(() => {
    const activeModules = buildModules({
      goals,
      users,
      platform,
      integrations,
      disabledModules,
      enabledExtras,
    }).filter((module) => module.active);
    if (activeModules.length === 0) return null;

    const totalHours = calculateTotalHours(
      activeModules.map((module) => module.hours),
      size,
    );
    const investment = estimateInvestmentRange(totalHours, hourlyRateMxn);
    const weeks = estimateWeekRange(totalHours);
    const multiplier = getSizeMultiplier(size);

    return {
      modules: activeModules.map(({ id, name, kind, hours }) => ({ id, name, kind, hours: Math.round(hours * multiplier) })),
      investment: `${formatMXN(investment.min)} – ${formatMXN(investment.max)}`,
      duration: `${weeks.min}–${weeks.max} semanas`,
      complexity: getComplexity(totalHours),
    };
  }, [goals, users, platform, integrations, size, disabledModules, enabledExtras, hourlyRateMxn]);
}
