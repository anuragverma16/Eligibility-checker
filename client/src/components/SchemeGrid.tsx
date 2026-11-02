import { ArrowRight, Search } from 'lucide-react';
import type { CSSProperties, MouseEvent } from 'react';
import type { Scheme, SchemeId } from '../data/schemes';
import { schemeDetails } from '../data/schemeDetails';
import { SchemeCover } from './SchemeCover';

type Props = {
  schemes: Scheme[];
  totalCount: number;
  query: string;
  selectedId: SchemeId | null;
  onQueryChange: (value: string) => void;
  onSelect: (scheme: Scheme) => void;
};

export function SchemeGrid({ schemes, totalCount, query, selectedId, onQueryChange, onSelect }: Props) {
  return (
    <section id="schemes" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Funding schemes</p>
          <h2>Choose the scheme that fits your goal</h2>
          <p className="muted">Each scheme shows its funding range, who administers it and what you will need.</p>
        </div>
        <div className="search-box">
          <Search size={16} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, sector or amount"
            aria-label="Search schemes"
          />
          <span className="count">{schemes.length}/{totalCount}</span>
        </div>
      </div>

      {schemes.length === 0 ? (
        <p className="empty">No schemes match “{query}”. Try a keyword such as loan, grant or startup.</p>
      ) : (
        <div className="scheme-grid">
          {schemes.map((scheme, index) => (
            <SchemeCard key={scheme.id} scheme={scheme} index={index} selected={selectedId === scheme.id} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}

function SchemeCard({ scheme, index, selected, onSelect }: { scheme: Scheme; index: number; selected: boolean; onSelect: (scheme: Scheme) => void }) {
  const details = schemeDetails[scheme.id];

  // Tilts the card toward the pointer; the sheen follows it.
  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const style = event.currentTarget.style;
    style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
    style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
    style.setProperty('--sheen-x', `${((x + 0.5) * 100).toFixed(1)}%`);
  }

  function handleLeave(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  }

  return (
    <button
      type="button"
      className={`scheme-card ${selected ? 'selected' : ''}`}
      style={{ '--card-accent': details.coverFrom, '--delay': `${Math.min(index, 8) * 60}ms` } as CSSProperties}
      onClick={() => onSelect(scheme)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <SchemeCover details={details} badge={scheme.badge} />
      <div className="scheme-body">
        <div className="scheme-meta">
          <span className="code-chip">{details.code}</span>
          <span className="eyebrow-small">{scheme.eyebrow}</span>
        </div>
        <h3>{scheme.title}</h3>
        <p className="scheme-desc">{scheme.description}</p>
        <div className="scheme-foot">
          <div>
            <small>Funding range</small>
            <strong>{scheme.amount}</strong>
          </div>
          <span className="arrow"><ArrowRight size={16} /></span>
        </div>
      </div>
    </button>
  );
}
