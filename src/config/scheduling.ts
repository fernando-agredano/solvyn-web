export const MEETING_DURATION_MINUTES = 30;
export const MEETING_TIME_ZONE = "America/Mexico_City";

// Cal.com event link, "username/event-slug". Without it the screen offers WhatsApp and email instead.
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "";
// How long the calendar may take to load before the alternatives are shown.
export const CAL_LOAD_TIMEOUT_MS = 15_000;

export const SCHEDULE_ROUTE = "/configurar/agenda";
export const CONFIRMATION_ROUTE = "/configurar/confirmacion";
