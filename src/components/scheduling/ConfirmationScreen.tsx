"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { Button } from "@/src/components/ui/Button";
import { CalendarIcon, CheckIcon, ClockIcon, FileCheckIcon, MailIcon, MessageIcon, MonitorIcon } from "@/src/components/ui/icons";
import { MEETING_DURATION_MINUTES, SCHEDULE_ROUTE } from "@/src/config/scheduling";
import { useCompletedFlowGuard } from "@/src/hooks/useCompletedFlowGuard";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { formatMeetingLabel } from "@/src/lib/scheduling";

const NEXT_STEPS = [
  { icon: <FileCheckIcon size={18} />, text: "Reviso tu propuesta y preparo preguntas para la reunión." },
  { icon: <MessageIcon size={18} />, text: "Un día antes te llega un recordatorio por WhatsApp." },
  { icon: <MonitorIcon size={18} />, text: "En la llamada afinamos alcance y te envío la propuesta final." },
];

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-white">
      {children}
    </span>
  );
}

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

  // The proposal email goes out when the lead is created and Cal.com sends the invitation.
  // TODO: clear the saved answers once the visitor leaves this screen (store.reset() would trip the flow guard here).
  return (
    <ConfiguratorShell>
      <main id="contenido" className="step-in mx-auto flex w-full max-w-[920px] flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:px-8 lg:min-h-[calc(100dvh-4rem)]">
        {isReady && hasMeeting && (
          <>
            <div className="flex flex-col items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-2xl border border-signal/40 bg-signal/15 text-signal ring-8 ring-signal/[0.06]"
              >
                <CheckIcon size={26} />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="m-0 text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
                  Listo, {contactName.trim().split(/\s+/)[0]}. Nos vemos pronto.
                </h1>
                <p className="m-0 text-[15px] leading-[1.6] text-text-secondary text-pretty">Tu reunión quedó agendada. Aquí está el resumen.</p>
              </div>
            </div>

            <ul className="m-0 grid w-full list-none grid-cols-3 gap-3 p-0 text-left max-[760px]:grid-cols-1">
              <li className="flex items-center gap-3 rounded-2xl border border-white/12 bg-linear-to-b from-white/[0.04] to-transparent p-4">
                <IconBox>
                  <CalendarIcon size={18} />
                </IconBox>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-label">Fecha y hora</span>
                  <span className="text-sm font-semibold">{formatMeetingLabel(meetingDate, meetingTime)}</span>
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-white/12 bg-linear-to-b from-white/[0.04] to-transparent p-4">
                <IconBox>
                  <ClockIcon size={18} />
                </IconBox>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-label">Duración</span>
                  <span className="text-sm font-semibold">{MEETING_DURATION_MINUTES} minutos, videollamada</span>
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-white/12 bg-linear-to-b from-white/[0.04] to-transparent p-4">
                <IconBox>
                  <MailIcon size={18} />
                </IconBox>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-label">Propuesta e invitación a</span>
                  <span className="truncate text-sm font-semibold">{contactEmail}</span>
                </span>
              </li>
            </ul>

            <section aria-labelledby="next-steps-heading" className="flex w-full flex-col gap-4 rounded-2xl border border-white/12 bg-linear-to-b from-white/[0.03] to-transparent p-5">
              <h2 id="next-steps-heading" className="m-0 text-base font-semibold">
                Lo que sigue
              </h2>
              <ol className="m-0 grid list-none grid-cols-3 gap-3 p-0 text-left max-[760px]:grid-cols-1">
                {NEXT_STEPS.map((step, index) => (
                  <li key={step.text} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <span className="flex items-center gap-2.5">
                      <IconBox>{step.icon}</IconBox>
                      <span className="rounded-full border border-white/12 px-2 py-0.5 text-[11px] text-text-secondary tabular-nums">Paso {index + 1}</span>
                    </span>
                    <span className="text-[13px] leading-[1.55] text-text-secondary">{step.text}</span>
                  </li>
                ))}
              </ol>
            </section>

            <Button href="/" variant="secondary">
              Volver al inicio
            </Button>
          </>
        )}
      </main>
    </ConfiguratorShell>
  );
}
