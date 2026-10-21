"use client";

import { useActionState, type ReactNode } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import {
  ADMIN_CONTROL_CLASSES,
  ADMIN_LABEL_CLASSES,
} from "@/src/components/admin/styles";
import type { PublicSettings } from "@/src/lib/settings/model";
import {
  MAX_AVAILABILITY_MESSAGE_LENGTH,
  MAX_HOURLY_RATE_MXN,
  MIN_HOURLY_RATE_MXN,
} from "@/src/lib/settings/schema";
import { saveSettings, type SettingsActionState } from "./actions";

const INITIAL_STATE: SettingsActionState = { status: "idle", fieldErrors: {} };

export function SettingsForm({ settings }: { settings: PublicSettings }) {
  const [state, formAction, isPending] = useActionState(
    saveSettings,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Tarifa por hora (MXN)"
          name="hourlyRateMxn"
          error={state.fieldErrors.hourlyRateMxn}
        >
          <input
            id="hourlyRateMxn"
            name="hourlyRateMxn"
            type="number"
            inputMode="numeric"
            min={MIN_HOURLY_RATE_MXN}
            max={MAX_HOURLY_RATE_MXN}
            step={1}
            required
            defaultValue={settings.hourlyRateMxn}
            className={ADMIN_CONTROL_CLASSES}
          />
        </Field>

        <Field
          label="Próximo inicio disponible"
          name="nextStartDate"
          hint="Déjalo vacío para no mostrar la fecha."
          error={state.fieldErrors.nextStartDate}
        >
          <input
            id="nextStartDate"
            name="nextStartDate"
            type="date"
            defaultValue={settings.nextStartDate ?? ""}
            className={ADMIN_CONTROL_CLASSES}
          />
        </Field>
      </div>

      <Field
        label="Mensaje de disponibilidad"
        name="availabilityMessage"
        hint={`Opcional. Máximo ${MAX_AVAILABILITY_MESSAGE_LENGTH} caracteres.`}
        error={state.fieldErrors.availabilityMessage}
      >
        <input
          id="availabilityMessage"
          name="availabilityMessage"
          type="text"
          maxLength={MAX_AVAILABILITY_MESSAGE_LENGTH}
          defaultValue={settings.availabilityMessage ?? ""}
          className={ADMIN_CONTROL_CLASSES}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="WhatsApp público"
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
            defaultValue={settings.whatsapp}
            className={ADMIN_CONTROL_CLASSES}
          />
        </Field>

        <Field
          label="Correo público"
          name="email"
          error={state.fieldErrors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            required
            defaultValue={settings.email}
            className={ADMIN_CONTROL_CLASSES}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#F4F4F5] pt-5">
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar ajustes"}
        </AdminButton>
        <SaveMessage state={state} />
      </div>
    </form>
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
      {hint && !error && <p className="m-0 text-xs text-[#71717A]">{hint}</p>}
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

function SaveMessage({ state }: { state: SettingsActionState }) {
  if (state.status === "saved")
    return (
      <p role="status" className="m-0 text-xs text-[#52525B]">
        Ajustes guardados.
      </p>
    );
  if (state.status === "error")
    return (
      <p role="alert" className="m-0 text-xs text-[#B91C1C]">
        {Object.keys(state.fieldErrors).length > 0
          ? "Revisa los campos marcados."
          : "No se pudieron guardar los ajustes."}
      </p>
    );
  return null;
}
