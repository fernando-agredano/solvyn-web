"use client";

import { useRef, useState } from "react";
import { AdminButton } from "./AdminButton";
import { ConfirmDialog } from "./ConfirmDialog";

// Signing out revokes every session, so it asks first. The real form is hidden and submitted on confirm.
export function SignOutButton({ action }: { action: () => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <>
      <form ref={formRef} action={action} className="hidden" />
      <AdminButton variant="secondary" onClick={() => setIsConfirming(true)}>
        Cerrar sesión
      </AdminButton>
      <ConfirmDialog
        open={isConfirming}
        title="¿Cerrar sesión?"
        description="Se cerrarán todas tus sesiones y tendrás que pedir un enlace nuevo para volver a entrar."
        confirmLabel="Cerrar sesión"
        onCancel={() => setIsConfirming(false)}
        onConfirm={() => {
          setIsConfirming(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
