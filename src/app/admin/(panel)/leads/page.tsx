import { connection } from "next/server";
import { Suspense } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import { UsersIcon } from "@/src/components/admin/icons";
import { LeadCardList } from "@/src/components/admin/LeadCardList";
import { LeadsFilterBar } from "@/src/components/admin/LeadsFilterBar";
import { LeadsTable } from "@/src/components/admin/LeadsTable";
import { PageHeading } from "@/src/components/admin/PageHeading";
import { Pagination } from "@/src/components/admin/Pagination";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";
import {
  hasActiveFilters,
  parseLeadsFilters,
} from "@/src/lib/admin/leads/filters";
import { listLeads } from "@/src/lib/admin/leads/queries";

type LeadsSearchParams = Promise<Record<string, string | string[] | undefined>>;

async function LeadsList({
  searchParams,
}: {
  searchParams: LeadsSearchParams;
}) {
  // The list is read per request, never prerendered.
  await connection();
  const filters = parseLeadsFilters(await searchParams);
  const page = await listLeads(filters);
  const isFiltered = hasActiveFilters(filters);
  const totalText = `${page.total} ${page.total === 1 ? "resultado" : "resultados"}`;

  // One card, like Settings: header, filters, results and pager. It has no overflow clipping so the dropdowns can open over the table.
  return (
    <main id="contenido" className="px-4 py-6 sm:px-8 lg:px-12">
      <div className={ADMIN_PANEL_CLASSES}>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-3.5">
          <PageHeading title="Leads" tags={[totalText]} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs text-[#52525B]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#059669]"
            />
            Desde el configurador
          </span>
        </div>

        <section aria-label="Filtros" className="border-b border-[#E4E4E7]">
          <LeadsFilterBar filters={filters} />
        </section>

        {page.leads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#18181B]">
              <UsersIcon />
            </span>
            <p className="m-0 text-sm font-semibold text-[#18181B]">
              {isFiltered
                ? "No hay leads con estos filtros"
                : "Aún no hay leads"}
            </p>
            <p className="m-0 max-w-sm text-sm text-[#71717A]">
              {isFiltered
                ? "Prueba con otra búsqueda o quita algún filtro."
                : "Aparecerán aquí cuando alguien complete el configurador."}
            </p>
            {isFiltered && (
              <AdminButton href="/admin/leads" variant="secondary">
                Limpiar filtros
              </AdminButton>
            )}
          </div>
        ) : (
          <>
            <LeadsTable leads={page.leads} />
            <LeadCardList leads={page.leads} />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-xl border-t border-[#E4E4E7] bg-[#FAFAFA] px-5 py-3">
              <span className="text-xs text-[#71717A]">{totalText}</span>
              <Pagination filters={filters} pageCount={page.pageCount} />
            </div>
          </>
        )}
      </div>
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
