'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, D, prefersReducedMotion } from '@/lib/motion';

// Entrada al aparecer: fundido corto para el texto, recorte (clip-path) para los objetos y «rise»
// para listas que se leen en orden (sube desde un desenfoque que se resuelve y, si lleva un filete
// [data-rule], lo dibuja de izquierda a derecha).
// Visible por defecto: el estado inicial solo se aplica en el instante en que arranca.
export default function Reveal({ as: Tag = 'div', className = '', children, delay = 0, y = 24, start = 'top 98%', variant = 'clip', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    let tween;
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        if (variant === 'rise') {
          const rule = el.querySelector('[data-rule]');
          tween = gsap.timeline({ delay })
            .fromTo(el, { opacity: 0, y: 28, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'expo.out', clearProps: 'opacity,transform,filter' }, 0);
          if (rule) tween.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.out', clearProps: 'transform' }, 0.08);
          return;
        }
        tween = variant === 'fade'
          ? gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: EASE, delay, clearProps: 'opacity,transform' })
          : gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)', y },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              y: 0,
              duration: D.enter,
              ease: EASE,
              delay,
              clearProps: 'clipPath,transform',
            }
          );
      },
    });
    return () => {
      st.kill();
      tween?.revert();
    };
  }, [delay, y, start, variant]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
