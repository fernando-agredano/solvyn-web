"use client";

import { useActionState } from "react";
import { ADMIN_CONTROL_CLASSES } from "@/src/components/admin/styles";
import { Button } from "@/src/components/ui/Button";
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
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={leadId} />
      <label className="flex flex-col gap-2 text-sm text-[#D4D4D4]">
        Notas internas
        <textarea
          name="notas"
          rows={5}
          maxLength={MAX_NOTES_LENGTH}
          defaultValue={initialNotes}
          className={`${ADMIN_CONTROL_CLASSES} min-h-32 resize-y py-3 leading-[1.55]`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="md" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar notas"}
        </Button>
        <NotesMessage status={state.status} />
      </div>
    </form>
  );
}

function NotesMessage({ status }: { status: LeadActionState["status"] }) {
  if (status === "saved")
    return (
      <p role="status" className="m-0 text-sm text-text-secondary">
        Notas guardadas.
      </p>
    );
  if (status === "error")
    return (
      <p role="alert" className="m-0 text-sm text-error">
        No se pudieron guardar las notas.
      </p>
    );
  return null;
}
