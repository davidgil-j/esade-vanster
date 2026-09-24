'use client';

import { useEffect, useRef, useState } from 'react';
import Lockup from './Lockup';
import { gsap, EASE, D, prefersReducedMotion } from '@/lib/motion';

// El lockup grande de la portada viaja con el scroll hasta su sitio en la cabecera (FLIP con
// scrub, en los primeros 60vh). Al llegar se convierte en el logo de la cabecera. Sin pin: la
// página baja con normalidad. Va fuera de la portada para quedar por encima de «La idea».
// Con movimiento reducido o sin JavaScript no existe: se queda el lockup quieto de la portada.
export default function FlyingLockup() {
  const [on, setOn] = useState(false);
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !document.getElementById('hero-lockup-slot')) return;
    setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return undefined;
    const d = document.documentElement;
    const el = outerRef.current;
    const slot = document.getElementById('hero-lockup-slot');
    const target = document.querySelector('.site-header__brand .lockup');
    d.classList.add('fly-on');

    // Medidas solo al preparar y al refrescar (nunca dentro del bucle de animación).
    // Todo va en transform (también el punto de partida): mover left/top contaría como CLS.
    const geo = { x0: 0, y0: 0, dx: 0, dy: 0, s: 1 };
    const hero = slot.closest('.hero');
    const measure = () => {
      // Posición del hueco dentro de la portada, sin transformaciones (la portada escala a 0,94 al
      // quedar debajo). Mientras es sticky, su borde superior coincide con el de la pantalla.
      let x = 0;
      let y = 0;
      let n = slot;
      while (n && n !== hero) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      geo.x0 = x;
      geo.y0 = y;
      const w0 = el.querySelector('.lockup').offsetWidth;
      const tr = target.getBoundingClientRect();
      geo.s = tr.width / w0;
      geo.dx = tr.left - x;
      geo.dy = tr.top - y;
    };
    measure();

    gsap.set(el, { x: geo.x0, y: geo.y0 });
    const tween = gsap.fromTo(el, { x: () => geo.x0, y: () => geo.y0, scale: 1 }, {
      x: () => geo.x0 + geo.dx,
      y: () => geo.y0 + geo.dy,
      scale: () => geo.s,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.6,
        scrub: true,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onUpdate: (self) => d.classList.toggle('lockup-home', self.progress > 0.995),
        onLeave: () => d.classList.add('lockup-home'),
        onEnterBack: () => d.classList.remove('lockup-home'),
      },
    });
    // Entrada: al final de la secuencia de la portada
    const enter = () => gsap.fromTo(innerRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: D.enter, ease: EASE });
    const already = d.classList.contains('hero-fallback');
    if (already) gsap.set(innerRef.current, { opacity: 1 });
    window.addEventListener('vx:lockup-in', enter);
    return () => {
      window.removeEventListener('vx:lockup-in', enter);
      tween.scrollTrigger?.kill();
      tween.kill();
      d.classList.remove('fly-on', 'lockup-home');
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={outerRef} className="fly-lockup" aria-hidden="true">
      <div ref={innerRef} className="fly-lockup__inner">
        <Lockup tone="dark" className="lockup--big" />
      </div>
    </div>
  );
}
