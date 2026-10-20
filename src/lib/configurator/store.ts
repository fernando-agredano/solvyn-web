import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONFIGURATOR_STEPS, MAX_GOALS } from "@/src/config/configurator-options";
import {
  INITIAL_ANSWERS,
  pickPersisted,
  sanitizePersistedAnswers,
  type ConfiguratorAnswers,
  type PersistedAnswers,
} from "@/src/lib/configurator/answers";
import type { ModuleKind } from "@/src/lib/modules";
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
      toggleModule: ({ id, kind }) =>
        set((state) =>
          kind === "integration"
            ? { disabledModules: { ...state.disabledModules, [id]: !state.disabledModules[id] } }
            : { enabledExtras: { ...state.enabledExtras, [id]: !state.enabledExtras[id] } },
        ),
      goNext: () =>
        set((state) => {
          const index = CONFIGURATOR_STEPS.indexOf(state.step);
          if (!isStepValid(state.step, state) || index === CONFIGURATOR_STEPS.length - 1) return state;
          return { step: CONFIGURATOR_STEPS[index + 1] };
        }),
      goBack: () =>
        set((state) => ({ step: CONFIGURATOR_STEPS[Math.max(0, CONFIGURATOR_STEPS.indexOf(state.step) - 1)] })),
      reset: () => set(INITIAL_ANSWERS),
    }),
    {
      name: "solvyn:configurator",
      version: STORAGE_VERSION,
      // Rehydrated from the client after mount, so the server and first client render match.
      skipHydration: true,
      partialize: pickPersisted,
      merge: (persisted, current) => ({ ...current, ...sanitizePersistedAnswers(persisted) }),
    },
  ),
);
