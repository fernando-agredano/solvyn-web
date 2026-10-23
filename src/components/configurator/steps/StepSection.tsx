import type { ReactNode } from "react";
import {
  CONFIGURATOR_STEPS,
  type ConfiguratorStep,
} from "@/src/config/configurator-options";

export const STEP_TITLE_ID = "step-title";

interface StepSectionProps {
  step: ConfiguratorStep;
  title: string;
  description: string;
  children: ReactNode;
}

// The step's header (badge, title, short description) and its content. On large screens the content scrolls on
// its own if the window is too short, so the page and the navigation bar never move.
export function StepSection({
  step,
  title,
  description,
  children,
}: StepSectionProps) {
  return (
    <section className="step-in flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex w-fit items-center self-end lg:[@media(max-height:780px)]:hidden rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-xs text-text-secondary">
          Paso {CONFIGURATOR_STEPS.indexOf(step) + 1} de{" "}
          {CONFIGURATOR_STEPS.length}
        </span>
        {/* Focus lands here on every step change, so screen reader and keyboard users start at the new step. */}
        <h1
          id={STEP_TITLE_ID}
          tabIndex={-1}
          className="m-0 text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.1] font-semibold tracking-[-0.02em] outline-none"
        >
          {title}
        </h1>
        <p className="m-0 text-[15px] leading-[1.55] text-text-secondary lg:[@media(max-height:780px)]:hidden">
          {description}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:overflow-y-auto lg:pr-1">
        {children}
      </div>
    </section>
  );
}
