import { z } from "zod";
import { SLUG_PATTERN } from "@/src/lib/proposals/repository";

export const MAX_MEETING_BODY_BYTES = 1024;

const MAX_DAYS_AHEAD = 365;
const DAY_MS = 24 * 60 * 60 * 1000;

const slugSchema = z.string().regex(SLUG_PATTERN);

export const acceptRequestSchema = z.object({ slug: slugSchema });

// startTime comes from the Cal.com embed event: an instant that must be plausible (not in the past, not years away).
export const meetingRequestSchema = z.object({
  slug: slugSchema,
  startTime: z
    .iso.datetime({ offset: true })
    .transform((value) => new Date(value))
    .refine((date) => date.getTime() > Date.now() - DAY_MS && date.getTime() < Date.now() + MAX_DAYS_AHEAD * DAY_MS),
});

export type MeetingRequest = z.infer<typeof meetingRequestSchema>;
