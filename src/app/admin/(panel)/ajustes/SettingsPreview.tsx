import type { ReactNode } from "react";
import {
  formatPhone,
  formatRate,
  type SettingsDraft,
} from "@/src/lib/settings/changes";
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
        <ContactRow
          label="Correo"
          value={draft.email.trim() || "—"}
          icon={<MailIcon />}
        />
        <ContactRow
          label="WhatsApp"
          value={formatPhone(draft.whatsapp) || "—"}
          icon={<PhoneIcon />}
        />
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

// The contact data is what visitors act on, so each item gets its own card: icon, label and a bold value.
function ContactRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#E4E4E7] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-[#18181B] text-white">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="m-0 text-[11px] font-medium tracking-wide text-[#71717A] uppercase">
          {label}
        </p>
        <p
          title={value}
          className="m-0 truncate text-sm font-semibold tabular-nums text-[#18181B]"
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
