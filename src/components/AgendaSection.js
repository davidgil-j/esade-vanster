'use client';

import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import CoverDesign from './objects/CoverDesign';
import { COPY } from '@/content/copy';
import { AGENDA_RENDER } from '@/content/agendaRender';
import { quadToMatrix3d } from '@/lib/quad';
import { gsap, ScrollTrigger, prefersReducedMotion, getLenis, scrollToTarget } from '@/lib/motion';

const Agenda3D = dynamic(() => import('./Agenda3D'), { ssr: false });

const useIsoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function webgl2() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

// Plan B de la firma: render estático de calidad del mismo modelo, con el nombre
// superpuesto en perspectiva. Si todavía no hay render, la tapa en plano.
function StaticAgenda({ name }) {
  const boxRef = useRef(null);
  const [box, setBox] = useState(null);

  useIsoLayout(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!AGENDA_RENDER) {
    return (
      <div className="agenda__flat">
        <CoverDesign className="agenda__flat-cover" name={name} title={`Tapa de la agenda Esade 2027 con el nombre ${name}`} />
      </div>
    );
  }

  const OW = 1000;
  const OH = 180;
  let transform;
  if (box) {
    const pts = AGENDA_RENDER.quad.map(([x, y]) => [x * box.w, y * box.h]);
    transform = quadToMatrix3d(OW, OH, pts);
  }
  return (
    <div ref={boxRef} className="agenda__render" style={{ aspectRatio: AGENDA_RENDER.aspect }}>
      <img src={AGENDA_RENDER.src} alt={`Agenda Esade 2027 con el nombre ${name} en la tapa`} decoding="async" />
      {transform ? (
        <svg className="agenda__render-name" viewBox={`0 0 ${OW} ${OH}`} width={OW} height={OH} style={{ transform }} aria-hidden="true">
          <defs>
            <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F4F6F8" />
              <stop offset="0.45" stopColor="#B9BEC6" />
              <stop offset="0.7" stopColor="#EEF0F3" />
              <stop offset="1" stopColor="#A9AFB8" />
            </linearGradient>
          </defs>
          <text x="0" y={OH * 0.78} fill="url(#foil)" textLength={name.length > 16 ? OW : undefined} lengthAdjust="spacingAndGlyphs"
            style={{ font: `600 ${OH * 0.78}px var(--font-montserrat), sans-serif` }}>
            {name}
          </text>
        </svg>
      ) : null}
    </div>
  );
}

export default function AgendaSection() {
  const [name, setName] = useState(COPY.agenda.fieldDefault);
  const [use3D, setUse3D] = useState(false);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [ready3D, setReady3D] = useState(false);
  const [renderMode, setRenderMode] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // ¿3D o plan B? WebGL2, sin movimiento reducido y sin ahorro de datos.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('render') === 'agenda') {
      setRenderMode(true);
      setUse3D(true);
      setNear(true);
      setActive(true);
      return;
    }
    const saveData = navigator.connection?.saveData;
    setUse3D(webgl2() && !prefersReducedMotion() && !saveData);
  }, []);

  // Se carga cuando la sección se acerca y solo se pinta mientras se ve.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || renderMode) return undefined;
    const ioNear = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '120% 0px' });
    const ioVis = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '10% 0px' });
    ioNear.observe(el);
    ioVis.observe(el);
    return () => { ioNear.disconnect(); ioVis.disconnect(); };
  }, [renderMode]);

  // La agenda se abre con el scroll (firma 3, versión corta): en escritorio la escena
  // se queda fija mientras se lee y se escribe; luego se abre.
  // En móvil no se ata al scroll: la agenda está encima del campo, se ve cerrada mientras
  // se escribe y se abre al terminar (al cerrar el teclado) o con un toque.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const set = () => setDesktop(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useEffect(() => {
    if (!use3D || renderMode || !desktop) return undefined;
    progressRef.current = 0;
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => { progressRef.current = Math.max(0, (self.progress - 0.3) / 0.62); },
    });
    return () => st.kill();
  }, [use3D, renderMode, desktop]);

  const openTo = (value) => {
    gsap.to(progressRef, { current: value, duration: value ? 1.6 : 0.9, ease: 'power3.inOut', overwrite: true });
  };

  const onFocus = () => {
    if (desktop) return;
    openTo(0);
    // La agenda y el campo, a la vez a la vista (encima del teclado).
    const stage = stageRef.current;
    if (!stage) return;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
    const y = stage.getBoundingClientRect().top + window.scrollY - header - 8;
    setTimeout(() => {
      if (getLenis()) scrollToTarget(y, { duration: 0.6 });
      else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, 60);
  };
  const onBlur = () => { if (!desktop && use3D) openTo(1); };
  const onStageTap = () => {
    if (desktop || !use3D) return;
    openTo(progressRef.current > 0.5 ? 0 : 1);
  };

  // Inclinación hacia el puntero, solo con ratón.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointerRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const leave = () => { pointerRef.current.x = 0; pointerRef.current.y = 0; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []);

  // Intro en el campo: se baja hasta que la agenda está abierta.
  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    e.currentTarget.blur();
    if (!desktop) return; // en móvil, el blur ya abre la agenda
    const track = trackRef.current;
    if (!track) return;
    const end = track.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    if (getLenis()) scrollToTarget(end, { duration: 1.8 });
    else window.scrollTo({ top: end, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const onQuad = (quad) => {
    window.__agendaQuad = quad;
    document.documentElement.setAttribute('data-agenda-quad', 'ready');
  };

  const show3D = use3D && near;

  return (
    <section id="agenda" className={`agenda ${renderMode ? 'is-render' : ''}`} data-tone="light" aria-labelledby="agenda-title">
      <div ref={trackRef} className={`agenda__track ${use3D ? 'has-3d' : ''}`}>
        <div className="agenda__sticky grid-page">
          <div className="agenda__text">
            <SplitHeading className="h2" id="agenda-title">{COPY.agenda.title}</SplitHeading>
            <Reveal className="agenda__body">
              {COPY.agenda.body.map((p) => <p key={p}>{p}</p>)}
            </Reveal>
            <div className="field">
              <label className="field__label" htmlFor="agenda-name">{COPY.agenda.fieldLabel}</label>
              <input
                id="agenda-name"
                className="field__input"
                type="text"
                value={name}
                maxLength={36}
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                enterKeyHint="done"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>
          <div ref={stageRef} className={`agenda__stage ${ready3D ? 'is-3d-ready' : ''}`} onClick={onStageTap}>
            <div className="agenda__fallback" aria-hidden={show3D && ready3D ? 'true' : undefined}>
              <StaticAgenda name={name || ' '} />
            </div>
            {show3D ? (
              <div className="agenda3d" aria-hidden="true">
                <Agenda3D
                  name={name}
                  progressRef={progressRef}
                  pointerRef={pointerRef}
                  active={active}
                  mode={renderMode ? 'render' : 'live'}
                  onQuad={onQuad}
                  onReady={() => setReady3D(true)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
