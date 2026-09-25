import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import PaintSlider from './PaintSlider';
import Lockup from './Lockup';
import { COPY, CONTACT } from '@/content/copy';

// Cierre: el último fotograma del vídeo (el anochecer) en el fucsia de Vänster. La página empieza de
// día, en la fachada, y acaba de noche, en la misma fachada, ya con el color de Vänster (con
// MarbleClosing, el mármol vivo entra por la ventana de «Quiénes somos» y es el tinte).
// El contenido va en una columna a la derecha: la mitad izquierda es del campus y su rótulo, que
// ningún texto pisa. Jerarquía: la pregunta, el texto, el botón y, separados por un filete y más
// pequeños, los datos de contacto.
export default function Cierre() {
  return (
    <section id="cierre" className="cierre" data-tone="marble" aria-labelledby="cierre-title">
      <div className="cierre__bg" aria-hidden="true">
        <picture className="cierre__night">
          <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/video/final-movil.avif" />
          <source type="image/avif" srcSet="/video/final.avif" />
          <img src="/video/final.webp" alt="" loading="lazy" decoding="async" />
        </picture>
        <span className="cierre__tint" />
      </div>
      <div className="grid-page cierre__grid">
        <SplitHeading className="cierre__title" id="cierre-title">{COPY.cierre.title}</SplitHeading>
        <div className="cierre__side">
          <Reveal variant="fade" className="cierre__body">
            {COPY.cierre.body.map((p) => <p key={p}>{p}</p>)}
          </Reveal>
          <PaintSlider />
          <ul className="contact">
            <li><a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            <li><a className="link" href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></li>
            <li>
              <a className="link contact__map" href={CONTACT.mapsHref} target="_blank" rel="noreferrer" aria-label={`${CONTACT.address} (abre Google Maps)`}>
                {CONTACT.address}
                <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M3.5 8.5l5-5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </li>
            <li><a className="link" href={CONTACT.webHref} target="_blank" rel="noreferrer">{CONTACT.web}</a></li>
          </ul>
        </div>
      </div>
      <footer className="grid-page site-footer">
        <Lockup tone="dark" className="site-footer__lockup" />
      </footer>
    </section>
  );
}
