import { generateObject, NoObjectGeneratedError } from "ai";
import type { TeamSize } from "@/src/config/pricing";
import type { ProposalFacts } from "@/src/lib/proposal";
import { buildTemplateCopy, resolveCopy, type ProposalCopy } from "@/src/lib/templates";
import { buildAiInput, type AiInput } from "./anonymize";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { getDefaultProviders, type DraftProvider } from "./providers";
import { buildRulesQuestionsAndRisks } from "./rules-draft";
import { buildDraftSchema, type DraftOutput } from "./schema";

// The whole chain (every provider and retry) shares this budget.
const CHAIN_TIMEOUT_MS = 20_000;
const MAX_ERROR_LENGTH = 400;

export interface ProposalDraftInput {
  facts: ProposalFacts;
  size: TeamSize | null;
  // Free text from the visitor. Contact data inside it is redacted before it leaves the server.
  description: string;
  // false skips the AI entirely (rate limit reached) and returns the rules-only draft.
  allowAi?: boolean;
}

export interface ProposalDraft {
  copy: ProposalCopy;
  suggestedModuleIds: string[];
  meetingQuestions: string[];
  risks: string[];
  provider: DraftProvider["id"] | "rules";
  source: "ai" | "rules";
}

export interface ProposalDraftDeps {
  getProviders: () => DraftProvider[];
  timeoutMs: number;
}

const defaultDeps: ProposalDraftDeps = { getProviders: getDefaultProviders, timeoutMs: CHAIN_TIMEOUT_MS };

function buildRulesDraft(facts: ProposalFacts): ProposalDraft {
  return {
    copy: resolveCopy(buildTemplateCopy(facts)),
    suggestedModuleIds: [],
    ...buildRulesQuestionsAndRisks(facts),
    provider: "rules",
    source: "rules",
  };
}

function buildAiDraft(facts: ProposalFacts, output: DraftOutput, provider: DraftProvider["id"]): ProposalDraft {
  const { title, summary, architectureNotes, technologyNotes, suggestedModuleIds, meetingQuestions, risks } = output;
  return {
    copy: resolveCopy(buildTemplateCopy(facts), { title, summary, architectureNotes, technologyNotes }),
    suggestedModuleIds,
    meetingQuestions,
    risks,
    provider,
    source: "ai",
  };
}

// Logs never include model output or the description: only who failed and why in broad terms.
function describeFailure(error: unknown): string {
  if (error instanceof Error) return error.name;
  return "UnknownError";
}

async function requestDraft(
  provider: DraftProvider,
  facts: ProposalFacts,
  aiInput: AiInput,
  deadline: number,
): Promise<DraftOutput | null> {
  const schema = buildDraftSchema(facts);
  let validationError: string | undefined;

  // At most two attempts per provider: the second one only happens after an invalid output.
  for (let attempt = 0; attempt < 2; attempt++) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) return null;
    try {
      const { object } = await generateObject({
        model: provider.model,
        schema,
        system: SYSTEM_PROMPT,
        prompt: buildUserPrompt(aiInput, validationError),
        abortSignal: AbortSignal.timeout(remainingMs),
        // The chain handles retries; the SDK's own retries would blow the time budget.
        maxRetries: 0,
      });
      return object;
    } catch (error) {
      if (attempt === 0 && NoObjectGeneratedError.isInstance(error)) {
        validationError = (error.cause instanceof Error ? error.cause.message : error.message).slice(0, MAX_ERROR_LENGTH);
        continue;
      }
      console.warn(`[ai] ${provider.id} failed: ${describeFailure(error)}`);
      return null;
    }
  }
  console.warn(`[ai] ${provider.id} returned invalid output twice`);
  return null;
}

// The only entry point to the AI layer. It never throws: if every provider fails, the rules-only draft is returned.
export async function generateProposalDraft(
  input: ProposalDraftInput,
  deps: ProposalDraftDeps = defaultDeps,
): Promise<ProposalDraft> {
  const { facts, size, description, allowAi = true } = input;
  if (!allowAi) return buildRulesDraft(facts);

  try {
    const aiInput = buildAiInput(facts, size, description);
    const deadline = Date.now() + deps.timeoutMs;
    for (const provider of deps.getProviders()) {
      const output = await requestDraft(provider, facts, aiInput, deadline);
      if (output) return buildAiDraft(facts, output, provider.id);
    }
  } catch (error) {
    console.warn(`[ai] unexpected failure: ${describeFailure(error)}`);
  }
  return buildRulesDraft(facts);
}
