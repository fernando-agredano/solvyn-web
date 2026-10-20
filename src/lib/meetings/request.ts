import { z } from "zod";
import { MEETING_SLOTS } from "@/src/config/scheduling";
import { getNextBusinessDays } from "@/src/lib/scheduling";
import { SLUG_PATTERN } from "@/src/lib/proposals/repository";

export const MAX_MEETING_BODY_BYTES = 1024;

// The date must be one of the days the scheduling screen offers.
export const meetingRequestSchema = z.object({
  slug: z.string().regex(SLUG_PATTERN),
  date: z.string().refine((date) => getNextBusinessDays().some((day) => day.iso === date)),
  time: z.enum(MEETING_SLOTS),
});

export type MeetingRequest = z.infer<typeof meetingRequestSchema>;
