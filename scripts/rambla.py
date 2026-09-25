"""
La foto de la portada: la Rambla de la Innovación del campus de Esade en Sant Cugat.
Foto: Jorge Franganillo (https://www.flickr.com/photos/franganillo/54583279275/), CC BY 2.0, vía
Wikimedia Commons («Esade - Rambla de la Innovación.jpg»). La licencia pide el crédito: va en el pie.
Original en design/fotos/rambla-innovacion-franganillo-ccby.jpg (5835×3502).

Uso: <venv>/bin/python scripts/rambla.py
Sale en public/foto/: rambla.{avif,webp} (2560 de ancho), rambla-1600.{avif,webp}, el recorte
vertical del móvil (centrado en el 40 % del ancho: cielo arriba y la fila de banderines) y las
versiones desenfocadas para la entrada («enfoca»).
"""
import subprocess
from pathlib import Path

import cv2

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'design' / 'fotos' / 'rambla-innovacion-franganillo-ccby.jpg'
OUT = ROOT / 'public' / 'foto'
TMP = ROOT / 'design' / 'fotos' / 'debug'
OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

im = cv2.imread(str(SRC))
H, W = im.shape[:2]


def enc(img, name, q_webp=80, q_avif=58):
    png = TMP / f'{name}.png'
    cv2.imwrite(str(png), img)
    subprocess.run(['cwebp', '-quiet', '-q', str(q_webp), str(png), '-o', str(OUT / f'{name}.webp')], check=True)
    subprocess.run(['avifenc', '-q', str(q_avif), '-s', '4', str(png), str(OUT / f'{name}.avif')], check=True, capture_output=True)
    print(name, img.shape[1], '×', img.shape[0])


def fit(img, w):
    return cv2.resize(img, (w, round(img.shape[0] * w / img.shape[1])), interpolation=cv2.INTER_AREA)


enc(fit(im, 2560), 'rambla')
enc(fit(im, 1600), 'rambla-1600')
# Móvil: el recorte vertical (390×844 de proporción), centrado en el 40 % del ancho
w = round(H * 390 / 844)
x = max(0, min(W - w, round(W * 0.40 - w / 2)))
mob = im[:, x:x + w]
enc(fit(mob, 1080), 'rambla-movil')
# Desenfocadas (muy pequeñas: el navegador las estira; el desenfoque ya va dentro)
for name, img in (('rambla-desenfocada', im), ('rambla-movil-desenfocada', mob)):
    small = fit(img, 480)
    enc(cv2.GaussianBlur(small, (0, 0), 9), name, 70, 50)
print('recorte del móvil en x =', x, 'ancho', w)
