// wa.me expects digits only, with the country code. Placeholders without digits fall back to the share chooser.
export function getWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  // Ten digits are a Mexican number: wa.me needs the country code.
  const withCountry = digits.length === 10 ? `52${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

// The business name and the link are optional: the visitor may not have named the business or generated a proposal.
export function buildProposalWhatsAppMessage({ name, business, proposalUrl }: { name: string; business: string; proposalUrl: string | null }) {
  const who = business.trim() ? `${name}, de ${business.trim()}` : name;
  return `Hola, soy ${who}. Revisé mi propuesta de Solvyn Solutions y prefiero platicarla por WhatsApp.${proposalUrl ? ` Aquí está: ${proposalUrl}` : ""}`;
}

// For display: a ten-digit Mexican number is shown with its country code, as "+52 3310061026".
export function formatDisplayPhone(phone: string) {
  const compact = phone.replace(/\s/g, "");
  return /^\d{10}$/.test(compact) ? `+52 ${compact}` : phone.trim();
}
