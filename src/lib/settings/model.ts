import { DEFAULT_HOURLY_RATE_MXN } from "@/src/config/pricing";
import { CONTACT_PLACEHOLDERS } from "@/src/config/site";

// Client-safe on purpose: browser components import these types and the fallback values.
export interface PublicSettings {
  hourlyRateMxn: number;
  nextStartDate: string | null;
  availabilityMessage: string | null;
  whatsapp: string;
  email: string;
}

// Used when the database can't be read. The rate is the one proposals were generated with before settings existed.
export const DEFAULT_SETTINGS: PublicSettings = {
  hourlyRateMxn: DEFAULT_HOURLY_RATE_MXN,
  nextStartDate: null,
  availabilityMessage: null,
  whatsapp: CONTACT_PLACEHOLDERS.whatsapp,
  email: CONTACT_PLACEHOLDERS.email,
};

export interface SettingsRow {
  hourly_rate_mxn: number;
  next_start_date: string | null;
  availability_message: string | null;
  whatsapp: string;
  email: string;
}

export const toPublicSettings = (row: SettingsRow): PublicSettings => ({
  hourlyRateMxn: row.hourly_rate_mxn,
  nextStartDate: row.next_start_date,
  availabilityMessage: row.availability_message,
  whatsapp: row.whatsapp,
  email: row.email,
});

// Noon UTC keeps the calendar day the same in every timezone the date is shown in.
export const formatStartDate = (isoDate: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeZone: "America/Mexico_City",
  }).format(new Date(`${isoDate}T12:00:00Z`));
