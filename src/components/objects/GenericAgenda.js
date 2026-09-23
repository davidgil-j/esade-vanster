import { LOGOS, ESADE_LOGO_RATIO } from '@/lib/brand';

// La agenda "de catálogo" del comparador (coro 13), dibujada por nosotros: un cuaderno
// genérico con goma y el logo impreso pequeño. Sin fotos ni logos de otros clientes.
export default function GenericAgenda({ className = '' }) {
  const w = 148;
  const h = 210;
  const lw = 34;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <rect width={w} height={h} fill="#2A292E" />
      {/* grano de la tapa de polipiel */}
      <rect width={w} height={h} fill="url(#pu-grain)" opacity="0.5" />
      <defs>
        <pattern id="pu-grain" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="#2A292E" />
          <circle cx="1" cy="1" r="0.45" fill="#34333A" />
        </pattern>
      </defs>
      {/* goma elástica */}
      <rect x={w - 20} y="0" width="7" height={h} fill="#1B1A1E" />
      <rect x={w - 20} y="0" width="1" height={h} fill="#3A3940" />
      {/* logo impreso en una tinta, pequeño y centrado abajo */}
      <image
        href={LOGOS.esadeWhite}
        x={(w - 20 - lw) / 2}
        y={h * 0.8}
        width={lw}
        height={lw * ESADE_LOGO_RATIO}
        opacity="0.72"
      />
    </svg>
  );
}
