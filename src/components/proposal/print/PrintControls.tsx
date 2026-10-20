"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// Opens the browser print dialog once fonts and images are ready, so the logo and text are in the PDF.
export function PrintControls({ proposalPath }: { proposalPath: string }) {
  const hasAutoPrinted = useRef(false);

  useEffect(() => {
    if (hasAutoPrinted.current) return;
    hasAutoPrinted.current = true;
    const images = Array.from(document.images);
    Promise.all([document.fonts.ready, ...images.map((image) => image.decode().catch(() => undefined))]).then(() => window.print());
  }, []);

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm print:hidden">
      <Link href={proposalPath} className="flex min-h-11 items-center text-neutral-700 underline">
        Volver a la propuesta
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="min-h-11 cursor-pointer rounded-[10px] bg-black px-5 font-semibold text-white"
      >
        Imprimir o guardar como PDF
      </button>
    </div>
  );
}
