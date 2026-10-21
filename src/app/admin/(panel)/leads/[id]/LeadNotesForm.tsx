"use client";

import { useActionState } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import {
  ADMIN_CONTROL_CLASSES,
  ADMIN_LABEL_CLASSES,
} from "@/src/components/admin/styles";
import { saveLeadNotes, type LeadActionState } from "../actions";

const INITIAL_STATE: LeadActionState = { status: "idle" };
const MAX_NOTES_LENGTH = 2000;

export function LeadNotesForm({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: string;
}) {
  const [state, formAction, isPending] = useActionState(
    saveLeadNotes,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={leadId} />
      <label className={`flex flex-col gap-1.5 ${ADMIN_LABEL_CLASSES}`}>
        Notas
        <textarea
          name="notas"
          rows={5}
          maxLength={MAX_NOTES_LENGTH}
          defaultValue={initialNotes}
          className={`${ADMIN_CONTROL_CLASSES} min-h-28 resize-y py-2.5 leading-[1.55]`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar notas"}
        </AdminButton>
        <NotesMessage status={state.status} />
      </div>
    </form>
  );
}

function NotesMessage({ status }: { status: LeadActionState["status"] }) {
  if (status === "saved")
    return (
      <p role="status" className="m-0 text-xs text-[#52525B]">
        Notas guardadas.
      </p>
    );
  if (status === "error")
    return (
      <p role="alert" className="m-0 text-xs text-[#B91C1C]">
        No se pudieron guardar las notas.
      </p>
    );
  return null;
}
