'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, D, prefersReducedMotion } from '@/lib/motion';

// Titular de las piezas con el mármol de Vänster dentro de las letras (como el titular de la
// portada de L'Occitane): Vänster firma el catálogo en sus palabras y el objeto sigue siendo de
// Esade. El mármol es la variante oscura para titulares (6,4:1 sobre blanco y 5,7:1 sobre el gris
// papel en el píxel más claro) y deriva muy despacio (CSS). El texto sigue siendo texto.
// Entra entero tras una máscara (no por líneas ni por palabras: partido, el navegador reparte las
// líneas distinto y al juntarse saltaba de línea). Con marble={false}, el mismo titular sin mármol. Visible por defecto: solo se esconde en el instante en que arranca.
export default function MarbleTitle({ as: Tag = 'h2', id, className = '', children, start = 'top 98%', marble = true }) {
  const innerRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    let tween;
    const st = ScrollTrigger.create({
      trigger: el.parentElement,
      start,
      once: true,
      onEnter: () => {
        tween = gsap.fromTo(el, { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: EASE, clearProps: 'transform' });
      },
    });
    return () => { st.kill(); tween?.revert(); };
  }, [start]);

  return (
    <Tag id={id} className={`mask ${className}`}>
      <span ref={innerRef} className={`mask__inner${marble ? ' marble-text' : ''}`}>{children}</span>
    </Tag>
  );
}
