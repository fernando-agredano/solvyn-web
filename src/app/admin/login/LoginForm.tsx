"use client";

import { useActionState } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import {
  ADMIN_CONTROL_CLASSES,
  ADMIN_LABEL_CLASSES,
} from "@/src/components/admin/styles";
import { requestLoginLink, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    requestLoginLink,
    INITIAL_STATE,
  );

  if (state.status === "sent") {
    return (
      <p role="status" className="m-0 text-sm leading-[1.6] text-[#52525B]">
        Si este correo tiene acceso, recibirás un enlace para entrar. Revisa tu
        bandeja de entrada.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={ADMIN_LABEL_CLASSES}>
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={state.status === "invalid" || undefined}
          aria-describedby={
            state.status === "invalid" ? "email-error" : undefined
          }
          className={ADMIN_CONTROL_CLASSES}
        />
        {state.status === "invalid" && (
          <p
            id="email-error"
            role="alert"
            className="m-0 text-xs text-[#B91C1C]"
          >
            Escribe un correo válido.
          </p>
        )}
      </div>
      <AdminButton type="submit" disabled={isPending}>
        {isPending ? "Enviando…" : "Enviar enlace"}
      </AdminButton>
    </form>
  );
}
