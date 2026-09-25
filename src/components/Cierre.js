import MarbleTitle from './MarbleTitle';
import Reveal from './Reveal';
import PaintSlider from './PaintSlider';
import Lockup from './Lockup';
import { COPY, CONTACT, CREDIT } from '@/content/copy';

// Cierre: el último fotograma del vídeo (el anochecer) en el fucsia de Vänster. La página empieza de
// día, en la fachada, y acaba de noche, en la misma fachada, ya con el color de Vänster (con
// MarbleClosing, el mármol vivo entra por la ventana de «Quiénes somos» y es el tinte).
// Centrado, como el de L'Occitane: la pregunta, el texto, el botón y los datos de contacto en una
// línea; abajo, tras un filete, la marca. El rótulo «esade» del campus queda encima, en la franja
// libre de arriba (MarbleClosing lleva la cámara hasta ahí): ningún texto lo pisa.
export default function Cierre() {
  return (
    <section id="cierre" className="cierre" data-tone="marble" aria-labelledby="cierre-title">
      <div className="cierre__bg" aria-hidden="true">
        <picture className="cierre__night">
          <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/video/final-rotulo-movil.avif" />
          <source type="image/avif" srcSet="/video/final-rotulo.avif" />
          <img src="/video/final-rotulo.webp" alt="" loading="lazy" decoding="async" />
        </picture>
        <span className="cierre__tint" />
      </div>
      <div className="cierre__inner">
        <MarbleTitle className="cierre__title" id="cierre-title" marble={false}>{COPY.cierre.title}</MarbleTitle>
        <Reveal variant="fade" className="cierre__body">
          {COPY.cierre.body.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
        <Reveal variant="fade" delay={0.12}>
          <PaintSlider />
        </Reveal>
        <Reveal as="ul" variant="fade" delay={0.22} className="contact">
          <li><a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          <li><a className="link" href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></li>
          <li>
            <a className="link contact__map" href={CONTACT.mapsHref} target="_blank" rel="noreferrer" aria-label={`${CONTACT.address} (abre Google Maps)`}>
              {CONTACT.address}
              <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M3.5 8.5l5-5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </li>
          <li><a className="link" href={CONTACT.webHref} target="_blank" rel="noreferrer">{CONTACT.web}</a></li>
        </Reveal>
      </div>
      <footer className="site-footer">
        <div className="site-footer__row">
          <Lockup tone="dark" className="site-footer__lockup" />
          {/* La licencia de la foto de la portada (CC BY 2.0) pide el crédito */}
          <p className="site-footer__credit">
            Foto de portada: <a className="link" href={CREDIT.href} target="_blank" rel="noreferrer">{CREDIT.author}</a> (<a className="link" href={CREDIT.licenseHref} target="_blank" rel="noreferrer">CC BY 2.0</a>)
          </p>
        </div>
      </footer>
    </section>
  );
}
