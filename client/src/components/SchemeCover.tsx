import { Factory, HeartHandshake, Landmark, Leaf, Lightbulb, Milk, Palette, Rocket, ShieldCheck, Sprout, Store, Users, Wheat, type LucideIcon } from 'lucide-react';
import type { SchemeDetails } from '../data/schemeDetails';

const ICONS: Record<SchemeDetails['icon'], LucideIcon> = {
  Store, HeartHandshake, Sprout, Users, Factory, ShieldCheck, Landmark, Rocket, Wheat, Milk, Lightbulb, Palette, Leaf,
};

// Designed cover for each scheme: gradient, faint rings and the scheme icon. Replaces the old screenshots.
export function SchemeCover({ details, badge, size = 'card' }: { details: SchemeDetails; badge?: string; size?: 'card' | 'preview' }) {
  const Icon = ICONS[details.icon];
  return (
    <div
      className={`scheme-cover scheme-cover-${size}`}
      style={{ background: `linear-gradient(135deg, ${details.coverFrom}, ${details.coverTo})` }}
    >
      <span className="cover-ring ring-one" />
      <span className="cover-ring ring-two" />
      <span className="cover-icon"><Icon size={size === 'card' ? 34 : 44} strokeWidth={1.6} /></span>
      {badge && <span className="cover-badge">{badge}</span>}
    </div>
  );
}
