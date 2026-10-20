"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { Button } from "@/src/components/ui/Button";
import { MEETING_DURATION_MINUTES, SCHEDULE_ROUTE } from "@/src/config/scheduling";
import { useCompletedFlowGuard } from "@/src/hooks/useCompletedFlowGuard";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { formatMeetingLabel } from "@/src/lib/scheduling";

const NEXT_STEPS = [
  "Reviso tu propuesta y preparo preguntas para la reunión.",
  "Un día antes te llega un recordatorio por WhatsApp.",
  "En la llamada afinamos alcance y te envío la propuesta final.",
];

export function ConfirmationScreen() {
  const router = useRouter();
  const isReady = useCompletedFlowGuard();
  const contactName = useConfiguratorStore((state) => state.contactName);
  const contactEmail = useConfiguratorStore((state) => state.contactEmail);
  const meetingDate = useConfiguratorStore((state) => state.meetingDate);
  const meetingTime = useConfiguratorStore((state) => state.meetingTime);
  const hasMeeting = meetingDate !== null && meetingTime !== null;

  // Opened without choosing a meeting: go pick one.
  useEffect(() => {
    if (isReady && !hasMeeting) router.replace(SCHEDULE_ROUTE);
  }, [isReady, hasMeeting, router]);

  // TODO(Phase 5): send the proposal and the calendar invitation by email (Resend / Cal.com) before saying so,
  // and clear the saved answers once the lead is stored.
  return (
    <ConfiguratorShell>
      <main id="contenido" className="step-in mx-auto flex max-w-[680px] flex-col items-center gap-7 px-6 pt-[88px] pb-[120px] text-center">
        {isReady && hasMeeting && (
          <>
            <div className="flex size-[72px] items-center justify-center rounded-[20px] bg-signal shadow-[0_0_60px_var(--signal-glow)]">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </div>
            <div className="flex flex-col gap-3.5">
              <h1 className="wide m-0 text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.08] font-semibold tracking-[-0.02em]">
                Listo, {contactName.trim().split(/\s+/)[0]}. Nos vemos pronto.
              </h1>
              <p className="m-0 text-[17px] leading-[1.6] text-text-secondary">
                Tu reunión de {MEETING_DURATION_MINUTES} minutos quedó agendada para el {formatMeetingLabel(meetingDate, meetingTime)}. Te envié la propuesta y la invitación a{" "}
                {contactEmail}.
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 rounded-2xl border border-white/12 p-6 text-left">
              <h2 className="semi m-0 text-[17px] font-semibold">Lo que sigue</h2>
              <ol className="m-0 flex list-none flex-col gap-4 p-0">
                {NEXT_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-3.5 text-[15px] leading-[1.55] text-text-secondary">
                    <span className="wide flex-none font-semibold text-heading">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <Button href="/" variant="secondary">
              Volver al inicio
            </Button>
          </>
        )}
      </main>
    </ConfiguratorShell>
  );
}
