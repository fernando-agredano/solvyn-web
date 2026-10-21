import { connection } from "next/server";
import { Suspense } from "react";
import { SectionCard } from "@/src/components/admin/SectionCard";
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

  return (
    <main
      id="contenido"
      className="flex flex-col gap-4 px-4 py-6 sm:px-8 lg:px-12"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="m-0 text-lg font-semibold text-[#18181B]">Ajustes</h1>
        <p className="m-0 text-xs text-[#71717A]">
          Se muestran en la landing y en el configurador
        </p>
      </div>
      <SectionCard
        title="Disponibilidad y contacto"
        headingId="settings-heading"
      >
        <SettingsForm settings={toPublicSettings(data as SettingsRow)} />
      </SectionCard>
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
