import type { ConfiguratorAnswers } from "@/src/lib/configurator/answers";
import { buildProposalRequest, getRequestSignature, readGeneratedSlug } from "@/src/lib/proposals/client";
import type { MeetingSlot } from "@/src/config/scheduling";

// Tells the server which meeting the visitor chose so the owner is notified. The confirmation screen
// does not wait for it: a failure here must never block the visitor.
export async function notifyMeetingBooked(answers: ConfiguratorAnswers, date: string, time: MeetingSlot): Promise<void> {
  const body = buildProposalRequest(answers);
  const slug = body && readGeneratedSlug(getRequestSignature(body));
  if (!slug) return;
  const payload = { slug, date, time };
  await fetch("/api/meeting", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
