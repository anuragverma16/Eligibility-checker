import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

type Props = {
  onSchemes: () => void;
  onHowItWorks: () => void;
  onTrack: () => void;
};

export function Navbar({ onSchemes, onHowItWorks, onTrack }: Props) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Schemes', action: onSchemes },
    { label: 'How it works', action: onHowItWorks },
    { label: 'Track application', action: onTrack },
  ];

  function go(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <header className={`navbar ${open ? 'open' : ''}`}>
      <div className="navbar-inner">
        <a className="brand" href="/" aria-label="Grantwise home">
          <Logo />
          <span className="brand-text">
            <strong>Grantwise</strong>
            <small>Funding eligibility portal</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <button key={link.label} className="nav-link" onClick={() => go(link.action)}>{link.label}</button>
          ))}
        </nav>

        <div className="nav-cta">
          <button className="btn btn-primary btn-sm" onClick={() => go(onSchemes)}>Check eligibility</button>
        </div>

        <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mobile-panel">
          {links.map((link) => (
            <button key={link.label} className="mobile-link" onClick={() => go(link.action)}>{link.label}</button>
          ))}
          <button className="btn btn-primary" onClick={() => go(onSchemes)}>Check eligibility</button>
        </div>
      )}
    </header>
  );
}
