'use client';

import { useEffect, useRef, useState } from 'react';
import Lockup from './Lockup';
import { gsap, ScrollTrigger, EASE, D, prefersReducedMotion } from '@/lib/motion';

// «vänster × esade» abajo en la portada, en sus colores oficiales (la foto es clara). Al bajar (como
// en L'Occitane): sube pegado a la página, al mismo ritmo que el scroll (1:1), y al llegar arriba se
// queda enganchado; en los últimos 360 px de recorrido se convierte, sin prisa y con muelle, en la
// isla: se hace algo más pequeño y la píldora aparece detrás (en el móvil empieza en blanco). Mientras sube, la portada se tiñe de
// mármol fucsia (Hero): a la vez, el lockup pasa a su versión blanca (el «vänster» fucsia se perdía en
// el fucsia), y vuelve a los colores al entrar en la píldora. La posición
// va pegada al scroll; la conversión va con muelle, así que llega un poco después y se asienta con
// suavidad aunque se baje deprisa. Al volver arriba hace el camino inverso.
// Va fuera de la portada para quedar por encima de «La idea». Solo transform y opacidad.
// Con movimiento reducido o sin JavaScript no existe: el lockup se queda quieto en la portada y la
// isla está siempre.
const MORPH = 360;
// Muelle de la conversión: rigidez 70, amortiguación 18, masa 1 (amortiguación crítica: sin rebote)
const K = 70;
const C = 18;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const map01 = (v, a, b) => clamp01((v - a) / (b - a));

export default function FlyingLockup() {
  const [on, setOn] = useState(false);
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const whiteRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !document.getElementById('hero-lockup-slot')) return;
    setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return undefined;
    const d = document.documentElement;
    const el = outerRef.current;
    const slot = document.getElementById('hero-lockup-slot');
    const target = document.querySelector('.island .lockup');
    const pill = document.querySelector('.island__pill');
    const hero = slot.closest('.hero');
    d.classList.add('fly-on');

    // Medidas solo al preparar y al refrescar (nunca en el bucle)
    const geo = { cx0: 0, y0: 0, w0: 1, cx1: 0, y1: 0, s1: 1, tint: 1, white0: 0 };
    const measure = () => {
      // El hueco dentro de la portada, sin transformaciones: con el scroll arriba, la portada
      // (sticky) empieza en el borde de la pantalla.
      let x = 0;
      let y = 0;
      let n = slot;
      while (n && n !== hero) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      geo.w0 = el.querySelector('.lockup').offsetWidth;
      geo.cx0 = x + slot.offsetWidth / 2;
      geo.y0 = y;
      // La isla, medida sin la escala que le pone la conversión (y sin su transición, que si no
      // devolvería la escala a medio camino)
      const pt = pill.style.transform;
      pill.style.transition = 'none';
      pill.style.transform = 'none';
      const tr = target.getBoundingClientRect();
      pill.style.transform = pt;
      pill.getBoundingClientRect();
      pill.style.transition = '';
      geo.s1 = tr.width / geo.w0;
      geo.cx1 = tr.left + tr.width / 2;
      geo.y1 = tr.top;
      // El tramo del tinte de la portada (Hero: 0,45 pantallas; 0,3 en el móvil; completo al 80 %)
      // En el móvil en vertical, abajo hay gente y banderines oscuros: allí empieza en blanco (sobre
      // el velo azul de la portada)
      geo.white0 = window.matchMedia('(orientation: portrait) and (max-width: 899px)').matches ? 1 : 0;
      geo.tint = window.innerHeight * (window.matchMedia('(max-width: 899px)').matches ? 0.3 : 0.45) * 0.8;
    };
    measure();

    let q = 0; // la conversión con muelle
    let v = 0;
    let last = '';
    const render = (p) => {
      const s = 1 + (geo.s1 - 1) * q;
      const cx = geo.cx0 + (geo.cx1 - geo.cx0) * q;
      const y = Math.max(geo.y1, geo.y0 - window.scrollY);
      const x = cx - (geo.w0 * s) / 2;
      const white = Math.max(geo.white0, clamp01(window.scrollY / geo.tint)) * (1 - map01(q, 0.35, 0.85));
      const key = `${x.toFixed(1)}|${y.toFixed(1)}|${s.toFixed(4)}|${white.toFixed(3)}`;
      if (key === last) return;
      last = key;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
      whiteRef.current.style.opacity = white.toFixed(3);
      pill.style.opacity = map01(q, 0.3, 1).toFixed(3);
      pill.style.transform = `scale(${(0.92 + 0.08 * map01(q, 0.3, 1)).toFixed(4)})`;
      d.classList.toggle('lockup-home', p >= 1 && q > 0.995);
    };
    const raw = () => clamp01(1 - (geo.y0 - window.scrollY - geo.y1) / MORPH);
    const tick = (time, dtMs) => {
      const p = raw();
      const dt = Math.min(0.05, dtMs / 1000);
      // Muelle hacia p; se asienta y se para (sin trabajo cuando todo está quieto)
      v += (K * (p - q) - C * v) * dt;
      q += v * dt;
      if (Math.abs(p - q) < 0.0005 && Math.abs(v) < 0.001) { q = p; v = 0; }
      render(p);
    };
    gsap.ticker.add(tick);
    const onRefresh = () => { measure(); last = ''; };
    ScrollTrigger.addEventListener('refreshInit', onRefresh);
    // Entrada: al final de la secuencia de la portada
    const enter = () => onRefresh() || gsap.fromTo(innerRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: D.enter, ease: EASE });
    if (d.classList.contains('hero-fallback')) gsap.set(innerRef.current, { opacity: 1 });
    window.addEventListener('vx:lockup-in', enter);
    return () => {
      window.removeEventListener('vx:lockup-in', enter);
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener('refreshInit', onRefresh);
      pill.style.opacity = '';
      pill.style.transform = '';
      pill.style.transition = '';
      d.classList.remove('fly-on', 'lockup-home');
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={outerRef} className="fly-lockup" aria-hidden="true">
      <div ref={innerRef} className="fly-lockup__inner">
        <span className="fly-lockup__base"><Lockup tone="light" className="lockup--big" /></span>
        <span ref={whiteRef} className="fly-lockup__white"><Lockup tone="dark" className="lockup--big" /></span>
      </div>
    </div>
  );
}
