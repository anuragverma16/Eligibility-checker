import type { CSSProperties, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { applicantFields, type FieldDef } from '../data/formFields';
import type { FormValues, Scheme } from '../data/schemes';
import { schemeDetails } from '../data/schemeDetails';
import { fieldError, normalizeInput } from '../lib/fieldValidation';
import { SchemeCover } from './SchemeCover';

type Props = {
  scheme: Scheme;
  values: FormValues;
  canContinue: boolean;
  saving: boolean;
  saveError: string;
  onChange: (key: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

const delay = (index: number) => ({ '--delay': `${60 + index * 60}ms` } as CSSProperties);

export function ApplicationForm({ scheme, values, canContinue, saving, saveError, onChange, onSubmit, onBack }: Props) {
  const details = schemeDetails[scheme.id];
  const requiredFields = [...applicantFields, ...scheme.fields].filter((field) => !field.optional);
  const completed = requiredFields.filter((field) => {
    const value = (values[field.key] ?? '').trim();
    return value && !fieldError(field, value, field.kind === 'amount' ? details.limit : undefined);
  }).length;
  const percent = requiredFields.length ? Math.round((completed / requiredFields.length) * 100) : 0;

  return (
    <form className="application" onSubmit={onSubmit} noValidate>
      <div className="application-main">
        <button type="button" className="link-back" onClick={onBack}><ArrowLeft size={16} /> All schemes</button>

        <header className="page-title reveal" style={delay(0)}>
          <p className="eyebrow">{scheme.eyebrow}</p>
          <h2>{scheme.title} application</h2>
          <p className="muted">Fields marked * are required. Formats such as PAN and PIN code are checked as you type.</p>
        </header>

        <div className="form-progress reveal" style={delay(0)}>
          <p className="form-progress-text"><strong>{completed}</strong> of {requiredFields.length} required fields completed</p>
          <div className="form-progress-bar" role="progressbar" aria-label="Form completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <i style={{ width: `${percent}%` }} />
          </div>
          <span className="form-progress-percent">{percent}%</span>
        </div>

        <fieldset className="card reveal" style={delay(1)}>
          <legend><span className="section-num">1</span> Applicant details</legend>
          <p className="section-desc">Use the name and details exactly as they appear on your PAN or Aadhaar.</p>
          <FieldGrid fields={applicantFields} values={values} onChange={onChange} />
        </fieldset>

        <fieldset className="card reveal" style={delay(2)}>
          <legend><span className="section-num">2</span> {scheme.title} details</legend>
          <p className="section-desc">Information specific to this scheme. Amounts are checked against its funding range.</p>
          <FieldGrid fields={scheme.fields} values={values} onChange={onChange} limit={details.limit} />
        </fieldset>

        <div className="form-footer reveal" style={delay(3)}>
          <span className="reassure"><ShieldCheck size={16} /> No account or upload required</span>
          <div className="submit-block">
            {saveError && <p className="form-error" role="alert">{saveError}</p>}
            <button className="btn btn-primary btn-lg" type="submit" disabled={!canContinue || saving} aria-busy={saving}>
              {saving ? <><Loader2 size={18} className="spin" /> Saving application</> : <>Review eligibility <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      </div>

      <aside className="application-side reveal" style={delay(2)}>
        <div className="side-card">
          <SchemeCover details={details} size="preview" />
          <div className="side-body">
            <p className="eyebrow">{details.code} · {scheme.eyebrow}</p>
            <h3>{scheme.title}</h3>
            <p className="muted small">{details.summary}</p>

            <div className="side-block">
              <small>Administered by</small>
              <p>{details.agency}</p>
            </div>
            <div className="side-block">
              <small>Funding range</small>
              <p className="range">{scheme.amount}</p>
            </div>
            <div className="side-block">
              <h4><CheckCircle2 size={15} /> Eligibility</h4>
              <ul>{details.eligibility.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="side-block">
              <h4><FileText size={15} /> Documents to keep ready</h4>
              <ul>{details.documents.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}

function FieldGrid({ fields, values, onChange, limit }: {
  fields: FieldDef[];
  values: FormValues;
  onChange: (key: string, value: string) => void;
  limit?: { min: number; max: number };
}) {
  return (
    <div className="grid-2">
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={values[field.key] ?? ''}
          limit={limit}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

function FieldInput({ field, value, limit, onChange }: {
  field: FieldDef;
  value: string;
  limit?: { min: number; max: number };
  onChange: (key: string, value: string) => void;
}) {
  const error = fieldError(field, value, field.kind === 'amount' ? limit : undefined);
  const handle = (next: string) => onChange(field.key, normalizeInput(field.kind, next));
  const shared = {
    value,
    required: !field.optional,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${field.key}-error` : undefined,
  };

  let control;
  switch (field.kind) {
    case 'select':
      control = (
        <select {...shared} onChange={(event) => handle(event.target.value)}>
          <option value="">{field.placeholder ?? `Select ${field.label.toLowerCase()}`}</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
      break;
    case 'textarea':
      control = <textarea {...shared} placeholder={field.placeholder} rows={3} onChange={(event) => handle(event.target.value)} />;
      break;
    case 'tel':
      control = <input {...shared} placeholder={field.placeholder} type="tel" inputMode="numeric" autoComplete="tel" maxLength={16} onChange={(event) => handle(event.target.value)} />;
      break;
    case 'email':
      control = <input {...shared} placeholder={field.placeholder} type="email" autoComplete="email" onChange={(event) => handle(event.target.value)} />;
      break;
    case 'number':
      control = <input {...shared} placeholder={field.placeholder} type="text" inputMode="numeric" maxLength={3} onChange={(event) => handle(event.target.value.replace(/\D/g, ''))} />;
      break;
    case 'date':
      control = <input {...shared} placeholder={field.placeholder} type="date" max={new Date().toISOString().slice(0, 10)} onChange={(event) => handle(event.target.value)} />;
      break;
    case 'pincode':
      control = <input {...shared} placeholder={field.placeholder} type="text" inputMode="numeric" maxLength={6} onChange={(event) => handle(event.target.value.replace(/\D/g, ''))} />;
      break;
    case 'pan':
    case 'udyam':
    case 'ifsc':
    case 'gst':
      control = <input {...shared} placeholder={field.placeholder} type="text" autoCapitalize="characters" spellCheck={false} maxLength={field.kind === 'udyam' ? 22 : field.kind === 'gst' ? 15 : 11} onChange={(event) => handle(event.target.value)} />;
      break;
    default:
      control = <input {...shared} placeholder={field.placeholder} type="text" autoComplete={field.key === 'applicant' ? 'name' : 'off'} maxLength={160} onChange={(event) => handle(event.target.value)} />;
  }

  return (
    <label className={`field ${field.kind === 'textarea' ? 'wide' : ''} ${error ? 'has-error' : ''}`}>
      <span className="field-label">
        {field.label}
        {!field.optional && <span className="req"> *</span>}
        {field.optional && <span className="hint">Optional</span>}
        {!error && field.hint && <span className="hint">{field.hint}</span>}
      </span>
      {control}
      {error && <span className="field-error" id={`${field.key}-error`}>{error}</span>}
    </label>
  );
}
