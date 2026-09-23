'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, EASE_OUT, prefersReducedMotion, scrollToTarget } from '@/lib/motion';
import { COPY } from '@/content/copy';

// Portada (PLAN.md · 2): el vídeo del campus, fotograma a fotograma, en un <canvas>.
// Provisional: frames de 720p en /public/hero-frames (local, fuera de Git).
const FRAMES = 120;
const SETS = {
  // Punto focal: el rótulo y la puerta (44 % del ancho y 45 % del alto del vídeo).
  d: { dir: '/hero-frames/d/', w: 1280, h: 720, fx: 0.44, fy: 0.45 },
  // Recorte 9:16 centrado en el punto focal (x = 361 px del original).
  m: { dir: '/hero-frames/m/', w: 404, h: 720, fx: 0.5, fy: 0.45 },
};
const src = (set, i) => `${SETS[set].dir}${String(i + 1).padStart(3, '0')}.webp`;
const TEXT_AT = 0.7; // el titular aparece hacia el 70 % del vídeo

// Recorrido del vídeo en pantallas: lo marca la variable CSS --hero-video (2 en escritorio,
// 1,3 en móvil vertical, para que el titular llegue antes del segundo gesto).
function videoScreens() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-video'));
  return Number.isFinite(v) && v > 0 ? v : 2;
}

// Orden de carga: primero uno de cada cuatro, luego los intermedios.
function loadOrder() {
  const first = [];
  const rest = [];
  for (let i = 0; i < FRAMES; i++) (i % 4 === 0 || i === FRAMES - 1 ? first : rest).push(i);
  return [...first, ...rest];
}

export default function HeroVideo() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const text = textRef.current;
    if (!root || !canvas) return undefined;

    if (prefersReducedMotion()) {
      root.classList.add('is-reduced');
      return undefined;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    const state = { set: null, images: [], loaded: new Set(), frame: 0, drawn: -1, w: 0, h: 0 };
    let alive = true;

    const pickSet = () => (window.innerHeight > window.innerWidth ? 'm' : 'd');

    const nearestLoaded = (i) => {
      if (state.loaded.has(i)) return i;
      for (let d = 1; d < FRAMES; d++) {
        if (i - d >= 0 && state.loaded.has(i - d)) return i - d;
        if (i + d < FRAMES && state.loaded.has(i + d)) return i + d;
      }
      return -1;
    };

    const draw = (force = false) => {
      const i = nearestLoaded(state.frame);
      if (i < 0 || (!force && i === state.drawn)) return;
      const img = state.images[i];
      const s = SETS[state.set];
      const cw = state.w;
      const ch = state.h;
      // "cover" respetando el punto focal
      const scale = Math.max(cw / s.w, ch / s.h);
      const dw = s.w * scale;
      const dh = s.h * scale;
      let dx = cw / 2 - s.fx * dw;
      let dy = ch / 2 - s.fy * dh;
      dx = Math.min(0, Math.max(cw - dw, dx));
      dy = Math.min(0, Math.max(ch - dh, dy));
      ctx.drawImage(img, dx, dy, dw, dh);
      state.drawn = i;
      if (!root.classList.contains('is-live')) root.classList.add('is-live');
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      state.w = Math.round(r.width * dpr);
      state.h = Math.round(r.height * dpr);
      canvas.width = state.w;
      canvas.height = state.h;
      draw(true);
    };

    const loadSet = (set) => {
      state.set = set;
      state.images = new Array(FRAMES);
      state.loaded = new Set();
      state.drawn = -1;
      const order = loadOrder();
      let cursor = 0;
      const next = () => {
        if (!alive || state.set !== set || cursor >= order.length) return;
        const i = order[cursor++];
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (!alive || state.set !== set) return;
          state.loaded.add(i);
          if (Math.abs(i - state.frame) < 4 || state.drawn < 0) draw();
          next();
        };
        img.onerror = next;
        img.src = src(set, i);
        state.images[i] = img;
      };
      // seis descargas a la vez
      for (let k = 0; k < 6; k++) next();
    };

    loadSet(pickSet());
    resize();

    const onResize = () => {
      const set = pickSet();
      if (set !== state.set) loadSet(set);
      resize();
    };
    window.addEventListener('resize', onResize);

    // El vídeo avanza en las primeras pantallas; en la última sube «La idea» y lo tapa.
    const video = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => `+=${window.innerHeight * videoScreens()}`,
      scrub: true,
      onUpdate: (self) => {
        state.frame = Math.min(FRAMES - 1, Math.round(self.progress * (FRAMES - 1)));
        draw();
      },
    });

    // Titular: escondido al principio, entra por líneas hacia el 70 %.
    let split;
    let textTl;
    if (text) {
      const title = text.querySelector('.hero__title');
      const rest = text.querySelectorAll('.hero__sub, .hero__cta');
      split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      textTl = gsap.timeline({ paused: true });
      textTl
        .from(split.lines, { yPercent: 110, duration: 0.9, ease: EASE_OUT, stagger: 0.08 })
        .from(rest, { autoAlpha: 0, y: 16, duration: 0.7, ease: EASE_OUT, stagger: 0.08 }, 0.35);
      textTl.progress(0).pause();
      gsap.set(text, { autoAlpha: 1 });
    }
    const textTrigger = ScrollTrigger.create({
      trigger: root,
      start: () => `top+=${window.innerHeight * videoScreens() * TEXT_AT} top`,
      end: 'bottom bottom',
      onEnter: () => textTl?.play(),
      onLeaveBack: () => textTl?.reverse(),
    });

    // Degradado: solo lo necesario para leer el texto, a la vez que el titular.
    const shade = root.querySelector('.hero__shade');
    const shadeTween = gsap.fromTo(
      shade,
      { opacity: 0.25 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: () => `top+=${window.innerHeight * videoScreens() * (TEXT_AT - 0.2)} top`,
          end: () => `top+=${window.innerHeight * videoScreens() * TEXT_AT} top`,
          scrub: true,
        },
      }
    );

    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
      video.kill();
      textTrigger.kill();
      // revert(), no kill(): devuelve los estilos iniciales (el efecto se monta dos veces
      // en desarrollo y, si no, la segunda vez anima de «escondido» a «escondido»).
      shadeTween.scrollTrigger?.kill();
      shadeTween.revert();
      textTl?.revert();
      split?.revert();
    };
  }, []);

  return (
    <section id="top" ref={rootRef} className="hero" data-tone="dark" aria-labelledby="hero-title">
      <div className="hero__stage">
        {/* Primer fotograma como imagen normal: el LCP no depende del resto */}
        <picture className="hero__poster">
          <source media="(orientation: portrait)" srcSet={src('m', 0)} />
          <img src={src('d', 0)} alt="" fetchPriority="high" decoding="async" />
        </picture>
        {/* Con movimiento reducido: solo el último fotograma */}
        <picture className="hero__last">
          <source media="(orientation: portrait)" srcSet={src('m', FRAMES - 1)} />
          <img src={src('d', FRAMES - 1)} alt="" loading="lazy" decoding="async" />
        </picture>
        <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />
        <div ref={textRef} className="hero__text grid-page">
          <h1 id="hero-title" className="hero__title">{COPY.hero.title}</h1>
          <p className="hero__sub">{COPY.hero.sub}</p>
          <a
            className="hero__cta link-arrow"
            href="#idea"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#idea');
            }}
          >
            {COPY.hero.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
