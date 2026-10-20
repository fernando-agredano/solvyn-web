import Link from "next/link";
import { useState } from "react";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { isValidEmail } from "@/src/lib/configurator/validation";
import { TextField } from "../fields/TextField";
import { StepSection } from "./StepSection";

// Below this length the visitor is probably still typing, so no error yet.
const MIN_EMAIL_LENGTH_FOR_ERROR = 4;

export function ContactStep() {
  const contactName = useConfiguratorStore((state) => state.contactName);
  const contactEmail = useConfiguratorStore((state) => state.contactEmail);
  const contactPhone = useConfiguratorStore((state) => state.contactPhone);
  const consent = useConfiguratorStore((state) => state.consent);
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);
  const [emailTouched, setEmailTouched] = useState(false);

  // Only complain once the visitor has typed something that looks like an attempt.
  const showEmailError = emailTouched && contactEmail.length > MIN_EMAIL_LENGTH_FOR_ERROR && !isValidEmail(contactEmail);

  return (
    <StepSection
      step="contact"
      title="¿A dónde te envío tu propuesta?"
      description="Con estos datos genero tu propuesta completa con arquitectura y vista previa, y te la envío por correo."
    >
      <div className="grid grid-cols-2 gap-[18px] max-[980px]:grid-cols-1">
        <TextField
          id="contact-name"
          label="Tu nombre"
          type="text"
          autoComplete="name"
          placeholder="Nombre y apellido"
          value={contactName}
          onChange={(event) => setAnswer("contactName", event.target.value)}
        />
        <TextField
          id="contact-phone"
          label="WhatsApp"
          type="tel"
          autoComplete="tel"
          placeholder="10 dígitos"
          value={contactPhone}
          onChange={(event) => setAnswer("contactPhone", event.target.value.replace(/[^0-9 +]/g, ""))}
        />
      </div>
      <TextField
        id="contact-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="tu@negocio.com"
        error={showEmailError ? "Revisa el correo: debe tener la forma nombre@dominio.com" : undefined}
        value={contactEmail}
        onChange={(event) => {
          setEmailTouched(true);
          setAnswer("contactEmail", event.target.value);
        }}
      />
      <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-normal text-text-secondary">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setAnswer("consent", event.target.checked)}
          className="mt-0.5 size-5 flex-none accent-white"
        />
        <span>
          Acepto el{" "}
          <Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-foreground">
            aviso de privacidad
          </Link>{" "}
          y que Solvyn Solutions me contacte sobre esta propuesta.
        </span>
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 p-4 text-sm leading-normal text-text-secondary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Tus datos no se comparten con terceros ni se usan para generar la propuesta.
      </div>
    </StepSection>
  );
}
