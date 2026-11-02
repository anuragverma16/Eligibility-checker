import type { FormValues, SchemeId } from '../data/schemes';
import type { EligibilityStatus } from '../lib/eligibility';

export type ApplicationPayload = {
  schemeId: SchemeId;
  referenceId: string;
  status: EligibilityStatus;
  values: FormValues;
};

const NETWORK_ERROR = 'We could not reach the server. Check your connection and try again.';

export async function saveApplication(payload: ApplicationPayload) {
  let response: Response;
  try {
    response = await fetch('/api/applications', {
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
    response = await fetch(`/api/applications/${encodeURIComponent(referenceId)}`);
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  if (response.status === 404) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'We could not look up that application.');
  return data as StoredApplication;
}
