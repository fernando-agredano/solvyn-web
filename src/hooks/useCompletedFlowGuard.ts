import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SCHEDULE_ROUTE } from "@/src/config/scheduling";
import { CONFIGURATOR_STEPS } from "@/src/config/configurator-options";
import { useConfiguratorRestore } from "@/src/hooks/useConfiguratorRestore";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { getReachableStep, isStepValid } from "@/src/lib/configurator/validation";

// For screens after the questionnaire: true once the answers are restored and every step is valid.
// Otherwise sends the visitor back to the first step that still needs an answer
// (contact data is never persisted, so after a reload that is the contact step).
export function useCompletedFlowGuard(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const setReturnRoute = useConfiguratorStore((state) => state.setReturnRoute);
  const isRestored = useConfiguratorRestore();
  const isComplete = useConfiguratorStore((state) => CONFIGURATOR_STEPS.every((step) => isStepValid(step, state)));
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  useEffect(() => {
    if (!isRestored || isComplete) return;
    setAnswer("step", getReachableStep(useConfiguratorStore.getState()));
    // From the agenda the visitor returns there once the missing data is filled in; the proposal screen needs no return trip.
    setReturnRoute(pathname === SCHEDULE_ROUTE ? SCHEDULE_ROUTE : null);
    router.replace("/configurar");
  }, [isRestored, isComplete, setAnswer, setReturnRoute, pathname, router]);

  return isRestored && isComplete;
}
