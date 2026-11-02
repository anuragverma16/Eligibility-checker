import { LOGO_MARK_PATH } from '../lib/brand';

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="12" className="logo-bg" />
      <path d={LOGO_MARK_PATH} className="logo-fg" />
    </svg>
  );
}
