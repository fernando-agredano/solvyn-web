import { z } from "zod";
import type { ArchNodeId, TechId } from "@/src/config/proposal";
import type { ProposalFacts } from "@/src/lib/proposal";

const MAX_SUMMARY_WORDS = 90;

// The AI never produces money or time: a price or a duration (6 semanas, 40 horas) makes the draft invalid.
// "24 horas" is allowed: models use it for availability ("disponible las 24 horas"), not as a delivery promise.
const FORBIDDEN_PATTERN = /\$|\bMXN\b|\bpesos?\b|\b(?!24\b)\d+\s*(?:a\s*\d+\s*)?(?:horas?|semanas?|meses|d[ií]as)\b/i;

const safeText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .refine((text) => !FORBIDDEN_PATTERN.test(text), "must not mention prices, hours or deadlines");

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export function getArchitectureNodeIds(facts: ProposalFacts): ArchNodeId[] {
  return [...facts.architecture.columns.flatMap((column) => column.nodeIds), ...facts.architecture.externalNodeIds];
}

// Extras the visitor has not switched on yet: the only modules the AI may suggest.
export function getSuggestableModuleIds(facts: ProposalFacts): string[] {
  return facts.modules.filter((module) => module.kind === "extra" && !module.active).map((module) => module.id);
}

const notesFor = <Id extends string>(ids: readonly Id[]) =>
  z.strictObject(Object.fromEntries(ids.map((id) => [id, safeText(160)])) as Record<Id, ReturnType<typeof safeText>>);

// Built per request: node, technology and module ids come from the facts, so the model cannot invent any.
export function buildDraftSchema(facts: ProposalFacts) {
  const suggestable = getSuggestableModuleIds(facts);
  return z.strictObject({
    title: safeText(80),
    summary: safeText(700).refine((text) => countWords(text) <= MAX_SUMMARY_WORDS, `must have at most ${MAX_SUMMARY_WORDS} words`),
    suggestedModuleIds: z
      .array(suggestable.length > 0 ? z.enum(suggestable as [string, ...string[]]) : z.never())
      .max(3)
      .refine((ids) => new Set(ids).size === ids.length, "must not repeat ids"),
    architectureNotes: notesFor<ArchNodeId>(getArchitectureNodeIds(facts)),
    technologyNotes: notesFor<TechId>(facts.technologies),
    meetingQuestions: z.array(safeText(160)).min(3).max(5),
    risks: z.array(safeText(200)).min(2).max(3),
  });
}

export type DraftOutput = z.infer<ReturnType<typeof buildDraftSchema>>;
