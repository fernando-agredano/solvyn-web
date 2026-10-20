import { z } from "zod";
import {
  LEAD_LABELS,
  LEAD_STATUSES,
  type LeadLabelValue,
  type LeadStatus,
} from "./filters";

// Only the fields the panel reads. Stored proposals are untrusted input for this view: a payload that doesn't match is shown as "no data".
const storedProposalSchema = z.object({
  description: z.string().default(""),
  facts: z.object({
    industryLabel: z.string().nullable(),
    investment: z.object({ min: z.number(), max: z.number() }),
  }),
  answers: z.object({
    goals: z.array(z.string()),
    otherGoal: z.string(),
    industry: z.string().nullable(),
    users: z.array(z.string()),
    size: z.string().nullable(),
    platform: z.string(),
    integrations: z.array(z.string()),
    urgency: z.string().nullable(),
    budget: z.string().nullable(),
  }),
});

export type StoredProposal = z.infer<typeof storedProposalSchema>;

const proposalRelationSchema = z.object({
  slug: z.string(),
  payload: z.unknown(),
});

const leadRowSchema = z.object({
  id: z.uuid(),
  nombre: z.string(),
  correo: z.string(),
  whatsapp: z.string().nullable(),
  puntaje: z.number(),
  etiqueta: z.enum(LEAD_LABELS),
  estado: z.enum(LEAD_STATUSES),
  notas: z.string().nullable(),
  created_at: z.string(),
  meeting_at: z.string().nullable(),
  proposals: proposalRelationSchema,
});

export type LeadRow = z.infer<typeof leadRowSchema>;

export interface LeadSummary {
  id: string;
  name: string;
  email: string;
  score: number;
  label: LeadLabelValue;
  status: LeadStatus;
  createdAt: Date;
  meetingAt: Date | null;
  proposalSlug: string;
  // Null when the stored proposal doesn't match the expected shape.
  proposal: StoredProposal | null;
}

export function parseStoredProposal(payload: unknown): StoredProposal | null {
  const parsed = storedProposalSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

export function toLeadSummary(row: LeadRow): LeadSummary {
  return {
    id: row.id,
    name: row.nombre,
    email: row.correo,
    score: row.puntaje,
    label: row.etiqueta,
    status: row.estado,
    createdAt: new Date(row.created_at),
    meetingAt: row.meeting_at ? new Date(row.meeting_at) : null,
    proposalSlug: row.proposals.slug,
    proposal: parseStoredProposal(row.proposals.payload),
  };
}

export const parseLeadRow = (row: unknown): LeadRow => leadRowSchema.parse(row);
