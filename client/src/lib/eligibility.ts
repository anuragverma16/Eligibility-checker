import type { FormValues, Scheme } from '../data/schemes';
import { schemeDetails } from '../data/schemeDetails';
import { formatShort, parseAmount, validateAmount } from './money';

export type EligibilityStatus = 'Eligible' | 'Under Review' | 'Not Eligible';

export const today = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

export function getSchemeCode(scheme: Scheme) {
  return scheme.id.slice(0, 3).toUpperCase();
}

export function computeStatus(scheme: Scheme, values: FormValues): EligibilityStatus {
  const selectValues = scheme.fields
    .filter((field) => field.kind === 'select')
    .map((field) => (values[field.key] || '').toLowerCase());
  if (selectValues.some((value) => value.includes('not available') || value.includes('not eligible'))) return 'Not Eligible';
  if (selectValues.some((value) => value.includes('under review') || value.includes('needs documents'))) return 'Under Review';
  return 'Eligible';
}

export function computeReferenceId(scheme: Scheme, values: FormValues, dateLabel: string) {
  const seed = `${scheme.id}|${values.applicant}|${values.email}|${values.phone}|${dateLabel}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return `GW-${getSchemeCode(scheme)}-${100000 + (hash % 900000)}`;
}

// The funding requirement as shown on the card: the formatted amount when it is valid, otherwise the text as entered.
export function getRequirement(scheme: Scheme, values: FormValues) {
  const limit = schemeDetails[scheme.id].limit;
  const requested = parseAmount(values.amount ?? '');
  return requested !== null && !validateAmount(values.amount, limit)
    ? formatShort(requested)
    : values.amount || scheme.amount;
}
