"use client";

import { CheckIcon } from "@/src/components/ui/icons";
import {
  CONFIGURATOR_STEPS,
  STEP_LABELS,
  type ConfiguratorStep,
} from "@/src/config/configurator-options";
import { useConfiguratorStore } from "@/src/lib/configurator/store";

// Numbered steps joined by lines that fill as the visitor advances. Done steps show a green check and can be
// clicked to go back; the current step is white with a soft ring; the rest wait, dimmed.
export function ConfiguratorStepper({ step }: { step: ConfiguratorStep }) {
  const goToStep = useConfiguratorStore((state) => state.goToStep);
  const currentIndex = CONFIGURATOR_STEPS.indexOf(step);

  return (
    <nav aria-label="Pasos del configurador">
      <ol className="m-0 flex list-none items-center p-0">
        {CONFIGURATOR_STEPS.map((id, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === CONFIGURATOR_STEPS.length - 1;

          return (
            <li key={id} className="flex items-center">
              <button
                type="button"
                disabled={!isDone}
                onClick={() => goToStep(id)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Paso ${index + 1}: ${STEP_LABELS[id]}${isDone ? ", completado" : ""}`}
                className="group flex min-h-11 items-center gap-2.5 rounded-full pr-1 disabled:cursor-default enabled:cursor-pointer"
              >
                <span
                  className={`flex size-8 flex-none items-center justify-center rounded-full border text-[13px] font-semibold tabular-nums transition-colors duration-300 ${
                    isDone
                      ? "border-signal/40 bg-signal/15 text-signal group-hover:bg-signal/25"
                      : isCurrent
                        ? "border-white bg-white text-black ring-4 ring-white/10"
                        : "border-white/20 text-label"
                  }`}
                >
                  {isDone ? <CheckIcon size={15} /> : index + 1}
                </span>
                <span
                  className={`hidden text-[13px] font-medium transition-colors duration-300 min-[1100px]:block ${
                    isCurrent
                      ? "text-white"
                      : isDone
                        ? "text-text-secondary group-hover:text-white"
                        : "text-muted"
                  }`}
                >
                  {STEP_LABELS[id]}
                </span>
              </button>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="relative mx-3 h-px w-8 flex-none overflow-hidden bg-white/12 min-[1100px]:w-14"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-white/70 transition-[width] duration-500 ease-out"
                    style={{ width: isDone ? "100%" : "0%" }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
