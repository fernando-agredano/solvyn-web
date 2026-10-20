// wa.me expects digits only, with the country code. Placeholders without digits fall back to the share chooser.
export function getWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
