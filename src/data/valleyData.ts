export type ZoneId =
  | 'Huayopata'
  | 'Quillabamba'
  | 'Santa Teresa'
  | 'Echarati'
  | 'Maranura';

export type PropertyCategory =
  | 'Fincas & Haciendas'
  | 'Villas & Residencias'
  | 'Terrenos de Inversión';

export type BudgetRange = 'all' | 'under-250' | '250-550' | 'over-550';

export type CurrencyCode = 'USD' | 'PEN';

export function formatPropertyPrice(
  priceUsd: number,
  currency: CurrencyCode,
  penRate: number,
): string {
  if (currency === 'PEN') {
    const penAmount = Math.round((priceUsd * penRate) / 500) * 500;
    return `S/ ${new Intl.NumberFormat('es-PE').format(penAmount)}`;
  }
  return `US$ ${new Intl.NumberFormat('en-US').format(priceUsd)}`;
}

export interface HeroSearchFilters {
  location: 'all' | ZoneId;
  category: 'all' | PropertyCategory;
  budget: BudgetRange;
}

export interface ValleyZone {
  id: ZoneId;
  indexLabel: string;
  name: string;
  altitude: string;
  microclimate: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  thumb?: string;
  video: string;
  poster?: string;
  videoScaleOrigin: string;
  driveTime: string;
  coordinates: { lat: number; lng: number };
}

export interface PropertyItem {
  id: string;
  title: string;
  zone: ZoneId;
  category: PropertyCategory;
  priceUsd: number;
  priceFormatted: string;
  isLand: boolean;
  hectares?: number;
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  altitude: string;
  sunarpStatus: string;
  summary: string;
  description: string;
  features: string[];
  productivityOrArchitecture: string;
  images: string[];
  thumbImages?: string[];
  coordinates: { lat: number; lng: number };
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  origin: string;
  propertyAcquired: string;
  quote: string;
  outcome: string;
}

export interface AgentProfile {
  id: 'mariano' | 'jose';
  name: string;
  fullName: string;
  role: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  coverage: string;
  bio: string;
  specialties: string[];
  photo?: string;
  photoThumb?: string;
}

const BASE_URL = import.meta.env.BASE_URL;
const mediaUrl = (slug: string, variant: 'thumb' | 'full') =>
  `${BASE_URL}assets/media/${slug}-${variant}.webp`;

export const HUAYOPATA_AERIAL_VIDEO = `${BASE_URL}assets/videos/huayopata_hero.mp4`;
export const HUAYOPATA_VALLEY_VIDEO = `${BASE_URL}assets/videos/huayopata_valle.mp4`;
export const HERO_VIDEO_POSTER = `${BASE_URL}assets/media/huayopata_hero-poster.webp`;
export const VALLEY_VIDEO_POSTER = `${BASE_URL}assets/media/huayopata_valle-poster.webp`;

export const MEDIA_ASSETS = {
  huayopataAerial: mediaUrl('huayopata-07-panoramica', 'full'),
  huayopataAerialThumb: mediaUrl('huayopata-07-panoramica', 'thumb'),
  huayopataLoma: mediaUrl('huayopata-03-loma', 'full'),
  huayopataLomaThumb: mediaUrl('huayopata-03-loma', 'thumb'),
  huayopataTrocha: mediaUrl('huayopata-05-trocha', 'full'),
  huayopataTrochaThumb: mediaUrl('huayopata-05-trocha', 'thumb'),
  huayopataBosque: mediaUrl('huayopata-06-bosque', 'full'),
  huayopataBosqueThumb: mediaUrl('huayopata-06-bosque', 'thumb'),
  huayopataPueblo: mediaUrl('huayopata-08-pueblo', 'full'),
  huayopataPuebloThumb: mediaUrl('huayopata-08-pueblo', 'thumb'),
  huayopataCordillera: mediaUrl('huayopata-09-cordillera', 'full'),
  huayopataCordilleraThumb: mediaUrl('huayopata-09-cordillera', 'thumb'),
  huayopataCampo: mediaUrl('huayopata-13-campo', 'full'),
  huayopataCampoThumb: mediaUrl('huayopata-13-campo', 'thumb'),
  quillabambaVilla: mediaUrl('quillabamba-villa', 'full'),
  quillabambaVillaThumb: mediaUrl('quillabamba-villa', 'thumb'),
  santaTeresaCanyon: mediaUrl('santa-teresa-canyon', 'full'),
  santaTeresaCanyonThumb: mediaUrl('santa-teresa-canyon', 'thumb'),
  echaratiCacao: mediaUrl('echarati-cacao', 'full'),
  echaratiCacaoThumb: mediaUrl('echarati-cacao', 'thumb'),
  maranuraEstate: mediaUrl('maranura-estate', 'full'),
  maranuraEstateThumb: mediaUrl('maranura-estate', 'thumb'),
};

export const AGENTS: AgentProfile[] = [
  {
    id: 'mariano',
    name: 'Mariano',
    fullName: 'Mariano · Asesor de Campo y Dron',
    role: 'Visitas en campo y tomas aéreas con dron',
    phoneDisplay: '+51 950 155 945',
    phoneHref: '+51950155945',
    whatsappNumber: '51950155945',
    coverage: 'Huayopata · Santa Teresa · Maranura',
    bio: 'Encargado de los recorridos en terreno y tomas con dron en Huayopata y alrededores. Te acompaña directamente a revisar trochas de acceso, linderos, fuentes de agua y zonas cultivables.',
    specialties: [
      'Visitas guiadas a fincas y terrenos',
      'Tomas aéreas con dron y revisión de linderos',
      'Verificación de accesos y fuentes de agua',
    ],
    photo: MEDIA_ASSETS.huayopataCampo,
    photoThumb: MEDIA_ASSETS.huayopataCampoThumb,
  },
  {
    id: 'jose',
    name: 'José',
    fullName: 'José · Asesor Senior y Trámites SUNARP',
    role: 'Asesor inmobiliario y especialista registral',
    phoneDisplay: '+51 982 908 264',
    phoneHref: '+51982908264',
    whatsappNumber: '51982908264',
    coverage: 'Quillabamba · Echarati · La Convención',
    bio: 'Responsable de la asesoría comercial, referencia de tasación y revisión de partidas en SUNARP. Acompaña cada operación desde la primera consulta hasta la firma en notaría en Quillabamba o Cusco.',
    specialties: [
      'Revisión de partidas y certificados en SUNARP',
      'Orientación en precio de mercado y negociación',
      'Coordinación notarial en Quillabamba y Cusco',
    ],
  },
];

export interface FilmReelPhoto {
  id: string;
  src: string;
  thumb?: string;
  title: string;
  caption: string;
}

export const HUAYOPATA_REEL_PHOTOS: FilmReelPhoto[] = [
  {
    id: 'reel-07',
    src: MEDIA_ASSETS.huayopataAerial,
    thumb: MEDIA_ASSETS.huayopataAerialThumb,
    title: 'Ladera forestal y acceso · Huayopata',
    caption: '1,780 m s. n. m. · Vista aérea del sector',
  },
  {
    id: 'reel-03',
    src: MEDIA_ASSETS.huayopataLoma,
    thumb: MEDIA_ASSETS.huayopataLomaThumb,
    title: 'Bosque de pinos y cabaña · Huayopata',
    caption: 'Arboleda madura con ingreso vehicular',
  },
  {
    id: 'reel-05',
    src: MEDIA_ASSETS.huayopataTrocha,
    thumb: MEDIA_ASSETS.huayopataTrochaThumb,
    title: 'Camino afirmado hacia la cumbre',
    caption: 'Acceso directo a terrazas de cultivo',
  },
  {
    id: 'reel-06',
    src: MEDIA_ASSETS.huayopataBosque,
    thumb: MEDIA_ASSETS.huayopataBosqueThumb,
    title: 'Reserva de bosque y quebrada',
    caption: 'Agua de manantial durante todo el año',
  },
  {
    id: 'reel-08',
    src: MEDIA_ASSETS.huayopataPueblo,
    thumb: MEDIA_ASSETS.huayopataPuebloThumb,
    title: 'Centro poblado de Huayopata',
    caption: 'Panorámica hacia el valle principal',
  },
  {
    id: 'reel-09',
    src: MEDIA_ASSETS.huayopataCordillera,
    thumb: MEDIA_ASSETS.huayopataCordilleraThumb,
    title: 'Cordillera y selva alta',
    caption: 'Laderas verdes en La Convención',
  },
  {
    id: 'reel-13',
    src: MEDIA_ASSETS.huayopataCampo,
    thumb: MEDIA_ASSETS.huayopataCampoThumb,
    title: 'Recorrido de verificación en campo',
    caption: 'Revisión directa de linderos con dron',
  },
];

export const VALLEY_ZONES: ValleyZone[] = [
  {
    id: 'Huayopata',
    indexLabel: '01',
    name: 'Huayopata',
    altitude: '1,550 – 2,150 m s. n. m.',
    microclimate: 'Bosque de neblina, té y café',
    tagline: 'Laderas verdes, plantaciones de té y fincas de café en altura.',
    description:
      'Entrada verde a La Convención bajando desde el Abra Málaga. Sus tierras húmedas y manantiales propios la hacen ideal para café de altura, té y casas de campo tranquilas.',
    highlights: ['Café de altura y té', 'Manantiales todo el año', 'A 3h 15m de Cusco'],
    image: MEDIA_ASSETS.huayopataAerial,
    thumb: MEDIA_ASSETS.huayopataAerialThumb,
    video: HUAYOPATA_AERIAL_VIDEO,
    poster: HERO_VIDEO_POSTER,
    videoScaleOrigin: 'origin-center',
    driveTime: '35 min a Quillabamba',
    coordinates: { lat: -12.976, lng: -72.567 },
  },
  {
    id: 'Quillabamba',
    indexLabel: '02',
    name: 'Quillabamba',
    altitude: '1,050 m s. n. m.',
    microclimate: 'Zona urbana y casas de campo',
    tagline: 'Viviendas amplias, clima cálido y acceso asfaltado cerca de la ciudad.',
    description:
      'Capital comercial de La Convención con clima cálido alrededor de 24 °C. Reúne casas familiares amplias, todos los servicios urbanos y títulos independientes.',
    highlights: ['Clima cálido de 24 °C', 'Partidas urbanas independientes', 'Todos los servicios'],
    image: MEDIA_ASSETS.quillabambaVilla,
    thumb: MEDIA_ASSETS.quillabambaVillaThumb,
    video: HUAYOPATA_VALLEY_VIDEO,
    poster: VALLEY_VIDEO_POSTER,
    videoScaleOrigin: 'origin-top-left',
    driveTime: 'Capital provincial',
    coordinates: { lat: -12.867, lng: -72.693 },
  },
  {
    id: 'Santa Teresa',
    indexLabel: '03',
    name: 'Santa Teresa',
    altitude: '1,550 m s. n. m.',
    microclimate: 'Aguas termales y ruta turística',
    tagline: 'Quebradas verdes, cercanía a Cocalmayo y terrenos con vista al cañón.',
    description:
      'Corredor natural hacia Machu Picchu con movimiento turístico constante. Sus terrenos con quebradas de agua y cercanía a las termas de Cocalmayo funcionan muy bien para hospedajes rurales.',
    highlights: ['Ruta hacia Machu Picchu', 'Cerca de baños termales', 'Aptos para hospedaje'],
    image: MEDIA_ASSETS.santaTeresaCanyon,
    thumb: MEDIA_ASSETS.santaTeresaCanyonThumb,
    video: HUAYOPATA_AERIAL_VIDEO,
    poster: HERO_VIDEO_POSTER,
    videoScaleOrigin: 'origin-bottom-right',
    driveTime: '55 min de Quillabamba',
    coordinates: { lat: -13.124, lng: -72.593 },
  },
  {
    id: 'Echarati',
    indexLabel: '04',
    name: 'Echarati',
    altitude: '850 m s. n. m.',
    microclimate: 'Zona de cacao y ríos limpios',
    tagline: 'Extensiones amplias y fértiles para cacao fino y proyectos agrícolas.',
    description:
      'Zona tradicional de cacao Chuncho y frutales. Recomendada para quienes buscan fundos amplios con río cercano y buen suelo agrícola.',
    highlights: ['Cacao Chuncho nativo', 'Fundos de 20 a 150 Ha', 'Ríos y quebradas limpias'],
    image: MEDIA_ASSETS.echaratiCacao,
    thumb: MEDIA_ASSETS.echaratiCacaoThumb,
    video: HUAYOPATA_VALLEY_VIDEO,
    poster: VALLEY_VIDEO_POSTER,
    videoScaleOrigin: 'origin-top-right',
    driveTime: '25 min de Quillabamba',
    coordinates: { lat: -12.768, lng: -72.581 },
  },
  {
    id: 'Maranura',
    indexLabel: '05',
    name: 'Maranura',
    altitude: '1,120 m s. n. m.',
    microclimate: 'Laderas soleadas y frutales',
    tagline: 'Fincas con vista al río Urubamba a pocos minutos de Quillabamba.',
    description:
      'Buena combinación entre carretera asfaltada y tranquilidad rural. Sus laderas soleadas producen cítricos, palto y café, y cuentan con espacios listos para construir.',
    highlights: ['Acceso por carretera PE-28B', 'Buen sol todo el año', 'Listo para construir'],
    image: MEDIA_ASSETS.maranuraEstate,
    thumb: MEDIA_ASSETS.maranuraEstateThumb,
    video: HUAYOPATA_AERIAL_VIDEO,
    poster: HERO_VIDEO_POSTER,
    videoScaleOrigin: 'origin-bottom-left',
    driveTime: '18 min de Quillabamba',
    coordinates: { lat: -12.957, lng: -72.663 },
  },
];

export const PROPERTIES: PropertyItem[] = [
  {
    id: 'fundo-bosque-huayopata',
    title: 'Reserva Bosque de Neblina · Huayopata',
    zone: 'Huayopata',
    category: 'Fincas & Haciendas',
    priceUsd: 520000,
    priceFormatted: 'US$ 520,000',
    isLand: true,
    hectares: 46.0,
    altitude: '1,780 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Partida N.° 11048291',
    summary:
      '46 hectáreas con bosque maduro de pino, camino afirmado interno, casa base y zonas aptas para café y té.',
    description:
      'Finca de 46 hectáreas en Huayopata con planos verificados por dron. Combina bosque maduro, trocha carrozable propia hasta la parte alta, caseta base y dos nacientes naturales de agua.',
    features: [
      '46.0 Ha con linderos verificados mediante dron',
      'Trocha vehicular propia hasta la parte alta',
      'Suelos aptos para café de altura y té',
      'Dos ojos de agua y caseta base existente',
    ],
    productivityOrArchitecture: 'Suelo forestal y cafetalero',
    images: [
      MEDIA_ASSETS.huayopataAerial,
      MEDIA_ASSETS.huayopataLoma,
      MEDIA_ASSETS.huayopataTrocha,
      MEDIA_ASSETS.huayopataBosque,
      MEDIA_ASSETS.huayopataCordillera,
    ],
    thumbImages: [
      MEDIA_ASSETS.huayopataAerialThumb,
      MEDIA_ASSETS.huayopataLomaThumb,
      MEDIA_ASSETS.huayopataTrochaThumb,
      MEDIA_ASSETS.huayopataBosqueThumb,
      MEDIA_ASSETS.huayopataCordilleraThumb,
    ],
    coordinates: { lat: -12.982, lng: -72.556 },
  },
  {
    id: 'villa-mirador-quillabamba',
    title: 'Villa Mirador Alto Urubamba',
    zone: 'Quillabamba',
    category: 'Villas & Residencias',
    priceUsd: 680000,
    priceFormatted: 'US$ 680,000',
    isLand: false,
    areaSqm: 540,
    bedrooms: 5,
    bathrooms: 6,
    altitude: '1,180 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Libre de cargas',
    summary:
      'Casa amplia en madera y piedra con piscina y vista abierta sobre el valle de Quillabamba.',
    description:
      'Residencia pensada para el clima cálido de Quillabamba, construida en madera dura y piedra natural, con amplios ventanales, piscina temperada y terraza familiar de 140 m².',
    features: [
      'Terreno privado de 4,200 m² con cerco vivo',
      'Piscina temperada y terraza en madera',
      'Sistema solar de respaldo (15 kW)',
      'Dormitorio principal con terraza privada',
    ],
    productivityOrArchitecture: 'Residencia lista para habitar',
    images: [MEDIA_ASSETS.quillabambaVilla],
    thumbImages: [MEDIA_ASSETS.quillabambaVillaThumb],
    coordinates: { lat: -12.861, lng: -72.698 },
  },
  {
    id: 'hacienda-neblina-huayopata',
    title: 'Terreno Mirador · Huayopata',
    zone: 'Huayopata',
    category: 'Terrenos de Inversión',
    priceUsd: 235000,
    priceFormatted: 'US$ 235,000',
    isLand: true,
    hectares: 18.5,
    altitude: '1,690 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Título definitivo',
    summary:
      '18.5 hectáreas en Huayopata con trocha afirmada, vista hacia el pueblo y áreas planas listas para proyecto.',
    description:
      'Terreno de 18.5 hectáreas en Huayopata que combina 10 hectáreas cultivables y 8.5 hectáreas de bosque nativo con miradores naturales hacia el valle y el pueblo.',
    features: [
      '18.5 Ha entre área cultivable y bosque nativo',
      'Ingreso vehicular afirmado por todo el predio',
      'Vista abierta hacia el pueblo de Huayopata',
      'Partida independiente saneada en SUNARP',
    ],
    productivityOrArchitecture: 'Terreno mixto agrícola y mirador',
    images: [
      MEDIA_ASSETS.huayopataTrocha,
      MEDIA_ASSETS.huayopataPueblo,
      MEDIA_ASSETS.huayopataCordillera,
    ],
    thumbImages: [
      MEDIA_ASSETS.huayopataTrochaThumb,
      MEDIA_ASSETS.huayopataPuebloThumb,
      MEDIA_ASSETS.huayopataCordilleraThumb,
    ],
    coordinates: { lat: -12.968, lng: -72.579 },
  },
  {
    id: 'reserva-termal-santa-teresa',
    title: 'Reserva Cañón Cocalmayo',
    zone: 'Santa Teresa',
    category: 'Terrenos de Inversión',
    priceUsd: 560000,
    priceFormatted: 'US$ 560,000',
    isLand: true,
    hectares: 24.0,
    altitude: '1,520 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Plano georreferenciado',
    summary:
      '24 hectáreas con frente de río y caída de agua a 12 minutos de los baños termales de Santa Teresa.',
    description:
      'Terreno ubicado en la ruta turística hacia Machu Picchu. Cuenta con tres áreas niveladas naturales, ribera de río y estudio básico de suelos listo para proyecto turístico o retiro privado.',
    features: [
      '420 metros de frente de río y caída de agua',
      'Ideal para hospedaje rural o casa de retiro',
      'Factibilidad eléctrica a pie de terreno',
      'Estudio topográfico y de suelos incluido',
    ],
    productivityOrArchitecture: 'Uso turístico o retiro en naturaleza',
    images: [MEDIA_ASSETS.santaTeresaCanyon],
    thumbImages: [MEDIA_ASSETS.santaTeresaCanyonThumb],
    coordinates: { lat: -13.118, lng: -72.596 },
  },
  {
    id: 'estancia-maranura-villa',
    title: 'Estancia Panorámica Maranura',
    zone: 'Maranura',
    category: 'Villas & Residencias',
    priceUsd: 390000,
    priceFormatted: 'US$ 390,000',
    isLand: false,
    areaSqm: 410,
    bedrooms: 4,
    bathrooms: 4,
    altitude: '1,120 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Independizada',
    summary:
      'Casa de campo en piedra y madera con terrazas sobre plantaciones de cítricos y el río Urubamba.',
    description:
      'Casa de campo a 18 minutos de Quillabamba por carretera asfaltada. Cuenta con terrazas techadas, zona de parrilla exterior y huerta propia de cítricos y palto.',
    features: [
      'Terreno campestre de 5,800 m² con portón vehicular',
      'Terrazas techadas en madera y piedra',
      'Cuatro dormitorios con vista al valle',
      'Sistema de riego instalado para frutales',
    ],
    productivityOrArchitecture: 'Casa de campo · 18 min de Quillabamba',
    images: [MEDIA_ASSETS.maranuraEstate],
    thumbImages: [MEDIA_ASSETS.maranuraEstateThumb],
    coordinates: { lat: -12.954, lng: -72.668 },
  },
  {
    id: 'fundo-cacao-echarati',
    title: 'Fundo Cacao Chuncho Echarati',
    zone: 'Echarati',
    category: 'Fincas & Haciendas',
    priceUsd: 340000,
    priceFormatted: 'US$ 340,000',
    isLand: true,
    hectares: 52.0,
    altitude: '890 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Partida saneada',
    summary:
      '52 hectáreas con 22 Ha de cacao Chuncho en producción, acceso al río y casa principal en madera.',
    description:
      'Finca agrícola en producción dentro de Echarati. Sus 22 hectáreas de cacao Chuncho generan cosecha constante, con casa de madera frente al río y área de secado.',
    features: [
      '22 Ha de cacao Chuncho en plena producción',
      'Casa de madera y piedra frente al río',
      'Módulo de fermentación y secado solar',
      'Acceso directo desde la vía hacia Kiteni',
    ],
    productivityOrArchitecture: 'Fundo cacaotero en producción',
    images: [MEDIA_ASSETS.echaratiCacao],
    thumbImages: [MEDIA_ASSETS.echaratiCacaoThumb],
    coordinates: { lat: -12.764, lng: -72.575 },
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Martín Aramburú',
    role: 'Productor agrícola',
    origin: 'Lima · Compró en Huayopata',
    propertyAcquired: 'Finca cafetalera en altura',
    quote:
      'Antes vimos terrenos con dudas en los linderos hasta llegar a Terrantier. Revisaron la partida en SUNARP y volaron el dron para medir todo en campo antes de firmar.',
    outcome: 'Firma en notaría sin observaciones en menos de un mes.',
  },
  {
    id: 'test-2',
    name: 'Elena y Thomas Lindner',
    role: 'Arquitecta y emprendedor turístico',
    origin: 'Cusco · Predio en Santa Teresa',
    propertyAcquired: 'Terreno de 12 Ha',
    quote:
      'Buscábamos agua propia y privacidad cerca de la ruta a Machu Picchu. Caminamos todo el lindero con el equipo y validamos documentos antes de dar el paso.',
    outcome: 'Compra cerrada con planos y partida al día.',
  },
  {
    id: 'test-3',
    name: 'Lucía Mendoza',
    role: 'Médica e inversionista',
    origin: 'Arequipa · Casa en Quillabamba',
    propertyAcquired: 'Residencia familiar 420 m²',
    quote:
      'Queríamos una casa con buen clima todo el año. Nos dieron información clara de precios, documentos y el trámite en notaría fue muy ordenado.',
    outcome: 'Entrega rápida con título independizado.',
  },
];
