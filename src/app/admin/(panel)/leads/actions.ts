"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertSameOrigin, requireAdmin } from "@/src/lib/admin/auth";
import { LEAD_STATUSES } from "@/src/lib/admin/leads/filters";

export type LeadActionState = { status: "idle" | "saved" | "error" };

const MAX_NOTES_LENGTH = 2000;

const statusSchema = z.object({ id: z.uuid(), estado: z.enum(LEAD_STATUSES) });
const notesSchema = z.object({
  id: z.uuid(),
  notas: z
    .string()
    .max(MAX_NOTES_LENGTH)
    .transform((value) => value.trim() || null),
});

// The session is checked first, before the input is even read. A lead the admin can't see (or that doesn't exist)
// updates zero rows and no error: the empty result is the signal.
async function updateLead(
  id: string,
  values: Record<string, string | null>,
): Promise<LeadActionState> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("leads")
    .update(values)
    .eq("id", id)
    .select("id");
  if (error || !data || data.length === 0) return { status: "error" };
  revalidatePath("/admin", "layout");
  return { status: "saved" };
}

export async function updateLeadStatus(
  _previous: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  await assertSameOrigin();
  await requireAdmin();
  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) return { status: "error" };
  return updateLead(parsed.data.id, { estado: parsed.data.estado });
}

export async function saveLeadNotes(
  _previous: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  await assertSameOrigin();
  await requireAdmin();
  const parsed = notesSchema.safeParse({
    id: formData.get("id"),
    notas: formData.get("notas") ?? "",
  });
  if (!parsed.success) return { status: "error" };
  return updateLead(parsed.data.id, { notas: parsed.data.notas });
}
