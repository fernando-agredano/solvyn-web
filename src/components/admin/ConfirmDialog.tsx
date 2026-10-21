"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AdminButton } from "./AdminButton";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

// Native <dialog>: the browser traps focus, closes on Escape and restores focus to the button that opened it.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onCancel();
      }}
      aria-labelledby="confirm-dialog-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-[#E4E4E7] bg-white p-0 text-[#18181B] shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <h2
            id="confirm-dialog-title"
            className="m-0 text-base font-semibold text-[#18181B]"
          >
            {title}
          </h2>
          {description && (
            <p className="m-0 text-sm leading-[1.6] text-[#52525B]">
              {description}
            </p>
          )}
        </div>
        {children}
        <div className="flex justify-end gap-2 pt-1">
          <AdminButton variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </AdminButton>
          <AdminButton onClick={onConfirm}>{confirmLabel}</AdminButton>
        </div>
      </div>
    </dialog>
  );
}
