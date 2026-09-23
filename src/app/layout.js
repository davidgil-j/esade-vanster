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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#16141A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}
