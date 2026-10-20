import type { ReactNode } from "react";
import { CONFIGURATOR_STEPS, type ConfiguratorStep } from "@/src/config/configurator-options";

export const STEP_TITLE_ID = "step-title";

interface StepSectionProps {
  step: ConfiguratorStep;
  title: string;
  description: string;
  children: ReactNode;
}

export function StepSection({ step, title, description, children }: StepSectionProps) {
  return (
    <section className="step-in flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm text-label">
          Paso {CONFIGURATOR_STEPS.indexOf(step) + 1} de {CONFIGURATOR_STEPS.length}
        </span>
        {/* Focus lands here on every step change, so screen reader and keyboard users start at the new step. */}
        <h1
          id={STEP_TITLE_ID}
          tabIndex={-1}
          className="wide m-0 text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.08] font-semibold tracking-[-0.02em] outline-none"
        >
          {title}
        </h1>
        <p className="m-0 text-[17px] leading-[1.6] text-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}
