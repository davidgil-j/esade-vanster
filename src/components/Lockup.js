import { LOGOS } from '@/lib/brand';

// «vänster × esade»: Vänster primero. Los logos cambian de archivo según el fondo y nunca se
// recolorean ni van dentro de cajas (CLAUDE.md y PLAN.md · 5, retoque 12.A). Sobre fondos oscuros,
// de color o de mármol va la versión blanca oficial tal cual: que por los huecos de la cinta se vea
// el fondo es lo normal en un logo invertido. Sobre fondo claro, la azul. El «×», en el amarillo de
// la veta del mármol.
export default function Lockup({ tone = 'light', className = '' }) {
  const onDark = tone !== 'light';
  return (
    <span className={`lockup ${className}`}>
      <img className="lockup__vanster" src={onDark ? LOGOS.vansterWhite : LOGOS.vansterColor} alt="Vänster" width="499" height="100" />
      <span className="lockup__x" aria-hidden="true">×</span>
      <img className="lockup__esade" src={onDark ? LOGOS.esadeWhite : LOGOS.esadeBlue} alt="esade" width="393" height="196" />
    </span>
  );
}
