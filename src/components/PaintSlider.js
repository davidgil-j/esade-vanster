'use client';

import { useEffect, useRef, useState } from 'react';
import Handle from './Handle';
import RollLabel from './RollLabel';
import { COPY } from '@/content/copy';
import { MAILTO, copyEmail } from '@/lib/mail';
import { SPRING, SPRING_SOFT, spring, clamp, prefersReducedMotion, panY, loadDrag } from '@/lib/motion';

// «Quiero hablarlo» del cierre como deslizable de pintura (PLAN.md · 5, punto 10C).
// Píldora de 240×56 con filete blanco de 1 px. El tirador empieza a 6 px del borde izquierdo; al
// arrastrarlo a la derecha, el interior se llena del mármol de Vänster detrás del tirador, con un
// borde de avance ondulado. Pasado el 85 % se completa con un muelle y: abre el correo con el asunto
// aprobado, copia la dirección con el aviso «Correo copiado» y vuelve al inicio con un muelle.
// Un toque, un clic, Intro o Espacio hacen lo mismo que completarlo.
// Con ratón, al pasar por encima el tirador se desliza solo hasta el final (el de L'Occitane) y el
// texto se aparta al hueco que deja, sin desaparecer; al salir, vuelve. Muelle suave sin rebote.
const PAD = 6;
const KNOB = 44;
const TEXT_SHIFT = -40; // el texto se corre a la izquierda cuando el tirador llega al final

export default function PaintSlider() {
  const rootRef = useRef(null);
  const knobRef = useRef(null);
  const fillRef = useRef(null);
  const paintRef = useRef(null);
  const labelRef = useRef(null);
  const x = useRef(0);
  const maxX = useRef(1);
  const width = useRef(240);
  const anim = useRef(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const lastDrag = useRef(0);
  const hovering = useRef(false);

  const render = (v) => {
    x.current = v;
    const p = clamp(v / maxX.current, 0, 1);
    knobRef.current.style.transform = `translate3d(${v}px,0,0)`;
    // el relleno avanza con el tirador; el mármol se queda quieto debajo (contramovimiento)
    const edge = v + PAD + KNOB / 2;
    const w = width.current; // medido al redimensionar, nunca en el bucle
    fillRef.current.style.transform = `translate3d(${edge - w}px,0,0)`;
    paintRef.current.style.transform = `translate3d(${w - edge}px,0,0)`;
    if (hovering.current) {
      // Deslizado por el cursor: el texto se queda y se corre al hueco
      labelRef.current.style.opacity = '1';
      labelRef.current.style.transform = `translate3d(${(TEXT_SHIFT * p).toFixed(2)}px,0,0)`;
    } else {
      labelRef.current.style.opacity = String(1 - Math.min(1, p * 1.4));
      labelRef.current.style.transform = '';
    }
  };

  const complete = async () => {
    anim.current?.stop();
    const run = () => {
      window.location.href = MAILTO;
      copyEmail().then((ok) => {
        if (!ok) return;
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2400);
      });
      setTimeout(() => {
        if (prefersReducedMotion()) { render(0); return; }
        anim.current = spring({ from: x.current, to: 0, ...SPRING, onUpdate: render });
      }, 450);
    };
    if (prefersReducedMotion()) { render(maxX.current); run(); return; }
    anim.current = spring({ from: x.current, to: maxX.current, ...SPRING, onUpdate: render, onComplete: run });
  };

  useEffect(() => {
    const root = rootRef.current;
    const measure = () => {
      width.current = root.offsetWidth;
      maxX.current = width.current - PAD * 2 - KNOB;
      render(x.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    if (prefersReducedMotion()) return () => ro.disconnect();

    // Al pasar el cursor, se desliza solo; al salir, vuelve (solo ratón: en táctil no hay hover)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const slideTo = (to) => {
      anim.current?.stop();
      anim.current = spring({ from: x.current, to, ...SPRING_SOFT, onUpdate: render });
    };
    const enter = (e) => {
      if (e.pointerType !== 'mouse' || !fine.matches || root.classList.contains('is-dragging')) return;
      hovering.current = true;
      slideTo(maxX.current);
    };
    const leave = (e) => {
      if (e.pointerType !== 'mouse' || root.classList.contains('is-dragging')) return;
      slideTo(0);
      // el texto sigue corrido mientras vuelve; se suelta al acabar
      setTimeout(() => { if (x.current < 1) { hovering.current = false; render(x.current); } }, 700);
    };
    root.addEventListener('pointerenter', enter);
    root.addEventListener('pointerleave', leave);

    const proxy = document.createElement('div');
    let x0 = 0;
    let drag;
    let dead = false;
    loadDrag().then(({ Draggable, InertiaPlugin }) => {
      if (dead) return;
      [drag] = Draggable.create(proxy, {
        trigger: root,
        type: 'x',
        allowNativeTouchScrolling: true,
        dragClickables: true,
        minimumMovement: 4,
        onPress() {
          anim.current?.stop();
          hovering.current = false;
          x0 = x.current - this.x;
          InertiaPlugin.track(proxy, 'x');
          root.classList.add('is-dragging');
        },
        onDrag() {
          let v = x0 + this.x;
          if (v < 0) v = -12 * (1 - Math.exp(v / 30)); // resistencia en el tope
          render(Math.min(v, maxX.current));
        },
        onRelease() { root.classList.remove('is-dragging'); },
        onDragEnd() {
          lastDrag.current = performance.now();
          const v = InertiaPlugin.getVelocity(proxy, 'x');
          InertiaPlugin.untrack(proxy, 'x');
          if (x.current / maxX.current > 0.85) complete();
          else anim.current = spring({ from: x.current, to: 0, velocity: v, ...SPRING, onUpdate: render });
        },
      });
      panY(drag);
    });
    return () => { dead = true; ro.disconnect(); drag?.kill(); anim.current?.stop(); root.removeEventListener('pointerenter', enter); root.removeEventListener('pointerleave', leave); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="paint-wrap">
      <a
        ref={rootRef}
        className="paint press-soft"
        href={MAILTO}
        onClick={(e) => {
          e.preventDefault();
          if (performance.now() - lastDrag.current < 80) return;
          complete();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ') { e.preventDefault(); complete(); }
        }}
      >
        <span ref={fillRef} className="paint__fill" aria-hidden="true">
          <span ref={paintRef} className="paint__marble" />
        </span>
        <span ref={labelRef} className="paint__label">
          <RollLabel text={COPY.cierre.cta} />
        </span>
        <span ref={knobRef} className="paint__knob" aria-hidden="true">
          <Handle dir="right" />
        </span>
      </a>
      <span className={`toast toast--paint ${copied ? 'is-on' : ''}`} role="status" aria-live="polite">
        {copied ? COPY.cierre.copied : ''}
      </span>
    </span>
  );
}
