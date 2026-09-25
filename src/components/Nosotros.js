'use client';

import Reveal from './Reveal';
import { COPY } from '@/content/copy';
import { LOGOS } from '@/lib/brand';

// Quiénes somos: el 1-2-3 de L'Occitane con la voz de Vänster. Fucsia plano, tres ideas cortas y
// una ventana cuadrada del mármol con el logotipo en blanco. Esa ventana es el punto de partida del
// cierre: al llegar, se abre hasta ocupar la pantalla (MarbleClosing). En móvil va al final, justo
// antes del cierre; en escritorio, abajo a la izquierda. Sin JavaScript o con movimiento reducido
// se ve la imagen fija del mármol.
export default function Nosotros() {
  return (
    <section id="nosotros" className="nosotros" data-tone="marble" aria-labelledby="nosotros-title">
      <div className="grid-page nosotros__grid">
        <h2 id="nosotros-title" className="nosotros__eyebrow">{COPY.nosotros.title}</h2>
        <ol className="nosotros__ideas">
          {COPY.nosotros.ideas.map((idea, i) => (
            <Reveal as="li" key={idea} variant="fade" delay={i * 0.08} className="nosotros__idea">
              <span className="nosotros__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="nosotros__text">{idea}</span>
            </Reveal>
          ))}
        </ol>
        <div className="nosotros__window" data-marble-window>
          <picture className="nosotros__still" aria-hidden="true">
            <source type="image/avif" srcSet="/marmol/marmol-fucsia-texto-16x9-movil.avif" />
            <img src="/marmol/marmol-fucsia-texto-16x9-movil.webp" alt="" loading="lazy" decoding="async" />
          </picture>
          <img data-marble-logo className="nosotros__logo" src={LOGOS.vansterWhite} alt="Vänster" width="499" height="100" />
        </div>
      </div>
    </section>
  );
}
