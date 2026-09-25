'use client';

import AgendaVideo from './AgendaVideo';
import MarbleTitle from './MarbleTitle';
import Reveal from './Reveal';
import MarbleWash from './MarbleWash';
import PieceMedia from './PieceMedia';
import { COPY } from '@/content/copy';

// Pieza 01 · La agenda. La ficha de producto de L'Occitane: la pieza (el vídeo, apaisado) a un lado en
// 7 columnas y, al otro, el número, el titular y el texto; el calendario va en espejo. En móvil se
// apila con la pieza primero. La bruma del mármol de Vänster, del lado del texto.
export default function AgendaSection() {
  return (
    <section id="agenda" className="piece piece--agenda" data-tone="light" aria-labelledby="agenda-title">
      <MarbleWash piece="agenda" />
      <div className="grid-page piece__grid">
        <PieceMedia depth={28}>
          <AgendaVideo />
        </PieceMedia>
        <PieceMedia depth={-56} className="piece__text">
          <p className="piece__num" aria-hidden="true">01</p>
          <MarbleTitle className="piece__title" id="agenda-title">{COPY.agenda.title}</MarbleTitle>
          <Reveal variant="fade" className="piece__body">
            {COPY.agenda.body.map((p) => <p key={p}>{p}</p>)}
          </Reveal>
        </PieceMedia>
      </div>
    </section>
  );
}
