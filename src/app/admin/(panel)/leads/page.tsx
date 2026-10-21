import { connection } from "next/server";
import { Suspense } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import { UsersIcon } from "@/src/components/admin/icons";
import { LeadCardList } from "@/src/components/admin/LeadCardList";
import { LeadsFilterBar } from "@/src/components/admin/LeadsFilterBar";
import { LeadsTable } from "@/src/components/admin/LeadsTable";
import { MeetingsCalendar } from "@/src/components/admin/MeetingsCalendar";
import { PageHeading } from "@/src/components/admin/PageHeading";
import { Pagination } from "@/src/components/admin/Pagination";
import { SegmentedNav } from "@/src/components/ui/SegmentedNav";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";
import {
  buildCalendarHref,
  countMeetingsInMonth,
  groupMeetingsByDay,
  monthParam,
  parseCalendarMonth,
} from "@/src/lib/admin/leads/calendar-view";
import {
  hasActiveFilters,
  parseLeadsFilters,
} from "@/src/lib/admin/leads/filters";
import { listLeads, listMeetingsInMonth } from "@/src/lib/admin/leads/queries";
import { toMexicoDay } from "@/src/lib/admin/leads/series";
import { monthLabel, parseIsoDate, shiftMonth } from "@/src/lib/calendar";

type LeadsSearchParams = Promise<Record<string, string | string[] | undefined>>;
type ResolvedSearchParams = Awaited<LeadsSearchParams>;

const VIEWS = [
  { href: "/admin/leads", label: "Lista" },
  { href: "/admin/leads?vista=calendario", label: "Calendario" },
] as const;

// Mexico City is where the business runs; the server may run in another timezone.
const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Mexico_City",
});

const pluralize = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

// The header the two views share: the title, a tag with the count, and the switch between them.
function LeadsHeader({ tags, view }: { tags: string[]; view: 0 | 1 }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-3.5">
      <PageHeading title="Leads" tags={tags} />
      <SegmentedNav
        items={VIEWS}
        activeIndex={view}
        ariaLabel="Vista de leads"
        itemWidthClass="w-28"
      />
    </div>
  );
}

async function ListView({ params }: { params: ResolvedSearchParams }) {
  const filters = parseLeadsFilters(params);
  const page = await listLeads(filters);
  const isFiltered = hasActiveFilters(filters);
  const totalText = pluralize(page.total, "resultado", "resultados");

  return (
    <>
      <LeadsHeader tags={[totalText]} view={0} />

      <section aria-label="Filtros" className="border-b border-[#E4E4E7]">
        <LeadsFilterBar filters={filters} />
      </section>

      {page.leads.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#18181B]">
            <UsersIcon />
          </span>
          <p className="m-0 text-sm font-semibold text-[#18181B]">
            {isFiltered ? "No hay leads con estos filtros" : "Aún no hay leads"}
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
    </>
  );
}

// The month and the meetings come from the URL and the database; the calendar itself only draws and selects.
async function CalendarView({
  monthValue,
}: {
  monthValue: string | undefined;
}) {
  const today = toMexicoDay(new Date());
  const month = parseCalendarMonth(monthValue, today);
  const meetingsByDay = groupMeetingsByDay(
    await listMeetingsInMonth(month),
    (date) => timeFormatter.format(date),
  );
  const count = countMeetingsInMonth(meetingsByDay, month);
  const { year: todayYear, month: todayMonth } = parseIsoDate(today);

  return (
    <>
      <LeadsHeader
        tags={[
          `${pluralize(count, "reunión", "reuniones")} en ${monthLabel(month)}`,
        ]}
        view={1}
      />
      <MeetingsCalendar
        key={monthParam(month)}
        month={month}
        today={today}
        meetingsByDay={meetingsByDay}
        previousHref={buildCalendarHref(shiftMonth(month, -1))}
        nextHref={buildCalendarHref(shiftMonth(month, 1))}
        todayHref={buildCalendarHref({ year: todayYear, month: todayMonth })}
      />
    </>
  );
}

async function LeadsPanel({
  searchParams,
}: {
  searchParams: LeadsSearchParams;
}) {
  // Both views are read per request, never prerendered.
  await connection();
  const params = await searchParams;
  const monthValue = typeof params.mes === "string" ? params.mes : undefined;
  const isCalendar = params.vista === "calendario";

  // One card, like Settings. It has no overflow clipping so the dropdowns can open over the table.
  return (
    <main
      id="contenido"
      className={`px-4 py-6 sm:px-8 lg:px-12 ${
        isCalendar ? "lg:flex lg:h-[calc(100dvh-3.5rem)] lg:flex-col lg:py-4" : ""
      }`}
    >
      <div
        className={`${ADMIN_PANEL_CLASSES} ${
          isCalendar ? "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" : ""
        }`}
      >
        {isCalendar ? (
          <CalendarView monthValue={monthValue} />
        ) : (
          <ListView params={params} />
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
      <LeadsPanel searchParams={searchParams} />
    </Suspense>
  );
}
