import { Button } from "@/src/components/ui/Button";
import { ChevronLeftIcon, ClockIcon } from "@/src/components/ui/icons";

interface StepNavigationProps {
  canGoBack: boolean;
  canContinue: boolean;
  isLastStep: boolean;
  lastStepLabel?: string;
  onBack: () => void;
  onContinue: () => void;
}

export function StepNavigation({
  canGoBack,
  canContinue,
  isLastStep,
  lastStepLabel = "Generar mi propuesta",
  onBack,
  onContinue,
}: StepNavigationProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 pt-3">
      {canGoBack ? (
        <Button variant="secondary" size="md" onClick={onBack}>
          <ChevronLeftIcon size={16} />
          Atrás
        </Button>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-label">
          <ClockIcon size={16} />
          Toma unos 3 minutos
        </span>
      )}
      <Button size="md" onClick={onContinue} disabled={!canContinue} withArrow>
        {isLastStep ? lastStepLabel : "Continuar"}
      </Button>
    </div>
  );
}
