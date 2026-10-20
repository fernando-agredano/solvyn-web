import type { ConfiguratorAnswers } from "@/src/lib/configurator/answers";
import { buildProposalRequest, getRequestSignature, readGeneratedSlug } from "@/src/lib/proposals/client";

// The slug of the proposal generated in this session, if any.
export function getGeneratedProposalSlug(answers: ConfiguratorAnswers): string | null {
  const body = buildProposalRequest(answers);
  return body ? readGeneratedSlug(getRequestSignature(body)) : null;
}

// These calls never block the visitor: a failure here must not stop the flow.
async function postForSlug(path: string, answers: ConfiguratorAnswers, extra: Record<string, string> = {}) {
  const slug = getGeneratedProposalSlug(answers);
  if (!slug) return;
  await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slug, ...extra }),
    keepalive: true,
  }).catch(() => undefined);
}

export const notifyProposalAccepted = (answers: ConfiguratorAnswers) => postForSlug("/api/lead/accept", answers);

export const notifyMeetingBooked = (answers: ConfiguratorAnswers, startTime: string) =>
  postForSlug("/api/meeting", answers, { startTime });
