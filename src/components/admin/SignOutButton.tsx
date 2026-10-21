"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

// Signing out revokes every session, so it asks first. The real form is hidden and submitted on confirm.
export function SignOutButton({ action }: { action: () => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <>
      <form ref={formRef} action={action} className="hidden" />
      {/* Light pill that inverts to dark on hover: it reads as the exit, without using a warning color. */}
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-4 text-sm font-medium text-[#3F3F46] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:border-[#18181B] hover:bg-[#18181B] hover:text-white"
      >
        <LogoutIcon />
        Cerrar sesión
      </button>
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

function LogoutIcon() {
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
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 8l4 4-4 4M20 12H9" />
    </svg>
  );
}
