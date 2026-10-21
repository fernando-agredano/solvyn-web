import { z } from "zod";

export const LEAD_STATUSES = [
  "nuevo",
  "contactado",
  "reunion",
  "propuesta_enviada",
  "cerrado",
  "descartado",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_LABELS = ["caliente", "tibio", "frio"] as const;
export type LeadLabelValue = (typeof LEAD_LABELS)[number];

export const LEAD_SORTS = ["fecha", "puntaje"] as const;
export type LeadSort = (typeof LEAD_SORTS)[number];

export const LEADS_PAGE_SIZE = 20;
const MAX_SEARCH_LENGTH = 100;

// Bad values fall back to "no filter" instead of an error page: the URL is typed by hand or copied from a link.
const leadsFiltersSchema = z.object({
  estado: z.enum(LEAD_STATUSES).optional().catch(undefined),
  etiqueta: z.enum(LEAD_LABELS).optional().catch(undefined),
  q: z.string().max(MAX_SEARCH_LENGTH).optional().catch(undefined),
  orden: z.enum(LEAD_SORTS).catch("fecha"),
  pagina: z.coerce.number().int().min(1).max(10_000).catch(1),
});

export type LeadsFilters = z.infer<typeof leadsFiltersSchema>;

type RawSearchParams = Record<string, string | string[] | undefined>;

// Next gives repeated keys as arrays; only the first value is used.
export function parseLeadsFilters(raw: RawSearchParams): LeadsFilters {
  const firstValues = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
  return leadsFiltersSchema.parse(firstValues);
}

// Commas and parentheses separate the conditions inside `or()`, so they are removed. Dots stay: emails need them.
export function sanitizeSearch(query: string): string {
  return query
    .replace(/[^\p{L}\p{N}@+.\- ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// True when the list is narrowed down or re-sorted, so the page can offer a way back to the full list.
export const hasActiveFilters = (filters: LeadsFilters) =>
  Boolean(filters.q || filters.estado || filters.etiqueta || filters.orden !== "fecha");

export function buildLeadsHref(filters: Partial<LeadsFilters>): string {
  const params = new URLSearchParams();
  if (filters.estado) params.set("estado", filters.estado);
  if (filters.etiqueta) params.set("etiqueta", filters.etiqueta);
  if (filters.q) params.set("q", filters.q);
  if (filters.orden && filters.orden !== "fecha")
    params.set("orden", filters.orden);
  if (filters.pagina && filters.pagina > 1)
    params.set("pagina", String(filters.pagina));
  const query = params.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}
