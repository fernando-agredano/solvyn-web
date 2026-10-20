"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { Button } from "@/src/components/ui/Button";
import { CAL_LINK, CONFIRMATION_ROUTE, MEETING_DURATION_MINUTES } from "@/src/config/scheduling";
import { SITE, SITE_URL } from "@/src/config/site";
import { useCompletedFlowGuard } from "@/src/hooks/useCompletedFlowGuard";
import { track } from "@/src/lib/analytics";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { getGeneratedProposalSlug, notifyMeetingBooked } from "@/src/lib/meetings/client";
import { getMeetingParts } from "@/src/lib/scheduling";
import { buildProposalWhatsAppMessage, getWhatsAppUrl } from "@/src/lib/whatsapp";
import { CalendarEmbed } from "./CalendarEmbed";

function useWhatsAppUrl() {
  const name = useConfiguratorStore((state) => state.contactName);
  const business = useConfiguratorStore((state) => state.business);
  const slug = getGeneratedProposalSlug(useConfiguratorStore.getState());
  const proposalUrl = slug ? `${SITE_URL}/propuesta/${slug}` : null;
  return getWhatsAppUrl(SITE.whatsapp, buildProposalWhatsAppMessage({ name: name.trim(), business, proposalUrl }));
}

// Mounted only after the answers are restored on the client: the prefilled name and email and the saved proposal link live in the browser.
function MeetingForm() {
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
      <div className="flex flex-col gap-3">
        <Link href="/configurar/propuesta" className="flex min-h-11 items-center self-start text-[15px] text-text-secondary no-underline">
          Volver a la propuesta
        </Link>
        <h1 className="wide m-0 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.02em]">Elige un horario</h1>
        <p className="m-0 text-[17px] leading-[1.6] text-text-secondary">
          Videollamada de {MEETING_DURATION_MINUTES} minutos para revisar tu propuesta. Hora del centro de México.
        </p>
      </div>

      {isUnavailable ? (
        <div role="status" className="flex flex-col gap-4 rounded-2xl border border-white/30 p-6">
          <h2 className="semi m-0 text-[17px] font-semibold">No pudimos cargar el calendario</h2>
          <p className="m-0 text-[15px] leading-[1.6] text-text-secondary">
            Escríbenos y agendamos la reunión por ahí. También puedes mandarnos un correo.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={whatsAppUrl} onClick={() => track("whatsapp_clicked")}>Hablar por WhatsApp</Button>
            <a href={`mailto:${SITE.email}`} className="flex min-h-11 items-center text-[15px] text-foreground underline">
              {SITE.email}
            </a>
          </div>
        </div>
      ) : (
        <>
          <CalendarEmbed
            name={contactName.trim()}
            email={contactEmail.trim()}
            isLoaded={isLoaded}
            onBooked={handleBooked}
            onReady={handleReady}
            onUnavailable={handleUnavailable}
          />
          <Button
            variant="secondary"
            href={whatsAppUrl}
            onClick={() => track("whatsapp_clicked")}
            className="self-start"
          >
            Prefiero hablar por WhatsApp
          </Button>
        </>
      )}
    </>
  );
}

export function SchedulingScreen() {
  const isReady = useCompletedFlowGuard();

  return (
    <ConfiguratorShell>
      <main id="contenido" className="step-in mx-auto flex max-w-[760px] flex-col gap-8 px-6 pt-16 pb-[120px]">
        {isReady && <MeetingForm />}
      </main>
    </ConfiguratorShell>
  );
}
