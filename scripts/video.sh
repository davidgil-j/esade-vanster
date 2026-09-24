#!/bin/sh
# Vídeo de la portada (PLAN.md · rediseño final, punto 4). Uso: sh scripts/video.sh
# Sin audio, con el desenfoque dentro del archivo (sigma 5 a 1280 px) y más desenfoque solo donde
# aún se leía texto inventado (la placa bajo «esade» y el banderín de la derecha). La cámara está fija.
set -e
cd "$(dirname "$0")/.."
SRC=video-esade-vanster.mp4
OUT=public/video
TMP=$(mktemp -d)
mkdir -p "$OUT"

# Máscara de desenfoque extra (blanco = más desenfoque), con bordes suaves.
python3 - "$TMP/mask.pgm" <<'PY'
import sys
W, H = 1280, 720
rects = [(452, 306, 684, 362),   # placa «RAMON LLULL UNIVERSITY»
         (1058, 332, 1122, 540)]  # banderín «Do Good Do Better»
feather = 9
px = bytearray(W * H)
for y in range(H):
    for x in range(W):
        v = 0.0
        for x0, y0, x1, y1 in rects:
            dx = max(x0 - x, 0, x - x1)
            dy = max(y0 - y, 0, y - y1)
            d = (dx * dx + dy * dy) ** 0.5
            v = max(v, max(0.0, 1 - d / feather))
        px[y * W + x] = int(v * 255)
open(sys.argv[1], 'wb').write(b'P5\n%d %d\n255\n' % (W, H) + bytes(px))
PY

BLUR="[0:v]split[a][b];[a]gblur=sigma=5[soft];[b]gblur=sigma=14[hard];[1:v]format=gray[m];[hard][m]alphamerge[hm];[soft][hm]overlay=format=auto,format=yuv420p"

# Escritorio 16:9
ffmpeg -loglevel error -y -i "$SRC" -loop 1 -i "$TMP/mask.pgm" -filter_complex "$BLUR[v]" -map "[v]" -an -t 10 \
  -c:v libx264 -preset veryslow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/portada.mp4"
ffmpeg -loglevel error -y -i "$SRC" -loop 1 -i "$TMP/mask.pgm" -filter_complex "$BLUR[v]" -map "[v]" -an -t 10 \
  -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good -cpu-used 1 "$OUT/portada.webm"
# Móvil 9:16, recortado sobre el punto focal (rótulo y puerta, ~44 % del ancho)
CROP="crop=406:720:360:0"
ffmpeg -loglevel error -y -i "$SRC" -loop 1 -i "$TMP/mask.pgm" -filter_complex "$BLUR,$CROP[v]" -map "[v]" -an -t 10 \
  -c:v libx264 -preset veryslow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/portada-movil.mp4"
ffmpeg -loglevel error -y -i "$SRC" -loop 1 -i "$TMP/mask.pgm" -filter_complex "$BLUR,$CROP[v]" -map "[v]" -an -t 10 \
  -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good -cpu-used 1 "$OUT/portada-movil.webm"

# Imagen fija muy desenfocada (primer fotograma, sigma 25): lo primero que se pinta.
ffmpeg -loglevel error -y -i "$SRC" -frames:v 1 -vf "gblur=sigma=25,scale=480:270" "$TMP/fija.png"
ffmpeg -loglevel error -y -i "$SRC" -frames:v 1 -vf "gblur=sigma=25,crop=406:720:360:0,scale=204:360" "$TMP/fija-movil.png"
# Último fotograma (el anochecer): cierre y movimiento reducido. Mismo desenfoque que el vídeo.
ffmpeg -loglevel error -y -sseof -0.05 -i "$SRC" -loop 1 -i "$TMP/mask.pgm" -filter_complex "$BLUR[v]" -map "[v]" -frames:v 1 -update 1 "$TMP/final.png"
ffmpeg -loglevel error -y -sseof -0.05 -i "$SRC" -loop 1 -i "$TMP/mask.pgm" -filter_complex "$BLUR,$CROP[v]" -map "[v]" -frames:v 1 -update 1 "$TMP/final-movil.png"

for f in fija fija-movil final final-movil; do
  q=60; [ "${f#fija}" != "$f" ] && q=40
  avifenc -q $q -s 4 "$TMP/$f.png" "$OUT/$f.avif" >/dev/null
  cwebp -quiet -q 80 -m 6 -sharp_yuv "$TMP/$f.png" -o "$OUT/$f.webp"
done
rm -rf "$TMP"
ls -l "$OUT"
