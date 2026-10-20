import { formatMXN } from "@/src/lib/pricing";
import type { LeadLabelValue, LeadStatus } from "./filters";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  reunion: "Reunión",
  propuesta_enviada: "Propuesta enviada",
  cerrado: "Cerrado",
  descartado: "Descartado",
};

export const LABEL_TEXT: Record<LeadLabelValue, string> = {
  caliente: "Caliente",
  tibio: "Tibio",
  frio: "Frío",
};

// Mexico City is where the business runs; the server may run in another timezone.
const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export const formatLeadDateTime = (date: Date) =>
  dateTimeFormatter.format(date);

export function formatInvestmentRange(
  investment: { min: number; max: number } | null,
): string {
  return investment
    ? `${formatMXN(investment.min)} – ${formatMXN(investment.max)}`
    : "Sin datos";
}
