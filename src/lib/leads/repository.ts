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

export interface LeadStorage {
  saveLead(lead: NewLead): Promise<void>;
}

export function createSupabaseLeadStorage(): LeadStorage {
  const supabase = createServiceClient();
  return {
    async saveLead(lead) {
      // Spanish column names match the admin panel; the unique (correo, proposal_id) makes a repeated save a no-op.
      const { error } = await supabase.from("leads").upsert(
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
      );
      if (error) throw new Error(`leads insert failed: ${error.code ?? "unknown"}`);
    },
  };
}
