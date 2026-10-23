"use client";

import {
  useActionState,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import { ConfirmDialog } from "@/src/components/admin/ConfirmDialog";
import { CalendarIcon, MailIcon, MessageIcon, WalletIcon } from "@/src/components/ui/icons";
import { DatePicker } from "@/src/components/admin/DatePicker";
import { PageHeading } from "@/src/components/admin/PageHeading";
import {
  ADMIN_CONTROL_CLASSES,
  ADMIN_LABEL_CLASSES,
} from "@/src/components/admin/styles";
import { useActionToast } from "@/src/components/admin/toast/useActionToast";
import {
  describeChanges,
  formatRate,
  toDraft,
  type SettingsDraft,
} from "@/src/lib/settings/changes";
import { formatStartDate, type PublicSettings } from "@/src/lib/settings/model";
import {
  MAX_AVAILABILITY_MESSAGE_LENGTH,
  MAX_HOURLY_RATE_MXN,
  MIN_HOURLY_RATE_MXN,
} from "@/src/lib/settings/schema";
import { saveSettings, type SettingsActionState } from "./actions";
import { SettingsPreview } from "./SettingsPreview";

const INITIAL_STATE: SettingsActionState = { status: "idle", fieldErrors: {} };

const GROUP_TAG_CLASSES =
  "m-0 inline-flex w-fit rounded-full bg-[#F4F4F5] px-2.5 py-1 text-xs font-semibold text-[#3F3F46]";

// Shared by the recap strip and the cards below it, so each recap card sits right above its column.
const COLUMNS_CLASSES =
  "grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,340px)]";

const GROUP_CARD_CLASSES =
  "flex flex-col gap-4 rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

function GroupHeader({
  id,
  icon,
  title,
  description,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#F4F4F5] pb-3">
      <span
        aria-hidden="true"
        className="flex size-9 flex-none items-center justify-center rounded-lg bg-[#18181B] text-white"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p id={id} className={GROUP_TAG_CLASSES}>
          {title}
        </p>
        <p className="m-0 text-xs text-[#71717A]">{description}</p>
      </div>
    </div>
  );
}

// Read-only recap of the draft: the same data as the form, glanceable before scrolling into the fields.
function SummaryStrip({ draft }: { draft: SettingsDraft }) {
  const contactChannels = [draft.whatsapp, draft.email].filter((value) => value.trim()).length;
  const items = [
    { icon: <WalletIcon size={16} />, label: "Tarifa por hora", value: formatRate(draft.hourlyRateMxn) },
    {
      icon: <CalendarIcon size={16} />,
      label: "Próximo inicio",
      value: draft.nextStartDate ? formatStartDate(draft.nextStartDate) : "Sin fecha",
    },
    { icon: <MailIcon size={16} />, label: "Canales de contacto", value: `${contactChannels} de 2 activos` },
  ];
  return (
    <ul className={`m-0 list-none p-0 ${COLUMNS_CLASSES}`}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3">
          <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-lg border border-[#E4E4E7] bg-white text-[#18181B]">
            {item.icon}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-xs text-[#71717A]">{item.label}</span>
            <span className="truncate text-sm font-semibold text-[#18181B]">{item.value}</span>
          </span>
          <span aria-hidden="true" className="ml-auto size-1.5 flex-none rounded-full bg-[#059669]" />
        </li>
      ))}
    </ul>
  );
}

export function SettingsForm({ settings }: { settings: PublicSettings }) {
  const [state, formAction, isPending] = useActionState(
    saveSettings,
    INITIAL_STATE,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<SettingsDraft>(() => toDraft(settings));
  const [isConfirming, setIsConfirming] = useState(false);

  // After a save the page is revalidated, so `settings` is the stored value again and nothing is pending.
  const baseline = toDraft(settings);
  const changes = describeChanges(baseline, draft);
  const isDirty = changes.length > 0;
  const hasFieldErrors = Object.keys(state.fieldErrors).length > 0;

  useActionToast(state, {
    saved: {
      title: "Ajustes guardados",
      description: "La landing y el configurador ya usan los valores nuevos.",
    },
    error: {
      title: hasFieldErrors
        ? "Revisa los campos marcados"
        : "No se pudieron guardar los ajustes",
      description: hasFieldErrors
        ? undefined
        : "Intenta de nuevo en unos segundos.",
    },
  });

  const updateField =
    (key: keyof SettingsDraft) => (event: ChangeEvent<HTMLInputElement>) =>
      setDraft((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className="w-full rounded-2xl border border-[#E4E4E7] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-[#E4E4E7] bg-[#FAFAFA] px-6 py-4">
        <PageHeading title="Ajustes" tags={["Sitio público"]} />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs text-[#52525B]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#059669]"
          />
          Se muestra en la landing y el configurador
        </span>
      </div>

      <form ref={formRef} action={formAction}>
        <div className="flex flex-col gap-5 p-6">
          <SummaryStrip draft={draft} />
          <div className={`${COLUMNS_CLASSES} items-stretch`}>
            <div
              role="group"
              aria-labelledby="pricing-group"
              className={GROUP_CARD_CLASSES}
            >
              <GroupHeader
                id="pricing-group"
                icon={<WalletIcon size={16} />}
                title="Tarifa y disponibilidad"
                description="Lo que ven los visitantes antes de configurar."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Tarifa por hora"
                  name="hourlyRateMxn"
                  error={state.fieldErrors.hourlyRateMxn}
                >
                  <div className="relative">
                    <input
                      id="hourlyRateMxn"
                      name="hourlyRateMxn"
                      type="number"
                      inputMode="numeric"
                      min={MIN_HOURLY_RATE_MXN}
                      max={MAX_HOURLY_RATE_MXN}
                      step={1}
                      required
                      value={draft.hourlyRateMxn}
                      onChange={updateField("hourlyRateMxn")}
                      className={`${ADMIN_CONTROL_CLASSES} pr-14`}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#71717A]"
                    >
                      MXN
                    </span>
                  </div>
                </Field>
                <Field
                  label="Próximo inicio disponible"
                  name="nextStartDate"
                  hint="Vacío: no se muestra la fecha."
                  error={state.fieldErrors.nextStartDate}
                >
                  <DatePicker
                    id="nextStartDate"
                    name="nextStartDate"
                    value={draft.nextStartDate}
                    onChange={(value) =>
                      setDraft((current) => ({ ...current, nextStartDate: value }))
                    }
                  />
                </Field>
              </div>
              <Field
                label="Mensaje de disponibilidad"
                name="availabilityMessage"
                hint={`Opcional. ${draft.availabilityMessage.length}/${MAX_AVAILABILITY_MESSAGE_LENGTH} caracteres.`}
                error={state.fieldErrors.availabilityMessage}
              >
                <input
                  id="availabilityMessage"
                  name="availabilityMessage"
                  type="text"
                  maxLength={MAX_AVAILABILITY_MESSAGE_LENGTH}
                  value={draft.availabilityMessage}
                  onChange={updateField("availabilityMessage")}
                  className={ADMIN_CONTROL_CLASSES}
                />
              </Field>
            </div>

            <div
              role="group"
              aria-labelledby="contact-group"
              className={GROUP_CARD_CLASSES}
            >
              <GroupHeader
                id="contact-group"
                icon={<MessageIcon size={16} />}
                title="Contacto público"
                description="Dónde te escriben desde la landing y el pie de página."
              />
              <div className="grid gap-4">
                <Field
                  label="WhatsApp"
                  name="whatsapp"
                  hint="10 dígitos, sin lada internacional."
                  error={state.fieldErrors.whatsapp}
                >
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    autoComplete="off"
                    required
                    value={draft.whatsapp}
                    onChange={updateField("whatsapp")}
                    className={ADMIN_CONTROL_CLASSES}
                  />
                </Field>
                <Field
                  label="Correo"
                  name="email"
                  error={state.fieldErrors.email}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    required
                    value={draft.email}
                    onChange={updateField("email")}
                    className={ADMIN_CONTROL_CLASSES}
                  />
                </Field>
              </div>
            </div>

          <SettingsPreview draft={draft} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border-t border-[#E4E4E7] bg-[#FAFAFA] px-6 py-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs text-[#52525B]">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${isDirty ? "bg-[#18181B]" : "bg-[#D4D4D8]"}`}
            />
            {isDirty
              ? `${changes.length} ${changes.length === 1 ? "cambio sin guardar" : "cambios sin guardar"}`
              : "Sin cambios pendientes"}
          </span>
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              disabled={!isDirty || isPending}
              onClick={() => setDraft(baseline)}
            >
              Descartar
            </AdminButton>
            <AdminButton
              disabled={!isDirty || isPending}
              onClick={() => setIsConfirming(true)}
            >
              {isPending ? "Guardando…" : "Guardar cambios"}
            </AdminButton>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirming}
        title="¿Guardar los cambios?"
        description="Se publicarán de inmediato en la landing y el configurador."
        confirmLabel="Guardar cambios"
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => {
          setIsConfirming(false);
          formRef.current?.requestSubmit();
        }}
      >
        <ul className="m-0 flex list-none flex-col gap-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-3.5">
          {changes.map((change) => (
            <li key={change.label} className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-[#71717A]">
                {change.label}
              </span>
              <span className="text-sm text-[#18181B]">
                <span className="text-[#71717A] line-through">
                  {change.from}
                </span>
                {" → "}
                {change.to}
              </span>
            </li>
          ))}
        </ul>
      </ConfirmDialog>
    </div>
  );
}

function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={ADMIN_LABEL_CLASSES}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="m-0 text-xs text-[#52525B]">{hint}</p>}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="m-0 text-xs text-[#B91C1C]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
