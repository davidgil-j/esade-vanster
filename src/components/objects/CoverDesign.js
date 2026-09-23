import { ESADE, LOGOS, ESADE_LOGO_RATIO, tanDeg } from '@/lib/brand';

// Tapa de la agenda Esade 2027, en plano (A5, 148 × 210).
// Pieza de Esade: azul oscuro, azul claro y blanco (3 colores); una diagonal a 10º.
export const COVER = {
  w: 148,
  h: 210,
  band: { y0: 0.76, angle: 10 },
  logo: { x: 0.12, y: 0.085, w: 0.4 },
  year: { x: 0.88, y: 0.935, size: 0.062 },
  name: { x: 0.12, y: 0.645, size: 0.072, maxW: 0.76 },
};

export default function CoverDesign({ name = '', className = '', title }) {
  const { w, h, band, logo, year } = COVER;
  const y0 = h * band.y0;
  const y1 = y0 - w * tanDeg(band.angle);
  const lw = w * logo.w;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width={w} height={h} fill={ESADE.dark} />
      <polygon points={`0,${y0} ${w},${y1} ${w},${h} 0,${h}`} fill={ESADE.light} />
      <image href={LOGOS.esadeWhite} x={w * logo.x} y={h * logo.y} width={lw} height={lw * ESADE_LOGO_RATIO} />
      <text
        x={w * year.x}
        y={h * year.y}
        textAnchor="end"
        fill={ESADE.white}
        style={{ font: `700 ${w * year.size}px var(--font-montserrat), sans-serif` }}
      >
        2027
      </text>
      {name ? (
        <text
          x={w * COVER.name.x}
          y={h * COVER.name.y}
          fill="#DADDE2"
          style={{ font: `600 ${w * COVER.name.size}px var(--font-montserrat), sans-serif` }}
        >
          {name}
        </text>
      ) : null}
    </svg>
  );
}
