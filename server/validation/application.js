import { FIELD_KEY_PATTERN, MAX_FIELD_LENGTH, MAX_FIELDS, SCHEME_IDS, STATUSES } from '../config/eligibility.js';

export const REFERENCE_PATTERN = /^GW-[A-Z0-9]{3}-\d{6}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns { ok: true, value } with a cleaned payload, or { ok: false, error } with the first problem found.
export function validateApplication(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return fail('Request body must be a JSON object.');
  }
  if (!SCHEME_IDS.includes(body.schemeId)) return fail('Unknown scheme.');
  if (typeof body.referenceId !== 'string' || !REFERENCE_PATTERN.test(body.referenceId)) {
    return fail('Invalid reference ID.');
  }
  if (!STATUSES.includes(body.status)) return fail('Invalid eligibility status.');
  if (!body.values || typeof body.values !== 'object' || Array.isArray(body.values)) {
    return fail('Missing application values.');
  }

  const values = pickValues(body.values);
  if (!values.applicant || !values.organization || !values.amount) {
    return fail('Applicant, organization and amount are required.');
  }
  if (!values.email || !EMAIL_PATTERN.test(values.email)) {
    return fail('A valid email address is required.');
  }
  const digits = (values.phone ?? '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return fail('A valid phone number is required.');
  }

  return {
    ok: true,
    value: {
      schemeId: body.schemeId,
      referenceId: body.referenceId,
      status: body.status,
      values,
    },
  };
}

// Keeps string fields with well-formed names, trimmed and length-capped, up to MAX_FIELDS entries.
function pickValues(input) {
  const picked = {};
  for (const [key, value] of Object.entries(input)) {
    if (Object.keys(picked).length >= MAX_FIELDS) break;
    if (!FIELD_KEY_PATTERN.test(key) || typeof value !== 'string' || !value.trim()) continue;
    picked[key] = value.trim().slice(0, MAX_FIELD_LENGTH);
  }
  return picked;
}

function fail(error) {
  return { ok: false, error };
}
