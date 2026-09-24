'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

// La sección de debajo en un apilado: sticky y, mientras la de encima sube, escala a 0,94 y se
// oscurece un poco (scrub, sin pin). Si es más alta que la pantalla, se queda pegada por abajo
// (top negativo), para que se lea entera antes de quedar tapada.
export default function StackCover({ over, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const setTop = () => {
      const h = el.offsetHeight;
      el.style.top = `${Math.min(0, window.innerHeight - h)}px`;
    };
    setTop();
    ScrollTrigger.addEventListener('refreshInit', setTop);
    if (prefersReducedMotion()) return () => ScrollTrigger.removeEventListener('refreshInit', setTop);
    const target = document.querySelector(over);
    const tl = gsap.timeline({ scrollTrigger: { trigger: target, start: 'top bottom', end: 'top top', scrub: true } });
    tl.fromTo(el.querySelector('.stack__inner') || el.firstElementChild, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
      .fromTo(el.querySelector('.stack__dim'), { opacity: 0 }, { opacity: 0.4, ease: 'none' }, 0);
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setTop);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [over]);
  return (
    <div ref={ref} className="stack__under">
      <div className="stack__inner">{children}</div>
      <div className="stack__dim" aria-hidden="true" />
    </div>
  );
}
