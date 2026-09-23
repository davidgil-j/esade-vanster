import { Montserrat, Mulish } from 'next/font/google';
import './globals.css';

// Provisionales hasta tener Esade Type (ver marca/esade.md).
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish',
  display: 'swap',
});

export const metadata = {
  title: 'esade × Vänster',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}
