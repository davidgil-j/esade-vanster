'use client';

import { useEffect, useRef } from 'react';
import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import { COPY } from '@/content/copy';
import { LOGOS } from '@/lib/brand';
import { gsap, SplitText, prefersReducedMotion } from '@/lib/motion';

// Quiénes somos: habla Vänster y firma. Fucsia plano #C40452 (el de sus tarjetas y su mosaico),
// con el logotipo oficial en blanco, grande, y el texto al lado. Sube apilándose sobre «Con vuestra
// marca» con el borde líquido de Vänster. La frase grande se ilumina palabra a palabra con el
// scroll, del 20 % al 100 %.
export default function Nosotros() {
  const leadRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    // aria: 'none': el párrafo se lee tal cual (un aria-label en un <p> no está permitido)
    const split = SplitText.create(leadRef.current, { type: 'words', wordsClass: 'lit-word', aria: 'none' });
    const tween = gsap.fromTo(split.words, { opacity: 0.2 }, {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: leadRef.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); split.revert(); };
  }, []);

  return (
    <section id="nosotros" className="nosotros" data-tone="marble" aria-labelledby="nosotros-title">
      <div className="grid-page nosotros__grid">
        <Reveal className="nosotros__logo">
          <img src={LOGOS.vansterWhite} alt="Vänster" width="499" height="100" />
        </Reveal>
        <div className="nosotros__text">
          <SplitHeading className="h2" id="nosotros-title">{COPY.nosotros.title}</SplitHeading>
          <p ref={leadRef} className="nosotros__lead">{COPY.nosotros.body[0]}</p>
          <Reveal as="p" variant="fade" className="nosotros__body">{COPY.nosotros.body[1]}</Reveal>
        </div>
      </div>
    </section>
  );
}
