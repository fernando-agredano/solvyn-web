import { SITE_URL } from "@/src/config/site";
import { createDefaultNotifier, type Notifier } from "@/src/lib/email/notifications";
import { createSupabaseLeadStorage, type LeadStorage } from "@/src/lib/leads/repository";
import { getMeetingParts } from "@/src/lib/scheduling";
import type { MeetingRequest } from "./request";

export interface BookMeetingDeps {
  leadStorage: LeadStorage;
  notifier: Notifier;
}

// Saves the meeting on the lead and tells the owner. Returns false when there was nothing to schedule.
export async function bookMeeting({ slug, startTime }: MeetingRequest, deps: BookMeetingDeps): Promise<boolean> {
  const lead = await deps.leadStorage.scheduleMeeting(slug, startTime);
  if (!lead) return false;
  const { date, time } = getMeetingParts(startTime);
  await deps.notifier.meetingBooked({
    ...lead,
    meetingDate: date,
    meetingTime: time,
    proposalUrl: `${SITE_URL}/propuesta/${slug}`,
  });
  return true;
}

export const defaultBookMeetingDeps = (): BookMeetingDeps => ({
  leadStorage: createSupabaseLeadStorage(),
  notifier: createDefaultNotifier(),
});
