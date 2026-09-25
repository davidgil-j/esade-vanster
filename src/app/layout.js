import { COPY } from '@/content/copy';
import './globals.css';

// Tipografías de Esade (Esade Type y Mabry Pro, las de su web): @font-face en globals.css, archivos
// en public/fonts/esade. Se precargan las dos que se ven primero (titular y texto).

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          // Antes del primer pintado: hay JS; la pantalla de carga sale en cada carga; movimiento
          // reducido. Red de seguridad: si a los 3,2 s la portada no ha arrancado (el JS no llegó),
          // se retiran la hoja de carga y las lamas y se ve todo quieto.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');window.__t0=performance.now();if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('rm');setTimeout(function(){if(!d.classList.contains('hero-go'))d.classList.add('hero-fallback')},3200)})();",
          }}
        />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/esade/Esade-Regular.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/esade/Mabry-Regular-Pro.woff2" crossOrigin="" />
        <link rel="preload" as="image" href="/foto/rambla-desenfocada.avif" type="image/avif" media="(min-width: 900px), (orientation: landscape)" fetchPriority="high" />
        <link rel="preload" as="image" href="/foto/rambla-movil-desenfocada.avif" type="image/avif" media="(max-width: 899px) and (orientation: portrait)" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
