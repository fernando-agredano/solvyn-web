import Link from "next/link";
import { Suspense } from "react";
import { StatCard } from "@/src/components/admin/StatCard";
import { LabelBadge } from "@/src/components/admin/LabelBadge";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";
import { LEAD_LABELS } from "@/src/lib/admin/leads/filters";
import { formatLeadDateTime } from "@/src/lib/admin/leads/labels";
import { getLeadsDashboard } from "@/src/lib/admin/leads/queries";

async function Dashboard() {
  const dashboard = await getLeadsDashboard();

  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 py-12"
    >
      <h1 className="wide m-0 text-[clamp(28px,4vw,40px)] font-bold text-heading">
        Resumen
      </h1>

      <section aria-labelledby="stats-heading" className="flex flex-col gap-4">
        <h2 id="stats-heading" className="sr-only">
          Cifras de leads
        </h2>
        <div className="grid gap-4 min-[620px]:grid-cols-3">
          <StatCard label="Total de leads" value={dashboard.total} />
          <StatCard label="Nuevos esta semana" value={dashboard.newThisWeek} />
          <StatCard
            label="Reuniones próximas"
            value={dashboard.upcomingMeetingCount}
          />
        </div>
      </section>

      <section aria-labelledby="labels-heading" className="flex flex-col gap-4">
        <h2
          id="labels-heading"
          className="semi m-0 text-xl font-semibold text-heading"
        >
          Por etiqueta
        </h2>
        <div className="grid gap-4 min-[620px]:grid-cols-3">
          {LEAD_LABELS.map((label) => (
            <div
              key={label}
              className={`${ADMIN_PANEL_CLASSES} flex items-center justify-between p-5`}
            >
              <LabelBadge label={label} />
              <span className="wide text-[32px] font-bold text-heading">
                {dashboard.byLabel[label]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="meetings-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="meetings-heading"
            className="semi m-0 text-xl font-semibold text-heading"
          >
            Próximas reuniones
          </h2>
          <Link
            href="/admin/leads"
            className="text-sm text-text-secondary underline-offset-4 hover:underline"
          >
            Ver todos los leads
          </Link>
        </div>
        {dashboard.upcomingMeetings.length === 0 ? (
          <p
            className={`${ADMIN_PANEL_CLASSES} m-0 p-5 text-[15px] text-text-secondary`}
          >
            No hay reuniones agendadas.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {dashboard.upcomingMeetings.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className={`${ADMIN_PANEL_CLASSES} flex flex-wrap items-center justify-between gap-3 p-4 no-underline transition duration-200 hover:border-white/28`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-signal shadow-[0_0_10px_var(--signal-glow)]"
                    />
                    <span className="font-semibold text-heading">
                      {lead.name}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-[14px] text-[#D4D4D4]">
                    {lead.meetingAt && formatLeadDateTime(lead.meetingAt)}
                    <LabelBadge label={lead.label} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
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
