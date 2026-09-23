import { ESADE, LOGOS, ESADE_LOGO_RATIO, MONTH_DESIGNS, monthGrid, tanDeg } from '@/lib/brand';
import { MONTHS, WEEKDAYS } from '@/content/copy';

// Una hoja del calendario de sobremesa: dos paneles, el diseño y el mes.
// Pieza de Esade: solo azul oscuro, azul claro y blanco (el cuadro del día marcado
// es azul claro), diagonales a 5, 10 o 15 grados desde la horizontal.
const PW = 160; // ancho de cada panel
const PH = 150;

function DesignPanel({ month }) {
  const d = MONTH_DESIGNS[month];
  const bg = ESADE[d.bg];
  const band = ESADE[d.band];
  const rise = PW * tanDeg(d.angle);
  const y0 = PH * 0.68;
  const pts = d.dir === 'up'
    ? `0,${y0} ${PW},${y0 - rise} ${PW},${PH} 0,${PH}`
    : `0,${y0 - rise} ${PW},${y0} ${PW},${PH} 0,${PH}`;
  const second = d.second
    ? (() => {
      const y2 = PH * 0.84;
      const r2 = PW * tanDeg(5);
      const p2 = d.dir === 'up'
        ? `0,${y2 - r2} ${PW},${y2} ${PW},${PH} 0,${PH}`
        : `0,${y2} ${PW},${y2 - r2} ${PW},${PH} 0,${PH}`;
      return <polygon points={p2} fill={ESADE[d.second]} />;
    })()
    : null;
  const lw = PW * 0.36;
  const monthColor = d.bg === 'white' ? ESADE.dark : ESADE.white;
  return (
    <g>
      <rect width={PW} height={PH} fill={bg} />
      <polygon points={pts} fill={band} />
      {second}
      <image
        href={d.logo === 'white' ? LOGOS.esadeWhite : LOGOS.esadeBlue}
        x={PW * 0.1}
        y={PH * 0.1}
        width={lw}
        height={lw * ESADE_LOGO_RATIO}
      />
      <text
        x={PW * 0.1}
        y={PH * 0.5}
        fill={monthColor}
        style={{ font: `700 ${PW * 0.13}px var(--font-montserrat), sans-serif`, letterSpacing: '-0.02em' }}
      >
        {MONTHS[month]}
      </text>
    </g>
  );
}

function MonthPanel({ month, marked }) {
  const cells = monthGrid(month);
  const m = 12;
  const colW = (PW - m * 2) / 7;
  const top = 34;
  const rowH = (PH - top - 10) / 6;
  return (
    <g transform={`translate(${PW}, 0)`}>
      <rect width={PW} height={PH} fill={ESADE.white} />
      <text x={PW - m} y={20} textAnchor="end" fill={ESADE.light} style={{ font: `700 9px var(--font-montserrat), sans-serif` }}>
        2027
      </text>
      {WEEKDAYS.map((w, i) => (
        <text key={w + i} x={m + colW * (i + 0.5)} y={top} textAnchor="middle" fill={ESADE.light}
          style={{ font: `700 6.4px var(--font-mulish), sans-serif` }}>
          {w}
        </text>
      ))}
      {cells.map((day, i) => {
        if (!day) return null;
        const col = i % 7;
        const row = Math.floor(i / 7);
        const cx = m + colW * (col + 0.5);
        const cy = top + rowH * (row + 0.75);
        const on = marked === day;
        return (
          <g key={i}>
            {on ? <rect x={cx - colW * 0.42} y={cy - rowH * 0.62} width={colW * 0.84} height={rowH * 0.86} fill={ESADE.light} /> : null}
            <text x={cx} y={cy} textAnchor="middle" fill={on ? ESADE.white : ESADE.dark}
              style={{ font: `${on ? 700 : 600} 7.6px var(--font-mulish), sans-serif` }}>
              {day}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function CalendarSheet({ month = 0, marked = null, className = '' }) {
  return (
    <svg className={className} viewBox={`0 0 ${PW * 2} ${PH}`} role="img"
      aria-label={`Hoja de ${MONTHS[month]} de 2027 del calendario de sobremesa de Esade${marked ? `, con el día ${marked} marcado` : ''}`}>
      <DesignPanel month={month} />
      <MonthPanel month={month} marked={marked} />
      <line x1={PW} y1="0" x2={PW} y2={PH} stroke="rgba(0,11,61,0.12)" strokeWidth="0.6" />
    </svg>
  );
}
