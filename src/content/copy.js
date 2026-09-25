// Copy de la ronda de David (septiembre 2026): menos letra, títulos sutiles y dos en pregunta.
// Literal: no se reescribe aquí sin pasar por David.
// Microcopy aprobado en la ronda 2: etiquetas de los controles y el aviso.

export const CONTACT = {
  email: 'info@vanster.design',
  phone: '93 164 89 25',
  phoneHref: '+34931648925',
  address: 'c. Diputació, 322, 08009 Barcelona',
  // Abre la dirección en Google Maps (en el móvil, en la app si está instalada)
  mapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Carrer de la Diputació, 322, 08009 Barcelona')}`,
  web: 'vanster.design',
  webHref: 'https://vanster.design',
};

export const COPY = {
  hero: {
    title: 'Un año entero sobre la mesa',
    sub: 'La agenda y el calendario 2027 de Esade, para regalar a fin de año.',
    cta: 'Ver la propuesta',
  },
  idea: {
    title: '¿Un logo en una agenda o una agenda de Esade?',
    body: 'Una agenda de catálogo con un logo se reconoce enseguida como regalo promocional. Nosotros diseñamos el objeto entero con la identidad de Esade.',
  },
  agenda: {
    title: '¿Dónde pasa el año una agenda?',
    body: [
      'Abierta sobre la mesa. Por eso es de espiral, con tapa dura y tamaño A5, y lleva los azules y las diagonales de Esade.',
    ],
  },
  calendar: {
    title: 'Doce meses a la vista',
    body: [
      'En un panel, el mes; en el otro, el diseño de Esade. Y sus fechas marcadas, las que no trae ningún calendario comprado.',
    ],
    fieldLabel: 'Marca una fecha de Esade',
  },
  // Quiénes somos, el 1-2-3 de L'Occitane: tres ideas cortas, sin párrafos.
  nosotros: {
    title: 'Quiénes somos',
    ideas: ['Diseñamos desde cero', 'Con vuestra marca', 'Y lo producimos'],
  },
  cierre: {
    title: '¿Hablamos de los próximos pasos?',
    body: [
      'Nos encantaría presentaros la propuesta en persona, resolver cualquier duda y ajustar cada pieza a lo que necesitan de verdad vuestros equipos.',
    ],
    cta: 'Quiero hablarlo',
    copied: 'Correo copiado',
  },
  meta: {
    title: 'vänster × esade',
    description:
      'Propuesta de Vänster para Esade: una agenda y un calendario 2027 diseñados con la identidad de Esade, como regalo de fin de año para vuestra gente.',
  },
};

// Pendiente de que Vänster confirme el idioma de los objetos (PLAN.md).
export const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
export const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
