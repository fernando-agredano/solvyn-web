import Link from "next/link";
import { useState } from "react";
import {
  CheckIcon,
  LockIcon,
  MailIcon,
  MessageIcon,
  UserIcon,
} from "@/src/components/ui/icons";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { isValidEmail } from "@/src/lib/configurator/validation";
import { TextField } from "../fields/TextField";
import { ReturnNoticeModal } from "./ReturnNoticeModal";
import { StepSection } from "./StepSection";

// Below this length the visitor is probably still typing, so no error yet.
const MIN_EMAIL_LENGTH_FOR_ERROR = 4;

export function ContactStep() {
  const contactName = useConfiguratorStore((state) => state.contactName);
  const contactEmail = useConfiguratorStore((state) => state.contactEmail);
  const contactPhone = useConfiguratorStore((state) => state.contactPhone);
  const consent = useConfiguratorStore((state) => state.consent);
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);
  const hasReturnRoute = useConfiguratorStore((state) => state.returnRoute !== null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);

  // Only complain once the visitor has typed something that looks like an attempt.
  const showEmailError =
    emailTouched &&
    contactEmail.length > MIN_EMAIL_LENGTH_FOR_ERROR &&
    !isValidEmail(contactEmail);

  return (
    <StepSection
      step="contact"
      title="¿A dónde te envío tu propuesta?"
      description="Con estos datos genero tu propuesta completa con arquitectura y diagrama, y te la envío por correo."
    >
      {hasReturnRoute && isNoticeOpen && <ReturnNoticeModal onClose={() => setIsNoticeOpen(false)} />}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
          <TextField
            id="contact-name"
            label="Tu nombre"
            type="text"
            autoComplete="name"
            icon={<UserIcon size={16} />}
            placeholder="Nombre y apellido"
            value={contactName}
            onChange={(event) => setAnswer("contactName", event.target.value)}
          />
          <TextField
            id="contact-phone"
            label="WhatsApp"
            type="tel"
            autoComplete="tel"
            icon={<MessageIcon size={16} />}
            placeholder="10 dígitos"
            value={contactPhone}
            onChange={(event) =>
              setAnswer(
                "contactPhone",
                event.target.value.replace(/[^0-9 +]/g, ""),
              )
            }
          />
        </div>
        <TextField
          id="contact-email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          icon={<MailIcon size={16} />}
          placeholder="tu@negocio.com"
          error={
            showEmailError
              ? "Revisa el correo: debe tener la forma nombre@dominio.com"
              : undefined
          }
          value={contactEmail}
          onChange={(event) => {
            setEmailTouched(true);
            setAnswer("contactEmail", event.target.value);
          }}
        />
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-normal text-text-secondary">
          <span className="relative mt-0.5 flex size-5 flex-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setAnswer("consent", event.target.checked)}
              className="peer size-5 cursor-pointer appearance-none rounded-md border border-white/60 bg-black transition-colors"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden items-center justify-center text-signal peer-checked:flex"
            >
              <CheckIcon size={14} />
            </span>
          </span>
          <span>
            Acepto el{" "}
            <Link
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              aviso de privacidad
            </Link>{" "}
            y que Solvyn Solutions me contacte sobre esta propuesta.
          </span>
        </label>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-[13px] leading-normal text-text-secondary">
        <span aria-hidden="true" className="flex-none text-white">
          <LockIcon size={18} />
        </span>
        Tus datos no se comparten con terceros ni se usan para generar la
        propuesta.
      </div>
    </StepSection>
  );
}
