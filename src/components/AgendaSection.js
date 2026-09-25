'use client';

import AgendaOpen from './AgendaOpen';
import MarbleTitle from './MarbleTitle';
import Reveal from './Reveal';
import MarbleWash from './MarbleWash';
import PieceMedia from './PieceMedia';
import { COPY } from '@/content/copy';

// Pieza 1 · La agenda 2027. Un solo objeto: la agenda vista desde arriba, que se abre arrastrando
// en el mismo sitio. Misma estructura que el calendario (pieza 2): título a toda anchura, objeto
// protagonista y el texto al lado, sobre la bruma del mármol de Vänster.
export default function AgendaSection() {
  return (
    <section id="agenda" className="piece piece--agenda" data-tone="light" aria-labelledby="agenda-title">
      <MarbleWash piece="agenda" />
      <div className="grid-page piece__grid">
        <MarbleTitle className="piece__title" id="agenda-title">{COPY.agenda.title}</MarbleTitle>
        <PieceMedia from="left">
          <AgendaOpen />
        </PieceMedia>
        <Reveal variant="fade" className="piece__body">
          {COPY.agenda.body.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
      </div>
    </section>
  );
}
