import type { Budget, Urgency } from "@/src/config/configurator-options";
import type { UserType } from "@/src/lib/modules";

export type LeadLabel = "caliente" | "tibio" | "frio";

export interface ScoringInput {
  budget: Budget | null;
  urgency: Urgency | null;
  users: UserType[];
  activeModuleCount: number;
  activeIntegrationCount: number;
}

const BUDGET_POINTS: Record<Budget, number> = { b4: 40, b3: 30, b2: 20, b1: 10, b0: 5 };
const URGENCY_POINTS: Record<Urgency, number> = { asap: 25, q: 15, flex: 5 };

const CLIENT_USERS_POINTS = 10;
const MANY_MODULES_THRESHOLD = 8;
const MANY_MODULES_POINTS = 10;
const INTEGRATION_POINTS = 5;
const MAX_INTEGRATION_POINTS = 15;
const MAX_SCORE = 100;

const HOT_THRESHOLD = 70;
const WARM_THRESHOLD = 40;

export function calculateLeadScore(input: ScoringInput): number {
  const score =
    (input.budget ? BUDGET_POINTS[input.budget] : 0) +
    (input.urgency ? URGENCY_POINTS[input.urgency] : 0) +
    (input.users.includes("clients") ? CLIENT_USERS_POINTS : 0) +
    (input.activeModuleCount >= MANY_MODULES_THRESHOLD ? MANY_MODULES_POINTS : 0) +
    Math.min(input.activeIntegrationCount * INTEGRATION_POINTS, MAX_INTEGRATION_POINTS);
  return Math.min(score, MAX_SCORE);
}

export function getLeadLabel(score: number): LeadLabel {
  if (score >= HOT_THRESHOLD) return "caliente";
  if (score >= WARM_THRESHOLD) return "tibio";
  return "frio";
}
