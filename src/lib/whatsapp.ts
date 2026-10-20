// wa.me expects digits only, with the country code. Placeholders without digits fall back to the share chooser.
export function getWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// The business name and the link are optional: the visitor may not have named the business or generated a proposal.
export function buildProposalWhatsAppMessage({ name, business, proposalUrl }: { name: string; business: string; proposalUrl: string | null }) {
  const who = business.trim() ? `${name}, de ${business.trim()}` : name;
  return `Hola, soy ${who}. Revisé mi propuesta de Solvyn Solutions y prefiero platicarla por WhatsApp.${proposalUrl ? ` Aquí está: ${proposalUrl}` : ""}`;
}
