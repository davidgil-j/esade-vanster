'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Photo from './Photo';
import Handle from './Handle';
import CoverName, { BOX_W } from './CoverName';
import { FOTOS } from '@/content/fotos';
import {
  gsap, ScrollTrigger, EASE, D, SPRING_SOFT, spring, project, clamp, prefersReducedMotion, panY, loadDrag,
} from '@/lib/motion';

// Abrir la agenda arrastrando, en vista cenital (PLAN.md · 5, punto 6).
// Sobre la foto abierta (sin la página izquierda y con la semana del 4 al 10 de enero en la
// derecha), la tapa compuesta tapa la página derecha. Se arrastra en horizontal y gira sobre la
// espiral (rotateY con perspectiva) hasta posarse a la izquierda, enseñando el interior de la tapa.
// - Draggable con velocidad: si al soltar la proyección pasa del 50 %, termina con un muelle sin
//   rebote; si no, vuelve. El muelle hereda la velocidad del dedo.
// - Pista: al entrar en pantalla la tapa se levanta 8° y vuelve, una vez.
// - La tapa es un botón (Intro o Espacio la abre y la cierra). Nunca bloquea el scroll vertical.
const G = FOTOS.abierta;
const hingeX = (G.izquierda[1][0] + G.derecha[0][0]) / 2; // centro del lomo
const coverW = ((G.derecha[1][0] - G.derecha[0][0]) + (G.izquierda[1][0] - G.izquierda[0][0])) / 2;
const coverTop = (G.derecha[0][1] + G.derecha[1][1] + G.izquierda[0][1] + G.izquierda[1][1]) / 4;
const coverBot = (G.derecha[2][1] + G.derecha[3][1] + G.izquierda[2][1] + G.izquierda[3][1]) / 4;
const [rx, ry, rw, rh] = G.anillas;

// Encuadre: se ve una franja de la foto (FW de su ancho) a toda altura. Cerrada, la franja va a la
// derecha y la agenda queda casi centrada; al abrirse, la franja se desplaza hasta centrar la doble
// página en el lomo. Es la misma agenda de principio a fin, sin cortes de plano.
const fwFor = () => (window.matchMedia('(max-width: 899px)').matches ? 0.76 : 0.8);
const smooth = (t) => t * t * (3 - 2 * t);

const AgendaOpen = forwardRef(function AgendaOpen({ name }, ref) {
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const coverRef = useRef(null);
  const handleRef = useRef(null);
  const shadeFront = useRef(null);
  const shadeBack = useRef(null);
  const castRight = useRef(null);
  const castLeft = useRef(null);
  const angle = useRef(0);
  const [open, setOpen] = useState(false);
  const [faceScale, setFaceScale] = useState(0.5);
  const size = useRef({ w: 1, h: 1, persp: 1, fw: 0.8 });
  const anim = useRef(null);
  const lastDrag = useRef(0);

  // Pinta un ángulo: solo transform y opacity, sin leer el layout.
  const render = (a) => {
    angle.current = a;
    const r = (a * Math.PI) / 180;
    coverRef.current.style.transform = `rotateY(${-a}deg)`;
    // Paneo del encuadre con el giro
    const { w: sw, fw } = size.current;
    const xClosed = 1 - fw;
    const xOpen = hingeX - fw / 2;
    const xL = xClosed + (xOpen - xClosed) * smooth(clamp(a / 180, 0, 1));
    stageRef.current.style.transform = `translate3d(${(-xL * sw).toFixed(2)}px,0,0)`;
    const front = a < 90 ? (a / 90) * 0.42 : 0.42;
    const back = a > 90 ? (1 - (a - 90) / 90) * 0.42 : 0.42;
    shadeFront.current.style.opacity = front;
    shadeBack.current.style.opacity = back;
    castRight.current.style.opacity = a < 90 ? Math.sin(r) * 0.9 : 0;
    castLeft.current.style.opacity = a > 90 ? Math.sin(r) * 0.9 : 0;
    // El tirador sigue al borde exterior de la tapa, proyectado con la misma perspectiva
    const { w, persp } = size.current;
    const cw = coverW * w;
    const z = cw * Math.sin(r);
    const x = hingeX * w + (cw * Math.cos(r) * persp) / (persp - z);
    handleRef.current.style.transform = `translate3d(${x}px,0,0) translate(-50%,-50%)`;
    handleRef.current.dataset.dir = a > 90 ? 'right' : 'left';
  };

  const settle = (to, velocity = 0) => {
    anim.current?.stop();
    const target = to ? 180 : 0;
    setOpen(!!to);
    if (prefersReducedMotion()) { render(target); return; }
    anim.current = spring({ from: angle.current, to: target, velocity, ...SPRING_SOFT, onUpdate: (v) => render(clamp(v, -2, 182)) });
  };

  useImperativeHandle(ref, () => ({ close: () => { if (angle.current > 0.5) settle(false); } }));

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const measure = () => {
      const fw = fwFor();
      frame.style.setProperty('--fw', String(fw));
      const w = stage.offsetWidth;
      const h = stage.offsetHeight;
      const persp = w * 1.6;
      size.current = { w, h, persp, fw };
      stage.style.perspective = `${persp}px`;
      stage.style.perspectiveOrigin = `${hingeX * 100}% 50%`;
      setFaceScale((coverW * w) / BOX_W);
      render(angle.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);

    // Reflejo de la estampación del nombre: sigue al puntero; en táctil, al scroll.
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = frame.getBoundingClientRect();
        frame.style.setProperty('--sheen', ((e.clientX - box.left) / box.width).toFixed(3));
      });
    };
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let sheenST;
    if (!prefersReducedMotion()) {
      if (fine) frame.addEventListener('pointermove', move, { passive: true });
      else sheenST = ScrollTrigger.create({ trigger: frame, start: 'top bottom', end: 'bottom top', onUpdate: (self) => frame.style.setProperty('--sheen', self.progress.toFixed(3)) });
    }
    const unSheen = () => { cancelAnimationFrame(raf); frame.removeEventListener('pointermove', move); sheenST?.kill(); };

    if (prefersReducedMotion()) return () => { ro.disconnect(); unSheen(); };

    // Arrastre: el ángulo sigue al dedo 1:1 (el borde exterior recorre dos anchos de tapa en 180°).
    const proxy = document.createElement('div');
    let a0 = 0;
    let x0 = 0;
    let drag;
    let dead = false;
    loadDrag().then(({ Draggable, InertiaPlugin }) => {
      if (dead) return;
      [drag] = Draggable.create(proxy, {
        trigger: coverRef.current,
        type: 'x',
        allowNativeTouchScrolling: true,
        dragClickables: true,
        minimumMovement: 6,
        onPress() {
          anim.current?.stop();
          a0 = angle.current;
          x0 = this.x;
          InertiaPlugin.track(proxy, 'x');
        },
        onDrag() {
          const dx = this.x - x0;
          let a = a0 - (dx / (2 * coverW * size.current.w)) * 180;
          // Resistencia en los topes, en lugar de un muro
          if (a < 0) a = -8 * (1 - Math.exp(a / 40));
          if (a > 180) a = 180 + 8 * (1 - Math.exp(-(a - 180) / 40));
          render(a);
        },
        onDragEnd() {
          lastDrag.current = performance.now();
          const vx = InertiaPlugin.getVelocity(proxy, 'x');
          const va = -(vx / (2 * coverW * size.current.w)) * 180; // °/s
          InertiaPlugin.untrack(proxy, 'x');
          settle(angle.current + project(va) > 90, va);
        },
      });
      panY(drag);
    });

    // Pista de uso, una vez
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        if (angle.current !== 0) return;
        const o = { a: 0 };
        gsap.to(o, {
          a: 8,
          duration: D.ui,
          ease: EASE,
          onUpdate: () => render(o.a),
          onComplete: () => { anim.current = spring({ from: o.a, to: 0, ...SPRING_SOFT, onUpdate: render }); },
        });
      },
    });
    return () => { dead = true; ro.disconnect(); unSheen(); drag?.kill(); st.kill(); anim.current?.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (performance.now() - lastDrag.current < 80) return; // el clic que sigue a un arrastre
    settle(!open);
  };

  const pct = (v) => `${v * 100}%`;
  const faceStyle = { transform: `scale(${faceScale})` };

  return (
    <div ref={frameRef} className="open" role="group" aria-label={`Agenda 2027 de Esade vista desde arriba, con el nombre ${name} en la tapa`}>
      <div ref={stageRef} className="open__stage">
        <Photo base="/fotos/agenda-abierta" sizes="(max-width: 899px) 132vw, 75vw" width={2400} height={1600} className="open__plate" alt="" />
        <div ref={castRight} className="open__cast open__cast--right" style={{ left: pct(hingeX), top: pct(coverTop), width: pct(coverW), height: pct(coverBot - coverTop) }} aria-hidden="true" />
        <div ref={castLeft} className="open__cast open__cast--left" style={{ left: pct(hingeX - coverW), top: pct(coverTop), width: pct(coverW), height: pct(coverBot - coverTop) }} aria-hidden="true" />
        <button
          ref={coverRef}
          type="button"
          className="open__cover"
          style={{ left: pct(hingeX), top: pct(coverTop), width: pct(coverW), height: pct(coverBot - coverTop) }}
          aria-label={`${open ? 'Cerrar' : 'Abrir'} la agenda de ${name}`}
          aria-expanded={open}
          onClick={toggle}
        >
          <span className="open__face open__face--front">
            <Photo base="/fotos/tapa-plana" widths={[530, 1060]} sizes="(max-width: 899px) 45vw, 30vw" width={1060} height={1378} alt="" />
            <CoverName name={name} transform={faceStyle.transform} className="cover-name--flat" />
            <span ref={shadeFront} className="open__shade" />
          </span>
          <span className="open__face open__face--back">
            <Photo base="/fotos/guarda-plana" widths={[530, 1060]} sizes="(max-width: 899px) 45vw, 30vw" width={1060} height={1378} alt="" />
            <span ref={shadeBack} className="open__shade" />
          </span>
        </button>
        <picture className="open__rings" style={{ left: pct(rx), top: pct(ry), width: pct(rw), height: pct(rh) }} aria-hidden="true">
          <source type="image/avif" srcSet="/fotos/agenda-anillas-1200.avif 79w, /fotos/agenda-anillas-2400.avif 158w" sizes="5vw" />
          <img src="/fotos/agenda-anillas-2400.webp" alt="" loading="lazy" decoding="async" draggable={false} />
        </picture>
        <span ref={handleRef} className="open__handle" style={{ top: pct((coverTop + coverBot) / 2) }} aria-hidden="true">
          <Handle dir="left" className="handle--left" />
          <Handle dir="right" className="handle--right" />
        </span>
      </div>
    </div>
  );
});

export default AgendaOpen;
