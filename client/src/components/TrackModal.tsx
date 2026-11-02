import { FormEvent, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { fetchApplication, type StoredApplication } from '../api/applications';
import type { FormValues } from '../data/schemes';
import { schemes } from '../data/schemes';
import { getRequirement } from '../lib/eligibility';
import { EligibilityCard } from './EligibilityCard';

export function TrackModal({ onClose }: { onClose: () => void }) {
  const [referenceId, setReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<StoredApplication | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = referenceId.trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const found = await fetchApplication(id);
      setResult(found);
      setSearched(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const scheme = result ? schemes.find((item) => item.id === result.schemeId) : undefined;
  const values = (result?.values ?? {}) as FormValues;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal${scheme ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="track-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <p className="eyebrow">Track application</p>
        <h2 id="track-title">Look up your eligibility card</h2>
        <p className="muted">Enter the Verification ID shown on your eligibility card, for example GW-SID-913301.</p>

        <form className="track-form" onSubmit={search}>
          <input value={referenceId} onChange={(event) => setReferenceId(event.target.value)} placeholder="GW-XXX-000000" aria-label="Verification ID" />
          <button className="btn btn-primary" type="submit" disabled={loading || !referenceId.trim()}>
            <Search size={16} /> {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error && <p className="form-error" role="alert">{error}</p>}
        {searched && !result && !error && <p className="muted track-empty">No application found for that ID.</p>}

        {result && scheme && (
          <div className="track-card">
            <EligibilityCard
              scheme={scheme}
              values={values}
              status={result.status}
              referenceId={result.referenceId}
              dateLabel="Submitted"
              dateValue={new Date(result.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              displayName={values.applicant || '—'}
              organization={values.organization || '—'}
              requirement={getRequirement(scheme, values)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
