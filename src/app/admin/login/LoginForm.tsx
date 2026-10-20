"use client";

import { useActionState } from "react";
import { TextField } from "@/src/components/configurator/fields/TextField";
import { Button } from "@/src/components/ui/Button";
import { requestLoginLink, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    requestLoginLink,
    INITIAL_STATE,
  );

  if (state.status === "sent") {
    return (
      <p
        role="status"
        className="text-[15px] leading-[1.6] text-text-secondary"
      >
        Si este correo tiene acceso, recibirás un enlace para entrar. Revisa tu
        bandeja de entrada.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        id="email"
        name="email"
        type="email"
        label="Correo"
        autoComplete="email"
        required
        error={
          state.status === "invalid" ? "Escribe un correo válido." : undefined
        }
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
