"use client";

import { useActionState } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import {
  ADMIN_CONTROL_CLASSES,
  ADMIN_LABEL_CLASSES,
} from "@/src/components/admin/styles";
import { useActionToast } from "@/src/components/admin/toast/useActionToast";
import { saveLeadNotes, type LeadActionState } from "../actions";

const INITIAL_STATE: LeadActionState = { status: "idle" };
const MAX_NOTES_LENGTH = 2000;

// Notes are internal and easy to edit again, so saving them only needs a toast, no confirmation.
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

  useActionToast(state, {
    saved: { title: "Notas guardadas" },
    error: {
      title: "No se pudieron guardar las notas",
      description: "Intenta de nuevo en unos segundos.",
    },
  });

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
      <div>
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar notas"}
        </AdminButton>
      </div>
    </form>
  );
}
