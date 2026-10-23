"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { useSettings } from "@/src/components/settings/SettingsProvider";
import { Button } from "@/src/components/ui/Button";
import { CalendarIcon, CheckIcon, ChevronLeftIcon, ClockIcon, MailIcon, MapPinIcon, MessageIcon, MonitorIcon } from "@/src/components/ui/icons";
import { WhatsAppButton } from "@/src/components/ui/WhatsAppButton";
import { CAL_LINK, CONFIRMATION_ROUTE, MEETING_DURATION_MINUTES } from "@/src/config/scheduling";
import { SITE_URL } from "@/src/config/site";
import { useCompletedFlowGuard } from "@/src/hooks/useCompletedFlowGuard";
import { track } from "@/src/lib/analytics";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { getGeneratedProposalSlug, notifyMeetingBooked } from "@/src/lib/meetings/client";
import { getMeetingParts } from "@/src/lib/scheduling";
import { buildProposalWhatsAppMessage, getWhatsAppUrl } from "@/src/lib/whatsapp";
import { CalendarEmbed } from "./CalendarEmbed";

const DETAILS = [
  { icon: <ClockIcon size={18} />, title: `${MEETING_DURATION_MINUTES} minutos`, text: "Duración de la llamada" },
  { icon: <MonitorIcon size={18} />, title: "Videollamada", text: "En línea, sin traslados" },
  { icon: <MapPinIcon size={18} />, title: "Centro de México", text: "Horarios en tu zona" },
];
const PERKS = ["Sin costo", "Sin compromiso"];

function useWhatsAppUrl() {
  const { whatsapp } = useSettings();
  const name = useConfiguratorStore((state) => state.contactName);
  const business = useConfiguratorStore((state) => state.business);
  const slug = getGeneratedProposalSlug(useConfiguratorStore.getState());
  const proposalUrl = slug ? `${SITE_URL}/propuesta/${slug}` : null;
  return getWhatsAppUrl(whatsapp, buildProposalWhatsAppMessage({ name: name.trim(), business, proposalUrl }));
}

// Mounted only after the answers are restored on the client: the prefilled name and email and the saved proposal link live in the browser.
function MeetingForm() {
  const { email } = useSettings();
  const router = useRouter();
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);
  const contactName = useConfiguratorStore((state) => state.contactName);
  const contactEmail = useConfiguratorStore((state) => state.contactEmail);
  const whatsAppUrl = useWhatsAppUrl();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(!CAL_LINK);

  const handleBooked = useCallback(
    (startTime: string) => {
      const { date, time } = getMeetingParts(new Date(startTime));
      setAnswer("meetingDate", date);
      setAnswer("meetingTime", time);
      track("meeting_booked");
      void notifyMeetingBooked(useConfiguratorStore.getState(), startTime);
      router.push(CONFIRMATION_ROUTE);
    },
    [router, setAnswer],
  );
  const handleReady = useCallback(() => setIsLoaded(true), []);
  const handleUnavailable = useCallback(() => setIsUnavailable(true), []);

  return (
    <>
      <div className="flex flex-none flex-col items-center gap-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-text-secondary">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          Último paso
        </span>
        <h1 className="m-0 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">Elige un horario</h1>
        <p className="m-0 max-w-[560px] text-[15px] lg:[@media(max-height:760px)]:hidden leading-[1.6] text-text-secondary text-pretty">
          Videollamada de {MEETING_DURATION_MINUTES} minutos para revisar tu propuesta juntos.
        </p>
      </div>

      {isUnavailable ? (
        <div role="status" className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-5 rounded-2xl border border-white/15 bg-linear-to-b from-white/[0.04] to-transparent p-8 text-center">
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-white">
            <CalendarIcon size={22} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 text-lg font-semibold">No pudimos cargar el calendario</h2>
            <p className="m-0 text-[15px] leading-[1.6] text-text-secondary">Escríbenos y agendamos la reunión por ahí. También puedes mandarnos un correo.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <WhatsAppButton href={whatsAppUrl}>
              <MessageIcon size={16} />
              Hablar por WhatsApp
            </WhatsAppButton>
            <Button variant="secondary" href={`mailto:${email}`}>
              <MailIcon size={16} />
              {email}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-2xl border border-white/12 bg-linear-to-b from-white/[0.04] to-transparent p-5">
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {DETAILS.map(({ icon, title, text }) => (
                <li key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3">
                  <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-white">
                    {icon}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold">{title}</span>
                    <span className="text-[13px] text-label">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-[13px] text-text-secondary">
              {PERKS.map((perk) => (
                <li key={perk} className="inline-flex items-center gap-1.5">
                  <span className="text-signal">
                    <CheckIcon size={14} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-4">
              <WhatsAppButton variant="secondary" href={whatsAppUrl} className="w-full">
                <MessageIcon size={16} />
                Hablar por WhatsApp
              </WhatsAppButton>
              <Button variant="secondary" href="/configurar/propuesta" className="w-full">
                <ChevronLeftIcon size={16} />
                Volver a la propuesta
              </Button>
            </div>
          </aside>
          <CalendarEmbed
            name={contactName.trim()}
            email={contactEmail.trim()}
            isLoaded={isLoaded}
            onBooked={handleBooked}
            onReady={handleReady}
            onUnavailable={handleUnavailable}
          />
        </div>
      )}
    </>
  );
}

export function SchedulingScreen() {
  const isReady = useCompletedFlowGuard();

  return (
    <ConfiguratorShell>
      <main id="contenido" className="step-in flex w-full flex-col gap-5 px-4 pt-8 pb-16 sm:px-8 lg:h-[calc(100dvh-4rem)] lg:px-12 lg:py-4">
        {isReady && <MeetingForm />}
      </main>
    </ConfiguratorShell>
  );
}
