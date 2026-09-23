'use client';

import { useEffect, useId, useRef, useState } from 'react';
import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import CalendarSheet from './objects/CalendarSheet';
import { COPY, MONTHS, WEEKDAYS } from '@/content/copy';
import { monthGrid } from '@/lib/brand';
import { gsap, EASE_OUT, prefersReducedMotion } from '@/lib/motion';

const pad = (n) => String(n).padStart(2, '0');
const toISO = (m, d) => `2027-${pad(m + 1)}-${pad(d)}`;

// Selector propio (escritorio): una rejilla de 2027 en un desplegable, con teclado.
function DatePicker({ value, onChange, labelId }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(value ? value.m : 0);
  const wrapRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onEsc);
    // foco en el día elegido o en el primero del mes
    requestAnimationFrame(() => {
      const target = gridRef.current?.querySelector('[aria-selected="true"]') || gridRef.current?.querySelector('button[data-day]');
      target?.focus();
    });
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onEsc); };
  }, [open]);

  const cells = monthGrid(view);
  const days = new Date(2027, view + 1, 0).getDate();

  const onGridKey = (e) => {
    const d = Number(e.target.dataset.day);
    if (!d) return;
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (moves[e.key] !== undefined) {
      e.preventDefault();
      const next = d + moves[e.key];
      if (next >= 1 && next <= days) gridRef.current.querySelector(`[data-day="${next}"]`)?.focus();
    }
  };

  const display = value ? `${pad(value.d)} / ${pad(value.m + 1)} / 2027` : 'dd / mm / 2027';

  return (
    <div ref={wrapRef} className="picker">
      <button type="button" className="picker__button" aria-labelledby={labelId} aria-haspopup="dialog" aria-expanded={open}
        onClick={() => { setView(value ? value.m : view); setOpen((o) => !o); }}>
        <span className={value ? '' : 'picker__empty'}>{display}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <rect x="2.5" y="4" width="15" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2.5" y1="8" x2="17.5" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6.5" y1="2" x2="6.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="13.5" y1="2" x2="13.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open ? (
        <div className="picker__panel" role="dialog" aria-label={`${MONTHS[view]} de 2027`}>
          <div className="picker__head">
            <button type="button" className="picker__nav" aria-label="Mes anterior" disabled={view === 0} onClick={() => setView((v) => Math.max(0, v - 1))}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            <span className="picker__title">{MONTHS[view]} 2027</span>
            <button type="button" className="picker__nav" aria-label="Mes siguiente" disabled={view === 11} onClick={() => setView((v) => Math.min(11, v + 1))}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </div>
          <div className="picker__week" aria-hidden="true">
            {WEEKDAYS.map((w, i) => <span key={w + i}>{w}</span>)}
          </div>
          <div ref={gridRef} className="picker__grid" role="grid" onKeyDown={onGridKey}>
            {cells.map((d, i) => (d ? (
              <button
                key={i}
                type="button"
                data-day={d}
                className="picker__day"
                aria-selected={value && value.m === view && value.d === d ? 'true' : 'false'}
                aria-label={`${d} de ${MONTHS[view]} de 2027`}
                onClick={() => { onChange({ m: view, d }); setOpen(false); }}
              >
                {d}
              </button>
            ) : <span key={i} />))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function CalendarSection() {
  const [value, setValue] = useState(null);
  const [month, setMonth] = useState(0);
  const [coarse, setCoarse] = useState(false);
  const sheetRef = useRef(null);
  const labelId = useId();

  useEffect(() => {
    setCoarse(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  // Cambio de hoja: la hoja nueva cae desde la anilla (movimiento en pantalla).
  const choose = (v) => {
    setValue(v);
    if (!v) return;
    if (v.m !== month) {
      setMonth(v.m);
      const el = sheetRef.current;
      if (el && !prefersReducedMotion()) {
        gsap.fromTo(el, { rotateX: -70, opacity: 0.2, transformOrigin: '50% 0%' },
          { rotateX: 0, opacity: 1, duration: 0.7, ease: EASE_OUT, clearProps: 'transform,opacity' });
      }
    }
  };

  return (
    <section id="calendario" className="calendar" data-tone="light" aria-labelledby="calendar-title">
      <div className="grid-page calendar__grid">
        <Reveal className="calendar__object">
          <div className="calendar__easel">
            <div ref={sheetRef} className="calendar__sheet">
              <CalendarSheet month={month} marked={value && value.m === month ? value.d : null} className="calendar__svg" />
            </div>
            <div className="calendar__base" aria-hidden="true" />
          </div>
        </Reveal>
        <div className="calendar__text">
          <SplitHeading className="h2" id="calendar-title">{COPY.calendar.title}</SplitHeading>
          <Reveal className="calendar__body">
            {COPY.calendar.body.map((p) => <p key={p}>{p}</p>)}
          </Reveal>
          <div className="field">
            <span className="field__label" id={labelId}>{COPY.calendar.fieldLabel}</span>
            {coarse ? (
              <input
                className="field__input field__input--date"
                type="date"
                min="2027-01-01"
                max="2027-12-31"
                aria-labelledby={labelId}
                value={value ? toISO(value.m, value.d) : ''}
                onChange={(e) => {
                  const [y, m, d] = e.target.value.split('-').map(Number);
                  choose(y === 2027 ? { m: m - 1, d } : null);
                }}
              />
            ) : (
              <DatePicker value={value} onChange={choose} labelId={labelId} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
