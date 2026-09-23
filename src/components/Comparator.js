'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CoverDesign from './objects/CoverDesign';
import GenericAgenda from './objects/GenericAgenda';

// Comparador catálogo contra diseño (coro 13). Se arrastra la costura: a la izquierda,
// la agenda genérica con el logo impreso; a la derecha, la agenda diseñada para Esade.
// Sin JavaScript se ven las dos una al lado de la otra.
export default function Comparator() {
  const frameRef = useRef(null);
  const [pos, setPos] = useState(50);
  const [ready, setReady] = useState(false);
  const dragging = useRef(false);

  useEffect(() => setReady(true), []);

  const setFromClientX = useCallback((x) => {
    const r = frameRef.current.getBoundingClientRect();
    const p = ((x - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, p)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - step));
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + step));
    else if (e.key === 'Home') setPos(4);
    else if (e.key === 'End') setPos(96);
    else return;
    e.preventDefault();
  };

  if (!ready) {
    return (
      <div className="compare compare--static">
        <div className="compare__item"><GenericAgenda className="compare__obj" /></div>
        <div className="compare__item"><CoverDesign className="compare__obj" /></div>
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      className="compare"
      style={{ '--pos': `${pos}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="compare__layer compare__layer--generic">
        <GenericAgenda className="compare__obj" />
      </div>
      <div className="compare__layer compare__layer--design">
        <CoverDesign className="compare__obj" />
      </div>
      <div
        className="compare__handle"
        role="slider"
        tabIndex={0}
        aria-label="Comparar la agenda de catálogo con la agenda diseñada para Esade"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
      >
        <span className="compare__grip" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
        </span>
      </div>
    </div>
  );
}
