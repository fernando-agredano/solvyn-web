import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";
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
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 pb-3">
        <div className="flex max-w-[720px] flex-col gap-3">
          <span className="text-sm text-label">
            Propuesta preliminar para {businessName}, {dateFormatter.format(new Date())}
          </span>
          <h1 className="wide m-0 text-[clamp(2rem,4vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.025em]">{title}</h1>
          <p className="m-0 text-[17px] leading-[1.65] text-text-secondary">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" size="md" onClick={copyShareLink}>
            Compartir enlace
          </Button>
          <Button variant="secondary" size="md" onClick={openPrintableVersion}>
            Descargar PDF
          </Button>
        </div>
      </div>
      {notice && (
        <div role="status" className="step-in flex items-center gap-2.5 self-start rounded-[10px] bg-white px-4 py-3 text-sm font-medium text-black">
          {notice}
        </div>
      )}
    </>
  );
}
