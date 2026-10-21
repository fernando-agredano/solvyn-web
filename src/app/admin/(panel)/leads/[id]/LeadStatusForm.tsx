"use client";

import { useActionState, useRef, useState } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import { ConfirmDialog } from "@/src/components/admin/ConfirmDialog";
import { Select } from "@/src/components/admin/Select";
import { ADMIN_LABEL_CLASSES } from "@/src/components/admin/styles";
import { useActionToast } from "@/src/components/admin/toast/useActionToast";
import { LEAD_STATUSES, type LeadStatus } from "@/src/lib/admin/leads/filters";
import { STATUS_LABELS } from "@/src/lib/admin/leads/labels";
import { updateLeadStatus, type LeadActionState } from "../actions";

const INITIAL_STATE: LeadActionState = { status: "idle" };

const STATUS_OPTIONS = LEAD_STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

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
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [isConfirming, setIsConfirming] = useState(false);

  useActionToast(state, {
    saved: {
      title: "Estado actualizado",
      description: `El lead ahora está en «${STATUS_LABELS[status]}».`,
    },
    error: {
      title: "No se pudo cambiar el estado",
      description: "Intenta de nuevo en unos segundos.",
    },
  });

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <input type="hidden" name="id" value={leadId} />
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="lead-status" className={ADMIN_LABEL_CLASSES}>
            Cambiar estado
          </label>
          <Select
            id="lead-status"
            name="estado"
            value={status}
            onChange={(value) => setStatus(value as LeadStatus)}
            options={STATUS_OPTIONS}
          />
        </div>
        <AdminButton
          disabled={isPending || status === initialStatus}
          onClick={() => setIsConfirming(true)}
        >
          {isPending ? "Guardando…" : "Guardar estado"}
        </AdminButton>
      </form>

      <ConfirmDialog
        open={isConfirming}
        title="¿Cambiar el estado del lead?"
        description={`Pasará de «${STATUS_LABELS[initialStatus]}» a «${STATUS_LABELS[status]}».`}
        confirmLabel="Cambiar estado"
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => {
          setIsConfirming(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
