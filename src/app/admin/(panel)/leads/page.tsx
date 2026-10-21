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
      className="flex flex-col gap-4 px-4 py-6 sm:px-8 lg:px-12"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="m-0 text-lg font-semibold text-[#18181B]">Leads</h1>
        <p className="m-0 text-xs text-[#71717A]">
          {page.total} {page.total === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      <section aria-label="Filtros" className={`${ADMIN_PANEL_CLASSES} p-4`}>
        <LeadsFilterBar filters={filters} />
      </section>

      {page.leads.length === 0 ? (
        <p className={`${ADMIN_PANEL_CLASSES} m-0 p-6 text-sm text-[#71717A]`}>
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
