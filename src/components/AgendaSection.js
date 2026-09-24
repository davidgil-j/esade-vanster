'use client';

import { useId, useRef, useState } from 'react';
import AgendaOpen from './AgendaOpen';
import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import { COPY } from '@/content/copy';
import { isFinePointer } from '@/lib/motion';

// Pieza 1 · La agenda 2027. Un solo objeto: la agenda vista desde arriba, cerrada con el nombre en
// la tapa, que se personaliza desde el campo y se abre arrastrando en el mismo sitio. Misma
// estructura que el calendario (pieza 2): título a toda anchura, objeto protagonista, texto y campo
// al lado. En móvil, el objeto va justo encima del campo, para verlo mientras se escribe.
export default function AgendaSection() {
  const [name, setName] = useState(COPY.agenda.fieldDefault);
  const inputId = useId();
  const openRef = useRef(null);
  const shown = name.trim() || COPY.agenda.fieldDefault;

  return (
    <section id="agenda" className="piece piece--agenda" data-tone="light" aria-labelledby="agenda-title">
      <div className="grid-page piece__grid">
        <SplitHeading className="piece__title" id="agenda-title">{COPY.agenda.title}</SplitHeading>
        <div className="piece__object">
          <AgendaOpen ref={openRef} name={shown} />
        </div>
        <Reveal variant="fade" className="piece__body">
          {COPY.agenda.body.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
        <div className="field piece__field">
          <label className="field__label" htmlFor={inputId}>{COPY.agenda.fieldLabel}</label>
          <input
            id={inputId}
            className="field__input"
            type="text"
            value={name}
            maxLength={40}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="done"
            // Si está abierta, se cierra para que se vea el nombre en la tapa mientras se escribe
            onFocus={() => openRef.current?.close()}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              // En escritorio el foco se queda en el campo; en táctil se cierra el teclado.
              if (!isFinePointer()) e.currentTarget.blur();
            }}
          />
        </div>
      </div>
    </section>
  );
}
