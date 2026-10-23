import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { CheckIcon, DownloadIcon, ShareIcon } from "@/src/components/ui/icons";
import { track } from "@/src/lib/analytics";

interface ProposalHeaderProps {
  businessName: string;
  title: string;
  summary: string;
}

const NOTICE_DURATION_MS = 2600;
const dateFormatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" });

export function ProposalHeader({ businessName, title, summary }: ProposalHeaderProps) {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}`);
      track("proposal_shared");
      setNotice("Enlace copiado");
    } catch {
      setNotice("No pudimos copiar el enlace. Cópialo desde la barra del navegador.");
    }
  };
  // The printable page opens in a new tab and asks the browser to print (save as PDF).
  const openPrintableVersion = () => window.open(`${window.location.pathname}/imprimir`, "_blank", "noopener");

  return (
    <header className="flex flex-col items-center gap-4 pb-2 text-center">
      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-text-secondary">
        <span className="size-1.5 flex-none rounded-full bg-signal" aria-hidden="true" />
        <span className="truncate">
          Propuesta preliminar para {businessName} · {dateFormatter.format(new Date())}
        </span>
      </span>
      <h1 className="m-0 max-w-[820px] text-[clamp(1.5rem,3vw,2.35rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">{title}</h1>
      <p className="m-0 max-w-[700px] text-[15px] leading-[1.65] text-text-secondary text-pretty">{summary}</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <Button variant="secondary" size="md" onClick={copyShareLink}>
          <ShareIcon size={16} />
          Compartir enlace
        </Button>
        <Button variant="secondary" size="md" onClick={openPrintableVersion}>
          <DownloadIcon size={16} />
          Descargar PDF
        </Button>
      </div>
      {notice && (
        <div role="status" className="step-in inline-flex items-center gap-2 rounded-[10px] border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm text-white">
          <span className="text-signal">
            <CheckIcon size={15} />
          </span>
          {notice}
        </div>
      )}
    </header>
  );
}
