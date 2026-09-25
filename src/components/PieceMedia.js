'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

// El objeto de cada pieza entra barriendo desde su lado de la composición (la agenda, de izquierda a
// derecha; el calendario, en espejo), como una foto que se desliza sobre la mesa, y la imagen se
// asienta de 1,06 a 1 a la vez. Cuenta la alternancia de las dos piezas; no es decoración.
// Después, un parallax corto con el scroll (scrub, sin pin: el scroll nunca se retiene) solo con
// ratón y en escritorio. Visible por defecto: el estado inicial solo se aplica al arrancar.
// Con movimiento reducido, quieto.
const WIPE = 1.15;
const expoOut = 'expo.out';

const PieceMedia = forwardRef(function PieceMedia({ from = 'left', children }, fwd) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const inner = el.firstElementChild;
    let tween;
    let settle;
    const hidden = from === 'left' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)';
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        tween = gsap.fromTo(el, { clipPath: hidden }, { clipPath: 'inset(0% 0% 0% 0%)', duration: WIPE, ease: expoOut, clearProps: 'clipPath' });
        settle = gsap.fromTo(inner, { scale: 1.06, transformOrigin: from === 'left' ? '0% 50%' : '100% 50%' }, { scale: 1, duration: WIPE + 0.3, ease: expoOut, clearProps: 'transform' });
      },
    });
    let para;
    const fine = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
    if (fine) {
      para = gsap.fromTo(el, { y: 36 }, { y: -36, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    return () => { st.kill(); tween?.revert(); settle?.revert(); para?.scrollTrigger?.kill(); para?.revert(); };
  }, [from]);

  return (
    <div
      ref={(node) => { ref.current = node; if (typeof fwd === 'function') fwd(node); else if (fwd) fwd.current = node; }}
      className="piece__object"
    >
      {children}
    </div>
  );
});

export default PieceMedia;
