'use client';

import { useEffect, useRef, useState } from 'react';
import MarbleLayer from './MarbleLayer';
import { ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

// El paso de «Quiénes somos» al cierre (el patrón de L'Occitane): la ventana de mármol se abre hasta
// ser el fondo del cierre, y dentro aparece el campus de Esade en fucsia.
// Hay una sola capa, fija a la pantalla (sticky) por debajo del texto: mármol vivo y, encima, el
// anochecer del vídeo en multiplicar. Mientras se lee el 1-2-3, la capa está recortada exactamente
// a la ventana (la ventana sube con el scroll y el mármol se queda quieto detrás, como una ventana
// de verdad). Al llegar el cierre, el recorte se abre con aceleración y frenada suaves hasta cubrir
// la pantalla, y a mitad de camino el campus entra por el mármol. No hay pin: la página baja con
// normalidad todo el rato; solo cambia el recorte.
// El texto blanco siempre se lee: el mármol es el de texto (4,8:1 como mínimo) y multiplicar solo
// oscurece. Con movimiento reducido o sin clip-path redondeado: la ventana con su imagen y el
// cierre de siempre (anochecer bajo el fucsia).
// Empieza cuando el 1-2-3 ya se ha leído entero (la ventana, cuadrada, se ve un buen rato) y
// termina cuando el cierre ha subido al 30 %: su titular llega ya sobre el campus.
const OPEN_FROM = 0.72; // borde inferior de la ventana a esta altura de pantalla: empieza a abrirse
const OPEN_TO = 0.3; // el cierre ha subido hasta aquí: abierto del todo
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function MarbleClosing({ top, children }) {
  const [on, setOn] = useState(false);
  const wrapRef = useRef(null);
  const layerRef = useRef(null);
  const nightRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    setOn(!prefersReducedMotion() && CSS.supports('clip-path', 'inset(0px round 1px)'));
  }, []);

  useEffect(() => {
    if (!on) return undefined;
    const layer = layerRef.current;
    const end = endRef.current;
    const win = wrapRef.current.querySelector('[data-marble-window]');
    const logo = wrapRef.current.querySelector('[data-marble-logo]');
    if (!win) return undefined;
    const update = () => {
      // Lectura primero, escritura después
      const L = layer.getBoundingClientRect();
      const W = win.getBoundingClientRect();
      const C = end.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(win).borderTopLeftRadius) || 0;
      const vh = window.innerHeight;
      const gap = C.top - W.bottom; // no cambia con el scroll
      const from = vh * OPEN_FROM;
      const to = vh * OPEN_TO - gap;
      const raw = clamp01((from - W.bottom) / (from - to));
      const e = easeInOutCubic(raw);
      // El logotipo de la ventana se disuelve en el primer 40 %: el del cierre toma el relevo
      const f = clamp01(raw / 0.4);
      if (logo) {
        logo.style.opacity = String(1 - f);
        logo.style.transform = `scale(${(1 + f * 0.08).toFixed(3)})`;
      }
      // El campus entra por el mármol en la segunda mitad de la apertura
      nightRef.current.style.opacity = clamp01((e - 0.35) / 0.65).toFixed(3);
      // Al final de la curva se suelta el recorte (si no, quedan píxeles de fucsia en los bordes)
      if (e > 0.985) { layer.style.clipPath = 'none'; return; }
      const k = 1 - e;
      layer.style.clipPath = `inset(${((W.top - L.top) * k).toFixed(1)}px ${((L.right - W.right) * k).toFixed(1)}px ${((L.bottom - W.bottom) * k).toFixed(1)}px ${((W.left - L.left) * k).toFixed(1)}px round ${(radius * k).toFixed(1)}px)`;
    };
    update();
    const st = ScrollTrigger.create({ trigger: wrapRef.current, start: 'top bottom', end: 'bottom top', onUpdate: update, onRefresh: update });
    const ro = new ResizeObserver(update);
    ro.observe(win);
    return () => { st.kill(); ro.disconnect(); };
  }, [on]);

  return (
    <div ref={wrapRef} className={`closing${on ? ' is-on' : ''}`}>
      {on ? (
        <div ref={layerRef} className="closing__layer" aria-hidden="true" data-print="hide">
          <MarbleLayer name="cierre" variant="fucsia" />
          <picture ref={nightRef} className="closing__night">
            <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/video/final-movil.avif" />
            <source type="image/avif" srcSet="/video/final.avif" />
            <img src="/video/final.webp" alt="" loading="lazy" decoding="async" />
          </picture>
        </div>
      ) : null}
      {top}
      <div ref={endRef} className="closing__end">{children}</div>
    </div>
  );
}
