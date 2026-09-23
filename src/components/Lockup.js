import { LOGOS } from '@/lib/brand';

// «vänster × esade»: Vänster primero. Los logos se cambian de archivo según el fondo,
// nunca se recolorean (CLAUDE.md).
export default function Lockup({ tone = 'light', className = '' }) {
  const onDark = tone !== 'light';
  return (
    <span className={`lockup ${className}`}>
      <img
        className="lockup__vanster"
        src={onDark ? LOGOS.vansterWhite : LOGOS.vansterColor}
        alt="Vänster"
        width="361"
        height="74"
      />
      <span className="lockup__x" aria-hidden="true">×</span>
      <img
        className="lockup__esade"
        src={onDark ? LOGOS.esadeWhite : LOGOS.esadeBlue}
        alt="esade"
        width="393"
        height="196"
      />
    </span>
  );
}
