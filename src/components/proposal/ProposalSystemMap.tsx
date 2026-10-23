import type { ReactNode } from "react";
import {
  BriefcaseIcon,
  LayersIcon,
  MonitorIcon,
  MobileIcon,
  SparklesIcon,
  UserCheckIcon,
  UsersIcon,
  ZapIcon,
} from "@/src/components/ui/icons";
import type { ProposalFacts } from "@/src/lib/proposal";
import { SectionCard } from "./SectionCard";

const USER_NODES = {
  team: { label: "Tu equipo", icon: <UsersIcon size={18} /> },
  clients: { label: "Tus clientes", icon: <UserCheckIcon size={18} /> },
  suppliers: { label: "Proveedores y socios", icon: <BriefcaseIcon size={18} /> },
} as const;

function MapNode({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-3.5 py-2.5">
      <span aria-hidden="true" className="flex size-8 flex-none items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium">{label}</span>
      <span aria-hidden="true" className="size-1.5 flex-none rounded-full bg-signal" />
    </div>
  );
}

function MapColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-center text-xs text-muted">{title}</span>
      {children}
    </div>
  );
}

// Same animated arrow language as the architecture flow, so both diagrams read as one family.
function FlowArrow() {
  return (
    <svg
      width="34"
      height="12"
      viewBox="0 0 34 12"
      fill="none"
      aria-hidden="true"
      className="flex-none self-center max-[980px]:rotate-90"
    >
      <path className="flow" d="M0 6 H28" stroke="#FFFFFF" strokeWidth="1.2" />
      <path d="M26 2 L32 6 L26 10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A plain-language picture of the proposed system: who uses it, what it does, and what it connects to.
export function ProposalSystemMap({ facts }: { facts: ProposalFacts }) {
  const { businessName, userTypes, modules, integrationNames, includesMobile } = facts;
  const activeModules = modules.filter((module) => module.active);
  const users = userTypes.length > 0 ? userTypes : (["team"] as const);

  return (
    <SectionCard
      id="system-map-heading"
      title="Cómo se ve tu sistema"
      description="Quién lo usa, qué hace y con qué se conecta, sin tecnicismos."
      icon={<LayersIcon size={20} />}
    >
      <div className="flex items-stretch gap-3 max-[980px]:flex-col">
        <div className="flex w-[22%] min-w-0 flex-none flex-col justify-center gap-4 max-[980px]:w-auto">
          <MapColumn title="Quién lo usa">
            {users.map((user) => (
              <MapNode key={user} icon={USER_NODES[user].icon} label={USER_NODES[user].label} />
            ))}
          </MapColumn>
        </div>

        <FlowArrow />

        <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-white/25 bg-linear-to-b from-white/[0.06] to-white/[0.015] p-4">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-[15px] font-semibold">Solución de {businessName}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/16 px-2.5 py-1 text-xs text-[#D4D4D4]">
              <span aria-hidden="true" className="live-dot size-[7px] rounded-full bg-signal" />
              {activeModules.length} {activeModules.length === 1 ? "módulo activo" : "módulos activos"}
            </span>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 max-[620px]:grid-cols-1">
            {activeModules.map((module) => (
              <li key={module.id}>
                <MapNode
                  icon={module.kind === "core" ? <LayersIcon size={16} /> : module.kind === "integration" ? <ZapIcon size={16} /> : <SparklesIcon size={16} />}
                  label={module.name}
                />
              </li>
            ))}
          </ul>
        </div>

        <FlowArrow />

        <div className="flex w-[22%] min-w-0 flex-none flex-col justify-center gap-4 max-[980px]:w-auto">
          <MapColumn title="Dónde se usa">
            <MapNode icon={<MonitorIcon size={18} />} label="Navegador web" />
            {includesMobile && <MapNode icon={<MobileIcon size={18} />} label="App móvil" />}
          </MapColumn>
          {integrationNames.length > 0 && (
            <MapColumn title="Se conecta con">
              {integrationNames.map((name) => (
                <MapNode key={name} icon={<ZapIcon size={18} />} label={name} />
              ))}
            </MapColumn>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
