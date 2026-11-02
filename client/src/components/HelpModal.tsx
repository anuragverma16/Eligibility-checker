import { useEffect } from 'react';
import { X } from 'lucide-react';

const STEPS = [
  { title: 'Choose a scheme', text: 'Browse the funding schemes and pick the one closest to your goal.' },
  { title: 'Share your details', text: 'Enter applicant details and the scheme-specific information. Amounts are checked against the scheme range.' },
  { title: 'Get your eligibility card', text: 'Download or print the card. Keep the Verification ID to look up your application later.' },
];

export function HelpModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <p className="eyebrow">How it works</p>
        <h2 id="help-title">From choice to eligibility card in three steps</h2>
        <ol className="steps-list">
          {STEPS.map((step, index) => (
            <li key={step.title} className="reveal" style={{ '--delay': `${100 + index * 90}ms` } as React.CSSProperties}>
              <span>{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
