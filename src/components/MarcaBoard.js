import { ESADE, LOGOS, tanDeg } from '@/lib/brand';

// «Con vuestra marca»: un pliego con las reglas del manual hechas objeto, sin rótulos.
// Tres piezas: los dos azules con una diagonal a 15º, la palabra esade como en el logotipo
// y una diagonal a 5º. Cada pieza, como mucho 3 colores y siempre un azul.
export default function MarcaBoard() {
  const W = 400;
  const H = 300;
  const rise15 = W * tanDeg(15);
  return (
    <div className="marca-board" aria-hidden="true">
      <svg className="marca-board__blues" viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={ESADE.dark} />
        <polygon points={`0,${H * 0.62} ${W},${H * 0.62 - rise15} ${W},${H} 0,${H}`} fill={ESADE.light} />
      </svg>
      <div className="marca-board__word">
        <img src={LOGOS.esadeBlue} alt="" width="393" height="196" />
      </div>
      <svg className="marca-board__five" viewBox="0 0 400 200">
        <rect width="400" height="200" fill={ESADE.white} />
        <polygon points={`0,${150} 400,${150 - 400 * tanDeg(5)} 400,200 0,200`} fill={ESADE.dark} />
      </svg>
    </div>
  );
}
