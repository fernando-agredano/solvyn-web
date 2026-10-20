import {
  BUDGET_OPTIONS,
  CONFIGURATOR_STEPS,
  MAX_GOALS,
  PLATFORM_OPTIONS,
  URGENCY_OPTIONS,
  USER_OPTIONS,
  type Budget,
  type ConfiguratorStep,
  type Urgency,
} from "@/src/config/configurator-options";
import { EXTRAS, GOALS, INDUSTRIES, INTEGRATIONS } from "@/src/config/catalog";
import { TEAM_SIZES, type TeamSize } from "@/src/config/pricing";
import type { Platform, UserType } from "@/src/lib/modules";
import { getReachableStep } from "@/src/lib/configurator/validation";

export interface ConfiguratorAnswers {
  step: ConfiguratorStep;
  goals: string[];
  otherGoal: string;
  industry: string | null;
  business: string;
  users: UserType[];
  size: TeamSize | null;
  platform: Platform;
  integrations: string[];
  urgency: Urgency | null;
  budget: Budget | null;
  // Proposal switches, keyed by module id (`i_<integration>` / `x_<extra>`): integrations the visitor turned off, extras turned on.
  disabledModules: Record<string, boolean>;
  enabledExtras: Record<string, boolean>;
  // The meeting the visitor confirmed. Not persisted: it is only needed until the confirmation screen.
  meetingDate: string | null;
  meetingTime: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consent: boolean;
}

export const INITIAL_ANSWERS: ConfiguratorAnswers = {
  step: "goal",
  goals: [],
  otherGoal: "",
  industry: null,
  business: "",
  users: [],
  size: null,
  platform: "web",
  integrations: [],
  urgency: null,
  budget: null,
  disabledModules: {},
  enabledExtras: {},
  meetingDate: null,
  meetingTime: null,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  consent: false,
};

// Personal data and consent are never saved to localStorage (LFPDPPP): consent must be given in the current session.
export const PERSISTED_KEYS = [
  "step",
  "goals",
  "otherGoal",
  "industry",
  "business",
  "users",
  "size",
  "platform",
  "integrations",
  "urgency",
  "budget",
  "disabledModules",
  "enabledExtras",
] as const satisfies readonly (keyof ConfiguratorAnswers)[];

type PersistedKey = (typeof PERSISTED_KEYS)[number];
export type PersistedAnswers = Pick<ConfiguratorAnswers, PersistedKey>;

export const pickPersisted = (answers: ConfiguratorAnswers): PersistedAnswers =>
  Object.fromEntries(PERSISTED_KEYS.map((key) => [key, answers[key]])) as PersistedAnswers;

const pickIds = (value: unknown, validIds: readonly string[]): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && validIds.includes(item)) : [];

const pickId = <T extends string>(value: unknown, validIds: readonly T[]): T | null =>
  typeof value === "string" && (validIds as readonly string[]).includes(value) ? (value as T) : null;

const pickFlags = (value: unknown, validIds: readonly string[]): Record<string, boolean> =>
  typeof value === "object" && value !== null
    ? Object.fromEntries(
        Object.entries(value).filter(
          (entry): entry is [string, boolean] => validIds.includes(entry[0]) && typeof entry[1] === "boolean",
        ),
      )
    : {};

const pickText = (value: unknown) => (typeof value === "string" ? value : "");

// Storage can hold stale or tampered data: keep only what still matches the catalog, then land on a reachable step.
export function sanitizePersistedAnswers(stored: unknown): ConfiguratorAnswers {
  const raw = (typeof stored === "object" && stored !== null ? stored : {}) as Record<string, unknown>;
  const answers: ConfiguratorAnswers = {
    ...INITIAL_ANSWERS,
    goals: [...new Set(pickIds(raw.goals, GOALS.map((goal) => goal.id)))].slice(-MAX_GOALS),
    otherGoal: pickText(raw.otherGoal),
    industry: pickId(raw.industry, INDUSTRIES.map((industry) => industry.id)),
    business: pickText(raw.business),
    users: pickIds(raw.users, USER_OPTIONS.map((option) => option.id)) as UserType[],
    size: pickId(raw.size, TEAM_SIZES.map((option) => option.id)),
    platform: pickId(raw.platform, PLATFORM_OPTIONS.map((option) => option.id)) ?? INITIAL_ANSWERS.platform,
    integrations: pickIds(raw.integrations, INTEGRATIONS.map((integration) => integration.id)),
    urgency: pickId(raw.urgency, URGENCY_OPTIONS.map((option) => option.id)),
    budget: pickId(raw.budget, BUDGET_OPTIONS.map((option) => option.id)),
    disabledModules: pickFlags(raw.disabledModules, INTEGRATIONS.map((integration) => `i_${integration.id}`)),
    enabledExtras: pickFlags(raw.enabledExtras, EXTRAS.map((extra) => `x_${extra.id}`)),
  };
  const requestedStep = pickId(raw.step, CONFIGURATOR_STEPS) ?? INITIAL_ANSWERS.step;
  const reachableStep = getReachableStep(answers);
  const isRequestedReachable = CONFIGURATOR_STEPS.indexOf(requestedStep) <= CONFIGURATOR_STEPS.indexOf(reachableStep);
  return { ...answers, step: isRequestedReachable ? requestedStep : reachableStep };
}
