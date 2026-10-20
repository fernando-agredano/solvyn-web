"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfiguratorShell } from "@/src/components/configurator/ConfiguratorShell";
import { Button } from "@/src/components/ui/Button";
import {
  CONFIRMATION_ROUTE,
  MEETING_DURATION_MINUTES,
  MEETING_SLOTS,
  type MeetingSlot,
} from "@/src/config/scheduling";
import { useCompletedFlowGuard } from "@/src/hooks/useCompletedFlowGuard";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { notifyMeetingBooked } from "@/src/lib/meetings/client";
import { getNextBusinessDays } from "@/src/lib/scheduling";

const CHOICE_BASE = "cursor-pointer border transition duration-200 ease-[ease]";
const choiceClasses = (selected: boolean) =>
  `${CHOICE_BASE} ${selected ? "border-white bg-white text-black" : "border-white/14 bg-white/2 text-foreground hover:border-white/40"}`;

// Mounted only after the answers are restored on the client: "today" decides which days are offered,
// so it must not be computed while the page is prerendered.
function MeetingForm() {
  const router = useRouter();
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<MeetingSlot | null>(null);
  const [days] = useState(() => getNextBusinessDays());

  const confirm = () => {
    if (!selectedDate || !selectedTime) return;
    // TODO(Phase 5): create the booking in Cal.com. The meeting is saved on the lead and the owner is emailed by /api/meeting.
    // For now the choice only lives in the store so the confirmation screen can show it.
    setAnswer("meetingDate", selectedDate);
    setAnswer("meetingTime", selectedTime);
    void notifyMeetingBooked(useConfiguratorStore.getState(), selectedDate, selectedTime);
    router.push(CONFIRMATION_ROUTE);
  };

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

      <fieldset className="m-0 flex min-w-0 flex-col gap-3.5 border-0 p-0">
        <legend className="semi mb-3.5 p-0 text-[17px] font-semibold">Día</legend>
        <div className="grid grid-cols-5 gap-2.5 max-[620px]:grid-cols-3">
          {/* TODO(Phase 5): disable the days and slots that Cal.com reports as taken. */}
          {days.map((day) => (
            <button
              key={day.iso}
              type="button"
              aria-pressed={day.iso === selectedDate}
              onClick={() => setSelectedDate(day.iso)}
              className={`flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-[14px] ${choiceClasses(day.iso === selectedDate)}`}
            >
              <span className="text-[13px] opacity-75">{day.weekday}</span>
              <span className="wide text-[22px] font-semibold">{day.day}</span>
              <span className="text-xs opacity-75">{day.month}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 flex min-w-0 flex-col gap-3.5 border-0 p-0">
        <legend className="semi mb-3.5 p-0 text-[17px] font-semibold">Hora</legend>
        <div className="flex flex-wrap gap-2.5">
          {MEETING_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              aria-pressed={slot === selectedTime}
              onClick={() => setSelectedTime(slot)}
              className={`min-h-12 min-w-24 rounded-xl px-[18px] text-[15px] font-semibold tabular-nums ${choiceClasses(slot === selectedTime)}`}
            >
              {slot}
            </button>
          ))}
        </div>
      </fieldset>

      <Button className="self-start" onClick={confirm} disabled={!selectedDate || !selectedTime}>
        Confirmar reunión
      </Button>
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
