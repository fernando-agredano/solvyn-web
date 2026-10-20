export const MEETING_DURATION_MINUTES = 30;
export const MEETING_TIME_ZONE = "America/Mexico_City";
export const MEETING_DAYS_COUNT = 5;

// TODO(Phase 5): replace these fixed slots with the real availability from Cal.com.
export const MEETING_SLOTS = ["10:00", "11:30", "13:00", "16:00", "17:30"] as const;
export type MeetingSlot = (typeof MEETING_SLOTS)[number];

export const SCHEDULE_ROUTE = "/configurar/agenda";
export const CONFIRMATION_ROUTE = "/configurar/confirmacion";
