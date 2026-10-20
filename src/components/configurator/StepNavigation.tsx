import { Button } from "@/src/components/ui/Button";

interface StepNavigationProps {
  canGoBack: boolean;
  canContinue: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export function StepNavigation({ canGoBack, canContinue, isLastStep, onBack, onContinue }: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border-subtle pt-2">
      {canGoBack ? (
        <Button variant="secondary" onClick={onBack}>
          Atrás
        </Button>
      ) : (
        <span className="text-sm text-label">Toma unos 3 minutos</span>
      )}
      <Button onClick={onContinue} disabled={!canContinue}>
        {isLastStep ? "Generar mi propuesta" : "Continuar"}
      </Button>
    </div>
  );
}
