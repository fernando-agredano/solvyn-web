"use client";

import { useActionState, useState, type ReactNode } from "react";
import { LockIcon, MailIcon } from "@/src/components/ui/icons";
import { isValidEmail } from "@/src/lib/configurator/validation";
import { AdminButton } from "@/src/components/admin/AdminButton";
import {
  ADMIN_CONTROL_CLASSES,
  ADMIN_LABEL_CLASSES,
} from "@/src/components/admin/styles";
import { AdminCard } from "../AdminCard";
import { requestLoginLink, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = { status: "idle" };

const NEXT_STEPS = [
  "Abre tu bandeja de entrada",
  "Pulsa el botón «Entrar al panel»",
  "Si no llega, revisa la carpeta de spam",
];

// The whole card lives here because its heading changes once the link is sent.
export function LoginForm({ notice }: { notice: ReactNode }) {
  const [state, formAction, isPending] = useActionState(
    requestLoginLink,
    INITIAL_STATE,
  );

  const [email, setEmail] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const isEmailValid = isValidEmail(email);
  const showError = state.status === "invalid" || (isTouched && email.length > 0 && !isEmailValid);

  if (state.status === "sent") {
    return (
      <AdminCard
        badge="Enlace enviado"
        icon={<MailIcon size={24} />}
        title="Revisa tu correo"
        description="Si este correo tiene acceso, recibirás un enlace para entrar."
      >
        <ol role="status" className="m-0 flex w-full list-none flex-col gap-2 p-0 text-left">
          {NEXT_STEPS.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-[#3F3F46]"
            >
              <span
                aria-hidden="true"
                className="flex size-6 flex-none items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-xs font-semibold text-[#18181B] tabular-nums"
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </AdminCard>
    );
  }

  return (
    <AdminCard
      badge="Acceso seguro"
      icon={<LockIcon size={24} />}
      title="Acceso al panel"
      description="Escribe tu correo y te enviaremos un enlace para entrar."
      perks={["Sin contraseña", "Enlace de un solo uso"]}
    >
      {notice}
    <form action={formAction} noValidate className="flex w-full flex-col gap-4">
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setIsTouched(true)}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? "email-error" : undefined}
          placeholder="tu@correo.com"
          className={`${ADMIN_CONTROL_CLASSES} text-center`}
        />
        {showError && (
          <p
            id="email-error"
            role="alert"
            className="m-0 text-xs text-[#B91C1C]"
          >
            Escribe un correo válido.
          </p>
        )}
      </div>
      <AdminButton type="submit" disabled={isPending || !isEmailValid}>
        {isPending ? "Enviando…" : "Enviar enlace"}
      </AdminButton>
    </form>
    </AdminCard>
  );
}
