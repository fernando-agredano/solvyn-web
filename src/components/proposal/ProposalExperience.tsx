"use client";

import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { useCompletedFlowGuard } from "@/src/hooks/useCompletedFlowGuard";
import { useProposalGeneration } from "@/src/hooks/useProposalGeneration";
import { GeneratingScreen } from "./GeneratingScreen";

// Transitional screen: generates the proposal and moves on to its own shareable page.
export function ProposalExperience() {
  const isReady = useCompletedFlowGuard();
  const { completedSteps, hasFailed, retry } = useProposalGeneration(isReady);

  return (
    <ConfiguratorShell>
      <GeneratingScreen completedSteps={completedSteps} hasFailed={hasFailed} onRetry={retry} />
    </ConfiguratorShell>
  );
}
