import type { CSSProperties } from 'react';
import { Check, CircleX, Clock } from 'lucide-react';
import type { FormValues, Scheme } from '../data/schemes';
import { schemeDetails } from '../data/schemeDetails';
import type { EligibilityStatus } from '../lib/eligibility';
import { Logo } from './Logo';

type Props = {
  scheme: Scheme;
  values: FormValues;
  status: EligibilityStatus;
  referenceId: string;
  dateLabel: string;
  dateValue: string;
  displayName: string;
  organization: string;
  requirement: string;
};

const STATUS_CLASS: Record<EligibilityStatus, string> = {
  Eligible: 'eligible',
  'Under Review': 'review',
  'Not Eligible': 'not-eligible',
};

export function EligibilityCard({
  scheme, values, status, referenceId, dateLabel, dateValue, displayName, organization, requirement,
}: Props) {
  const details = schemeDetails[scheme.id];
  const detailFields = scheme.fields.filter((field) => field.key !== 'organization' && field.key !== 'amount');
  const rows = [
    ...detailFields.map((field) => ({ label: field.label, value: values[field.key] || '—' })),
    ...(values.registration ? [{ label: 'Registration / ID number', value: values.registration }] : []),
  ];

  return (
    <article className="result-card reveal">
      <header className="result-head">
        <div className="result-title">
          <span className="result-code" style={{ background: `linear-gradient(135deg, ${details.coverFrom}, ${details.coverTo})` }}>{details.code}</span>
          <div>
            <h2>{scheme.title}</h2>
            <p>Eligibility verification</p>
          </div>
        </div>
        <span className={`status-pill ${STATUS_CLASS[status]}`}>
          {status === 'Eligible' && <Check size={13} />}
          {status === 'Under Review' && <Clock size={13} />}
          {status === 'Not Eligible' && <CircleX size={13} />}
          {status}
        </span>
      </header>

      <div className="result-meta">
        <span>Verification ID <strong>{referenceId}</strong></span>
        <span>{dateLabel} <strong>{dateValue}</strong></span>
      </div>

      <div className="result-body">
        <div className="result-summary">
          <div>
            <small>Applicant</small>
            <p className="result-name">{displayName}</p>
            <p className="muted small">{organization}</p>
            <p className="muted small">{values.phone || '—'} · {values.email || '—'}</p>
          </div>
          <div>
            <small>Requirement</small>
            <p className="result-amount" style={{ color: details.coverFrom }}>{requirement}</p>
            <p className="muted small">Administered by {details.agency}</p>
          </div>
        </div>

        <section className="result-section">
          <h3>{scheme.title} details</h3>
          {rows.map((row, index) => (
            <div className="detail-row reveal" style={{ '--delay': `${150 + index * 45}ms` } as CSSProperties} key={`${row.label}-${index}`}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </section>

        <section className="result-section">
          <h3>Eligibility checklist</h3>
          {scheme.checks.map((check, index) => (
            <div className="check-row reveal" style={{ '--delay': `${280 + index * 100}ms` } as CSSProperties} key={check}>
              <span className="tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5" /></svg></span>
              {check}
            </div>
          ))}
        </section>
      </div>

      <footer className="result-foot">
        <Logo size={22} />
        <p>System-generated eligibility snapshot based on the information provided. Not an official document issued by any government authority; subject to final verification by the scheme authority.</p>
      </footer>
    </article>
  );
}
