"use client";

import { useActionState } from "react";
import { ADMIN_CONTROL_CLASSES } from "@/src/components/admin/styles";
import { Button } from "@/src/components/ui/Button";
import { LEAD_STATUSES, type LeadStatus } from "@/src/lib/admin/leads/filters";
import { STATUS_LABELS } from "@/src/lib/admin/leads/labels";
import { updateLeadStatus, type LeadActionState } from "../actions";

const INITIAL_STATE: LeadActionState = { status: "idle" };

export function LeadStatusForm({
  leadId,
  initialStatus,
}: {
  leadId: string;
  initialStatus: LeadStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateLeadStatus,
    INITIAL_STATE,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <input type="hidden" name="id" value={leadId} />
      <label className="flex flex-1 flex-col gap-2 text-sm text-[#D4D4D4]">
        Cambiar estado
        <select
          name="estado"
          defaultValue={initialStatus}
          className={ADMIN_CONTROL_CLASSES}
        >
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" size="md" disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar estado"}
      </Button>
      <StatusMessage status={state.status} />
    </form>
  );
}

function StatusMessage({ status }: { status: LeadActionState["status"] }) {
  if (status === "saved")
    return (
      <p role="status" className="m-0 text-sm text-text-secondary">
        Estado guardado.
      </p>
    );
  if (status === "error")
    return (
      <p role="alert" className="m-0 text-sm text-error">
        No se pudo guardar el estado.
      </p>
    );
  return null;
}
