import { CONFIGURATOR_STEPS, OTHER_GOAL_ID, type ConfiguratorStep } from "@/src/config/configurator-options";
import type { ConfiguratorAnswers } from "@/src/lib/configurator/answers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_OTHER_GOAL_LENGTH = 4;

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());

export function isStepValid(step: ConfiguratorStep, answers: ConfiguratorAnswers): boolean {
  switch (step) {
    case "goal":
      return (
        answers.goals.length > 0 &&
        (!answers.goals.includes(OTHER_GOAL_ID) || answers.otherGoal.trim().length >= MIN_OTHER_GOAL_LENGTH)
      );
    case "industry":
      return answers.industry !== null;
    case "details":
      return answers.users.length > 0 && answers.size !== null && answers.budget !== null;
    case "contact":
      return answers.contactName.trim().length > 1 && isValidEmail(answers.contactEmail) && answers.consent;
  }
}

// Furthest step the visitor can be on: the first one whose previous steps are not all valid.
export function getReachableStep(answers: ConfiguratorAnswers): ConfiguratorStep {
  const firstInvalid = CONFIGURATOR_STEPS.find((step) => !isStepValid(step, answers));
  return firstInvalid ?? CONFIGURATOR_STEPS[CONFIGURATOR_STEPS.length - 1];
}

// An unfinished step counts as 35% so the bar always shows some progress.
export function getProgressPercent(step: ConfiguratorStep, isCurrentStepValid: boolean): number {
  const index = CONFIGURATOR_STEPS.indexOf(step);
  return Math.round(((index + (isCurrentStepValid ? 1 : 0.35)) / CONFIGURATOR_STEPS.length) * 100);
}
