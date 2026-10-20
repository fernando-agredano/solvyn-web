import { Suspense } from "react";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";
import { requireAdmin } from "@/src/lib/admin/auth";
import { toPublicSettings, type SettingsRow } from "@/src/lib/settings/model";
import { SETTINGS_COLUMNS } from "@/src/lib/settings/settings";
import { SettingsForm } from "./SettingsForm";

// Read from the table, not the public view: the admin session may see what the stored row holds.
async function SettingsPanel() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", 1)
    .single();
  if (error || !data) throw new Error("settings read failed");

  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-[720px] flex-col gap-8 px-6 py-12"
    >
      <h1 className="wide m-0 text-[clamp(28px,4vw,40px)] font-bold text-heading">
        Ajustes
      </h1>
      <section className={`${ADMIN_PANEL_CLASSES} p-6`}>
        <SettingsForm settings={toPublicSettings(data as SettingsRow)} />
      </section>
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
