const MEXICO_COUNTRY_CODE = "52";
const MEXICO_LOCAL_NUMBER_LENGTH = 10;

// wa.me needs digits with the country code. Ten-digit numbers are assumed to be Mexican, since the site only serves México.
export function getWhatsAppHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const withCountry =
    digits.length === MEXICO_LOCAL_NUMBER_LENGTH
      ? `${MEXICO_COUNTRY_CODE}${digits}`
      : digits;
  return withCountry.length >= 11 && withCountry.length <= 15
    ? `https://wa.me/${withCountry}`
    : null;
}

export const getMailtoHref = (email: string) => `mailto:${email}`;
