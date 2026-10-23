"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/Button";
import { CalendarIcon, CheckIcon } from "@/src/components/ui/icons";

const POINTS = [
  "Tus respuestas y tu propuesta ya están guardadas.",
  "Solo falta confirmar tu contacto y el aviso de privacidad.",
  "Al terminar te llevamos de vuelta a la agenda.",
];

// Native <dialog>: the browser traps focus, closes on Escape and restores focus when it closes.
export function ReturnNoticeModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="return-notice-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-[#0A0A0A] p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-5 p-6 text-center sm:p-7">
        <span aria-hidden="true" className="relative flex size-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-white">
          <CalendarIcon size={22} />
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-[#0A0A0A] bg-signal" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 id="return-notice-title" className="m-0 text-lg font-semibold tracking-[-0.01em] text-balance">
            Confirma tus datos para agendar
          </h2>
          <p className="m-0 text-sm leading-[1.6] text-text-secondary text-pretty">
            Por tu privacidad, tus datos de contacto no se guardan en el navegador. Los necesitamos de nuevo para reservar tu reunión.
          </p>
        </div>
        <ul className="m-0 flex w-full list-none flex-col gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-[13px] leading-normal text-text-secondary">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="mt-px flex size-[18px] flex-none items-center justify-center rounded-full border border-signal/40 bg-signal/15 text-signal">
                <CheckIcon size={11} />
              </span>
              {point}
            </li>
          ))}
        </ul>
        <Button onClick={onClose} withArrow>
          Entendido
        </Button>
      </div>
    </dialog>
  );
}
