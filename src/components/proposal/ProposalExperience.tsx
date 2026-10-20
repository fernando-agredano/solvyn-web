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
        <main id="contenido" className="mx-auto max-w-[1180px] px-6 pt-14 pb-[120px]">
          <h1 className="wide m-0 text-3xl font-semibold">{proposal.copy.title}</h1>
        </main>
      )}
    </ConfiguratorShell>
  );
}
