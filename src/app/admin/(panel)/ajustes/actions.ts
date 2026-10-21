"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { assertSameOrigin, requireAdmin } from "@/src/lib/admin/auth";
import { settingsFormSchema, toSettingsRow } from "@/src/lib/settings/schema";
import { SETTINGS_TAG } from "@/src/lib/settings/settings";

export type SettingsActionState = {
  status: "idle" | "saved" | "error";
  fieldErrors: Record<string, string>;
};

// The session is checked before the input is read. The settings row always exists (migration 004), so a
// zero-row update means the write was refused.
export async function saveSettings(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await assertSameOrigin();
  const { supabase } = await requireAdmin();

  const parsed = settingsFormSchema.safeParse({
    hourlyRateMxn: formData.get("hourlyRateMxn"),
    nextStartDate: formData.get("nextStartDate") ?? "",
    availabilityMessage: formData.get("availabilityMessage") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    email: formData.get("email") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).flatMap(([field, messages]) =>
          messages?.[0] ? [[field, messages[0]]] : [],
        ),
      ),
    };
  }

  const { data, error } = await supabase
    .from("settings")
    .update(toSettingsRow(parsed.data))
    .eq("id", 1)
    .select("id");
  if (error || !data || data.length === 0)
    return { status: "error", fieldErrors: {} };

  // Read-your-writes: the next page view shows the new values, not the cached ones.
  updateTag(SETTINGS_TAG);
  revalidatePath("/admin/ajustes");
  return { status: "saved", fieldErrors: {} };
}
