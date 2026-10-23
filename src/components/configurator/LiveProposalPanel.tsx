import { useLiveProposal } from "@/src/hooks/useLiveProposal";
import { useConfiguratorStore } from "@/src/lib/configurator/store";

export function LiveProposalPanel() {
  const business = useConfiguratorStore((state) => state.business);
  const proposal = useLiveProposal();

  return (
    <aside
      aria-label="Tu propuesta en vivo"
      aria-live="polite"
      className="flex min-h-0 flex-col gap-4 rounded-2xl border border-border bg-linear-to-b from-white/6 to-white/[0.015] p-5"
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs text-label">Tu propuesta</span>
          <span className="truncate text-[17px] font-semibold">{business.trim() || "Tu negocio"}</span>
        </div>
        <span className="inline-flex flex-none items-center gap-2 rounded-full border border-white/16 px-2.5 py-1 text-xs text-[#D4D4D4]">
          <span className="live-dot size-[7px] rounded-full bg-signal" />
          En vivo
        </span>
      </div>

      {proposal ? (
        <>
          <div className="flex shrink-0 flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <span className="text-xs text-label">Inversión estimada</span>
            <span className="text-[22px] font-semibold tracking-[-0.02em] tabular-nums">{proposal.investment}</span>
            <span className="text-xs text-label tabular-nums">
              {proposal.duration}, complejidad {proposal.complexity}
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <span className="mb-1 shrink-0 text-xs text-label">Módulos ({proposal.modules.length})</span>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {proposal.modules.map((module) => (
                <div key={module.id} className="row-in flex items-center justify-between gap-3 border-b border-white/6 py-2 text-[13px]">
                  <span className="flex min-w-0 items-center gap-2.5">
                    {/* Green marks the essential modules; integrations get a neutral dot. */}
                    <span
                      aria-hidden="true"
                      className={`size-1.5 flex-none rounded-full ${module.kind === "core" ? "bg-signal" : "bg-white/50"}`}
                    />
                    <span className="text-[#E5E5E5]">{module.name}</span>
                  </span>
                  <span className="flex-none text-label tabular-nums">{module.hours} h</span>
                </div>
              ))}
            </div>
          </div>
          <span className="shrink-0 text-xs leading-normal text-muted">Estimado preliminar. Se confirma en la reunión inicial.</span>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-2 py-6 text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="7" y="7" width="10" height="10" rx="2" />
            <path d="M10 7V3M14 7V3M10 21v-4M14 21v-4M7 10H3M7 14H3M21 10h-4M21 14h-4" />
          </svg>
          <span className="text-sm leading-normal text-text-secondary">Elige qué quieres lograr y aquí verás cómo se arma tu solución.</span>
        </div>
      )}
    </aside>
  );
}
