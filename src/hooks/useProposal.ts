import { useMemo } from "react";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { buildProposalFacts, type ProposalFacts } from "@/src/lib/proposal";
import { buildTemplateCopy, resolveCopy, type ProposalCopy } from "@/src/lib/templates";

export interface Proposal {
  facts: ProposalFacts;
  copy: ProposalCopy;
}

// The current proposal: facts computed from the answers plus its texts.
// Phase 4 passes the AI texts to `resolveCopy`; today every text comes from the templates.
export function useProposal(): Proposal | null {
  const goals = useConfiguratorStore((state) => state.goals);
  const users = useConfiguratorStore((state) => state.users);
  const platform = useConfiguratorStore((state) => state.platform);
  const integrations = useConfiguratorStore((state) => state.integrations);
  const disabledModules = useConfiguratorStore((state) => state.disabledModules);
  const enabledExtras = useConfiguratorStore((state) => state.enabledExtras);
  const size = useConfiguratorStore((state) => state.size);
  const industry = useConfiguratorStore((state) => state.industry);
  const business = useConfiguratorStore((state) => state.business);
  const urgency = useConfiguratorStore((state) => state.urgency);

  return useMemo(() => {
    const facts = buildProposalFacts({
      goals,
      users,
      platform,
      integrations,
      disabledModules,
      enabledExtras,
      size,
      industry,
      business,
      urgency,
    });
    return facts && { facts, copy: resolveCopy(buildTemplateCopy(facts)) };
  }, [goals, users, platform, integrations, disabledModules, enabledExtras, size, industry, business, urgency]);
}
