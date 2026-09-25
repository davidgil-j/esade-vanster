'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';

// Bruma del mármol de Vänster en cada pieza (la de las fichas de L'Occitane), distinta en cada una:
// - la agenda: el mármol apaisado, del lado del texto (derecha), subiendo con el scroll;
// - el calendario: el mármol vertical (otras vetas, a otra escala), en espejo (izquierda),
//   bajando con el scroll.
// Parallax con scrub (sin pin) y una deriva lentísima en CSS, solo con ratón en escritorio.
// Encima, un velo fijo del color del fondo hace el desvanecido: la GPU solo compone capas ya
// pintadas. Con movimiento reducido o en móvil, quieta.
const PARALLAX = 80;
const SRC = {
  agenda: { avif: '/marmol/marmol-fucsia-texto-16x9.avif', webp: '/marmol/marmol-fucsia-texto-16x9.webp', movil: '/marmol/marmol-fucsia-texto-16x9-movil.avif', dir: 1 },
  calendario: { avif: '/marmol/marmol-fucsia-texto-9x16.avif', webp: '/marmol/marmol-fucsia-texto-9x16.webp', movil: '/marmol/marmol-fucsia-texto-9x16-movil.avif', dir: -1 },
};

export default function MarbleWash({ piece = 'agenda' }) {
  const ref = useRef(null);
  const src = SRC[piece];

  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion() || !fine) return undefined;
    const tween = gsap.fromTo(el.querySelector('.wash__move'), { y: -PARALLAX * src.dir }, {
      y: PARALLAX * src.dir,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [src.dir]);

  return (
    <span ref={ref} className={`wash wash--${piece}`} aria-hidden="true" data-print="hide">
      <span className="wash__move">
        <span className="wash__drift">
          <picture>
            <source type="image/avif" media="(max-width: 899px)" srcSet={src.movil} />
            <source type="image/avif" srcSet={src.avif} />
            <img src={src.webp} alt="" loading="lazy" decoding="async" />
          </picture>
        </span>
      </span>
      <span className="wash__veil" />
    </span>
  );
}
