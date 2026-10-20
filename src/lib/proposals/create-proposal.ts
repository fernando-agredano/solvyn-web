import { generateProposalDraft, type ProposalDraft } from "@/src/lib/ai/generate-proposal-draft";
import { PRIVACY_VERSION, SITE_URL } from "@/src/config/site";
import { createDefaultNotifier, type Notifier } from "@/src/lib/email/notifications";
import { createSupabaseLeadStorage, type LeadStorage } from "@/src/lib/leads/repository";
import { buildProposalFacts } from "@/src/lib/proposal";
import { calculateLeadScore, getLeadLabel } from "@/src/lib/scoring";
import { hashIdentifier, isOverLimit, normalizeEmail } from "./limits";
import type { ProposalRequest } from "./request";
import { generateSlug, type ProposalStorage } from "./repository";

const TOP_MODULES_IN_EMAIL = 5;

export interface CreateProposalDeps {
  storage: ProposalStorage;
  leadStorage: LeadStorage;
  notifier: Notifier;
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
  const { id: proposalId } = await deps.storage.saveProposal(
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

  // The visitor gets the proposal even if the lead could not be saved; only the kind of failure is logged.
  const score = calculateLeadScore({
    budget: answers.budget,
    urgency: answers.urgency,
    users: answers.users,
    activeModuleCount: facts.activeModuleCount,
    activeIntegrationCount: facts.modules.filter((module) => module.kind === "integration" && module.active).length,
  });
  const label = getLeadLabel(score);
  const isNewLead = await deps.leadStorage
    .saveLead({
      proposalId,
      name: contact.name,
      email: normalizeEmail(contact.email),
      whatsapp: contact.phone || null,
      score,
      label,
      answers: { budget: answers.budget, urgency: answers.urgency, size: answers.size, users: answers.users },
      consentAt: new Date(),
      consentVersion: PRIVACY_VERSION,
    })
    .catch((error: unknown) => {
      console.error(`[lead] ${error instanceof Error ? error.message : "save failed"}`);
      return false;
    });

  if (isNewLead) {
    await deps.notifier.leadCreated({
      name: contact.name,
      email: normalizeEmail(contact.email),
      whatsapp: contact.phone || null,
      score,
      label,
      goals: facts.goalNames,
      industry: facts.industryLabel,
      budget: answers.budget,
      urgency: answers.urgency,
      topModules: facts.modules
        .filter((module) => module.active)
        .sort((first, second) => second.hours - first.hours)
        .slice(0, TOP_MODULES_IN_EMAIL)
        .map((module) => module.name),
      investment: facts.investment,
      weeks: facts.weeks,
      proposalUrl: `${SITE_URL}/propuesta/${slug}`,
    });
  }

  return { slug, source: draft.source };
}

export const defaultCreateProposalDeps = (storage: ProposalStorage): CreateProposalDeps => ({
  storage,
  leadStorage: createSupabaseLeadStorage(),
  notifier: createDefaultNotifier(),
  generateDraft: generateProposalDraft,
  newSlug: generateSlug,
});
