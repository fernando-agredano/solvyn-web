import { TEAM_SIZES, type TeamSize } from "@/src/config/pricing";
import type { ProposalFacts } from "@/src/lib/proposal";

// Everything the AI is allowed to see. Name, email, phone and business name are not part of this type on purpose.
export interface AiInput {
  description: string;
  industry: string | null;
  goals: string[];
  teamSize: string | null;
  platform: "web" | "web y móvil";
  integrations: string[];
  activeModules: { id: string; name: string }[];
  suggestableModules: { id: string; name: string; description: string }[];
}

const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
const PHONE_PATTERN = /\+?\d[\d\s().-]{6,}\d/g;
const URL_PATTERN = /https?:\/\/\S+|www\.\S+/gi;
// Angle brackets could close the delimiter the prompt wraps around the description.
const DELIMITER_PATTERN = /[<>]/g;

// The description is free text: contact data the visitor typed inside it must not reach the provider either.
export function redactContactData(text: string): string {
  return text
    .replace(EMAIL_PATTERN, "[correo omitido]")
    .replace(URL_PATTERN, "[enlace omitido]")
    .replace(PHONE_PATTERN, "[teléfono omitido]")
    .replace(DELIMITER_PATTERN, "");
}

export function buildAiInput(facts: ProposalFacts, size: TeamSize | null, description: string): AiInput {
  return {
    description: redactContactData(description),
    industry: facts.industryLabel,
    goals: facts.goalNames,
    teamSize: TEAM_SIZES.find((option) => option.id === size)?.label ?? null,
    platform: facts.includesMobile ? "web y móvil" : "web",
    integrations: facts.integrationNames,
    activeModules: facts.modules.filter((module) => module.active).map(({ id, name }) => ({ id, name })),
    suggestableModules: facts.modules
      .filter((module) => module.kind === "extra" && !module.active)
      .map(({ id, name, description: moduleDescription }) => ({ id, name, description: moduleDescription })),
  };
}
