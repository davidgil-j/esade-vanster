// Foto en AVIF y WebP con srcset. `base` sin extensión ni anchura: '/fotos/agenda-esade'.
// Fuera de la primera pantalla, carga diferida. Las fotos de escena tienen 800, 1200 y 2400 px.
export default function Photo({ base, widths = [800, 1200, 2400], sizes = '100vw', alt = '', width, height, eager = false, className = '', imgClassName = '', ...rest }) {
  const set = (ext) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        className={imgClassName}
        src={`${base}-${widths[0]}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
        draggable={false}
        {...rest}
      />
    </picture>
  );
}
