import { Suspense } from "react";
import { LeadCardList } from "@/src/components/admin/LeadCardList";
import { LeadsFilterBar } from "@/src/components/admin/LeadsFilterBar";
import { LeadsTable } from "@/src/components/admin/LeadsTable";
import { Pagination } from "@/src/components/admin/Pagination";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";
import { parseLeadsFilters } from "@/src/lib/admin/leads/filters";
import { listLeads } from "@/src/lib/admin/leads/queries";

type LeadsSearchParams = Promise<Record<string, string | string[] | undefined>>;

async function LeadsList({
  searchParams,
}: {
  searchParams: LeadsSearchParams;
}) {
  const filters = parseLeadsFilters(await searchParams);
  const page = await listLeads(filters);

  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-12"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="wide m-0 text-[clamp(28px,4vw,40px)] font-bold text-heading">
          Leads
        </h1>
        <p className="m-0 text-sm text-label">
          {page.total} {page.total === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      <section aria-label="Filtros" className={`${ADMIN_PANEL_CLASSES} p-5`}>
        <LeadsFilterBar filters={filters} />
      </section>

      {page.leads.length === 0 ? (
        <p
          className={`${ADMIN_PANEL_CLASSES} m-0 p-6 text-[15px] text-text-secondary`}
        >
          No hay leads con estos filtros. Prueba quitando alguno.
        </p>
      ) : (
        <>
          <LeadsTable leads={page.leads} />
          <LeadCardList leads={page.leads} />
          <Pagination filters={filters} pageCount={page.pageCount} />
        </>
      )}
    </main>
  );
}

export default function AdminLeadsPage({
  searchParams,
}: {
  searchParams: LeadsSearchParams;
}) {
  return (
    <Suspense>
      <LeadsList searchParams={searchParams} />
    </Suspense>
  );
}
