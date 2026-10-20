import type { Budget, Urgency } from "@/src/config/configurator-options";
import type { TeamSize } from "@/src/config/pricing";
import type { UserType } from "@/src/lib/modules";
import type { LeadLabel } from "@/src/lib/scoring";
import { createServiceClient } from "@/src/lib/supabase/server";

export interface NewLead {
  proposalId: string;
  name: string;
  email: string;
  whatsapp: string | null;
  score: number;
  label: LeadLabel;
  answers: { budget: Budget | null; urgency: Urgency | null; size: TeamSize; users: UserType[] };
  consentAt: Date;
  consentVersion: string;
}

export interface ScheduledLead {
  name: string;
  email: string;
  whatsapp: string | null;
  score: number;
  label: LeadLabel;
}

export interface LeadStorage {
  // True when the lead was created, false when it already existed.
  saveLead(lead: NewLead): Promise<boolean>;
  // The visitor accepted the proposal: the lead waits for a meeting. Only a brand new lead changes state.
  markAccepted(proposalSlug: string): Promise<void>;
  // Sets the meeting of the lead of a proposal. Null when there is no lead or it already has a meeting.
  scheduleMeeting(proposalSlug: string, meetingAt: Date): Promise<ScheduledLead | null>;
}

export function createSupabaseLeadStorage(): LeadStorage {
  const supabase = createServiceClient();

  const findProposalId = async (slug: string): Promise<string | null> => {
    const { data, error } = await supabase.from("proposals").select("id").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`proposals read failed: ${error.code ?? "unknown"}`);
    return (data?.id as string | undefined) ?? null;
  };

  return {
    async saveLead(lead) {
      // Spanish column names match the admin panel; the unique (correo, proposal_id) makes a repeated save a no-op.
      const { data, error } = await supabase.from("leads").upsert(
        {
          proposal_id: lead.proposalId,
          nombre: lead.name,
          correo: lead.email,
          whatsapp: lead.whatsapp,
          puntaje: lead.score,
          etiqueta: lead.label,
          respuestas: {
            presupuesto: lead.answers.budget,
            urgencia: lead.answers.urgency,
            tamano: lead.answers.size,
            usuarios: lead.answers.users,
          },
          consentimiento_at: lead.consentAt.toISOString(),
          consentimiento_version: lead.consentVersion,
        },
        { onConflict: "correo,proposal_id", ignoreDuplicates: true },
      ).select("id");
      if (error) throw new Error(`leads insert failed: ${error.code ?? "unknown"}`);
      // An ignored duplicate returns no row.
      return data.length > 0;
    },
    async markAccepted(proposalSlug) {
      const proposalId = await findProposalId(proposalSlug);
      if (!proposalId) return;
      const { error } = await supabase.from("leads").update({ estado: "reunion" }).eq("proposal_id", proposalId).eq("estado", "nuevo");
      if (error) throw new Error(`leads update failed: ${error.code ?? "unknown"}`);
    },
    async scheduleMeeting(proposalSlug, meetingAt) {
      const proposalId = await findProposalId(proposalSlug);
      if (!proposalId) return null;

      // Only a lead without a meeting is updated, so repeated requests do not notify twice.
      const { data, error } = await supabase
        .from("leads")
        .update({ meeting_at: meetingAt.toISOString(), estado: "reunion" })
        .eq("proposal_id", proposalId)
        .is("meeting_at", null)
        .select("nombre, correo, whatsapp, puntaje, etiqueta");
      if (error) throw new Error(`leads update failed: ${error.code ?? "unknown"}`);
      const lead = data[0];
      if (!lead) return null;
      return { name: lead.nombre, email: lead.correo, whatsapp: lead.whatsapp, score: lead.puntaje, label: lead.etiqueta };
    },
  };
}
