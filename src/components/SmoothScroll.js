'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, prefersReducedMotion } from '@/lib/motion';

// Lenis solo con rueda y trackpad (en táctil, scroll nativo: en L'Occitane llegó a bloquear el
// Safari del iPhone). lerp 0,1 y un solo reloj: Lenis avanza dentro de gsap.ticker, junto con
// ScrollTrigger, los muelles y el mármol. Con movimiento reducido, scroll nativo.
export default function SmoothScroll() {
  useEffect(() => {
    // Las tipografías cambian las alturas al cargar: se recalculan las posiciones una vez.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion() || !fine) return undefined;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
