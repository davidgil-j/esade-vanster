'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';

// Capa de profundidad de una pieza (scrub, sin pin, solo con ratón y en escritorio). Tres velocidades
// en cada ficha: el mármol de fondo, lento (MarbleWash); la pieza, un poco más lenta que la página
// (depth > 0, se queda atrás); el texto, un poco más rápido (depth < 0, va por delante). Así la letra
// no se mueve pegada al fondo. Sin recortes ni barridos: la pieza está siempre entera (antes el
// barrido dejaba franjas blancas mientras entraba). Con movimiento reducido o en táctil, quieto.
const PieceMedia = forwardRef(function PieceMedia({ depth = -28, className = 'piece__object', children }, fwd) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
    if (!el || prefersReducedMotion() || !fine) return undefined;
    const tween = gsap.fromTo(el, { y: -depth }, { y: depth, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    return () => { tween.scrollTrigger?.kill(); tween.revert(); };
  }, [depth]);

  return (
    <div
      ref={(node) => { ref.current = node; if (typeof fwd === 'function') fwd(node); else if (fwd) fwd.current = node; }}
      className={className}
    >
      {children}
    </div>
  );
});

export default PieceMedia;
