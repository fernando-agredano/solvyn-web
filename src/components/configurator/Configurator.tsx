"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONFIGURATOR_STEPS, type ConfiguratorStep } from "@/src/config/configurator-options";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { getProgressPercent, isStepValid } from "@/src/lib/configurator/validation";
import { ConfiguratorHeader } from "./ConfiguratorHeader";
import { LiveProposalPanel } from "./LiveProposalPanel";
import { StepNavigation } from "./StepNavigation";
import { ContactStep } from "./steps/ContactStep";
import { DetailsStep } from "./steps/DetailsStep";
import { GoalStep } from "./steps/GoalStep";
import { IndustryStep } from "./steps/IndustryStep";
import { STEP_TITLE_ID } from "./steps/StepSection";

const STEP_COMPONENTS: Record<ConfiguratorStep, () => React.JSX.Element> = {
  goal: GoalStep,
  industry: IndustryStep,
  details: DetailsStep,
  contact: ContactStep,
};

export const PROPOSAL_ROUTE = "/configurar/propuesta";

export function Configurator() {
  const router = useRouter();
  const step = useConfiguratorStore((state) => state.step);
  const isCurrentStepValid = useConfiguratorStore((state) => isStepValid(state.step, state));
  const goNext = useConfiguratorStore((state) => state.goNext);
  const goBack = useConfiguratorStore((state) => state.goBack);

  // The saved answers are restored after mount; focus management waits for that so a restored step doesn't steal focus.
  const [isRestored, setIsRestored] = useState(false);
  useEffect(() => {
    Promise.resolve(useConfiguratorStore.persist.rehydrate()).finally(() => setIsRestored(true));
  }, []);

  const previousStep = useRef<ConfiguratorStep | null>(null);
  useEffect(() => {
    if (!isRestored) return;
    if (previousStep.current !== null && previousStep.current !== step) {
      document.getElementById(STEP_TITLE_ID)?.focus();
    }
    previousStep.current = step;
  }, [isRestored, step]);

  const isLastStep = step === CONFIGURATOR_STEPS[CONFIGURATOR_STEPS.length - 1];
  const CurrentStep = STEP_COMPONENTS[step];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,255,255,0.06),rgba(255,255,255,0)_70%),#000000]">
      <ConfiguratorHeader step={step} progressPercent={getProgressPercent(step, isCurrentStepValid)} />
      <main
        id="contenido"
        className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1fr)_minmax(0,400px)] items-start gap-12 px-6 pt-14 pb-24 max-[980px]:grid-cols-1"
      >
        <div className="flex min-w-0 flex-col gap-10">
          <CurrentStep key={step} />
          <StepNavigation
            canGoBack={step !== CONFIGURATOR_STEPS[0]}
            canContinue={isCurrentStepValid}
            isLastStep={isLastStep}
            onBack={goBack}
            onContinue={() => (isLastStep ? router.push(PROPOSAL_ROUTE) : goNext())}
          />
        </div>
        <LiveProposalPanel />
      </main>
    </div>
  );
}
