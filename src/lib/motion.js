'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

// Un solo registro de plugins y un solo reloj (gsap.ticker) para toda la página:
// Lenis, ScrollTrigger, los muelles y el shader del mármol avanzan en el mismo fotograma.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('vanster', '0.22,1,0.36,1');
  // Nada de medir el layout en cada scroll si la barra del navegador móvil cambia de alto.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// ── Tokens (PLAN.md · 5): una sola curva de entrada y cuatro duraciones ──
export const EASE = 'vanster'; // cubic-bezier(0.22, 1, 0.36, 1)
export const D = { press: 0.1, ui: 0.3, mid: 0.45, enter: 0.7 };
// Muelle sin rebote: rigidez 400 y amortiguación crítica (2·√400 = 40). Con 30 rebotaría un 3 %.
export const SPRING = { stiffness: 400, damping: 40 };
// Para giros grandes (tapa, hoja): más lento, también sin rebote (2·√170 ≈ 26).
export const SPRING_SOFT = { stiffness: 170, damping: 26 };

let lenisInstance = null;
export const setLenis = (l) => { lenisInstance = l; };
export const getLenis = () => lenisInstance;

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const isFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const isCoarse = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// Desplazamiento a un ancla: por Lenis si está (el salto nativo pelea con la interpolación).
export function scrollToTarget(target, opts = {}) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, ...opts });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else el?.scrollIntoView({ behavior });
}

// Muelle con velocidad inicial, en el reloj de GSAP. Sale del valor actual (interrumpible) y
// hereda la velocidad del gesto: sin costura entre arrastrar y soltar.
export function spring({ from, to, velocity = 0, stiffness = SPRING.stiffness, damping = SPRING.damping, precision = 0.001, onUpdate, onComplete }) {
  let x = from;
  let v = velocity;
  let alive = true;
  const scale = Math.max(Math.abs(to - from), 1);
  const tick = (_t, deltaTime) => {
    const dt = Math.min(deltaTime, 50) / 1000;
    const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const a = -stiffness * (x - to) - damping * v;
      v += a * h;
      x += v * h;
    }
    if (Math.abs(x - to) < precision * scale && Math.abs(v) < precision * scale * 10) {
      x = to;
      v = 0;
      stop();
      onUpdate?.(x, v);
      onComplete?.();
      return;
    }
    onUpdate?.(x, v);
  };
  function stop() {
    if (!alive) return;
    alive = false;
    gsap.ticker.remove(tick);
  }
  gsap.ticker.add(tick);
  return { stop, get value() { return x; }, get velocity() { return v; } };
}

// Proyección del gesto (Apple, «Designing Fluid Interfaces»): adónde llegaría con esa velocidad.
export const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Draggable, con allowNativeTouchScrolling y un proxy, pone touch-action: manipulation en el
// disparador: el navegador se queda también el gesto horizontal y lo corta con pointercancel.
// En los arrastres horizontales, el vertical es del scroll y el horizontal es nuestro: pan-y.
export function panY(draggable) {
  const t = draggable?.vars?.trigger;
  (Array.isArray(t) ? t : [t]).forEach((el) => { if (el?.style) el.style.touchAction = 'pan-y'; });
  return draggable;
}

// Draggable e InertiaPlugin solo hacen falta para los arrastres (todos bajo la portada): se cargan
// aparte, después de hidratar, y no cuentan en el JS inicial.
let dragModules = null;
export function loadDrag() {
  dragModules = dragModules || Promise.all([import('gsap/Draggable'), import('gsap/InertiaPlugin')]).then(([d, i]) => {
    gsap.registerPlugin(d.Draggable, i.InertiaPlugin);
    return { Draggable: d.Draggable, InertiaPlugin: i.InertiaPlugin };
  });
  return dragModules;
}

export { gsap, ScrollTrigger, SplitText };
