// Render estático de la agenda (plan B de la firma en móvil sin WebGL y con movimiento
// reducido). Lo genera scripts/render-agenda.cjs a partir del propio modelo 3D.
// quad: esquinas de la zona del nombre sobre la imagen, en fracciones (x, y).
export const AGENDA_RENDER = {
  src: '/agenda/render.webp',
  aspect: '1200 / 1000',
  quad: [[0.3142,0.4604],[0.6569,0.5723],[0.6448,0.6154],[0.298,0.5004]],
};
