"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { CONFIGURATOR_STEPS, type ConfiguratorStep } from "@/src/config/configurator-options";
import { useConfiguratorRestore } from "@/src/hooks/useConfiguratorRestore";
import { track } from "@/src/lib/analytics";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { getProgressPercent, isStepValid } from "@/src/lib/configurator/validation";
import { ConfiguratorShell } from "./ConfiguratorShell";
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
  const returnRoute = useConfiguratorStore((state) => state.returnRoute);
  const setReturnRoute = useConfiguratorStore((state) => state.setReturnRoute);

  // Focus management waits for the restore so a restored step doesn't steal focus.
  const isRestored = useConfiguratorRestore();

  const hasTrackedStart = useRef(false);
  useEffect(() => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    track("configurator_started");
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
    <ConfiguratorShell progress={{ step, percent: getProgressPercent(step, isCurrentStepValid) }}>
      <main
        id="contenido"
        className="grid w-full gap-6 px-4 pt-6 pb-10 sm:px-8 lg:h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_clamp(340px,28vw,460px)] lg:grid-rows-[minmax(0,1fr)] lg:gap-8 lg:px-12 lg:py-4 lg:[@media(max-height:780px)]:py-2"
      >
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <CurrentStep key={step} />
          <StepNavigation
            canGoBack={step !== CONFIGURATOR_STEPS[0]}
            canContinue={isCurrentStepValid}
            isLastStep={isLastStep}
            lastStepLabel={returnRoute ? "Continuar a la agenda" : undefined}
            onBack={goBack}
            onContinue={() => {
              track("step_completed", { step: CONFIGURATOR_STEPS.indexOf(step) + 1 });
              if (isLastStep) {
                setReturnRoute(null);
                router.push(returnRoute ?? PROPOSAL_ROUTE);
              }
              else goNext();
            }}
          />
        </div>
        <LiveProposalPanel />
      </main>
    </ConfiguratorShell>
  );
}
