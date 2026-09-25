import { Montserrat, Mulish } from 'next/font/google';
import { COPY } from '@/content/copy';
import './globals.css';

// Tipografías de Vänster (marca/vanster/LEEME.md) para la web. Dentro de los objetos de Esade,
// mientras no llegue Esade Type, Newsreader, horneada en las fotos (scripts/render-designs.cjs).
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

// Imagen para compartir el enlace: 1200×630 (scripts/og-image.cjs). metadataBase convierte sus
// rutas en URLs absolutas, que es lo que piden WhatsApp, LinkedIn, Slack y X.
const OG_IMAGE = {
  url: '/og/vanster-esade.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'vänster × esade: la agenda 2027 de Esade sobre el mármol fucsia de Vänster',
};

export const metadata = {
  metadataBase: new URL('https://esade-vanster.vercel.app'),
  title: COPY.meta.title,
  description: COPY.meta.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: COPY.meta.title,
    description: COPY.meta.description,
    url: '/',
    siteName: COPY.meta.title,
    type: 'website',
    locale: 'es_ES',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: COPY.meta.title,
    description: COPY.meta.description,
    images: [OG_IMAGE],
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
