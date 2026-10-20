import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LabelBadge } from "@/src/components/admin/LabelBadge";
import { ADMIN_PANEL_CLASSES } from "@/src/components/admin/styles";
import { Button } from "@/src/components/ui/Button";
import { describeAnswers } from "@/src/lib/admin/leads/answers";
import { getMailtoHref, getWhatsAppHref } from "@/src/lib/admin/leads/contact";
import {
  formatInvestmentRange,
  formatLeadDateTime,
  STATUS_LABELS,
} from "@/src/lib/admin/leads/labels";
import { getLeadById } from "@/src/lib/admin/leads/queries";
import { LeadNotesForm } from "./LeadNotesForm";
import { LeadStatusForm } from "./LeadStatusForm";

type LeadParams = Promise<{ id: string }>;

const SECTION_CLASSES = `${ADMIN_PANEL_CLASSES} flex flex-col gap-5 p-6`;
const SECTION_TITLE_CLASSES = "semi m-0 text-lg font-semibold text-heading";

async function LeadDetail({ params }: { params: LeadParams }) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const whatsappHref = getWhatsAppHref(lead.phone);
  const answers = lead.proposal ? describeAnswers(lead.proposal) : null;

  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-[960px] flex-col gap-8 px-6 py-12"
    >
      <Link
        href="/admin/leads"
        className="w-fit text-sm text-text-secondary underline-offset-4 hover:underline"
      >
        ← Volver a leads
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="wide m-0 text-[clamp(26px,4vw,36px)] font-bold text-heading">
            {lead.name}
          </h1>
          <LabelBadge label={lead.label} />
        </div>
        <p className="m-0 text-[15px] text-text-secondary">
          Puntaje {lead.score} · Registrado el{" "}
          {formatLeadDateTime(lead.createdAt)}
        </p>
      </header>

      <section aria-labelledby="contact-heading" className={SECTION_CLASSES}>
        <h2 id="contact-heading" className={SECTION_TITLE_CLASSES}>
          Contacto
        </h2>
        <p className="m-0 text-[15px] text-[#D4D4D4]">{lead.email}</p>
        {lead.phone && (
          <p className="m-0 text-[15px] text-[#D4D4D4]">{lead.phone}</p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button
            href={getMailtoHref(lead.email)}
            variant="secondary"
            size="md"
          >
            Escribir correo
          </Button>
          {whatsappHref ? (
            <Button href={whatsappHref} size="md">
              Abrir WhatsApp
            </Button>
          ) : (
            <p className="m-0 self-center text-sm text-muted">
              Sin número de WhatsApp válido.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="proposal-heading" className={SECTION_CLASSES}>
        <h2 id="proposal-heading" className={SECTION_TITLE_CLASSES}>
          Propuesta
        </h2>
        <dl className="m-0 grid gap-4 text-[15px] sm:grid-cols-2">
          <div>
            <dt className="text-label">Inversión estimada</dt>
            <dd className="m-0 mt-1 tabular-nums text-[#D4D4D4]">
              {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
            </dd>
          </div>
          <div>
            <dt className="text-label">Industria</dt>
            <dd className="m-0 mt-1 text-[#D4D4D4]">
              {lead.proposal?.facts.industryLabel ?? "—"}
            </dd>
          </div>
        </dl>
        <div>
          <Button
            href={`/propuesta/${lead.proposalSlug}`}
            variant="secondary"
            size="md"
          >
            Ver propuesta
          </Button>
        </div>
      </section>

      <section aria-labelledby="answers-heading" className={SECTION_CLASSES}>
        <h2 id="answers-heading" className={SECTION_TITLE_CLASSES}>
          Respuestas del configurador
        </h2>
        {answers === null ? (
          <p className="m-0 text-[15px] text-text-secondary">
            No se pudieron leer las respuestas guardadas.
          </p>
        ) : (
          <dl className="m-0 grid gap-4 text-[15px]">
            {answers.map((answer) => (
              <div
                key={answer.label}
                className="grid gap-1 sm:grid-cols-[200px_1fr] sm:gap-4"
              >
                <dt className="text-label">{answer.label}</dt>
                <dd className="m-0 whitespace-pre-line text-[#D4D4D4]">
                  {answer.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section aria-labelledby="meeting-heading" className={SECTION_CLASSES}>
        <h2 id="meeting-heading" className={SECTION_TITLE_CLASSES}>
          Reunión
        </h2>
        <p className="m-0 text-[15px] text-[#D4D4D4]">
          {lead.meetingAt
            ? formatLeadDateTime(lead.meetingAt)
            : "Sin reunión agendada."}
        </p>
      </section>

      <section aria-labelledby="status-heading" className={SECTION_CLASSES}>
        <h2 id="status-heading" className={SECTION_TITLE_CLASSES}>
          Estado
        </h2>
        <p className="m-0 text-[15px] text-text-secondary">
          Actual: {STATUS_LABELS[lead.status]}
        </p>
        <LeadStatusForm leadId={lead.id} initialStatus={lead.status} />
      </section>

      <section aria-labelledby="notes-heading" className={SECTION_CLASSES}>
        <h2 id="notes-heading" className={SECTION_TITLE_CLASSES}>
          Notas
        </h2>
        <LeadNotesForm leadId={lead.id} initialNotes={lead.notes ?? ""} />
      </section>
    </main>
  );
}

export default function AdminLeadDetailPage({
  params,
}: {
  params: LeadParams;
}) {
  return (
    <Suspense>
      <LeadDetail params={params} />
    </Suspense>
  );
}
