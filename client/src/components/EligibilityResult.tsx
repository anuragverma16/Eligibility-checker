import type { CSSProperties } from 'react';
import { ArrowLeft, ChevronRight, Download, Printer, RotateCcw } from 'lucide-react';
import type { FormValues, Scheme } from '../data/schemes';
import { schemeDetails } from '../data/schemeDetails';
import type { EligibilityStatus } from '../lib/eligibility';
import { EligibilityCard } from './EligibilityCard';

type Props = {
  scheme: Scheme;
  values: FormValues;
  status: EligibilityStatus;
  referenceId: string;
  today: string;
  displayName: string;
  organization: string;
  requirement: string;
  onDownload: () => void;
  onBack: () => void;
  onReset: () => void;
  onChooseAnother: () => void;
};

export function EligibilityResult({
  scheme, values, status, referenceId, today, displayName, organization, requirement,
  onDownload, onBack, onReset, onChooseAnother,
}: Props) {
  const details = schemeDetails[scheme.id];

  return (
    <section className="result" style={{ '--card-accent': details.coverFrom } as CSSProperties}>
      <button type="button" className="link-back" onClick={onBack}><ArrowLeft size={16} /> Edit details</button>

      <EligibilityCard
        scheme={scheme}
        values={values}
        status={status}
        referenceId={referenceId}
        dateLabel="Generated"
        dateValue={today}
        displayName={displayName}
        organization={organization}
        requirement={requirement}
      />

      <div className="result-actions reveal" style={{ '--delay': '520ms' } as CSSProperties}>
        <button className="btn btn-primary btn-lg" onClick={onDownload}><Download size={18} /> Download card</button>
        <button className="btn btn-secondary btn-lg" onClick={() => window.print()}><Printer size={17} /> Print</button>
      </div>
      <div className="result-links reveal" style={{ '--delay': '580ms' } as CSSProperties}>
        <button onClick={onReset}><RotateCcw size={15} /> Start over</button>
        <button onClick={onChooseAnother}>Choose a different scheme <ChevronRight size={16} /></button>
      </div>
    </section>
  );
}
