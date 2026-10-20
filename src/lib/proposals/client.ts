import type { z } from "zod";
import { OTHER_GOAL_ID } from "@/src/config/configurator-options";
import type { ConfiguratorAnswers } from "@/src/lib/configurator/answers";
import type { proposalRequestSchema } from "./request";

export type ProposalRequestBody = z.input<typeof proposalRequestSchema>;

// Past this the visitor gets a friendly message and a retry button (the server gives up on the AI at 20 s).
export const PROPOSAL_REQUEST_TIMEOUT_MS = 25_000;

const STORAGE_KEY = "solvyn:generated-proposal";

// Answers must be complete (the guard of the proposal screen ensures it). The business name, name and phone never leave the browser here.
export function buildProposalRequest(answers: ConfiguratorAnswers): ProposalRequestBody | null {
  if (!answers.size) return null;
  return {
    answers: {
      goals: answers.goals,
      users: answers.users,
      platform: answers.platform,
      integrations: answers.integrations,
      disabledModules: answers.disabledModules,
      enabledExtras: answers.enabledExtras,
      size: answers.size,
      industry: answers.industry,
      urgency: answers.urgency,
    },
    description: answers.goals.includes(OTHER_GOAL_ID) ? answers.otherGoal : "",
    contact: { email: answers.contactEmail.trim() },
  };
}

// What identifies a proposal for reuse: the same answers must not ask the AI again. The email is not part of it.
export const getRequestSignature = ({ answers, description }: ProposalRequestBody) => JSON.stringify({ answers, description });

export async function requestProposalSlug(body: ProposalRequestBody): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROPOSAL_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch("/api/proposal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data: unknown = await response.json().catch(() => null);
    const slug = typeof data === "object" && data !== null && "slug" in data ? data.slug : null;
    if (!response.ok || typeof slug !== "string") throw new Error(`Proposal request failed (${response.status})`);
    return slug;
  } finally {
    clearTimeout(timer);
  }
}

export function readGeneratedSlug(signature: string): string | null {
  try {
    const stored: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (typeof stored === "object" && stored !== null && "signature" in stored && "slug" in stored) {
      return stored.signature === signature && typeof stored.slug === "string" ? stored.slug : null;
    }
  } catch {
    // Without storage (or with corrupt data) the proposal is simply generated again.
  }
  return null;
}

export function rememberGeneratedSlug(signature: string, slug: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ signature, slug }));
  } catch {
    // Nothing to remember without storage.
  }
}
