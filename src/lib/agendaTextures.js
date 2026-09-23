'use client';

// Texturas de la agenda dibujadas en canvas: la tapa, el nombre (para la estampación),
// la guarda, la portadilla, el grano del papel y el canto de las hojas.
// Tapa: pieza de Esade, 3 colores (azul oscuro, azul claro, blanco), diagonal a 10º.
import { ESADE, LOGOS, ESADE_LOGO_RATIO, tanDeg } from './brand';
import { COVER } from '@/components/objects/CoverDesign';

export const TEX_W = 1024;
export const TEX_H = Math.round((TEX_W * COVER.h) / COVER.w);

const imgCache = new Map();
function loadImage(src) {
  if (imgCache.has(src)) return imgCache.get(src);
  const p = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  imgCache.set(src, p);
  return p;
}

export function fontFamily(varName = '--font-montserrat') {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || 'Montserrat, sans-serif';
}

export async function ensureFonts() {
  const fam = fontFamily();
  await Promise.all([
    document.fonts.load(`600 64px ${fam}`),
    document.fonts.load(`700 64px ${fam}`),
  ]).catch(() => {});
  return fam;
}

function canvas(w = TEX_W, h = TEX_H) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export async function drawCover() {
  const fam = await ensureFonts();
  const logo = await loadImage(LOGOS.esadeWhite);
  const c = canvas();
  const ctx = c.getContext('2d');
  const w = c.width;
  const h = c.height;
  ctx.fillStyle = ESADE.dark;
  ctx.fillRect(0, 0, w, h);
  const y0 = h * COVER.band.y0;
  ctx.fillStyle = ESADE.light;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(w, y0 - w * tanDeg(COVER.band.angle));
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
  const lw = w * COVER.logo.w;
  ctx.drawImage(logo, w * COVER.logo.x, h * COVER.logo.y, lw, lw * ESADE_LOGO_RATIO);
  ctx.fillStyle = ESADE.white;
  ctx.font = `700 ${Math.round(w * COVER.year.size)}px ${fam}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('2027', w * COVER.year.x, h * COVER.year.y);
  return c;
}

// El nombre, en blanco sobre negro: se usa como máscara de la estampación metálica.
// Si es largo, la letra baja hasta que cabe en el ancho de la tapa.
export function drawName(c, name, fam) {
  const ctx = c.getContext('2d');
  const w = c.width;
  const h = c.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  const text = (name || '').trim();
  if (!text) return c;
  let size = w * COVER.name.size;
  const maxW = w * COVER.name.maxW;
  ctx.font = `600 ${Math.round(size)}px ${fam}`;
  const measured = ctx.measureText(text).width;
  if (measured > maxW) {
    size *= maxW / measured;
    ctx.font = `600 ${Math.round(size)}px ${fam}`;
  }
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, w * COVER.name.x, h * COVER.name.y);
  return c;
}

export function nameCanvas() {
  return canvas();
}

export function drawEndpaper() {
  const c = canvas(256, Math.round((256 * COVER.h) / COVER.w));
  const ctx = c.getContext('2d');
  ctx.fillStyle = ESADE.light;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

export async function drawTitlePage() {
  const fam = await ensureFonts();
  const logo = await loadImage(LOGOS.esadeBlue);
  const c = canvas();
  const ctx = c.getContext('2d');
  const w = c.width;
  const h = c.height;
  ctx.fillStyle = '#FBFBFA';
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 0.035);
  const lw = w * 0.4;
  ctx.drawImage(logo, (w - lw) / 2, h * 0.36, lw, lw * ESADE_LOGO_RATIO);
  ctx.fillStyle = ESADE.dark;
  ctx.font = `700 ${Math.round(w * 0.07)}px ${fam}`;
  ctx.textAlign = 'center';
  ctx.fillText('2027', w / 2, h * 0.6);
  return c;
}

function grain(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

// Relieve del papel (para bumpMap): ruido fino.
export function drawPaperBump(size = 512) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  grain(ctx, size, size, 0.18);
  return c;
}

// Canto de las hojas: rayas finas que dejan ver que son muchas páginas.
export function drawPageEdge() {
  const c = canvas(64, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#F4F3F0';
  ctx.fillRect(0, 0, c.width, c.height);
  for (let y = 0; y < c.height; y += 2) {
    ctx.fillStyle = y % 4 === 0 ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.025)';
    ctx.fillRect(0, y, c.width, 1);
  }
  return c;
}
