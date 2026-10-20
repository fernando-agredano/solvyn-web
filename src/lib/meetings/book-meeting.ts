import { SITE_URL } from "@/src/config/site";
import { createDefaultNotifier, type Notifier } from "@/src/lib/email/notifications";
import { createSupabaseLeadStorage, type LeadStorage } from "@/src/lib/leads/repository";
import type { MeetingRequest } from "./request";

export interface BookMeetingDeps {
  leadStorage: LeadStorage;
  notifier: Notifier;
}

// Mexico City has no daylight saving time since 2022, so its offset is fixed.
const MEXICO_UTC_OFFSET = "-06:00";

export const toMeetingDate = (date: string, time: string) => new Date(`${date}T${time}:00${MEXICO_UTC_OFFSET}`);

// Saves the meeting on the lead and tells the owner. Returns false when there was nothing to schedule.
export async function bookMeeting({ slug, date, time }: MeetingRequest, deps: BookMeetingDeps): Promise<boolean> {
  const lead = await deps.leadStorage.scheduleMeeting(slug, toMeetingDate(date, time));
  if (!lead) return false;
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
