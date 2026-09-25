// Imagen para compartir el enlace (Open Graph y Twitter): 1200×630.
// Mármol fucsia de Vänster a sangre, el lockup «vänster × esade» en blanco y la agenda cerrada (la
// misma foto compuesta que la web), con las esquinas levemente redondeadas como las fotos de la web.
// Uso: node scripts/og-image.cjs   → public/og/vanster-esade.jpg
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require(process.env.PW || '/Users/davidgiljaques/Documents/GitHub/L-OCCITANE/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/og');
fs.mkdirSync(OUT, { recursive: true });
const b64 = (f, type) => `data:${type};base64,${fs.readFileSync(path.join(ROOT, f)).toString('base64')}`;
// La foto se recorta sobre la agenda (el lino sobra) y nunca pisa el lockup: los logos, enteros.
const PHOTO_W = 760;
const PHOTO_H = Math.round(PHOTO_W / 1.5);
const FRAME_W = 540;
const FRAME_H = 486;
const CROP_X = Math.round(PHOTO_W * 0.15);
const CROP_Y = Math.round((PHOTO_H - FRAME_H) / 2);

const html = `<!doctype html><html><head><style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: #C40452 url('${b64('public/marmol/marmol-fucsia-texto-16x9.webp', 'image/webp')}') center / cover; }
  .lockup { position: absolute; left: 64px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 20px; }
  .lockup .v { height: 40px; width: auto; }
  .lockup .x { color: #FBA90E; font: 600 32px Georgia, serif; line-height: 1; }
  .lockup .e { height: 72px; width: auto; }
  .photo { position: absolute; right: 56px; top: ${Math.round((630 - FRAME_H) / 2)}px; width: ${FRAME_W}px; height: ${FRAME_H}px; overflow: hidden; border-radius: 10px; box-shadow: 0 24px 60px -24px rgba(40, 0, 16, 0.55); }
  .ph { position: absolute; left: ${-CROP_X}px; top: ${-CROP_Y}px; width: ${PHOTO_W}px; height: ${PHOTO_H}px; }
  .ph img { width: 100%; height: 100%; display: block; }
</style></head><body>
  <div class="lockup">
    <img class="v" src="${b64('public/brand/vanster-logotipo-blanco.svg', 'image/svg+xml')}" alt="">
    <span class="x">×</span>
    <img class="e" src="${b64('public/brand/esade-logo-blanco.svg', 'image/svg+xml')}" alt="">
  </div>
  <div class="photo"><div class="ph">
    <img src="${b64('public/fotos/agenda-esade-1200.webp', 'image/webp')}" alt="">
  </div></div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' });
  await p.waitForTimeout(300);
  const png = path.join(OUT, 'vanster-esade.png');
  await p.screenshot({ path: png });
  await b.close();
  // JPEG de calidad alta: WhatsApp, LinkedIn y Slack lo leen sin problemas y pesa poco
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', png, '-q:v', '3', path.join(OUT, 'vanster-esade.jpg')]);
  fs.unlinkSync(png);
  console.log('→', path.join(OUT, 'vanster-esade.jpg'), fs.statSync(path.join(OUT, 'vanster-esade.jpg')).size, 'bytes');
})();
