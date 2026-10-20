"use client";

import { useMemo, useState } from "react";
import { useConfiguratorRestore } from "@/src/hooks/useConfiguratorRestore";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { toggleModuleFlags } from "@/src/lib/modules";
import { buildProposalFacts } from "@/src/lib/proposal";
import type { StoredProposalPayload } from "@/src/lib/proposals/repository";
import { buildTemplateCopy } from "@/src/lib/templates";
import { ProposalView } from "./ProposalView";

type SavedProposal = Pick<StoredProposalPayload, "answers" | "copy" | "provider">;

// Texts come from the saved proposal; modules, hours and prices are recalculated here from pricing.ts,
// so the optional switches never call the AI again.
export function SavedProposalView({ proposal }: { proposal: SavedProposal }) {
  const [flags, setFlags] = useState({
    disabledModules: proposal.answers.disabledModules,
    enabledExtras: proposal.answers.enabledExtras,
  });
  // The saved proposal has no business name; the visitor who created it still sees theirs from this browser.
  useConfiguratorRestore();
  const business = useConfiguratorStore((state) => state.business);

  const facts = useMemo(
    () => buildProposalFacts({ ...proposal.answers, ...flags, business }),
    [proposal.answers, flags, business],
  );
  if (!facts) return null;

  // Rules-only texts mention the module count, so they follow the switches; AI texts stay as generated.
  const copy = proposal.provider === "rules" ? buildTemplateCopy(facts) : proposal.copy;

  return (
    <ProposalView
      facts={facts}
      copy={copy}
      onToggleModule={(module) => setFlags((current) => ({ ...current, ...toggleModuleFlags(current, module) }))}
    />
  );
}
