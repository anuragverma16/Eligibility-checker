const CRORE = 10_000_000;
const LAKH = 100_000;

// Turns "₹5 Lakh", "2 Cr", "1,50,00,000" or "150000" into rupees. Returns null when it cannot be read.
export function parseAmount(text: string): number | null {
  const cleaned = text.toLowerCase().replace(/₹|rs\.?|inr|,/g, '').trim();
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|lacs?|lac|k)?$/);
  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2];
  if (!unit) return value;
  if (unit.startsWith('cr')) return value * CRORE;
  if (unit.startsWith('la')) return value * LAKH;
  return value * 1000;
}

export function formatShort(amount: number) {
  if (amount >= CRORE) return `₹${trimZero(amount / CRORE)} Cr`;
  if (amount >= LAKH) return `₹${trimZero(amount / LAKH)} Lakh`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Returns an error message for the amount field, or null when it is acceptable (or still empty).
export function validateAmount(text: string, limit: { min: number; max: number }): string | null {
  if (!text.trim()) return null;
  const amount = parseAmount(text);
  if (amount === null) return 'Enter an amount such as ₹5 Lakh or ₹2 Crore.';
  if (amount < limit.min) return `The minimum for this scheme is ${formatShort(limit.min)}.`;
  if (amount > limit.max) return `The maximum for this scheme is ${formatShort(limit.max)}.`;
  return null;
}

function trimZero(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
}
