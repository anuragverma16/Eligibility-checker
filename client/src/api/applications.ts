import type { FormValues, SchemeId } from '../data/schemes';
import type { EligibilityStatus } from '../lib/eligibility';

export type ApplicationPayload = {
  schemeId: SchemeId;
  referenceId: string;
  status: EligibilityStatus;
  values: FormValues;
};

const NETWORK_ERROR = 'We could not reach the server. Check your connection and try again.';

// Empty in local dev (the Vite proxy forwards /api); set to the Render URL in production.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function saveApplication(payload: ApplicationPayload) {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'We could not save your application. Please try again.');
  }
  return data as { referenceId: string };
}

export type StoredApplication = {
  referenceId: string;
  schemeId: SchemeId;
  status: EligibilityStatus;
  values: Partial<FormValues>;
  createdAt: string;
};

export async function fetchApplication(referenceId: string) {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/applications/${encodeURIComponent(referenceId)}`);
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  if (response.status === 404) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'We could not look up that application.');
  return data as StoredApplication;
}
