import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONFIGURATOR_STEPS, MAX_GOALS, type ConfiguratorStep } from "@/src/config/configurator-options";
import {
  INITIAL_ANSWERS,
  pickPersisted,
  sanitizePersistedAnswers,
  type ConfiguratorAnswers,
  type PersistedAnswers,
} from "@/src/lib/configurator/answers";
import { toggleModuleFlags, type ModuleKind } from "@/src/lib/modules";
import { isStepValid } from "@/src/lib/configurator/validation";

// Bump when the persisted shape changes: stored data from another version is discarded.
export const STORAGE_VERSION = 1;

type ListKey = "goals" | "users" | "integrations";

interface ConfiguratorState extends ConfiguratorAnswers {
  setAnswer: <K extends keyof ConfiguratorAnswers>(key: K, value: ConfiguratorAnswers[K]) => void;
  toggleItem: <K extends ListKey>(key: K, id: ConfiguratorAnswers[K][number]) => void;
  // Flips an optional proposal module: integrations start on, extras start off.
  toggleModule: (module: { id: string; kind: ModuleKind }) => void;
  goNext: () => void;
  goBack: () => void;
  // Only to a step already reached: the stepper can go back, never ahead of what the answers allow.
  goToStep: (step: ConfiguratorStep) => void;
  // Where to go after the contact step when a later screen sent the visitor back for missing data. Memory only.
  returnRoute: string | null;
  setReturnRoute: (route: string | null) => void;
  reset: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist<ConfiguratorState, [], [], PersistedAnswers>(
    (set) => ({
      ...INITIAL_ANSWERS,
      setAnswer: (key, value) => set({ [key]: value }),
      toggleItem: (key, id) =>
        set((state) => {
          const current = state[key] as string[];
          if (current.includes(id)) return { [key]: current.filter((item) => item !== id) };
          // Choosing a goal beyond the limit drops the oldest one.
          const next = [...current, id];
          return { [key]: key === "goals" ? next.slice(-MAX_GOALS) : next };
        }),
      toggleModule: (module) => set((state) => toggleModuleFlags(state, module)),
      goNext: () =>
        set((state) => {
          const index = CONFIGURATOR_STEPS.indexOf(state.step);
          if (!isStepValid(state.step, state) || index === CONFIGURATOR_STEPS.length - 1) return state;
          return { step: CONFIGURATOR_STEPS[index + 1] };
        }),
      goBack: () =>
        set((state) => ({ step: CONFIGURATOR_STEPS[Math.max(0, CONFIGURATOR_STEPS.indexOf(state.step) - 1)] })),
      goToStep: (step) =>
        set((state) => (CONFIGURATOR_STEPS.indexOf(step) <= CONFIGURATOR_STEPS.indexOf(state.step) ? { step } : state)),
      returnRoute: null,
      setReturnRoute: (route) => set({ returnRoute: route }),
      reset: () => set({ ...INITIAL_ANSWERS, returnRoute: null }),
    }),
    {
      name: "solvyn:configurator",
      version: STORAGE_VERSION,
      // Rehydrated from the client after mount, so the server and first client render match.
      skipHydration: true,
      partialize: pickPersisted,
      // Only persisted keys are merged: every screen restores on mount, and that must not wipe the in-memory
      // contact data or meeting.
      merge: (persisted, current) => ({ ...current, ...pickPersisted(sanitizePersistedAnswers(persisted)) }),
    },
  ),
);
