import { BUDGET_OPTIONS, URGENCY_OPTIONS } from "@/src/config/configurator-options";
import { SITE } from "@/src/config/site";
import { formatMXN } from "@/src/lib/pricing";
import { formatMeetingLabel } from "@/src/lib/scheduling";
import type { LeadLabel } from "@/src/lib/scoring";
import type { EmailMessage } from "./transport";

export interface LeadEmailData {
  name: string;
  email: string;
  whatsapp: string | null;
  score: number;
  label: LeadLabel;
  goals: string[];
  industry: string | null;
  budget: (typeof BUDGET_OPTIONS)[number]["id"] | null;
  urgency: (typeof URGENCY_OPTIONS)[number]["id"] | null;
  topModules: string[];
  investment: { min: number; max: number };
  weeks: { min: number; max: number };
  proposalUrl: string;
}

export interface MeetingEmailData {
  name: string;
  email: string;
  whatsapp: string | null;
  score: number;
  label: LeadLabel;
  meetingDate: string;
  meetingTime: string;
  proposalUrl: string;
}

const LABEL_TEXT: Record<LeadLabel, string> = { caliente: "caliente", tibio: "tibio", frio: "frío" };

// Served from the public "brand" bucket, so it loads in any mail client even before the site has a public domain.
const LOGO_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/brand/solvyn-logo-dark.png`;

const FONT = "Arial, Helvetica, sans-serif";
const MUTED = "#71717A";
const BORDER = "#E4E4E7";
const TEXT = "#3F3F46";
const STRONG = "#18181B";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const formatRange = (range: { min: number; max: number }, format: (value: number) => string) =>
  `${format(range.min)} a ${format(range.max)}`;

// wa.me needs the country code: ten-digit Mexican numbers get 52.
function getWhatsAppLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.length === 10 ? `52${digits}` : digits}`;
}

const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}" style="color:#18181B;text-decoration:underline;">${escapeHtml(text)}</a>`;

const paragraph = (html: string, color = TEXT) =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:${color};">${html}</p>`;

const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr>` +
  `<td bgcolor="#18181B" style="border-radius:10px;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a></td>` +
  `</tr></table>`;

// Values are already HTML (escaped by the caller) so a row can hold a link.
const detailTable = (rows: [label: string, valueHtml: string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border-top:1px solid ${BORDER};">` +
  rows
    .map(
      ([label, value]) =>
        `<tr><td valign="top" width="34%" style="padding:16px 12px 16px 0;border-bottom:1px solid ${BORDER};font-family:${FONT};font-size:14px;color:${MUTED};">${escapeHtml(label)}</td>` +
        `<td valign="top" style="padding:16px 0;border-bottom:1px solid ${BORDER};font-family:${FONT};font-size:15px;line-height:1.5;color:${STRONG};">${value}</td></tr>`,
    )
    .join("") +
  `</table>`;

const heading = (text: string) =>
  `<h1 style="margin:0 0 20px;font-family:${FONT};font-size:28px;line-height:1.2;letter-spacing:-0.5px;color:${STRONG};">${escapeHtml(text)}</h1>`;

const subtitle = (text: string) =>
  `<p style="margin:0 0 28px;font-family:${FONT};font-size:15px;line-height:1.6;color:${MUTED};">${escapeHtml(text)}</p>`;

// The only external image is the logo. Light page; the card has a gray header strip (logo and a green status badge)
// and a white body. The page color is set on both the body and the table for clients that ignore one of them.
function layout(preheader: string, badge: string, content: string): string {
  return (
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="color-scheme" content="light"><title>${escapeHtml(SITE.name)}</title></head>` +
    `<body style="margin:0;padding:0;background-color:#F4F4F5;">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F4F5" style="background-color:#F4F4F5;"><tr><td align="center" style="padding:32px 16px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid ${BORDER};border-radius:18px;">` +
    `<tr><td bgcolor="#FAFAFA" style="background-color:#FAFAFA;border-bottom:1px solid ${BORDER};border-radius:18px 18px 0 0;padding:18px 28px;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td align="left"><img src="${LOGO_URL}" alt="${escapeHtml(SITE.name)}" width="120" style="display:block;border:0;height:auto;"></td>` +
    `<td align="right"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background-color:#ECFDF5;font-family:${FONT};font-size:13px;color:#047857;"><span style="color:#10B981;">&#9679;</span>&nbsp;${escapeHtml(badge)}</span></td>` +
    `</tr></table></td></tr>` +
    `<tr><td style="padding:32px 28px 12px;">${content}</td></tr>` +
    `<tr><td style="padding:0 28px 28px;font-family:${FONT};font-size:12px;line-height:1.5;color:#A1A1AA;">${escapeHtml(SITE.name)} · Software a medida</td></tr>` +
    `</table></td></tr></table></body></html>`
  );
}

const contactRows = (data: Pick<LeadEmailData, "name" | "email" | "whatsapp" | "score" | "label">): [string, string][] => {
  const whatsappLink = data.whatsapp ? getWhatsAppLink(data.whatsapp) : null;
  return [
    ["Nombre", escapeHtml(data.name)],
    ["Correo", link(`mailto:${data.email}`, data.email)],
    [
      "WhatsApp",
      !data.whatsapp ? "No proporcionado" : whatsappLink ? link(whatsappLink, data.whatsapp) : escapeHtml(data.whatsapp),
    ],
    ["Puntaje", `${data.score}/100 · ${escapeHtml(LABEL_TEXT[data.label])}`],
  ];
};

export function buildOwnerLeadEmail(data: LeadEmailData): Omit<EmailMessage, "to"> {
  const budget = BUDGET_OPTIONS.find((option) => option.id === data.budget)?.label ?? "Sin respuesta";
  const urgency = URGENCY_OPTIONS.find((option) => option.id === data.urgency)?.label ?? "Sin respuesta";
  const content =
    heading(`Nuevo lead ${LABEL_TEXT[data.label]}`) +
    subtitle("Alguien generó una propuesta en tu configurador.") +
    detailTable([
      ...contactRows(data),
      ["Metas", escapeHtml(data.goals.join(", "))],
      ["Industria", escapeHtml(data.industry ?? "No especificada")],
      ["Presupuesto", escapeHtml(budget)],
      ["Urgencia", escapeHtml(urgency)],
      ["Módulos principales", data.topModules.map(escapeHtml).join("<br>")],
      ["Inversión estimada", `${escapeHtml(formatRange(data.investment, formatMXN))} MXN`],
    ]) +
    button("Ver propuesta", data.proposalUrl);
  return { subject: `Nuevo lead ${LABEL_TEXT[data.label]}: ${data.name}`, html: layout(`${data.name} generó una propuesta`, "Nuevo lead", content) };
}

export function buildClientProposalEmail(data: LeadEmailData): Omit<EmailMessage, "to"> {
  const content =
    heading(`Hola, ${data.name}`) +
    subtitle("Tu propuesta preliminar ya está lista.") +
    paragraph(
      `Armamos tu propuesta para <strong style="color:#18181B;">${escapeHtml(data.goals.join(", "))}</strong> con los módulos que mejor encajan con lo que nos contaste.`,
    ) +
    detailTable([
      ["Inversión estimada", `${escapeHtml(formatRange(data.investment, formatMXN))} MXN`],
      ["Tiempo estimado", `${data.weeks.min} a ${data.weeks.max} semanas`],
    ]) +
    button("Ver mi propuesta", data.proposalUrl) +
    paragraph("Esta propuesta es preliminar: la afinamos contigo en la reunión antes de cerrar alcance y precio.", MUTED);
  return { subject: "Tu propuesta de Solvyn Solutions", html: layout("Tu propuesta está lista", "Propuesta lista", content) };
}

export function buildOwnerMeetingEmail(data: MeetingEmailData): Omit<EmailMessage, "to"> {
  const when = formatMeetingLabel(data.meetingDate, data.meetingTime);
  const content =
    heading("Reunión agendada") +
    subtitle("Un cliente reservó una videollamada para revisar su propuesta.") +
    detailTable([["Cuándo", `${escapeHtml(when)} (hora del centro de México)`], ...contactRows(data)]) +
    button("Ver propuesta", data.proposalUrl);
  return { subject: `Reunión agendada: ${data.name}`, html: layout(`${data.name} · ${when}`, "Confirmado", content) };
}
