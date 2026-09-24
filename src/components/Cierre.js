import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import PaintSlider from './PaintSlider';
import Lockup from './Lockup';
import { COPY, CONTACT } from '@/content/copy';

// Cierre: el último fotograma del vídeo (el anochecer) bajo el fucsia de Vänster en modo
// multiplicar. La página empieza de día, en la fachada, y acaba de noche, en la misma fachada, ya
// con el color de Vänster. El mármol no se repite aquí: sale una sola vez, en «La idea».
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
            <li>{CONTACT.address}</li>
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
