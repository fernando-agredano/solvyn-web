import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import { LabelBadge } from "@/src/components/admin/LabelBadge";
import { SectionCard } from "@/src/components/admin/SectionCard";
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

const DATA_LABEL = "text-xs font-medium text-[#71717A]";
const DATA_VALUE = "m-0 mt-1 text-sm text-[#18181B]";

async function LeadDetail({ params }: { params: LeadParams }) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const whatsappHref = getWhatsAppHref(lead.phone);
  const answers = lead.proposal ? describeAnswers(lead.proposal) : null;

  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-[960px] flex-col gap-4 px-5 py-6"
    >
      <Link
        href="/admin/leads"
        className="w-fit text-xs font-medium text-[#52525B] hover:text-[#18181B]"
      >
        ← Volver a leads
      </Link>

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="m-0 text-lg font-semibold text-[#18181B]">
          {lead.name}
        </h1>
        <LabelBadge label={lead.label} />
        <span className="text-xs text-[#71717A]">
          Puntaje {lead.score} · Registrado el{" "}
          {formatLeadDateTime(lead.createdAt)}
        </span>
      </header>

      <SectionCard title="Contacto" headingId="contact-heading">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className={DATA_LABEL}>Correo</p>
            <p className={DATA_VALUE}>{lead.email}</p>
          </div>
          <div>
            <p className={DATA_LABEL}>WhatsApp</p>
            <p className={DATA_VALUE}>{lead.phone ?? "Sin número"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton href={getMailtoHref(lead.email)} variant="secondary">
            Escribir correo
          </AdminButton>
          {whatsappHref ? (
            <AdminButton href={whatsappHref}>Abrir WhatsApp</AdminButton>
          ) : (
            <p className="m-0 self-center text-xs text-[#71717A]">
              Sin número de WhatsApp válido.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Propuesta" headingId="proposal-heading">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className={DATA_LABEL}>Inversión estimada</p>
            <p className={`${DATA_VALUE} tabular-nums`}>
              {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
            </p>
          </div>
          <div>
            <p className={DATA_LABEL}>Industria</p>
            <p className={DATA_VALUE}>
              {lead.proposal?.facts.industryLabel ?? "—"}
            </p>
          </div>
        </div>
        <div>
          <AdminButton
            href={`/propuesta/${lead.proposalSlug}`}
            variant="secondary"
          >
            Ver propuesta
          </AdminButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Respuestas del configurador"
        headingId="answers-heading"
      >
        {answers === null ? (
          <p className="m-0 text-sm text-[#71717A]">
            No se pudieron leer las respuestas guardadas.
          </p>
        ) : (
          <dl className="m-0 grid gap-3 text-sm">
            {answers.map((answer) => (
              <div
                key={answer.label}
                className="grid gap-1 border-b border-[#F4F4F5] pb-3 last:border-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-4"
              >
                <dt className="text-[#71717A]">{answer.label}</dt>
                <dd className="m-0 whitespace-pre-line text-[#18181B]">
                  {answer.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Reunión" headingId="meeting-heading">
          <p className="m-0 text-sm text-[#18181B]">
            {lead.meetingAt
              ? formatLeadDateTime(lead.meetingAt)
              : "Sin reunión agendada."}
          </p>
        </SectionCard>

        <SectionCard title="Estado" headingId="status-heading">
          <p className="m-0 text-xs text-[#71717A]">
            Actual: {STATUS_LABELS[lead.status]}
          </p>
          <LeadStatusForm leadId={lead.id} initialStatus={lead.status} />
        </SectionCard>
      </div>

      <SectionCard title="Notas internas" headingId="notes-heading">
        <LeadNotesForm leadId={lead.id} initialNotes={lead.notes ?? ""} />
      </SectionCard>
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
