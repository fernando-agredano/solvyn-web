import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { BarChart } from "@/src/components/admin/BarChart";
import { HorizontalBars } from "@/src/components/admin/HorizontalBars";
import { LabelBadge } from "@/src/components/admin/LabelBadge";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { StatCard } from "@/src/components/admin/StatCard";
import { SERIES_DAYS } from "@/src/lib/admin/leads/series";
import { LEAD_LABELS, LEAD_STATUSES } from "@/src/lib/admin/leads/filters";
import {
  formatLeadDateTime,
  LABEL_TEXT,
  STATUS_LABELS,
} from "@/src/lib/admin/leads/labels";
import { getLeadsDashboard } from "@/src/lib/admin/leads/queries";

const formatDay = (isoDate: string) =>
  new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(`${isoDate}T12:00:00Z`));

async function Dashboard() {
  // The dashboard compares dates with the current time: it is rendered per request, never prerendered.
  await connection();
  const dashboard = await getLeadsDashboard();

  const totalInSeries = dashboard.leadsByDay.reduce(
    (sum, day) => sum + day.count,
    0,
  );

  return (
    <main
      id="contenido"
      className="flex flex-col gap-5 px-4 py-6 sm:px-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="m-0 text-lg font-semibold text-[#18181B]">Resumen</h1>
        <p className="m-0 text-xs text-[#71717A]">Últimos {SERIES_DAYS} días</p>
      </div>

      <section
        aria-label="Cifras principales"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard label="Total de leads" value={dashboard.total} />
        <StatCard label="Nuevos esta semana" value={dashboard.newThisWeek} />
        <StatCard
          label="Reuniones próximas"
          value={dashboard.upcomingMeetingCount}
        />
        <StatCard label="Leads calientes" value={dashboard.byLabel.caliente} />
      </section>

      <div className="grid gap-3 xl:grid-cols-3">
        <SectionCard
          title="Leads por día"
          headingId="daily-heading"
          action={
            <span className="text-xs text-[#71717A]">
              {totalInSeries} en el periodo
            </span>
          }
          className="xl:col-span-2"
        >
          <BarChart
            ariaLabel={`Leads por día en los últimos ${SERIES_DAYS} días: ${totalInSeries} en total`}
            data={dashboard.leadsByDay.map((day) => ({
              label: formatDay(day.date),
              value: day.count,
            }))}
          />
        </SectionCard>

        <SectionCard title="Por etiqueta" headingId="labels-heading">
          <div className="flex flex-col gap-4">
            <HorizontalBars
              rows={LEAD_LABELS.map((label) => ({
                label: LABEL_TEXT[label],
                value: dashboard.byLabel[label],
              }))}
            />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <SectionCard
          title="Embudo por estado"
          headingId="funnel-heading"
          className="xl:col-span-2"
        >
          <HorizontalBars
            rows={LEAD_STATUSES.map((status) => ({
              label: STATUS_LABELS[status],
              value: dashboard.byStatus[status],
            }))}
          />
        </SectionCard>

        <SectionCard
          title="Próximas reuniones"
          headingId="meetings-heading"
          action={
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-[#52525B] hover:text-[#18181B]"
            >
              Ver leads
            </Link>
          }
        >
          {dashboard.upcomingMeetings.length === 0 ? (
            <p className="m-0 text-sm text-[#71717A]">
              No hay reuniones agendadas.
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col divide-y divide-[#F4F4F5] p-0">
              {dashboard.upcomingMeetings.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex flex-col gap-1.5 py-3 no-underline first:pt-0 last:pb-0"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-[#18181B]">
                        {lead.name}
                      </span>
                      <LabelBadge label={lead.label} />
                    </span>
                    <span className="text-xs text-[#71717A]">
                      {lead.meetingAt && formatLeadDateTime(lead.meetingAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </main>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
