import huayopata03Loma from '../assets/huayopata/huayopata_03_loma.jpg';
import huayopata05Trocha from '../assets/huayopata/huayopata_05_trocha.jpg';
import huayopata06Bosque from '../assets/huayopata/huayopata_06_bosque.jpg';
import huayopata07Panoramica from '../assets/huayopata/huayopata_07_panoramica.jpg';
import huayopata08Pueblo from '../assets/huayopata/huayopata_08_pueblo.jpg';
import huayopata09Cordillera from '../assets/huayopata/huayopata_09_cordillera.jpg';
import huayopata13Campo from '../assets/huayopata/huayopata_13_campo.jpg';

import villaSelvaAltaImg from '../assets/images/villa_selva_alta_1794594171747.jpg';
import santaTeresaCanyonImg from '../assets/images/santa_teresa_canyon_1794594172097.jpg';
import echaratiCacaoFincaImg from '../assets/images/echarati_cacao_finca_1794594171694.jpg';
import maranuraValleyEstateImg from '../assets/images/maranura_valley_estate_1794594173233.jpg';

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
  video: string;
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

export const HUAYOPATA_AERIAL_VIDEO = '/assets/videos/huayopata_hero.mp4';
export const HUAYOPATA_VALLEY_VIDEO = '/assets/videos/huayopata_valle.mp4';

export interface FilmReelPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
}

export const HUAYOPATA_REEL_PHOTOS: FilmReelPhoto[] = [
  {
    id: 'reel-07',
    src: huayopata07Panoramica,
    title: 'Ladera Forestal & Trocha · Huayopata',
    caption: '1,780 m s. n. m. · Levantamiento aéreo integral',
  },
  {
    id: 'reel-03',
    src: huayopata03Loma,
    title: 'Macizo de Pinos y Refugio · Huayopata',
    caption: 'Bosque consolidado con acceso vehicular interno',
  },
  {
    id: 'reel-05',
    src: huayopata05Trocha,
    title: 'Acceso Afirmado en Cumbre · Huayopata',
    caption: 'Conectividad hacia terrazas cafetaleras',
  },
  {
    id: 'reel-06',
    src: huayopata06Bosque,
    title: 'Reserva Boscosa & Quebrada · Huayopata',
    caption: 'Nacientes de agua permanentes en altura',
  },
  {
    id: 'reel-08',
    src: huayopata08Pueblo,
    title: 'Corredor Urbano de Huayopata',
    caption: 'Vista hacia el valle y río principal',
  },
  {
    id: 'reel-09',
    src: huayopata09Cordillera,
    title: 'Horizonte de Selva Alta · La Convención',
    caption: 'Bosque de neblina y pisos ecológicos',
  },
  {
    id: 'reel-13',
    src: huayopata13Campo,
    title: 'Inspección Fotogramétrica en Campo',
    caption: 'Verificación técnica directa sobre lindero',
  },
];

export const MEDIA_ASSETS = {
  huayopataAerial: huayopata07Panoramica,
  huayopataLoma: huayopata03Loma,
  huayopataTrocha: huayopata05Trocha,
  huayopataBosque: huayopata06Bosque,
  huayopataPueblo: huayopata08Pueblo,
  huayopataCordillera: huayopata09Cordillera,
  huayopataCampo: huayopata13Campo,
  quillabambaVilla: villaSelvaAltaImg,
  santaTeresaCanyon: santaTeresaCanyonImg,
  echaratiCacao: echaratiCacaoFincaImg,
  maranuraEstate: maranuraValleyEstateImg,
};

export const VALLEY_ZONES: ValleyZone[] = [
  {
    id: 'Huayopata',
    indexLabel: '01',
    name: 'Huayopata',
    altitude: '1,550 – 2,150 m s. n. m.',
    microclimate: 'Bosque de neblina, té y café Geisha',
    tagline: 'Laderas de neblina matinal, plantaciones de té de altura y bosques privados.',
    description:
      'Puerta verde de La Convención descendiendo desde el Abra Málaga. Sus suelos ricos en materia orgánica y manantiales permanentes permiten combinar fincas cafetaleras de especialidad con refugios arquitectónicos privados.',
    highlights: ['Café Geisha >87 pts SCA', 'Manantiales propios todo el año', 'A 3h 15m de Cusco'],
    image: MEDIA_ASSETS.huayopataAerial,
    video: HUAYOPATA_AERIAL_VIDEO,
    videoScaleOrigin: 'origin-center',
    driveTime: '35 min a Quillabamba',
    coordinates: { lat: -12.976, lng: -72.567 },
  },
  {
    id: 'Quillabamba',
    indexLabel: '02',
    name: 'Quillabamba',
    altitude: '1,050 m s. n. m.',
    microclimate: 'Centro urbano y villas ribereñas',
    tagline: 'Residencias contemporáneas, clima cálido y conectividad sobre el Vilcanota.',
    description:
      'Corazón residencial y financiero de La Convención con clima cálido seco de 24 °C promedio anual. Concentra villas familiares de diseño bioclimático, acceso vial asfaltado y partidas urbanas consolidadas.',
    highlights: ['Clima templado-cálido 24 °C', 'Partidas urbanas independientes', 'Conectividad inmediata'],
    image: MEDIA_ASSETS.quillabambaVilla,
    video: HUAYOPATA_VALLEY_VIDEO,
    videoScaleOrigin: 'origin-top-left',
    driveTime: 'Capital provincial',
    coordinates: { lat: -12.867, lng: -72.693 },
  },
  {
    id: 'Santa Teresa',
    indexLabel: '03',
    name: 'Santa Teresa',
    altitude: '1,550 m s. n. m.',
    microclimate: 'Aguas termales y ruta a Machu Picchu',
    tagline: 'Cañones turquesa, fuentes termales de Cocalmayo y eco-hospitalidad de alto valor.',
    description:
      'Corredor amazónico hacia Machu Picchu con flujo internacional constante. Sus laderas con cascadas y cercanía a Cocalmayo posicionan a la zona para lodges boutique y retiros de bienestar.',
    highlights: ['Demanda ecoturística internacional', 'Fuentes termales naturales', 'Ruta alterna a Machu Picchu'],
    image: MEDIA_ASSETS.santaTeresaCanyon,
    video: HUAYOPATA_AERIAL_VIDEO,
    videoScaleOrigin: 'origin-bottom-right',
    driveTime: '55 min de Quillabamba',
    coordinates: { lat: -13.124, lng: -72.593 },
  },
  {
    id: 'Echarati',
    indexLabel: '04',
    name: 'Echarati',
    altitude: '850 m s. n. m.',
    microclimate: 'Cacao chuncho y ríos cristalinos',
    tagline: 'Grandes extensiones fértiles de cacao fino de aroma y selva alta exuberante.',
    description:
      'Territorio emblemático del cacao Chuncho ancestral peruano. Ideal para inversionistas patrimoniales que buscan fincas de mediana y gran escala con ríos limpios y alto potencial agroforestal.',
    highlights: ['Cacao Chuncho nativo', 'Fundos de 20 a 150 Ha', 'Ríos y quebradas limpias'],
    image: MEDIA_ASSETS.echaratiCacao,
    video: HUAYOPATA_VALLEY_VIDEO,
    videoScaleOrigin: 'origin-top-right',
    driveTime: '25 min de Quillabamba',
    coordinates: { lat: -12.768, lng: -72.581 },
  },
  {
    id: 'Maranura',
    indexLabel: '05',
    name: 'Maranura',
    altitude: '1,120 m s. n. m.',
    microclimate: 'Terrazas soleadas y cítricos',
    tagline: 'Fincas panorámicas sobre el río Urubamba a pocos minutos de Quillabamba.',
    description:
      'Equilibrio sereno entre conectividad por carretera asfaltada y amplitud rural. Sus laderas soleadas albergan cítricos, café orgánico y parcelas listas para casas de campo.',
    highlights: ['Acceso directo por Ruta PE-28B', 'Alta luminosidad todo el año', 'Terrazas listas para obra'],
    image: MEDIA_ASSETS.maranuraEstate,
    video: HUAYOPATA_AERIAL_VIDEO,
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
      '46 hectáreas con bosque maduro de pino y selva alta, carretera interna afirmada, casa base y terrazas aptas para café Geisha y té.',
    description:
      'Propiedad insignia con levantamiento aerofotogramétrico completo en Huayopata. Combina macizo forestal consolidado, trocha carrozable privada compactada a lo largo de la ladera, pabellón operativo y nacientes propias de agua cristalina.',
    features: [
      '46.0 Ha con lindero georreferenciado mediante dron RTK',
      'Trocha vehicular privada ejecutada hasta la cumbre',
      'Suelos aptos para café Geisha y té de especialidad',
      'Dos ojos de agua registrados y caseta base existente',
    ],
    productivityOrArchitecture: 'Suelo forestal y cafetalero de altura',
    images: [
      MEDIA_ASSETS.huayopataAerial,
      MEDIA_ASSETS.huayopataLoma,
      MEDIA_ASSETS.huayopataTrocha,
      MEDIA_ASSETS.huayopataBosque,
      MEDIA_ASSETS.huayopataCordillera,
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
      'Residencia contemporánea de teca, piedra andina y piscina infinita suspendida sobre el valle cálido de Quillabamba.',
    description:
      'Arquitectura bioclimática concebida para la ceja de selva: celosías de madera shihuahuaco, ventanales acústicos piso-techo, piscina infinita climatizada y terraza de 140 m² orientada al poniente.',
    features: [
      'Terreno matriz privado de 4,200 m² con cerco vivo',
      'Piscina infinita temperada y deck en teca certificada',
      'Sistema solar híbrido con respaldo de litio (15 kW)',
      'Suite principal panorámica con terraza privada',
    ],
    productivityOrArchitecture: 'Arquitectura orgánica · Entrega llave en mano',
    images: [MEDIA_ASSETS.quillabambaVilla],
    coordinates: { lat: -12.861, lng: -72.698 },
  },
  {
    id: 'hacienda-neblina-huayopata',
    title: 'Terreno Mirador & Laderas de Huayopata',
    zone: 'Huayopata',
    category: 'Terrenos de Inversión',
    priceUsd: 235000,
    priceFormatted: 'US$ 235,000',
    isLand: true,
    hectares: 18.5,
    altitude: '1,690 m s. n. m.',
    sunarpStatus: 'Inscrita en SUNARP · Título definitivo',
    summary:
      '18.5 hectáreas en Huayopata con trocha afirmada, vistas panorámicas hacia el pueblo y plataformas listas para desarrollo.',
    description:
      'Predio de inversión en Huayopata con 10 hectáreas de ladera cultivable y 8.5 hectáreas de bosque nuboso y miradores naturales sobre el valle y centro poblado.',
    features: [
      '18.5 Ha con terrazas naturales y bosque nativo de altura',
      'Acceso vehicular consolidado a través de todo el predio',
      'Vistas abiertas hacia la quebrada y centro poblado de Huayopata',
      'Partida independiente saneada en SUNARP',
    ],
    productivityOrArchitecture: 'Terreno estratégico de altura en Huayopata',
    images: [
      MEDIA_ASSETS.huayopataTrocha,
      MEDIA_ASSETS.huayopataPueblo,
      MEDIA_ASSETS.huayopataCordillera,
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
    sunarpStatus: 'Inscrita en SUNARP · Levantamiento RTK',
    summary:
      '24 hectáreas con frente de río cristalino y cascada natural a 12 minutos de las aguas termales de Santa Teresa.',
    description:
      'Enclave privilegiado para eco-hospitalidad de alto estándar en la ruta amazónica hacia Machu Picchu. Cuenta con tres plataformas naturales niveladas, ribera de río y estudio geotécnico preliminar.',
    features: [
      '420 metros lineales de ribera y caída de agua propia',
      'Zonificación apta para eco-lodge o retiro privado',
      'Factibilidad eléctrica trifásica a pie de predio',
      'Estudio topográfico y de suelos incluido',
    ],
    productivityOrArchitecture: 'Eco-hospitalidad · Ruta Machu Picchu',
    images: [MEDIA_ASSETS.santaTeresaCanyon],
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
      'Casa de campo en piedra y madera oscura con terrazas sobre plantaciones de cítricos y el río Urubamba.',
    description:
      'Residencia elevada a 18 minutos de Quillabamba por vía asfaltada, diseñada con amplios decks panorámicos, zona de fogón exterior y huerto privado de cítricos y palto.',
    features: [
      'Terreno campestre de 5,800 m² con acceso vehicular',
      'Terrazas cubiertas en madera estructural y piedra',
      'Cuatro suites con vista abierta al valle del Urubamba',
      'Riego tecnificado instalado para frutales',
    ],
    productivityOrArchitecture: 'Residencia campestre · 18 min de Quillabamba',
    images: [MEDIA_ASSETS.maranuraEstate],
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
    sunarpStatus: 'Inscrita en SUNARP · Partida matriz saneada',
    summary:
      '52 hectáreas con 22 Ha de cacao Chuncho nativo en producción, frente fluvial cristalino y pabellón en madera.',
    description:
      'Finca productiva con excelente piso ecológico en el Alto Urubamba. Sus 22 hectáreas de cacao Chuncho fino de aroma generan cosecha continua con compradores de chocolatería fina.',
    features: [
      '22 Ha de cacao Chuncho injertado en plena cosecha',
      'Pabellón elevado en cedro y piedra frente al río',
      'Módulo de fermentación y secadero solar',
      'Acceso directo desde corredor hacia Kiteni',
    ],
    productivityOrArchitecture: 'Agroexportación orgánica y reserva fluvial',
    images: [MEDIA_ASSETS.echaratiCacao],
    coordinates: { lat: -12.764, lng: -72.575 },
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Martín Aramburú Velasco',
    role: 'Socio Director, Fondo Agroforestal Andino',
    origin: 'Lima · Adquirió 42 Ha en Huayopata',
    propertyAcquired: 'Finca cafetalera en altura',
    quote:
      'Evaluamos cuatro fundos en La Convención con superposición de linderos hasta llegar a Selva Alta. Su equipo auditó cada partida en SUNARP y realizó el vuelo fotogramétrico RTK antes de firmar arras.',
    outcome: 'Cierre notarial sin observaciones en 28 días y primera cosecha de Geisha exportada.',
  },
  {
    id: 'test-2',
    name: 'Elena & Thomas Lindner',
    role: 'Arquitecta y Emprendedor Turístico',
    origin: 'Zúrich / Cusco · Predio en Santa Teresa',
    propertyAcquired: 'Reserva eco-turística 12 Ha',
    quote:
      'Buscábamos acceso real al agua y privacidad en la ruta hacia Machu Picchu. Recorrimos cada vértice en campo con sus ingenieros y validamos caudales y zonificación antes de invertir.',
    outcome: 'Anteproyecto de 6 suites boutique aprobado con total certeza registral.',
  },
  {
    id: 'test-3',
    name: 'Dra. Lucía Mendoza Quiñones',
    role: 'Médica Especialista e Inversionista Privada',
    origin: 'Arequipa · Residencia en Quillabamba',
    propertyAcquired: 'Villa familiar 420 m²',
    quote:
      'Queríamos una casa de clima cálido permanente lejos de la saturación urbana. La transparencia técnica en tasación, saneamiento y entrega notarial superó nuestro estándar.',
    outcome: 'Apreciación estimada del 18% en 24 meses y renta corporativa estacional.',
  },
];
