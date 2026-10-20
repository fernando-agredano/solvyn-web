import { useState } from "react";
import { SegmentedControl } from "@/src/components/configurator/fields/SegmentedControl";
import {
  PREVIEW_ACCENTS,
  PREVIEW_DEVICES,
  PREVIEW_TEMPLATES,
  type PreviewAccent,
  type PreviewDevice,
} from "@/src/config/preview-templates";
import type { ProposalFacts } from "@/src/lib/proposal";
import { SectionCard } from "../SectionCard";
import { DesktopPreview } from "./DesktopPreview";
import { MobilePreview } from "./MobilePreview";

const DEFAULT_URL = "tunegocio";

// "Clínica Vitalia" -> "clinicavitalia.com"
const buildPreviewUrl = (businessName: string) =>
  `${businessName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "") || DEFAULT_URL}.com`;

function AccentPicker({ value, onChange }: { value: PreviewAccent; onChange: (accent: PreviewAccent) => void }) {
  return (
    <div role="group" aria-label="Color de marca" className="flex items-center">
      {PREVIEW_ACCENTS.map((accent) => (
        // 44px touch target around the 30px swatch of the design.
        <button
          key={accent.id}
          type="button"
          aria-label={`Color ${accent.name.toLowerCase()}`}
          aria-pressed={accent.id === value.id}
          onClick={() => onChange(accent)}
          className="flex size-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <span
            aria-hidden="true"
            className={`size-[30px] rounded-full border-2 shadow-[inset_0_0_0_3px_#000000] ${accent.id === value.id ? "border-white" : "border-transparent"}`}
            style={{ background: accent.color }}
          />
        </button>
      ))}
    </div>
  );
}

export function SolutionPreview({ facts }: { facts: ProposalFacts }) {
  const [accent, setAccent] = useState<PreviewAccent>(PREVIEW_ACCENTS[0]);
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const template = PREVIEW_TEMPLATES[facts.kind];

  return (
    <SectionCard
      id="preview-heading"
      title="Vista previa"
      description="Así podría verse tu solución. Prueba con el color de tu marca."
      actions={
        <div className="flex flex-wrap items-center gap-4">
          <AccentPicker value={accent} onChange={setAccent} />
          <SegmentedControl compact label="Dispositivo" options={PREVIEW_DEVICES} value={device} onChange={setDevice} />
        </div>
      }
    >
      {/* Sample screen, not real content: described once instead of read element by element. */}
      <div
        role="img"
        aria-label={`Vista previa de ejemplo de ${facts.businessName} en ${device === "desktop" ? "computadora" : "celular"}`}
        className="flex justify-center overflow-x-auto rounded-2xl border border-white/6 bg-[radial-gradient(ellipse_60%_70%_at_50%_40%,rgba(255,255,255,0.07),rgba(255,255,255,0)_70%),#050505] px-5 py-10"
      >
        {device === "desktop" ? (
          <DesktopPreview template={template} accent={accent} businessName={facts.businessName} url={buildPreviewUrl(facts.businessName)} />
        ) : (
          <MobilePreview template={template} accent={accent} businessName={facts.businessName} />
        )}
      </div>
    </SectionCard>
  );
}
