"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { useConfiguratorRestore } from "@/src/hooks/useConfiguratorRestore";
import { useProposal } from "@/src/hooks/useProposal";
import { useProposalGeneration } from "@/src/hooks/useProposalGeneration";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { getReachableStep } from "@/src/lib/configurator/validation";
import { GeneratingScreen } from "./GeneratingScreen";
import { ProposalView } from "./ProposalView";

export function ProposalExperience() {
  const router = useRouter();
  const isRestored = useConfiguratorRestore();
  // Contact data is never persisted, so only the first three steps decide whether there is something to propose.
  const hasAnswers = useConfiguratorStore((state) => getReachableStep(state) === "contact");
  const proposal = useProposal();
  const canGenerate = isRestored && hasAnswers && proposal !== null;
  const { completedSteps, isDone } = useProposalGeneration(canGenerate);

  useEffect(() => {
    if (isRestored && !canGenerate) router.replace("/configurar");
  }, [isRestored, canGenerate, router]);

  return (
    <ConfiguratorShell>
      {!isDone || !proposal ? (
        <GeneratingScreen completedSteps={completedSteps} />
      ) : (
        <ProposalView proposal={proposal} />
      )}
    </ConfiguratorShell>
  );
}
