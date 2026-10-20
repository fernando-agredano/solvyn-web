const HOURS_PER_WEEK = 30;

// Investment range: 85% to 115% of hours x rate, rounded to the thousand.
export function estimateInvestmentRange(hours: number, hourlyRate: number) {
  const base = hours * hourlyRate;
  return {
    min: Math.round((base * 0.85) / 1000) * 1000,
    max: Math.round((base * 1.15) / 1000) * 1000,
  };
}

export function estimateWeekRange(hours: number) {
  const min = Math.max(2, Math.floor((hours * 0.9) / HOURS_PER_WEEK));
  const max = Math.max(min + 1, Math.ceil((hours * 1.1) / HOURS_PER_WEEK));
  return { min, max };
}

export function estimatePhaseWeeks(hours: number, share: number) {
  return Math.max(1, Math.round((hours / HOURS_PER_WEEK) * share));
}

export function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(
    amount,
  );
}
