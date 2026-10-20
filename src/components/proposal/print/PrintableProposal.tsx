import Image from "next/image";
import type { ReactNode } from "react";
import { ARCH_NODES, TECHNOLOGIES } from "@/src/config/proposal";
import { MEETING_TIME_ZONE } from "@/src/config/scheduling";
import { SITE } from "@/src/config/site";
import { formatMXN } from "@/src/lib/pricing";
import type { ProposalFacts } from "@/src/lib/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { PrintControls } from "./PrintControls";

// A4 page with margins, and a white page even though the site is dark. Removed with the page.
const PAGE_CSS = "@page { size: A4; margin: 16mm 14mm; } body { background: #fff; color: #000; }";

const FIXED_ASSUMPTIONS = [
  "Los montos están en pesos mexicanos (MXN) y no incluyen IVA.",
  "La inversión es un rango estimado a partir de las horas de cada módulo; el precio final se confirma al definir el alcance.",
];

interface PrintableProposalProps {
  facts: ProposalFacts;
  copy: ProposalCopy;
  risks: string[];
  proposalPath: string;
  date: Date;
}

// Short sections stay on one page; long ones may split, and their items avoid breaking instead.
function PrintSection({ title, keepTogether = true, children }: { title: string; keepTogether?: boolean; children: ReactNode }) {
  return (
    <section className={`pt-7 ${keepTogether ? "break-inside-avoid" : ""}`}>
      <h2 className="semi m-0 mb-3 border-b border-neutral-300 pb-2 text-lg font-semibold break-after-avoid">{title}</h2>
      {children}
    </section>
  );
}

const List = ({ children }: { children: ReactNode }) => <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[14px] leading-[1.5]">{children}</ul>;

function Indicator({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-neutral-300 p-3">
      <span className="text-xs text-neutral-600">{label}</span>
      <span className="wide text-[15px] font-semibold whitespace-nowrap tabular-nums">{value}</span>
    </div>
  );
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function PrintableProposal({ facts, copy, risks, proposalPath, date }: PrintableProposalProps) {
  const activeModules = facts.modules.filter((module) => module.active);
  const dateLabel = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeZone: MEETING_TIME_ZONE }).format(date);
  const investmentLabel = `${formatMXN(facts.investment.min)} – ${formatMXN(facts.investment.max)}`;

  return (
    <div className="min-h-screen bg-white text-black">
      <style>{PAGE_CSS}</style>
      <main id="contenido" className="mx-auto max-w-[800px] px-6 py-10 print:max-w-none print:p-0">
        <PrintControls proposalPath={proposalPath} />

        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Image src="/brand/solvyn-logo-dark.png" alt={SITE.name} width={1100} height={262} priority className="block h-7 w-auto" />
            <span className="text-sm text-neutral-600">{dateLabel}</span>
          </div>
          <p className="m-0 text-sm text-neutral-600">Propuesta preliminar</p>
          <h1 className="wide m-0 text-[28px] leading-[1.1] font-semibold tracking-[-0.02em]">{copy.title}</h1>
          <p className="m-0 text-[15px] leading-[1.6] text-neutral-800">{copy.summary}</p>
        </header>

        <PrintSection title="Indicadores">
          <div className="grid grid-cols-[2fr_1.3fr_1fr_1fr] gap-3">
            <Indicator label="Inversión estimada" value={investmentLabel} />
            <Indicator label="Tiempo de desarrollo" value={`${facts.weeks.min}–${facts.weeks.max} semanas`} />
            <Indicator label="Módulos" value={`${facts.activeModuleCount} · ${facts.totalHours} h`} />
            <Indicator label="Complejidad" value={capitalize(facts.complexity)} />
          </div>
        </PrintSection>

        <PrintSection title="Módulos y horas" keepTogether={false}>
          <List>
            {activeModules.map((module) => (
              <li key={module.id} className="flex justify-between gap-4 break-inside-avoid border-b border-neutral-200 pb-2">
                <span>
                  <strong className="font-semibold">{module.name}.</strong> {module.description}
                </span>
                <span className="flex-none tabular-nums text-neutral-700">~{module.hours} h</span>
              </li>
            ))}
          </List>
        </PrintSection>

        <PrintSection title="Arquitectura" keepTogether={false}>
          <div className="flex flex-col gap-4">
            {facts.architecture.columns.map((column) => (
              <div key={column.id} className="break-inside-avoid">
                <h3 className="m-0 mb-1.5 text-sm font-semibold">{column.title}</h3>
                <List>
                  {column.nodeIds.map((nodeId) => (
                    <li key={nodeId}>
                      <strong className="font-semibold">{ARCH_NODES[nodeId].label}.</strong> {copy.architectureNotes[nodeId]}
                    </li>
                  ))}
                </List>
              </div>
            ))}
            {facts.architecture.externalNodeIds.length > 0 && (
              <div className="break-inside-avoid">
                <h3 className="m-0 mb-1.5 text-sm font-semibold">Servicios externos</h3>
                <List>
                  {facts.architecture.externalNodeIds.map((nodeId) => (
                    <li key={nodeId}>
                      <strong className="font-semibold">{ARCH_NODES[nodeId].label}.</strong> {copy.architectureNotes[nodeId]}
                    </li>
                  ))}
                </List>
              </div>
            )}
          </div>
        </PrintSection>

        <PrintSection title="Fases y entregables">
          <ol className="m-0 flex list-none flex-col gap-3 p-0 text-[14px] leading-[1.5]">
            {facts.phases.map((phase, index) => (
              <li key={phase.name} className="break-inside-avoid">
                <div className="flex justify-between gap-4 font-semibold">
                  <span>
                    {index + 1}. {phase.name}
                  </span>
                  <span className="tabular-nums">
                    {phase.weeks} {phase.weeks === 1 ? "semana" : "semanas"}
                  </span>
                </div>
                <span className="text-neutral-700">Entregable: {phase.deliverable}</span>
              </li>
            ))}
          </ol>
        </PrintSection>

        <PrintSection title="Tecnologías">
          <List>
            {facts.technologies.map((id) => (
              <li key={id}>
                <strong className="font-semibold">{TECHNOLOGIES[id].name}.</strong> {copy.technologyNotes[id]}
              </li>
            ))}
          </List>
        </PrintSection>

        <PrintSection title="Inversión">
          <p className="m-0 text-[15px] leading-[1.6]">
            <strong className="wide text-xl font-semibold">{investmentLabel} MXN</strong>
            <br />
            Antes de IVA, para {facts.totalHours} horas estimadas y entre {facts.weeks.min} y {facts.weeks.max} semanas de desarrollo.
          </p>
        </PrintSection>

        <PrintSection title="Supuestos">
          <List>
            {[...FIXED_ASSUMPTIONS, ...risks].map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </List>
        </PrintSection>

        <footer className="mt-10 border-t border-neutral-300 pt-4 text-center text-sm text-neutral-700">
          Propuesta preliminar, se confirma en reunión
        </footer>
      </main>
    </div>
  );
}
