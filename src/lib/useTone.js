'use client';

import { useEffect, useState } from 'react';

// Tono del fondo que hay bajo una línea horizontal de la pantalla (px desde arriba).
// Cada sección lo declara con data-tone="video | marble | light". Gana la última sección, en el
// orden del documento, que cubre la línea: las que suben apilándose tapan a la de debajo.
// Solo se mide en los avisos del IntersectionObserver, nunca en cada scroll.
export function useToneAt(lineFn, initial = 'video') {
  const [tone, setTone] = useState(initial);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-tone]'));
    if (!sections.length) return undefined;
    let io;
    const build = () => {
      io?.disconnect();
      const line = Math.round(lineFn());
      const pick = () => {
        let current = null;
        sections.forEach((s) => {
          const r = s.getBoundingClientRect();
          if (r.top <= line && r.bottom > line) current = s;
        });
        if (current) setTone(current.getAttribute('data-tone'));
      };
      io = new IntersectionObserver(pick, {
        rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`,
        threshold: [0, 1],
      });
      sections.forEach((s) => io.observe(s));
      pick();
    };
    build();
    window.addEventListener('resize', build);
    return () => {
      io?.disconnect();
      window.removeEventListener('resize', build);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return tone;
}
