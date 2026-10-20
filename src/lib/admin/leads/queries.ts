import { z } from "zod";
import { requireAdmin } from "@/src/lib/admin/auth";
import {
  LEADS_PAGE_SIZE,
  sanitizeSearch,
  type LeadLabelValue,
  type LeadsFilters,
} from "./filters";
import { parseLeadRow, toLeadSummary, type LeadSummary } from "./records";

// One column list for the list and the detail, so one parser covers both. Notes are read here but only the detail shows them.
const LEAD_COLUMNS =
  "id, nombre, correo, whatsapp, puntaje, etiqueta, estado, notas, created_at, meeting_at, proposals(slug, payload)";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const UPCOMING_MEETINGS_LIMIT = 5;

export interface LeadsPage {
  leads: LeadSummary[];
  total: number;
  pageCount: number;
}

export interface LeadDetail extends LeadSummary {
  phone: string | null;
  notes: string | null;
}

export interface LeadsDashboard {
  total: number;
  newThisWeek: number;
  upcomingMeetingCount: number;
  upcomingMeetings: LeadSummary[];
  byLabel: Record<LeadLabelValue, number>;
}

// Every read goes through the signed-in admin's session, so RLS decides what comes back.
export async function listLeads(filters: LeadsFilters): Promise<LeadsPage> {
  const { supabase } = await requireAdmin();
  const from = (filters.pagina - 1) * LEADS_PAGE_SIZE;

  let query = supabase
    .from("leads")
    .select(LEAD_COLUMNS, { count: "exact" })
    .order(filters.orden === "puntaje" ? "puntaje" : "created_at", {
      ascending: false,
    })
    .range(from, from + LEADS_PAGE_SIZE - 1);

  if (filters.estado) query = query.eq("estado", filters.estado);
  if (filters.etiqueta) query = query.eq("etiqueta", filters.etiqueta);

  const search = filters.q ? sanitizeSearch(filters.q) : "";
  if (search)
    query = query.or(`nombre.ilike.*${search}*,correo.ilike.*${search}*`);

  const { data, error, count } = await query;
  if (error) throw new Error(`leads list failed: ${error.code ?? "unknown"}`);

  const total = count ?? 0;
  return {
    leads: (data ?? []).map((row) => toLeadSummary(parseLeadRow(row))),
    total,
    pageCount: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)),
  };
}

export async function getLeadById(id: string): Promise<LeadDetail | null> {
  // A malformed id would make Postgres throw; it can't match a lead anyway, so it's a plain not found.
  if (!z.uuid().safeParse(id).success) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`lead read failed: ${error.code ?? "unknown"}`);
  if (!data) return null;

  const row = parseLeadRow(data);
  return { ...toLeadSummary(row), phone: row.whatsapp, notes: row.notas };
}

// Head requests return only the count, so nothing is downloaded just to be counted.
async function countOf(
  query: PromiseLike<{ count: number | null; error: { code?: string } | null }>,
): Promise<number> {
  const { count, error } = await query;
  if (error) throw new Error(`leads count failed: ${error.code ?? "unknown"}`);
  return count ?? 0;
}

export async function getLeadsDashboard(): Promise<LeadsDashboard> {
  const { supabase } = await requireAdmin();
  // Read after the session check, so the date is taken per request and never prerendered.
  const now = new Date();
  const weekAgo = new Date(now.getTime() - WEEK_MS).toISOString();
  const nowIso = now.toISOString();
  const countLeads = () =>
    supabase.from("leads").select("id", { count: "exact", head: true });

  const [
    total,
    newThisWeek,
    upcomingMeetingCount,
    upcoming,
    caliente,
    tibio,
    frio,
  ] = await Promise.all([
    countOf(countLeads()),
    countOf(countLeads().gte("created_at", weekAgo)),
    countOf(countLeads().gte("meeting_at", nowIso)),
    supabase
      .from("leads")
      .select(LEAD_COLUMNS)
      .gte("meeting_at", nowIso)
      .order("meeting_at", { ascending: true })
      .limit(UPCOMING_MEETINGS_LIMIT),
    countOf(countLeads().eq("etiqueta", "caliente")),
    countOf(countLeads().eq("etiqueta", "tibio")),
    countOf(countLeads().eq("etiqueta", "frio")),
  ]);

  if (upcoming.error)
    throw new Error(
      `meetings read failed: ${upcoming.error.code ?? "unknown"}`,
    );

  return {
    total,
    newThisWeek,
    upcomingMeetingCount,
    upcomingMeetings: (upcoming.data ?? []).map((row) =>
      toLeadSummary(parseLeadRow(row)),
    ),
    byLabel: { caliente, tibio, frio },
  };
}
