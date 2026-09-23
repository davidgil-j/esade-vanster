import SmoothScroll from '@/components/SmoothScroll';
import Header from '@/components/Header';
import HeroVideo from '@/components/HeroVideo';
import SplitHeading from '@/components/SplitHeading';
import Reveal from '@/components/Reveal';
import Comparator from '@/components/Comparator';
import AgendaSection from '@/components/AgendaSection';
import CalendarSection from '@/components/CalendarSection';
import MarcaBoard from '@/components/MarcaBoard';
import CtaMail from '@/components/CtaMail';
import Lockup from '@/components/Lockup';
import { COPY, CONTACT } from '@/content/copy';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        {/* 1 · Portada: el campus, ligado al scroll */}
        <HeroVideo />

        {/* 2 · La idea (habla Vänster): sube y tapa el vídeo */}
        <section id="idea" className="idea tone-vanster" data-tone="vanster" aria-labelledby="idea-title">
          <div className="grid-page idea__grid">
            <div className="idea__text">
              <SplitHeading className="h2 h2--xl" id="idea-title">{COPY.idea.title}</SplitHeading>
              <Reveal as="p" className="idea__body">{COPY.idea.body}</Reveal>
            </div>
            <Reveal className="idea__compare" delay={0.1}>
              <Comparator />
            </Reveal>
          </div>
        </section>

        {/* 3 · La agenda 2027: la firma (nombre en la tapa) y su apertura */}
        <AgendaSection />

        {/* 4 · El calendario de sobremesa 2027 */}
        <CalendarSection />

        {/* 5 · Con vuestra marca */}
        <section id="marca" className="marca" data-tone="light" aria-labelledby="marca-title">
          <div className="grid-page marca__grid">
            <div className="marca__text">
              <SplitHeading className="h2" id="marca-title">{COPY.marca.title}</SplitHeading>
              <Reveal as="p" className="marca__body">{COPY.marca.body}</Reveal>
              <Reveal as="p" className="marca__close" delay={0.08}>{COPY.marca.close}</Reveal>
            </div>
            <Reveal className="marca__board" delay={0.05}>
              <MarcaBoard />
            </Reveal>
          </div>
        </section>

        {/* 6 · Quiénes somos (habla Vänster) */}
        <section id="nosotros" className="nosotros tone-vanster" data-tone="vanster" aria-labelledby="nosotros-title">
          <div className="grid-page nosotros__grid">
            <SplitHeading className="h2" id="nosotros-title">{COPY.nosotros.title}</SplitHeading>
            <Reveal as="p" className="nosotros__lead">{COPY.nosotros.body[0]}</Reveal>
            <Reveal as="p" className="nosotros__body" delay={0.08}>{COPY.nosotros.body[1]}</Reveal>
          </div>
        </section>

        {/* 7 · Cierre (habla Vänster) */}
        <section id="cierre" className="cierre tone-vanster" data-tone="vanster" aria-labelledby="cierre-title">
          <div className="grid-page cierre__grid">
            <SplitHeading className="cierre__title" id="cierre-title">{COPY.cierre.title}</SplitHeading>
            <div className="cierre__side">
              <Reveal className="cierre__body">
                {COPY.cierre.body.map((p) => <p key={p}>{p}</p>)}
              </Reveal>
              <CtaMail variant="inverse" size="lg" className="cierre__cta" />
              <ul className="contact">
                <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
                <li><a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></li>
                <li>{CONTACT.address}</li>
                <li><a href={CONTACT.webHref} target="_blank" rel="noreferrer">{CONTACT.web}</a></li>
              </ul>
            </div>
          </div>
          <footer className="grid-page site-footer">
            <Lockup tone="vanster" className="site-footer__lockup" />
          </footer>
        </section>
      </main>
    </>
  );
}
