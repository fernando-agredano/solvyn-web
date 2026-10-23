import Image from "next/image";
import type { ReactNode } from "react";
import {
  ARCH_NODES,
  TECHNOLOGIES,
  type ArchNodeId,
} from "@/src/config/proposal";
import { MEETING_TIME_ZONE } from "@/src/config/scheduling";
import { SITE } from "@/src/config/site";
import { formatMXN } from "@/src/lib/pricing";
import type { ProposalFacts } from "@/src/lib/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { PrintControls } from "./PrintControls";

// A4 page with margins, and a white page even though the site is dark. Backgrounds are forced so the dark
// band and the tinted cards survive "save as PDF". Removed with the page.
const PAGE_CSS =
  "@page { size: A4; margin: 0; } body { background: #fff; color: #0a0a0a; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }";

const FIXED_ASSUMPTIONS = [
  "Los montos están en pesos mexicanos (MXN) y no incluyen IVA.",
  "La inversión es un rango estimado a partir de las horas de cada módulo; el precio final se confirma al definir el alcance.",
];

const KIND_LABELS = {
  core: "Esencial",
  integration: "Integración",
  extra: "Sugerido",
} as const;

interface PrintableProposalProps {
  facts: ProposalFacts;
  copy: ProposalCopy;
  risks: string[];
  proposalPath: string;
  date: Date;
}

const GreenDot = () => (
  <span
    aria-hidden="true"
    className="inline-block size-1.5 flex-none rounded-full bg-[#2FB383]"
  />
);

const USER_LABELS = { team: "Tu equipo", clients: "Tus clientes", suppliers: "Proveedores y socios" } as const;

function MapNode({ label }: { label: string }) {
  return (
    <div className="flex min-h-8 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] leading-tight font-medium">
      <GreenDot />
      <span className="min-w-0 flex-1">{label}</span>
    </div>
  );
}

function MapArrow() {
  return (
    <svg width="22" height="12" viewBox="0 0 34 12" fill="none" aria-hidden="true" className="flex-none self-center max-[640px]:rotate-90">
      <path d="M0 6 H28" stroke="#a3a3a3" strokeWidth="1.4" />
      <path d="M26 2 L32 6 L26 10" stroke="#a3a3a3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Short sections stay on one page; long ones may split, and their items avoid breaking instead.
function PrintSection({
  number,
  title,
  keepTogether = true,
  children,
}: {
  number: string;
  title: string;
  keepTogether?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`pt-6 ${keepTogether ? "break-inside-avoid" : ""}`}>
      <div className="mb-3 flex items-center gap-2.5 break-after-avoid">
        <span className="flex h-6 min-w-6 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 px-1.5 text-[11px] font-semibold text-neutral-800 tabular-nums">
          {number}
        </span>
        <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
          {title}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
      </div>
      {children}
    </section>
  );
}

function InfoCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <span className="text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">
        {label}
      </span>
      <div className="text-[13px] leading-[1.45]">{children}</div>
    </div>
  );
}

function Indicator({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-neutral-200 px-3.5 py-3">
      <span className="text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">
        {label}
      </span>
      <span className="text-[15px] font-semibold sm:whitespace-nowrap tabular-nums">
        {value}
      </span>
      {note && <span className="text-[11px] text-neutral-500">{note}</span>}
    </div>
  );
}

const TH =
  "px-3 py-2 text-left text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase";

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export function PrintableProposal({
  facts,
  copy,
  risks,
  proposalPath,
  date,
}: PrintableProposalProps) {
  const activeModules = facts.modules.filter((module) => module.active);
  const dateLabel = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeZone: MEETING_TIME_ZONE,
  }).format(date);
  const investmentLabel = `${formatMXN(facts.investment.min)} – ${formatMXN(facts.investment.max)}`;
  const durationLabel = `${facts.weeks.min}–${facts.weeks.max} semanas`;
  const architectureGroups: { title: string; nodeIds: ArchNodeId[] }[] = [
    ...facts.architecture.columns.map((column) => ({
      title: column.title,
      nodeIds: column.nodeIds,
    })),
    ...(facts.architecture.externalNodeIds.length > 0
      ? [
          {
            title: "Servicios externos",
            nodeIds: facts.architecture.externalNodeIds,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <style>{PAGE_CSS}</style>
      <main
        id="contenido"
        className="mx-auto max-w-[800px] px-6 py-10 print:max-w-none print:px-[12mm] print:py-0"
      >
        <table className="w-full border-collapse">
          <thead className="hidden print:table-header-group">
            <tr>
              <td className="h-[12mm] p-0" />
            </tr>
          </thead>
          <tfoot className="hidden print:table-footer-group">
            <tr>
              <td className="h-[14mm] p-0" />
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td className="p-0 align-top">
        <PrintControls proposalPath={proposalPath} />

        <header className="overflow-hidden rounded-2xl border border-neutral-200 bg-linear-to-b from-neutral-50 to-white">
          <div className="flex items-center justify-between gap-4 px-7 py-5">
            <Image
              src="/brand/solvyn-logo-dark.png"
              alt={SITE.name}
              width={1100}
              height={262}
              priority
              className="block h-7 w-auto"
            />
            <div className="flex flex-col items-end gap-0.5 text-right">
              <span className="text-[10px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">
                Propuesta preliminar
              </span>
              <span className="text-[13px]">{dateLabel}</span>
            </div>
          </div>
          <div aria-hidden="true" className="h-[3px] bg-[#46D19A]" />
        </header>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoCard label="Preparada para">
            <strong className="text-[15px] font-semibold">
              {facts.businessName}
            </strong>
            {facts.industryLabel && (
              <div className="text-neutral-600">{facts.industryLabel}</div>
            )}
          </InfoCard>
          <InfoCard label="Preparada por">
            <strong className="text-[15px] font-semibold">{SITE.name}</strong>
            <div className="text-neutral-600">Software a medida</div>
          </InfoCard>
        </div>

        <section className="pt-6">
          <h1 className="m-0 text-[26px] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
            {copy.title}
          </h1>
          {facts.goalNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {facts.goalNames.map((goal) => (
                <span
                  key={goal}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-2.5 py-1 text-[11px] text-neutral-700"
                >
                  <GreenDot />
                  {goal}
                </span>
              ))}
            </div>
          )}
          <p className="m-0 mt-3 text-[13px] leading-[1.65] text-neutral-700">
            {copy.summary}
          </p>
        </section>

        <PrintSection number="01" title="Resumen de la inversión">
          <div className="grid grid-cols-[1.8fr_1.2fr_1fr_1fr] gap-2.5 max-[640px]:grid-cols-2">
            <Indicator
              label="Inversión estimada"
              value={investmentLabel}
              note="MXN, antes de IVA"
            />
            <Indicator label="Tiempo" value={durationLabel} />
            <Indicator
              label="Módulos"
              value={`${facts.activeModuleCount} · ${facts.totalHours} h`}
            />
            <Indicator
              label="Complejidad"
              value={capitalize(facts.complexity)}
            />
          </div>
        </PrintSection>

        <PrintSection number="02" title="Cómo funciona tu sistema">
          <div className="flex items-stretch gap-2.5 max-[640px]:flex-col">
            <div className="flex w-[22%] flex-none flex-col justify-center gap-2 max-[640px]:w-auto">
              <span className="text-center text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">Quién lo usa</span>
              {(facts.userTypes.length > 0 ? facts.userTypes : (["team"] as const)).map((user) => (
                <MapNode key={user} label={USER_LABELS[user]} />
              ))}
            </div>
            <MapArrow />
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-xl border border-neutral-300 bg-neutral-50 p-3">
              <div className="flex items-center justify-center gap-2 text-[13px] font-semibold">
                <GreenDot />
                Solución de {facts.businessName}
                <span className="rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-600">{activeModules.length} módulos</span>
              </div>
              <ul className="m-0 grid list-none grid-cols-2 gap-1.5 p-0">
                {activeModules.map((module) => (
                  <li key={module.id}>
                    <MapNode label={module.name} />
                  </li>
                ))}
              </ul>
            </div>
            <MapArrow />
            <div className="flex w-[22%] flex-none flex-col justify-center gap-2 max-[640px]:w-auto">
              <span className="text-center text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">Dónde se usa</span>
              <MapNode label="Navegador web" />
              {facts.includesMobile && <MapNode label="App móvil" />}
              {facts.integrationNames.length > 0 && (
                <>
                  <span className="mt-1 text-center text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">Se conecta con</span>
                  {facts.integrationNames.map((name) => (
                    <MapNode key={name} label={name} />
                  ))}
                </>
              )}
            </div>
          </div>
        </PrintSection>

        <PrintSection
          number="03"
          title="Detalle de módulos"
          keepTogether={false}
        >
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-neutral-100">
                <tr>
                  <th className={`${TH} w-8`}>#</th>
                  <th className={TH}>Módulo</th>
                  <th className={`${TH} w-24`}>Tipo</th>
                  <th className={`${TH} w-16 text-right`}>Horas</th>
                </tr>
              </thead>
              <tbody>
                {activeModules.map((module, index) => (
                  <tr
                    key={module.id}
                    className="break-inside-avoid border-t border-neutral-200 align-top"
                  >
                    <td className="px-3 py-2.5 text-neutral-500 tabular-nums">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[13px] font-semibold">
                        {module.name}
                      </div>
                      <div className="mt-0.5 leading-[1.5] text-neutral-600">
                        {module.description}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-neutral-700">
                      {KIND_LABELS[module.kind]}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                      {module.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-end break-inside-avoid">
            <div className="w-[300px] overflow-hidden rounded-xl border border-neutral-200">
              <div className="flex justify-between gap-4 px-4 py-2 text-[12px]">
                <span className="text-neutral-600">Horas totales</span>
                <span className="font-medium tabular-nums">
                  {facts.totalHours} h
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-neutral-200 px-4 py-2 text-[12px]">
                <span className="text-neutral-600">Desarrollo</span>
                <span className="font-medium tabular-nums">
                  {durationLabel}
                </span>
              </div>
              <div className="border-t-2 border-[#46D19A] bg-neutral-50 px-4 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">
                  <GreenDot />
                  Inversión estimada
                </div>
                <div className="mt-0.5 text-[17px] font-semibold tabular-nums">
                  {investmentLabel}
                </div>
                <div className="text-[11px] text-neutral-500">
                  MXN · IVA no incluido
                </div>
              </div>
            </div>
          </div>
        </PrintSection>

        <PrintSection number="04" title="Fases y entregables">
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-neutral-100">
                <tr>
                  <th className={`${TH} w-8`}>#</th>
                  <th className={TH}>Fase</th>
                  <th className={TH}>Entregable</th>
                  <th className={`${TH} w-24 text-right`}>Duración</th>
                </tr>
              </thead>
              <tbody>
                {facts.phases.map((phase, index) => (
                  <tr
                    key={phase.name}
                    className="border-t border-neutral-200 align-top"
                  >
                    <td className="px-3 py-2.5 text-neutral-500 tabular-nums">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] font-semibold">
                      {phase.name}
                    </td>
                    <td className="px-3 py-2.5 text-neutral-600">
                      {phase.deliverable}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {phase.weeks} {phase.weeks === 1 ? "semana" : "semanas"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PrintSection>

        <PrintSection
          number="05"
          title="Arquitectura de la solución"
          keepTogether={false}
        >
          <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
            {architectureGroups.map((group) => (
              <div
                key={group.title}
                className="break-inside-avoid rounded-xl border border-neutral-200 p-3.5"
              >
                <h3 className="m-0 mb-2 text-[10px] font-semibold tracking-[0.08em] text-neutral-500 uppercase">
                  {group.title}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[12px] leading-[1.5]">
                  {group.nodeIds.map((nodeId) => (
                    <li key={nodeId}>
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                        <GreenDot />
                        {ARCH_NODES[nodeId].label}
                      </span>
                      <span className="text-neutral-600">
                        {copy.architectureNotes[nodeId]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PrintSection>

        <PrintSection number="06" title="Tecnologías">
          <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
            {facts.technologies.map((id) => (
              <div
                key={id}
                className="break-inside-avoid rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3"
              >
                <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                  <GreenDot />
                  {TECHNOLOGIES[id].name}
                </div>
                <div className="mt-0.5 text-[12px] leading-[1.5] text-neutral-600">
                  {copy.technologyNotes[id]}
                </div>
              </div>
            ))}
          </div>
        </PrintSection>

        <PrintSection number="07" title="Supuestos y condiciones">
          <ul className="m-0 flex list-none flex-col gap-2 rounded-xl border border-neutral-200 p-4 text-[12px] leading-[1.5] text-neutral-700">
            {[...FIXED_ASSUMPTIONS, ...risks].map((assumption) => (
              <li key={assumption} className="flex items-start gap-2.5">
                <span className="mt-[5px]">
                  <GreenDot />
                </span>
                {assumption}
              </li>
            ))}
          </ul>
        </PrintSection>

        <footer className="mt-8 flex items-center justify-between gap-4 border-t border-neutral-200 pt-3 text-[11px] text-neutral-500">
          <span>
            {SITE.name} · Propuesta preliminar, se confirma en reunión
          </span>
          <span>{dateLabel}</span>
        </footer>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
