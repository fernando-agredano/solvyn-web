import { generateProposalDraft, type ProposalDraft } from "@/src/lib/ai/generate-proposal-draft";
import { buildProposalFacts } from "@/src/lib/proposal";
import { hashIdentifier, isOverLimit, normalizeEmail } from "./limits";
import type { ProposalRequest } from "./request";
import { generateSlug, type ProposalStorage } from "./repository";

export interface CreateProposalDeps {
  storage: ProposalStorage;
  generateDraft: typeof generateProposalDraft;
  newSlug: () => string;
}

// Prices, hours and weeks come from the facts (pricing.ts); the draft only contributes text.
export async function createProposal(
  request: ProposalRequest,
  clientIp: string,
  deps: CreateProposalDeps,
): Promise<{ slug: string; source: ProposalDraft["source"] }> {
  const { answers, description, contact } = request;
  // The business name is not collected here, so the saved proposal and the AI input never contain it.
  const facts = buildProposalFacts({ ...answers, business: "" });
  if (!facts) throw new Error("The answers do not produce any module");

  const hashes = { ipHash: hashIdentifier(clientIp), emailHash: hashIdentifier(normalizeEmail(contact.email)) };
  // If the limit check fails (database down) the visitor still gets a proposal, just without the AI.
  const overLimit = await deps.storage.countRecentGenerations(hashes).then(isOverLimit, () => true);

  const draft = await deps.generateDraft({ facts, size: answers.size, description, allowAi: !overLimit });

  // Only generations that reached the AI chain count towards the limit.
  if (!overLimit) {
    await deps.storage
      .logGeneration({ ...hashes, provider: draft.provider, ok: draft.source === "ai" })
      .catch((error: unknown) => console.warn(`[proposal] ${error instanceof Error ? error.message : "log failed"}`));
  }

  const slug = deps.newSlug();
  await deps.storage.saveProposal(
    slug,
    {
      answers,
      description,
      facts,
      copy: draft.copy,
      suggestedModuleIds: draft.suggestedModuleIds,
      meetingQuestions: draft.meetingQuestions,
      risks: draft.risks,
      provider: draft.provider,
    },
    draft.source,
  );
  return { slug, source: draft.source };
}

export const defaultCreateProposalDeps = (storage: ProposalStorage): CreateProposalDeps => ({
  storage,
  generateDraft: generateProposalDraft,
  newSlug: generateSlug,
});
