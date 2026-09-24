'use client';

import { useEffect, useRef } from 'react';
import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import { COPY } from '@/content/copy';
import { ESADE, LOGOS } from '@/lib/brand';
import { gsap, ScrollTrigger, EASE, D, prefersReducedMotion } from '@/lib/motion';

// «Con vuestra marca» (sección de Esade, bordes rectos). Cada regla del texto se demuestra con su
// pieza al entrar en pantalla:
// 1. los dos azules, que se abren con clip-path;
// 2. un contador de colores que llega a 3;
// 3. una diagonal que gira de 5 a 15° con el scroll mientras un número marca el ángulo;
// 4. «ESADE» en mayúsculas que se funde en el logo oficial en minúsculas (solo el fundido: el logo
//    no se anima por dentro).
// Sin JavaScript o con movimiento reducido, cada pieza se ve en su estado final.
export default function MarcaSection() {
  const boardRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const board = boardRef.current;
    const q = (s) => board.querySelector(s);
    const triggers = [];
    const once = (el, fn) => triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: fn }));

    // 1 · Azules
    const sw = board.querySelectorAll('.demo-blues__swatch');
    gsap.set(sw, { clipPath: 'inset(100% 0 0 0)' });
    once(q('.demo-blues'), () => gsap.to(sw, { clipPath: 'inset(0% 0 0 0)', duration: D.enter, ease: EASE, stagger: 0.1 }));

    // 2 · Contador de colores
    const num = q('.demo-count__num');
    const dots = board.querySelectorAll('.demo-count__dot');
    num.textContent = '0';
    gsap.set(dots, { opacity: 0, scale: 0.9 });
    once(q('.demo-count'), () => {
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          opacity: 1, scale: 1, duration: D.ui, ease: EASE, delay: i * 0.2,
          onStart: () => { num.textContent = String(i + 1); },
        });
      });
    });

    // 3 · Diagonal de 5 a 15° ligada al scroll
    const band = q('.demo-angle__band');
    const deg = q('.demo-angle__deg');
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: q('.demo-angle'),
      start: 'top 85%',
      end: 'bottom 35%',
      scrub: 0.3,
      onUpdate: (self) => {
        const a = 5 + self.progress * 10;
        band.style.transform = `rotate(${-a}deg)`;
        const r = Math.round(a);
        if (r !== last) { last = r; deg.textContent = `${r}°`; }
      },
    });
    triggers.push(st);

    // 4 · ESADE → esade
    const upper = q('.demo-logo__upper');
    const logo = q('.demo-logo__img');
    gsap.set(logo, { opacity: 0 });
    once(q('.demo-logo'), () => {
      gsap.timeline({ delay: 0.3 })
        .to(upper, { opacity: 0, duration: D.enter, ease: 'none' }, 0)
        .to(logo, { opacity: 1, duration: D.enter, ease: 'none' }, 0);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      // solo lo que se animó: los colores van en el style de React y no se tocan
      gsap.set([...sw], { clearProps: 'clipPath' });
      gsap.set([...dots, logo, upper], { clearProps: 'opacity,transform,scale' });
      band.style.transform = '';
      num.textContent = '3';
      deg.textContent = '15°';
    };
  }, []);

  return (
    <section id="marca" className="marca" data-tone="light" aria-labelledby="marca-title">
      <div className="marca__inner">
        <div className="grid-page marca__grid">
          <div className="marca__text">
            <SplitHeading className="h2" id="marca-title">{COPY.marca.title}</SplitHeading>
            <Reveal as="p" variant="fade" className="marca__body">{COPY.marca.body}</Reveal>
            <Reveal as="p" variant="fade" className="marca__close" delay={0.08}>{COPY.marca.close}</Reveal>
          </div>
          <div ref={boardRef} className="marca__board" aria-hidden="true">
            <div className="demo demo-blues">
              <span className="demo-blues__swatch" style={{ background: ESADE.dark }} />
              <span className="demo-blues__swatch" style={{ background: ESADE.light }} />
            </div>
            <div className="demo demo-count">
              <span className="demo-count__num">3</span>
              <span className="demo-count__dots">
                <span className="demo-count__dot" style={{ background: ESADE.dark }} />
                <span className="demo-count__dot" style={{ background: ESADE.light }} />
                <span className="demo-count__dot demo-count__dot--white" />
              </span>
            </div>
            <div className="demo demo-angle">
              <span className="demo-angle__band" />
              <span className="demo-angle__deg">15°</span>
            </div>
            <div className="demo demo-logo">
              <span className="demo-logo__upper">ESADE</span>
              <img className="demo-logo__img" src={LOGOS.esadeBlue} alt="" width="393" height="196" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
