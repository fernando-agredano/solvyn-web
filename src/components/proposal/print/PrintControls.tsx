"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { DownloadIcon, ChevronLeftIcon } from "@/src/components/ui/icons";
import { track } from "@/src/lib/analytics";

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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] print:hidden">
      <Link
        href={proposalPath}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-neutral-300 px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
      >
        <ChevronLeftIcon size={16} />
        Volver a la propuesta
      </Link>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            track("pdf_downloaded");
            window.print();
          }}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
        >
          <DownloadIcon size={16} />
          Imprimir o guardar como PDF
        </button>
      </div>
    </div>
  );
}
