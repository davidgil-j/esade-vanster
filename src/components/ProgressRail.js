'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion';
import { useToneAt } from '@/lib/useTone';

// Raíl de progreso: una espiral wire-o vertical de 24 anillas finas que se rellenan con el
// progreso: de fucsia sobre fondo claro y de blanco sobre fucsia, mármol o vídeo. En móvil, más
// pequeña. La altura del documento se mide al refrescar, nunca en el bucle.
const N = 24;
const GAP = 12;

export default function ProgressRail() {
  const fillRef = useRef(null);
  const tone = useToneAt(() => window.innerHeight / 2, 'video');

  useEffect(() => {
    let max = 1;
    let last = -1;
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    const tick = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      fillRef.current.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); ScrollTrigger.removeEventListener('refresh', measure); };
  }, []);

  const rings = Array.from({ length: N }, (_, i) => (
    <path key={i} d={`M3 ${6 + i * GAP} c 0 -4 14 -4 14 0 c 0 4 -14 4 -14 0`} />
  ));
  return (
    <div className={`rail tone-${tone}`} aria-hidden="true">
      <svg className="rail__base" viewBox={`0 0 20 ${N * GAP + 4}`}>{rings}</svg>
      <svg ref={fillRef} className="rail__fill" viewBox={`0 0 20 ${N * GAP + 4}`}>{rings}</svg>
    </div>
  );
}
