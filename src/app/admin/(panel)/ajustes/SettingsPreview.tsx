import type { ReactNode } from "react";
import { formatRate, type SettingsDraft } from "@/src/lib/settings/changes";
import { formatStartDate } from "@/src/lib/settings/model";

// Mirrors what the landing and the footer show, so the owner sees the effect before confirming.
export function SettingsPreview({ draft }: { draft: SettingsDraft }) {
  const message = draft.availabilityMessage.trim();

  return (
    <aside
      aria-label="Vista previa de la landing"
      className="flex flex-col gap-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs font-semibold text-[#3F3F46]">
          Vista previa
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#52525B]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#059669]"
          />
          Así se verá
        </span>
      </div>

      <PreviewBlock label="Tarifa">
        <p className="m-0 text-xl font-semibold tabular-nums text-[#18181B]">
          {formatRate(draft.hourlyRateMxn)}
          <span className="text-sm font-normal text-[#71717A]"> / hora</span>
        </p>
      </PreviewBlock>

      <PreviewBlock label="Disponibilidad">
        <p className="m-0 rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#18181B]">
          {draft.nextStartDate
            ? `Próximo inicio disponible: ${formatStartDate(draft.nextStartDate)}`
            : "Sin fecha de inicio"}
        </p>
        {message && (
          <p className="m-0 text-xs leading-[1.5] text-[#52525B]">{message}</p>
        )}
      </PreviewBlock>

      <PreviewBlock label="Contacto">
        <p className="m-0 break-all text-sm text-[#18181B]">
          {draft.email.trim() || "—"}
        </p>
        <p className="m-0 text-sm tabular-nums text-[#18181B]">
          {draft.whatsapp.trim() || "—"}
        </p>
      </PreviewBlock>
    </aside>
  );
}

function PreviewBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="m-0 text-xs font-medium text-[#71717A]">{label}</p>
      {children}
    </div>
  );
}
