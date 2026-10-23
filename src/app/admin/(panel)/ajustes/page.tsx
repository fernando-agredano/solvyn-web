import { connection } from "next/server";
import { Suspense } from "react";
import { requireAdmin } from "@/src/lib/admin/auth";
import { toPublicSettings, type SettingsRow } from "@/src/lib/settings/model";
import { SETTINGS_COLUMNS } from "@/src/lib/settings/settings";
import { SettingsForm } from "./SettingsForm";

// Read from the table, not the public view: the admin session may see what the stored row holds.
async function SettingsPanel() {
  await connection();
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", 1)
    .single();
  if (error || !data) throw new Error("settings read failed");

  // The card sits at the top, right under the header.
  return (
    <main
      id="contenido"
      className="flex px-4 py-6 sm:px-8 lg:px-12"
    >
      <SettingsForm settings={toPublicSettings(data as SettingsRow)} />
    </main>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense>
      <SettingsPanel />
    </Suspense>
  );
}
