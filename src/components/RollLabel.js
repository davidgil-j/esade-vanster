// Etiqueta de botón con las letras que ruedan al pasar el ratón (coro 8, Skiper 58).
// 15 ms por letra y 300 ms como mucho en total (PLAN.md): la duración de cada letra
// es lo que queda. Si la etiqueta fuera más larga, se reparte el escalonado.
const TOTAL = 300;
const STEP = 15;
const MIN_CHAR = 90;

export default function RollLabel({ text }) {
  const chars = Array.from(text);
  const gaps = Math.max(1, chars.length - 1);
  const step = Math.min(STEP, (TOTAL - MIN_CHAR) / gaps);
  const charDur = Math.round(TOTAL - step * gaps);
  return (
    <span className="roll" style={{ '--roll-dur': `${charDur}ms` }}>
      <span className="sr-only">{text}</span>
      <span className="roll__track" aria-hidden="true">
        {chars.map((c, i) => {
          const glyph = c === ' ' ? ' ' : c;
          return (
            <span key={i} className="roll__char" style={{ '--d': `${Math.round(i * step)}ms` }}>
              <span className="roll__a">{glyph}</span>
              <span className="roll__b">{glyph}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
