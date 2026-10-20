import {
  BUDGET_OPTIONS,
  OTHER_GOAL_ID,
  PLATFORM_OPTIONS,
  URGENCY_OPTIONS,
  USER_OPTIONS,
} from "@/src/config/configurator-options";
import { GOALS, INDUSTRIES, INTEGRATIONS } from "@/src/config/catalog";
import { TEAM_SIZES } from "@/src/config/pricing";
import type { StoredProposal } from "./records";

export interface AnswerRow {
  label: string;
  value: string;
}

type Option = { id: string; label: string };

// Stored ids that no longer exist in the catalog are shown as they are, so an old proposal is never hidden.
const labelOf = (options: readonly Option[], id: string | null) =>
  id === null
    ? null
    : (options.find((option) => option.id === id)?.label ?? id);

const integrationNames = INTEGRATIONS.map((integration) => ({
  id: integration.id,
  label: integration.name,
}));

// Mirrors the order the visitor answered the configurator.
export function describeAnswers(stored: StoredProposal): AnswerRow[] {
  const { answers, description } = stored;
  // The "otra" goal is free text: its catalog label is replaced by what the visitor wrote.
  const catalogGoals = answers.goals.filter((id) => id !== OTHER_GOAL_ID);
  const goals = catalogGoals.map((id) => labelOf(GOALS, id) ?? id);
  if (answers.goals.includes(OTHER_GOAL_ID) && answers.otherGoal)
    goals.push(answers.otherGoal);

  const rows: Array<AnswerRow | null> = [
    row("Metas", goals.join(", ")),
    row("Industria", labelOf(INDUSTRIES, answers.industry)),
    row(
      "Quién lo usa",
      answers.users.map((id) => labelOf(USER_OPTIONS, id) ?? id).join(", "),
    ),
    row("Tamaño del equipo", labelOf(TEAM_SIZES, answers.size)),
    row("Plataforma", labelOf(PLATFORM_OPTIONS, answers.platform)),
    row(
      "Integraciones",
      answers.integrations
        .map((id) => labelOf(integrationNames, id) ?? id)
        .join(", "),
    ),
    row("Urgencia", labelOf(URGENCY_OPTIONS, answers.urgency)),
    row("Presupuesto", labelOf(BUDGET_OPTIONS, answers.budget)),
    row("Descripción", description),
  ];
  return rows.filter((item): item is AnswerRow => item !== null);
}

function row(label: string, value: string | null): AnswerRow | null {
  return value && value.trim() ? { label, value } : null;
}
