import type { CSSProperties } from 'react';
import { ArrowRight, BadgeCheck, Check, Clock, Lock, Sparkles } from 'lucide-react';

type Props = { schemeCount: number; onBrowse: () => void };

const PREVIEW_ROWS = [
  { label: 'Verification ID', value: 'GW-MUD-482913' },
  { label: 'Business stage', value: 'Existing (1–3 years)' },
  { label: 'Requirement', value: '₹3 Lakh' },
];

const PREVIEW_CHECKS = ['Identity verified', 'Business activity documented', 'Loan within category limit'];

export function Hero({ schemeCount, onBrowse }: Props) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy reveal" style={{ '--delay': '0ms' } as CSSProperties}>
          <span className="hero-badge"><Sparkles size={14} /> Government and private funding eligibility</span>
          <h1>Find the funding you qualify for, <em>in minutes.</em></h1>
          <p className="hero-lede">
            Pick a scheme, share the essentials, and receive an eligibility card with a verification ID you can download,
            print or look up later.
          </p>
          <div className="hero-actions">
            <button className="btn btn-gold btn-lg" onClick={onBrowse}>Browse {schemeCount} schemes <ArrowRight size={18} /></button>
          </div>
          <ul className="hero-points">
            <li><Clock size={15} /> About two minutes</li>
            <li><BadgeCheck size={15} /> No documents uploaded</li>
            <li><Lock size={15} /> Saved securely to the portal</li>
          </ul>
        </div>

        <div className="hero-visual reveal" style={{ '--delay': '150ms' } as CSSProperties} aria-hidden="true">
          <div className="preview-card">
            <div className="preview-top">
              <span className="preview-code">MUD</span>
              <div>
                <strong>MUDRA Loan</strong>
                <small>Sample eligibility card</small>
              </div>
              <span className="status-pill eligible"><Check size={13} /> Eligible</span>
            </div>
            <div className="preview-rows">
              {PREVIEW_ROWS.map((row) => (
                <div key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>
              ))}
            </div>
            <div className="preview-checks">
              {PREVIEW_CHECKS.map((check) => (
                <div key={check}><span className="preview-tick"><Check size={11} strokeWidth={3} /></span>{check}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats reveal" style={{ '--delay': '260ms' } as CSSProperties}>
        <div><strong>{schemeCount}</strong><span>funding schemes</span></div>
        <div><strong>Up to ₹50 Cr</strong><span>largest funding listed</span></div>
        <div><strong>3 steps</strong><span>from choice to card</span></div>
      </div>
    </section>
  );
}
