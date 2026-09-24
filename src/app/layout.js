import { Montserrat, Mulish } from 'next/font/google';
import { COPY } from '@/content/copy';
import './globals.css';

// Tipografías de Vänster (marca/vanster/LEEME.md). Dentro de los objetos de Esade
// son provisionales hasta la fase 3 (PLAN.md): no tenemos Esade Type.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-mulish',
  display: 'swap',
});

export const metadata = {
  title: COPY.meta.title,
  description: COPY.meta.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: COPY.meta.title,
    description: COPY.meta.description,
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  // La barra del navegador toma el color de lo primero que se ve: la hoja de carga (fucsia).
  themeColor: '#C40452',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${mulish.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Antes del primer pintado: hay JS; la pantalla de carga, una vez por sesión; movimiento
          // reducido. Red de seguridad: si a los 3,2 s la portada no ha arrancado (el JS no llegó),
          // se retiran la hoja de carga y las lamas y se ve todo quieto.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');window.__t0=performance.now();try{if(sessionStorage.getItem('vx-loader'))d.classList.add('no-loader')}catch(e){d.classList.add('no-loader')}if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('rm');setTimeout(function(){if(!d.classList.contains('hero-go'))d.classList.add('hero-fallback')},3200)})();",
          }}
        />
        <link rel="preload" as="image" href="/video/fija.avif" type="image/avif" media="(min-width: 900px), (orientation: landscape)" fetchPriority="high" />
        <link rel="preload" as="image" href="/video/fija-movil.avif" type="image/avif" media="(max-width: 899px) and (orientation: portrait)" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
