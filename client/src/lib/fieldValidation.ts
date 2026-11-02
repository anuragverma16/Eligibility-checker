import type { FieldDef, FieldKind } from '../data/formFields';
import { validateAmount } from './money';

const FORMAT: Partial<Record<FieldKind, { pattern: RegExp; message: string }>> = {
  pan: { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: 'Enter a valid PAN, for example ABCDE1234F.' },
  udyam: { pattern: /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/, message: 'Enter a valid Udyam number, for example UDYAM-MH-00-0000000.' },
  pincode: { pattern: /^\d{6}$/, message: 'PIN code must be 6 digits.' },
  ifsc: { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Enter a valid IFSC code, for example SBIN0001234.' },
  gst: { pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/, message: 'Enter a valid 15-character GSTIN.' },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
  number: { pattern: /^\d+$/, message: 'Enter a whole number.' },
};

const UPPERCASE_KINDS: FieldKind[] = ['pan', 'udyam', 'ifsc', 'gst'];

// Upper-cases identifiers as the user types so they match the official format.
export function normalizeInput(kind: FieldKind, value: string) {
  return UPPERCASE_KINDS.includes(kind) ? value.toUpperCase() : value;
}

// Returns a message for a filled-in field, or null when it is valid or still empty.
// Empty required fields are reported through isFormComplete instead.
export function fieldError(field: FieldDef, rawValue: string, limit?: { min: number; max: number }): string | null {
  const value = rawValue.trim();
  if (!value) return null;

  if (field.kind === 'amount') return limit ? validateAmount(value, limit) : null;

  if (field.kind === 'tel') {
    const digits = value.replace(/\D/g, '');
    const valid = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
    return valid ? null : 'Enter a 10-digit mobile number.';
  }

  if (field.kind === 'date') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Enter a valid date.';
    if (date > new Date()) return 'The date cannot be in the future.';
    return null;
  }

  const format = FORMAT[field.kind];
  if (format && !format.pattern.test(UPPERCASE_KINDS.includes(field.kind) ? value.toUpperCase() : value)) {
    return format.message;
  }
  return null;
}

export function isFormComplete(fields: FieldDef[], values: Record<string, string>, limit?: { min: number; max: number }) {
  return fields.every((field) => {
    const value = (values[field.key] ?? '').trim();
    if (!value) return Boolean(field.optional);
    return fieldError(field, value, limit) === null;
  });
}
