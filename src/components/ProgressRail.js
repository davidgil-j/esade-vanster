'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion';
import { useToneAt } from '@/lib/useTone';

// Indicador de progreso: un banderín de Esade, como los de la Rambla de la portada, colgado de su
// brazo. Se llena de arriba abajo con el fucsia de Vänster, en el sentido en que se recorre la página:
// lo relleno es lo ya leído (el equivalente de la espiga de lavanda de L'Occitane). Sobre fondo claro,
// silueta en tinta y relleno fucsia; sobre mármol o fucsia, en blanco. Aparece con el primer scroll y
// solo con ratón (en el móvil no aporta y tapaba texto). Decorativo: fuera del árbol de accesibilidad.
// La altura del documento se mide al refrescar, nunca en el bucle; en el bucle, solo clip-path.
const BANNER = 'M5 7 H23 V154 Q23 156 21 156 H7 Q5 156 5 154 Z';

export default function ProgressRail() {
  const [mouse, setMouse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const on = () => setMouse(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mouse ? <Banner /> : null;
}

function Banner() {
  const fillRef = useRef(null);
  const [shown, setShown] = useState(false);
  const tone = useToneAt(() => window.innerHeight / 2, 'light');

  useEffect(() => {
    let max = 1;
    let last = -1;
    let seen = false;
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    const tick = () => {
      const y = window.scrollY;
      if (!seen && y > 8) { seen = true; setShown(true); }
      const p = Math.min(1, Math.max(0, y / max));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      fillRef.current.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); ScrollTrigger.removeEventListener('refresh', measure); };
  }, []);

  return (
    <div className={`rail tone-${tone}${shown ? ' is-on' : ''}`} aria-hidden="true" data-print="hide">
      <svg viewBox="0 0 28 160" className="rail__svg">
        {/* El brazo del que cuelga */}
        <path className="rail__arm" d="M1 3.5 H27" />
        <path className="rail__base" d={BANNER} />
        <g ref={fillRef} className="rail__fill">
          <path d={BANNER} />
        </g>
      </svg>
    </div>
  );
}
