'use client';

import { useEffect, useState } from 'react';
import Lockup from './Lockup';
import CtaMail from './CtaMail';

// Cabecera fija (coro 11): el lockup cambia de archivo según el fondo que tiene debajo.
// Cada sección declara su fondo con data-tone="light | dark | vanster".
export default function Header() {
  const [tone, setTone] = useState('dark');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-tone]'));
    if (!sections.length) return undefined;
    let io;
    const build = () => {
      io?.disconnect();
      const line = 36; // mitad de la cabecera
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setTone(e.target.getAttribute('data-tone'));
          });
        },
        { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` }
      );
      sections.forEach((s) => io.observe(s));
    };
    build();
    window.addEventListener('resize', build);
    return () => {
      io?.disconnect();
      window.removeEventListener('resize', build);
    };
  }, []);

  return (
    <header className={`site-header tone-${tone}`}>
      <a className="site-header__brand" href="#top" aria-label="vänster × esade, inicio">
        <Lockup tone={tone} />
      </a>
      <CtaMail variant={tone === 'vanster' ? 'inverse' : tone === 'dark' ? 'ghost' : 'solid'} size="sm" className="site-header__cta" />
    </header>
  );
}
