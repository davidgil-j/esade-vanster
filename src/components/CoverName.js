'use client';

import { useEffect, useRef } from 'react';
import { FOTOS } from '@/content/fotos';

// El nombre en la tapa, en HTML, sobre la foto o sobre la tapa plana. Estampación en blanco
// perlado (degradado de blanco a #F1F2F4) con un reflejo que sigue al puntero (--sheen, 0–1).
// La caja mide 1000 unidades de ancho y tiene la proporción real de la tapa (0,77); se lleva a la
// foto con matrix3d desde las esquinas, o se escala sobre la tapa plana. Hasta 40 caracteres:
// si no cabe en el 72 % del ancho, la letra se reduce (nunca se estira).
export const BOX_W = 1000;
export const BOX_H = Math.round(BOX_W / FOTOS.pageRatio);
const N = FOTOS.cerrada.nombre;

// Ajuste: se mide el texto en su tamaño base (la caja no está transformada para el layout) y se
// reduce lo justo para que quepa. Solo al cambiar el nombre, nunca en un bucle.
function fit(el) {
  const base = N.size * BOX_W; // 72
  el.style.fontSize = `${base}px`;
  const w = el.offsetWidth;
  const max = N.maxW * BOX_W;
  if (w > max) el.style.fontSize = `${Math.floor(base * (max / w) * 10) / 10}px`;
}

export default function CoverName({ name, transform, className = '' }) {
  const textRef = useRef(null);
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    fit(el);
    document.fonts?.ready.then(() => fit(el));
  }, [name]);

  return (
    <div className={`cover-name ${className}`} style={{ width: BOX_W, height: BOX_H, transform }} aria-hidden="true">
      <span
        ref={textRef}
        className="cover-name__text"
        style={{ left: N.x * BOX_W, top: N.baseline * BOX_H, fontSize: N.size * BOX_W }}
      >
        {name}
      </span>
    </div>
  );
}
