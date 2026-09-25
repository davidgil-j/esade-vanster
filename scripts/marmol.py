"""
Texturas del mármol de Vänster (PLAN.md · rediseño final, punto 9A). Uso: python scripts/marmol.py
  marmol        la normal (relleno del botón, anillas del raíl)
  marmol-texto  luminancia comprimida: texto blanco a 4,5:1 o más en el 100 % de los píxeles (medido)
  marmol-lq     64 px, marcador de posición mientras carga
  marmol-fucsia-*  las mismas, con el tono comprimido hacia el fucsia #C40452 (k = 0,35): es el
                   mármol que usa la web; el original tiraba a rojo y naranja y se iba de la marca
Y el amarillo de la veta, muestreado de la imagen.
"""
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'design' / 'fotos'
OUT = ROOT / 'public' / 'marmol'
TMP = ROOT / 'design' / 'fotos' / 'debug'
OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

Y_MAX = 0.175  # (1,05 / 4,5) − 0,05 = 0,183: con 0,175 queda margen


def to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(c):
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(np.clip(c, 0, None), 1 / 2.4) - 0.055)


def rel_lum(lin_bgr):
    return lin_bgr[..., 2] * 0.2126 + lin_bgr[..., 1] * 0.7152 + lin_bgr[..., 0] * 0.0722


def lin_to_oklab(lin_rgb):
    M1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566], [0.0883024619, 0.2817188376, 0.6299787005]])
    M2 = np.array([[0.2104542553, 0.7936177850, -0.0040720468], [1.9779984951, -2.4285922050, 0.4505937099], [0.0259040371, 0.7827717662, -0.8086757660]])
    return np.cbrt(lin_rgb @ M1.T) @ M2.T


def oklab_to_lin(lab):
    M2i = np.array([[1, 0.3963377774, 0.2158037573], [1, -0.1055613458, -0.0638541728], [1, -0.0894841775, -1.2914855480]])
    M1i = np.array([[4.0767416621, -3.3077115913, 0.2309699292], [-1.2684380046, 2.6097574011, -0.3413193965], [-0.0041960863, -0.7034186147, 1.7076147010]])
    return ((lab @ M2i.T) ** 3) @ M1i.T


def text_safe(bgr8, y_max=None):
    """Oscurece solo lo necesario para que el blanco se lea a 4,5:1 en todos los píxeles. Para que las
    vetas claras no se vuelvan grises, se les devuelve croma (OKLab) y el amarillo gira un poco hacia
    el naranja; al final, un tope duro garantiza la luminancia."""
    y_max = y_max or Y_MAX
    lin = to_lin(bgr8[..., ::-1].astype(np.float32) / 255)  # RGB lineal
    Y = lin @ np.array([0.2126, 0.7152, 0.0722])
    s = 0.22
    Yt = y_max * (1 - np.exp(-Y / s)) / (1 - np.exp(-1 / s))
    k = Yt / np.maximum(Y, 1e-6)
    lab = lin_to_oklab(lin * k[..., None])
    C = np.hypot(lab[..., 1], lab[..., 2])
    h = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    squeeze = np.clip(1 - k, 0, 1)  # cuánto se ha oscurecido
    C = C * (1 + 0.6 * squeeze)
    yellow = np.clip(1 - np.abs(h - 85) / 30, 0, 1)
    h = h - 22 * yellow * squeeze
    lab[..., 1] = C * np.cos(np.radians(h))
    lab[..., 2] = C * np.sin(np.radians(h))
    out = np.clip(oklab_to_lin(lab), 0, 1)
    Y2 = out @ np.array([0.2126, 0.7152, 0.0722])
    out *= np.minimum(1, y_max / np.maximum(Y2, 1e-6))[..., None]
    q = np.round(np.clip(to_srgb(out), 0, 1) * 255).astype(np.uint8)[..., ::-1]
    Yq = rel_lum(to_lin(q.astype(np.float32) / 255))
    ratio = 1.05 / (Yq + 0.05)
    return q, float(ratio.min()), float((ratio >= 4.5).mean())


FUCSIA_K = 0.35


def to_fucsia(bgr8, k=FUCSIA_K):
    """Comprime los tonos hacia el del fucsia de Vänster en OKLCh (luz y croma intactos): el mármol
    se lee fucsia y conserva un hilo del naranja y el amarillo de sus tarjetas."""
    ref = lin_to_oklab(to_lin(np.array([[[0xC4, 0x04, 0x52]]], np.float32) / 255))
    ht = float(np.degrees(np.arctan2(ref[..., 2], ref[..., 1]))[0, 0])
    lab = lin_to_oklab(to_lin(bgr8[..., ::-1].astype(np.float32) / 255))
    C = np.hypot(lab[..., 1], lab[..., 2])
    h = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    h2 = ht + ((h - ht + 180) % 360 - 180) * k
    lab[..., 1] = C * np.cos(np.radians(h2))
    lab[..., 2] = C * np.sin(np.radians(h2))
    out = np.clip(oklab_to_lin(lab), 0, 1)
    return (np.clip(to_srgb(out), 0, 1) * 255 + 0.5).astype(np.uint8)[..., ::-1]


def enc(img, name, q_webp=80, q_avif=58):
    png = TMP / f'{name}.png'
    cv2.imwrite(str(png), img)
    subprocess.run(['cwebp', '-quiet', '-q', str(q_webp), '-m', '6', '-sharp_yuv', str(png), '-o', str(OUT / f'{name}.webp')], check=True)
    subprocess.run(['avifenc', '-q', str(q_avif), '-s', '4', str(png), str(OUT / f'{name}.avif')], check=True, capture_output=True)
    return {'w': img.shape[1], 'h': img.shape[0], 'webp': (OUT / f'{name}.webp').stat().st_size, 'avif': (OUT / f'{name}.avif').stat().st_size}


report = {}
for fmt, fname in (('16x9', 'marmol-16x9.png'), ('9x16', 'marmol-9x16.png')):
    img = cv2.imread(str(SRC / fname))
    report[f'marmol-{fmt}'] = enc(img, f'marmol-{fmt}')
    safe, rmin, share = text_safe(img)
    report[f'marmol-texto-{fmt}'] = {**enc(safe, f'marmol-texto-{fmt}'), 'contraste_min': round(rmin, 2), 'pixeles_ok': share}
    lq = cv2.resize(safe, (64, round(64 * img.shape[0] / img.shape[1])), interpolation=cv2.INTER_AREA)
    report[f'marmol-lq-{fmt}'] = enc(lq, f'marmol-lq-{fmt}', q_webp=60, q_avif=40)

# Versiones ligeras: el móvil pinta el mármol a media resolución (la textura entera sobra) y el
# botón del cierre es una píldora de 240 px (el relleno no necesita 1672 px).
for fmt in ('16x9', '9x16'):
    safe = cv2.imread(str(TMP / f'marmol-texto-{fmt}.png'))
    small = cv2.resize(safe, (safe.shape[1] // 2, safe.shape[0] // 2), interpolation=cv2.INTER_AREA)
    report[f'marmol-texto-{fmt}-movil'] = enc(small, f'marmol-texto-{fmt}-movil')
img = cv2.imread(str(SRC / 'marmol-16x9.png'))
crop = img[:, img.shape[1] // 4: img.shape[1] // 4 + img.shape[0] * 2]  # franja 2:1 con vetas y amarillo
pill = cv2.resize(crop, (560, 280), interpolation=cv2.INTER_AREA)
report['marmol-boton'] = enc(pill, 'marmol-boton', q_webp=78, q_avif=55)

# El mármol de la web: comprimido hacia el fucsia
for fmt, fname in (('16x9', 'marmol-16x9.png'), ('9x16', 'marmol-9x16.png')):
    f = to_fucsia(cv2.imread(str(SRC / fname)))
    safe, rmin, share = text_safe(f)
    report[f'marmol-fucsia-texto-{fmt}'] = {**enc(safe, f'marmol-fucsia-texto-{fmt}'), 'contraste_min': round(rmin, 2), 'pixeles_ok': share}
    small = cv2.resize(safe, (safe.shape[1] // 2, safe.shape[0] // 2), interpolation=cv2.INTER_AREA)
    report[f'marmol-fucsia-texto-{fmt}-movil'] = enc(small, f'marmol-fucsia-texto-{fmt}-movil')
    lq = cv2.resize(safe, (64, round(64 * safe.shape[0] / safe.shape[1])), interpolation=cv2.INTER_AREA)
    report[f'marmol-fucsia-lq-{fmt}'] = enc(lq, f'marmol-fucsia-lq-{fmt}', q_webp=60, q_avif=40)
f = to_fucsia(cv2.imread(str(SRC / 'marmol-16x9.png')))
crop = f[:, f.shape[1] // 4: f.shape[1] // 4 + f.shape[0] * 2]
report['marmol-fucsia-boton'] = enc(cv2.resize(crop, (560, 280), interpolation=cv2.INTER_AREA), 'marmol-fucsia-boton', q_webp=78, q_avif=55)

# Mármol para rellenar titulares sobre papel claro (background-clip: text): más oscuro (Y ≤ 0,12),
# así el titular se lee a 5:1 o más sobre el fondo en todos los píxeles.
f = to_fucsia(cv2.imread(str(SRC / 'marmol-16x9.png')))
tit, _, _ = text_safe(f, y_max=0.12)
tit = cv2.resize(tit, (1200, round(1200 * tit.shape[0] / tit.shape[1])), interpolation=cv2.INTER_AREA)
report['marmol-fucsia-titulo'] = enc(tit, 'marmol-fucsia-titulo', q_webp=76, q_avif=52)

# Mármol perla para el titular de la portada: casi blanco (L* 90-100) con la veta fucsia muy tenue
# (croma al 35 %). Se lee como blanco con brillo sobre el velo oscuro de arriba de la portada.
f = to_fucsia(cv2.imread(str(SRC / 'marmol-16x9.png')))
lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB).astype(np.float32)
L = lab[..., 0] * 100 / 255
L = 90 + (L - L.min()) / max(1e-3, L.max() - L.min()) * 10
lab[..., 0] = L * 255 / 100
lab[..., 1] = 128 + (lab[..., 1] - 128) * 0.35
lab[..., 2] = 128 + (lab[..., 2] - 128) * 0.35
perla = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
perla = cv2.resize(perla, (1200, round(1200 * perla.shape[0] / perla.shape[1])), interpolation=cv2.INTER_AREA)
report['marmol-perla'] = enc(perla, 'marmol-perla', q_webp=78, q_avif=55)

# Neones para el parpadeo del titular de la portada (Hero): el mármol encendido en dos colores de la
# casa, luminosos y saturados para que contrasten sobre el cielo oscurecido. Fucsia (L* 66-90, croma
# ×1,2) y oro, el amarillo de la veta de la «×» (tono llevado a ~70° en Lab, L* 72-96).
def neon(src_bgr, L0, L1, chroma, hue=None):
    lab = cv2.cvtColor(src_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0] * 100 / 255
    lab[..., 0] = (L0 + (L - L.min()) / max(1e-3, L.max() - L.min()) * (L1 - L0)) * 255 / 100
    a = lab[..., 1] - 128
    b_ = lab[..., 2] - 128
    if hue is not None:
        c = np.sqrt(a * a + b_ * b_)
        c = c / max(1e-3, c.max()) * 90 + 25  # siempre con color: sin grises
        h = np.deg2rad(hue) + (np.arctan2(b_, a) - np.arctan2(b_, a).mean()) * 0.25
        a, b_ = c * np.cos(h), c * np.sin(h)
    lab[..., 1] = 128 + a * chroma
    lab[..., 2] = 128 + b_ * chroma
    img = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    return cv2.resize(img, (1200, round(1200 * img.shape[0] / img.shape[1])), interpolation=cv2.INTER_AREA)


f = to_fucsia(cv2.imread(str(SRC / 'marmol-16x9.png')))
report['marmol-neon-fucsia'] = enc(neon(f, 66, 90, 1.2), 'marmol-neon-fucsia', q_webp=78, q_avif=55)
report['marmol-neon-oro'] = enc(neon(f, 72, 96, 0.9, hue=78), 'marmol-neon-oro', q_webp=78, q_avif=55)

# Amarillo de la veta: píxeles muy saturados y claros con tono entre 38° y 52°
img = cv2.imread(str(SRC / 'marmol-16x9.png'))
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV_FULL).astype(np.float32)
h = hsv[..., 0] * 360 / 256
sel = (h > 38) & (h < 52) & (hsv[..., 1] > 190) & (hsv[..., 2] > 225)
b, g, r = np.median(img[sel], axis=0)
report['amarillo_veta'] = '#%02X%02X%02X' % (int(r), int(g), int(b))
report['amarillo_pixeles'] = int(sel.sum())
(SRC / 'marmol.json').write_text(json.dumps(report, indent=1))
print(json.dumps(report, indent=1))
