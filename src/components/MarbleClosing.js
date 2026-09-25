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
// La llegada a Esade: mientras el cierre sube, la cámara se acerca a la fachada (escala 1 → 1,16 como
// mucho, ligada al scroll) y lleva el rótulo «esade» al centro y arriba, justo encima de la pregunta del
// cierre, que va centrada: el rótulo corona el texto y ninguna letra lo pisa. La foto sube y por
// abajo se funde en el mármol. Ya en reposo al final, sigue acercándose muy despacio (CSS, 26 s,
// solo mientras el cierre está en pantalla).
const ZOOM = 0.16;
const SIGN_MIN_TOP = 84; // bajo la isla
// En el móvil en vertical el texto del cierre ocupa casi toda la pantalla: la cámara sube el rótulo a
// la franja de arriba, libre de texto; y el campus entra más tarde, cuando el 1-2-3 ya se ha ido.
const PORTRAIT = '(orientation: portrait) and (max-width: 899px)';
// El rótulo en el fotograma (scripts/rotulo.py lo deja nítido y quita la bandera de al lado), en
// fracciones de la imagen: letras y banda. En el móvil, la imagen es el recorte vertical.
const SIGN = { x0: 0.36, x1: 0.524, y0: 0.315, y1: 0.5 };
const IMG = { w: 1280, h: 720 };
const MOBILE_CROP = { x: 360, w: 406 }; // recorte del móvil dentro del fotograma
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
    const nightImg = nightRef.current.querySelector('img');
    const portrait = window.matchMedia(PORTRAIT);
    // Dónde cae el rótulo en pantalla con la cámara en un estado (escala s, desplazamiento t, origen O)
    const signRect = (Wl, Hl, s, tx, ty, Ox, Oy) => {
      const mob = portrait.matches;
      const iw = mob ? MOBILE_CROP.w : IMG.w;
      const c = Math.max(Wl / iw, Hl / IMG.h);
      const dw = iw * c;
      const dh = IMG.h * c;
      const ox = (Wl - dw) / 2;
      const oy = (Hl - dh) / 2;
      const fx = (x) => (mob ? (x * IMG.w - MOBILE_CROP.x) / MOBILE_CROP.w : x);
      const map = (px, py) => [Ox + (px - Ox) * s + tx, Oy + (py - Oy) * s + ty];
      const [l, t] = map(ox + fx(SIGN.x0) * dw, oy + SIGN.y0 * dh);
      const [r, b] = map(ox + fx(SIGN.x1) * dw, oy + SIGN.y1 * dh);
      // La foto se ve dentro de su caja (object-fit: cover recorta a la caja), no entera
      const [il, it] = map(0, 0);
      const [ir] = map(Wl, Hl);
      return { l, t, r, b, il, it, ir };
    };
    const title = end.querySelector('.cierre__title');
    if (!win) return undefined;
    const update = () => {
      // Lectura primero, escritura después
      const L = layer.getBoundingClientRect();
      const W = win.getBoundingClientRect();
      const C = end.getBoundingClientRect();
      const T = title ? title.getBoundingClientRect() : null;
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
      const late = portrait.matches ? 0.75 : 0.35;
      // La llegada: de que el cierre asoma a que queda asentado al final de la página
      const arrive = clamp01((vh - C.top) / Math.max(1, C.height));
      const Wl = L.width;
      const Hl = L.height;
      let s;
      let tx = 0;
      let ty = 0;
      const Ox = Wl / 2;
      const Oy = Hl / 2;
      // La pregunta, donde quedará al final de la página (el cierre acaba en el borde de abajo)
      const titleTop = T ? T.top - C.bottom + vh : Hl * 0.5;
      const air = Math.min(56, Math.max(28, Hl * 0.045));
      let fits = true;
      if (portrait.matches) {
        // Móvil: la cámara lleva el rótulo a que empiece a 108 px (bajo la isla), sin escala
        const r1 = signRect(Wl, Hl, 1, 0, 0, Ox, Oy);
        s = 1;
        ty = (108 - r1.t) * arrive;
        fits = 108 + (r1.b - r1.t) <= titleTop - air * 0.5;
      } else {
        // Escritorio: el estado final, con el rótulo centrado y su base a un respiro de la pregunta.
        // El acercamiento, el que quepa entre la isla y la pregunta (en pantallas bajas, menos)
        const r1 = signRect(Wl, Hl, 1, 0, 0, Ox, Oy);
        const room = titleTop - air - SIGN_MIN_TOP;
        const sEnd = Math.min(1 + ZOOM, Math.max(1, room / (r1.b - r1.t)));
        fits = room >= (r1.b - r1.t) * 0.97;
        const r = signRect(Wl, Hl, sEnd, 0, 0, Ox, Oy);
        // Centrado, sin destapar los lados de la foto
        const txEnd = Math.min(-r.il, Math.max(Wl - r.ir, Wl / 2 - (r.l + r.r) / 2));
        // La base del rótulo, encima de la pregunta; y su borde de arriba, nunca bajo la isla
        let tyEnd = titleTop - air - r.b;
        tyEnd = Math.max(tyEnd, SIGN_MIN_TOP - r.t);
        tyEnd = Math.min(tyEnd, -r.it); // sin destapar la foto por arriba
        s = 1 + (sEnd - 1) * arrive;
        tx = txEnd * arrive;
        ty = tyEnd * arrive;
      }
      // Al 88 %: el oscurecido del campus, un pelín más claro. Si el rótulo no cabe encima de la
      // pregunta (un móvil en horizontal), no hay campus: el cierre se queda en mármol.
      nightRef.current.style.opacity = fits ? (0.88 * clamp01((e - late) / (1 - late))).toFixed(3) : '0';
      nightImg.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
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
            <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/video/final-rotulo-movil.avif" />
            <source type="image/avif" srcSet="/video/final-rotulo.avif" />
            <img src="/video/final-rotulo.webp" alt="" loading="lazy" decoding="async" />
          </picture>
        </div>
      ) : null}
      {top}
      <div ref={endRef} className="closing__end">{children}</div>
    </div>
  );
}
