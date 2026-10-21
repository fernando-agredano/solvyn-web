import { formatMXN } from "@/src/lib/pricing";
import { formatStartDate, type PublicSettings } from "./model";

// The form works with strings, as the inputs do. Client-safe: used by the settings form and its preview.
export interface SettingsDraft {
  hourlyRateMxn: string;
  nextStartDate: string;
  availabilityMessage: string;
  whatsapp: string;
  email: string;
}

export interface SettingsChange {
  label: string;
  from: string;
  to: string;
}

export const toDraft = (settings: PublicSettings): SettingsDraft => ({
  hourlyRateMxn: String(settings.hourlyRateMxn),
  nextStartDate: settings.nextStartDate ?? "",
  availabilityMessage: settings.availabilityMessage ?? "",
  whatsapp: settings.whatsapp,
  email: settings.email,
});

export const formatRate = (value: string) =>
  value.trim() !== "" && Number.isFinite(Number(value))
    ? `${formatMXN(Number(value))} MXN`
    : "—";

const FIELDS: {
  key: keyof SettingsDraft;
  label: string;
  format: (value: string) => string;
}[] = [
  { key: "hourlyRateMxn", label: "Tarifa por hora", format: formatRate },
  {
    key: "nextStartDate",
    label: "Próximo inicio",
    format: (value) => (value ? formatStartDate(value) : "Sin fecha"),
  },
  {
    key: "availabilityMessage",
    label: "Mensaje",
    format: (value) => value.trim() || "Sin mensaje",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    format: (value) => value.trim() || "—",
  },
  { key: "email", label: "Correo", format: (value) => value.trim() || "—" },
];

// What changed between the saved settings and the form, ready to show in the confirmation.
export function describeChanges(
  before: SettingsDraft,
  after: SettingsDraft,
): SettingsChange[] {
  return FIELDS.filter(
    (field) => before[field.key].trim() !== after[field.key].trim(),
  ).map((field) => ({
    label: field.label,
    from: field.format(before[field.key]),
    to: field.format(after[field.key]),
  }));
}

// "5512345678" becomes "55 1234 5678". Anything that isn't ten digits is shown as typed.
export function formatPhone(value: string): string {
  const compact = value.replace(/\s/g, "");
  return /^\d{10}$/.test(compact)
    ? `${compact.slice(0, 2)} ${compact.slice(2, 6)} ${compact.slice(6)}`
    : value.trim();
}
