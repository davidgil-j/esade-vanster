'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, prefersReducedMotion } from '@/lib/motion';

// Lenis dentro del reloj de GSAP: un solo reloj para scroll, ScrollTrigger y three.js.
// Con movimiento reducido no hay scroll suavizado: scroll nativo.
export default function SmoothScroll() {
  useEffect(() => {
    // Las tipografías cambian las alturas al cargar: se recalculan las posiciones.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    setLenis(lenis);
    document.documentElement.classList.add('lenis');

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  return null;
}
