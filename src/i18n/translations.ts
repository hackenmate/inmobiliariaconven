import type {
  AgentProfile,
  FilmReelPhoto,
  PropertyCategory,
  PropertyItem,
  TestimonialItem,
  ValleyZone,
  ZoneId,
} from '../data/valleyData';

export type LanguageCode = 'es' | 'en';

export const CATEGORY_LABELS: Record<LanguageCode, Record<PropertyCategory, string>> = {
  es: {
    'Fincas & Haciendas': 'Fincas y Haciendas',
    'Villas & Residencias': 'Villas y Residencias',
    'Terrenos de Inversión': 'Terrenos de Inversión',
  },
  en: {
    'Fincas & Haciendas': 'Estates & Farms',
    'Villas & Residencias': 'Villas & Residences',
    'Terrenos de Inversión': 'Investment Land',
  },
};

export const REEL_TRANSLATIONS_EN: Record<string, { title: string; caption: string }> = {
  'reel-07': {
    title: 'Forest Slope & Access · Huayopata',
    caption: '1,780 m a.s.l. · Aerial view of the area',
  },
  'reel-03': {
    title: 'Pine Grove & Cabin · Huayopata',
    caption: 'Mature woodland with vehicle access',
  },
  'reel-05': {
    title: 'Ridge Access Track',
    caption: 'Direct road to farming terraces',
  },
  'reel-06': {
    title: 'Forest Reserve & Creek',
    caption: 'Year-round natural mountain water',
  },
  'reel-08': {
    title: 'Huayopata Town',
    caption: 'View over the main valley',
  },
  'reel-09': {
    title: 'High Jungle Mountains',
    caption: 'Green ridges across La Convención',
  },
  'reel-13': {
    title: 'Field Visit & Verification',
    caption: 'On-site boundary review with drone',
  },
};

export function getLocalizedReelPhoto(photo: FilmReelPhoto, lang: LanguageCode): FilmReelPhoto {
  if (lang === 'es') return photo;
  const en = REEL_TRANSLATIONS_EN[photo.id];
  return en ? { ...photo, ...en } : photo;
}

const ZONE_TRANSLATIONS_EN: Record<
  ZoneId,
  {
    altitude: string;
    microclimate: string;
    tagline: string;
    description: string;
    highlights: string[];
    driveTime: string;
  }
> = {
  Huayopata: {
    altitude: '1,550 – 2,150 m a.s.l.',
    microclimate: 'Cloud forest, tea & coffee',
    tagline: 'Green hills, tea plantations, and high-altitude coffee farms.',
    description:
      'The green gateway to La Convención coming down from Abra Málaga. Moist soils and natural springs make it ideal for high-altitude coffee, tea, and quiet country homes.',
    highlights: ['Coffee & tea farms', 'Year-round water springs', '3h 15m from Cusco'],
    driveTime: '35 min to Quillabamba',
  },
  Quillabamba: {
    altitude: '1,050 m a.s.l.',
    microclimate: 'Urban area & country homes',
    tagline: 'Spacious homes, warm weather, and paved access close to town.',
    description:
      'Commercial center of La Convención with warm weather around 24 °C. Offers spacious family homes, full city services, and independent property titles.',
    highlights: ['Warm 24 °C climate', 'Independent city titles', 'Full urban services'],
    driveTime: 'Provincial capital',
  },
  'Santa Teresa': {
    altitude: '1,550 m a.s.l.',
    microclimate: 'Hot springs & tourist route',
    tagline: 'Green canyons, proximity to Cocalmayo, and scenic views.',
    description:
      'Natural route toward Machu Picchu with steady visitor flow. Lots with mountain creeks near Cocalmayo hot springs work very well for country lodges.',
    highlights: ['Route toward Machu Picchu', 'Near natural hot springs', 'Suited for hospitality'],
    driveTime: '55 min from Quillabamba',
  },
  Echarati: {
    altitude: '850 m a.s.l.',
    microclimate: 'Cacao farms & clean rivers',
    tagline: 'Large fertile plots for fine cacao and agricultural projects.',
    description:
      'Traditional territory for native Chuncho cacao and fruit crops. Recommended for buyers looking for larger farms near clean rivers with good soil.',
    highlights: ['Native Chuncho Cacao', '20 to 150 Ha farms', 'Clean rivers nearby'],
    driveTime: '25 min from Quillabamba',
  },
  Maranura: {
    altitude: '1,120 m a.s.l.',
    microclimate: 'Sunny slopes & fruit groves',
    tagline: 'Farms overlooking the Urubamba River minutes from Quillabamba.',
    description:
      'A practical balance between paved road access and rural quiet. Sunny hillsides produce citrus, avocado, and coffee, with spaces ready to build.',
    highlights: ['Direct PE-28B highway access', 'Sunny year-round', 'Ready to build'],
    driveTime: '18 min from Quillabamba',
  },
};

export function getLocalizedZone(zone: ValleyZone, lang: LanguageCode): ValleyZone {
  if (lang === 'es') return zone;
  const en = ZONE_TRANSLATIONS_EN[zone.id];
  return en ? { ...zone, ...en } : zone;
}

const PROPERTY_TRANSLATIONS_EN: Record<
  string,
  {
    title: string;
    altitude: string;
    sunarpStatus: string;
    summary: string;
    description: string;
    features: string[];
    productivityOrArchitecture: string;
  }
> = {
  'fundo-bosque-huayopata': {
    title: 'Cloud Forest Reserve · Huayopata',
    altitude: '1,780 m a.s.l.',
    sunarpStatus: 'SUNARP Title No. 11048291',
    summary:
      '46 hectares with mature pine woodland, internal gravel road, base house, and land suited for coffee and tea.',
    description:
      '46-hectare estate in Huayopata with drone-verified boundaries. Combines mature woodland, a private vehicle track up to the ridge, a base house, and two natural water springs.',
    features: [
      '46.0 Ha with drone-verified boundaries',
      'Private gravel road to the upper ridge',
      'Soils suited for specialty coffee and tea',
      'Two water springs and existing base cabin',
    ],
    productivityOrArchitecture: 'Forestry & coffee soil',
  },
  'villa-mirador-quillabamba': {
    title: 'Alto Urubamba Overlook Villa',
    altitude: '1,180 m a.s.l.',
    sunarpStatus: 'Registered in SUNARP · Free of liens',
    summary:
      'Spacious stone and hardwood home with swimming pool overlooking the Quillabamba valley.',
    description:
      'Built for Quillabamba’s warm weather using hardwood and natural stone, with large windows, a heated pool, and a 140 m² family terrace.',
    features: [
      'Private 4,200 m² titled lot with natural hedge',
      'Heated pool and hardwood deck',
      '15 kW backup solar system',
      'Main bedroom with private terrace',
    ],
    productivityOrArchitecture: 'Ready-to-move-in residence',
  },
  'hacienda-neblina-huayopata': {
    title: 'Huayopata Overlook Land',
    altitude: '1,690 m a.s.l.',
    sunarpStatus: 'Registered in SUNARP · Definitive title',
    summary:
      '18.5 hectares in Huayopata with gravel road access, valley views, and flat areas ready for building.',
    description:
      '18.5-hectare parcel in Huayopata combining 10 hectares of farmable land and 8.5 hectares of native forest with open views of the valley and town.',
    features: [
      '18.5 Ha mixing farmable slopes and native forest',
      'Gravel road access across the property',
      'Open views toward Huayopata town',
      'Independent SUNARP-cleared title',
    ],
    productivityOrArchitecture: 'Mixed farming & lookout land',
  },
  'reserva-termal-santa-teresa': {
    title: 'Cocalmayo Canyon Reserve',
    altitude: '1,520 m a.s.l.',
    sunarpStatus: 'Registered in SUNARP · Georeferenced map',
    summary:
      '24 hectares with riverfront and natural waterfall 12 minutes from Santa Teresa hot springs.',
    description:
      'Situated along the tourist corridor toward Machu Picchu. Features three natural flat areas, river frontage, and a basic soil study ready for a lodge or private retreat.',
    features: [
      '420 meters of riverfront and private waterfall',
      'Suited for a country lodge or private retreat',
      'Electrical connection available at boundary',
      'Topographic and soil study included',
    ],
    productivityOrArchitecture: 'Tourism or nature retreat',
  },
  'estancia-maranura-villa': {
    title: 'Maranura Panoramic Country House',
    altitude: '1,120 m a.s.l.',
    sunarpStatus: 'Registered in SUNARP · Subdivided',
    summary:
      'Stone and timber country home with wide terraces overlooking citrus orchards and the Urubamba River.',
    description:
      'Country home 18 minutes from Quillabamba on a paved highway. Includes covered outdoor terraces, a barbecue area, and a private citrus and avocado orchard.',
    features: [
      '5,800 m² country lot with gated access',
      'Covered wood and stone terraces',
      'Four bedrooms with valley views',
      'Orchard irrigation system installed',
    ],
    productivityOrArchitecture: 'Country home · 18 min from Quillabamba',
  },
  'fundo-cacao-echarati': {
    title: 'Chuncho Cacao Farm · Echarati',
    altitude: '890 m a.s.l.',
    sunarpStatus: 'Registered in SUNARP · Cleared title',
    summary:
      '52 hectares with 22 Ha of producing native Chuncho cacao, river access, and a wooden main house.',
    description:
      'Working agricultural estate in Echarati. Its 22 hectares of native Chuncho cacao deliver regular harvests, complete with a riverside wooden house and drying area.',
    features: [
      '22 Ha of producing Chuncho cacao',
      'Wood and stone house facing the river',
      'Fermentation house and solar drying deck',
      'Direct access from the Kiteni road',
    ],
    productivityOrArchitecture: 'Working cacao farm',
  },
};

export function getLocalizedProperty(prop: PropertyItem, lang: LanguageCode): PropertyItem {
  if (lang === 'es') return prop;
  const en = PROPERTY_TRANSLATIONS_EN[prop.id];
  return en ? { ...prop, ...en } : prop;
}

const AGENT_TRANSLATIONS_EN: Record<
  AgentProfile['id'],
  {
    fullName: string;
    role: string;
    bio: string;
    specialties: string[];
  }
> = {
  mariano: {
    fullName: 'Mariano · Field & Drone Advisor',
    role: 'Field Visits & Drone Aerial Views',
    bio: 'Handles on-site visits and drone footage in Huayopata and nearby districts. Walks each property with you to check access roads, boundaries, and water sources in person.',
    specialties: [
      'Guided visits to farms and rural land',
      'Drone aerial views and boundary checks',
      'Road access and water spring inspection',
    ],
  },
  jose: {
    fullName: 'José · Senior Advisor & SUNARP Titles',
    role: 'Real Estate Advisor & Registry Specialist',
    bio: 'Leads commercial guidance, market valuation references, and SUNARP title reviews. Supports every transaction from the first inquiry through notarial signing in Quillabamba or Cusco.',
    specialties: [
      'SUNARP title deed and lien reviews',
      'Market price guidance and negotiation',
      'Notarial coordination in Quillabamba and Cusco',
    ],
  },
};

export function getLocalizedAgent(agent: AgentProfile, lang: LanguageCode): AgentProfile {
  if (lang === 'es') return agent;
  const en = AGENT_TRANSLATIONS_EN[agent.id];
  return en ? { ...agent, ...en } : agent;
}

const TESTIMONIAL_TRANSLATIONS_EN: Record<
  string,
  {
    role: string;
    origin: string;
    propertyAcquired: string;
    quote: string;
    outcome: string;
  }
> = {
  'test-1': {
    role: 'Agricultural producer',
    origin: 'Lima · Bought in Huayopata',
    propertyAcquired: 'High-altitude coffee farm',
    quote:
      'We looked at properties with unclear boundaries before finding Terrantier. They checked the SUNARP record and flew the drone to measure everything in the field before we signed.',
    outcome: 'Notarial closing completed in under a month with no observations.',
  },
  'test-2': {
    role: 'Architect & hospitality founder',
    origin: 'Cusco · Property in Santa Teresa',
    propertyAcquired: '12 Ha parcel',
    quote:
      'We needed reliable water and privacy near the route to Machu Picchu. We walked every boundary together and confirmed all paperwork before moving forward.',
    outcome: 'Closed cleanly with updated maps and registry title.',
  },
  'test-3': {
    role: 'Physician & investor',
    origin: 'Arequipa · Home in Quillabamba',
    propertyAcquired: '420 m² family home',
    quote:
      'We wanted a home with warm weather all year round. They gave us clear pricing, verified documents, and the notarial process went smoothly.',
    outcome: 'Quick handover with independent property title.',
  },
};

export function getLocalizedTestimonial(
  item: TestimonialItem,
  lang: LanguageCode,
): TestimonialItem {
  if (lang === 'es') return item;
  const en = TESTIMONIAL_TRANSLATIONS_EN[item.id];
  return en ? { ...item, ...en } : item;
}

export const STATIC_FAQS_BY_LANG: Record<
  LanguageCode,
  Array<{ id: string; question: string; answer: string }>
> = {
  es: [
    {
      id: 'faq-sunarp',
      question: '¿Cómo verifican que los documentos estén en regla?',
      answer:
        'Antes de ofrecer cualquier propiedad, José revisa la partida registral en SUNARP y confirma que no tenga cargas ni superposiciones. Entregamos copia literal vigente antes de cualquier firma.',
    },
    {
      id: 'faq-dron',
      question: '¿Para qué hacen la revisión con dron en Huayopata?',
      answer:
        'Mariano recorre el terreno y realiza tomas aéreas con dron para comprobar las medidas reales, caminos de ingreso y fuentes de agua, evitando diferencias entre los planos y el terreno físico.',
    },
    {
      id: 'faq-extranjeros',
      question: '¿Pueden comprar personas de fuera de Cusco o del extranjero?',
      answer:
        'Sí. Coordinamos la compra de forma presencial o mediante poder en notarías de Quillabamba y Cusco para compradores de otras regiones o del extranjero.',
    },
    {
      id: 'faq-visita',
      question: '¿Cómo coordino una visita al terreno?',
      answer:
        'Puedes escribir directamente a Mariano (+51 950 155 945) para visitas en Huayopata, Santa Teresa y Maranura, o a José (+51 982 908 264) para Quillabamba y Echarati.',
    },
    {
      id: 'faq-venta',
      question: '¿También ayudan a vender o tasar propiedades?',
      answer:
        'Sí. Evaluamos fincas, terrenos y viviendas que cuenten con título inscrito en SUNARP, incluyendo visita física, material fotográfico y referencia de valor en el valle.',
    },
  ],
  en: [
    {
      id: 'faq-sunarp',
      question: 'How do you verify that property documents are in order?',
      answer:
        'Before listing any property, José checks the SUNARP registry record to confirm there are no liens or boundary overlaps. We provide a current certified copy prior to signing.',
    },
    {
      id: 'faq-dron',
      question: 'Why do you use drone inspections in Huayopata?',
      answer:
        'Mariano walks the land and captures drone imagery to verify actual dimensions, road access, and water sources, preventing surprises between paper maps and the physical site.',
    },
    {
      id: 'faq-extranjeros',
      question: 'Can buyers from outside Cusco or abroad purchase?',
      answer:
        'Yes. We support in-person purchases as well as closings via power of attorney at notary offices in Quillabamba and Cusco.',
    },
    {
      id: 'faq-visita',
      question: 'How do I schedule a property visit?',
      answer:
        'You can message Mariano (+51 950 155 945) directly for visits in Huayopata, Santa Teresa, and Maranura, or José (+51 982 908 264) for Quillabamba and Echarati.',
    },
    {
      id: 'faq-venta',
      question: 'Do you also help value and sell properties?',
      answer:
        'Yes. We review farms, land plots, and homes with registered SUNARP titles, including an on-site visit, photography, and local market pricing guidance.',
    },
  ],
};

export const UI_COPY = {
  es: {
    nav: {
      gallery: 'Galería',
      properties: 'Propiedades',
      zones: 'Zonas',
      team: 'Equipo',
      faq: 'Preguntas',
      cta: 'Contactar',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      langSwitchAria: 'Cambiar idioma a inglés',
    },
    hero: {
      eyebrow: 'La Convención, Cusco · Huayopata y Quillabamba',
      titleLine1: 'Fincas, casas de campo y',
      titleLine2: 'terrenos en La Convención',
      subtitle:
        'Propiedades seleccionadas en el valle con verificación en campo y documentos al día en SUNARP.',
      searchAria: 'Buscador de propiedades en La Convención',
      locationLabel: 'Ubicación',
      allLocations: 'Todo La Convención',
      categoryLabel: 'Tipo',
      allCategories: 'Todas las opciones',
      budgetLabel: 'Presupuesto',
      allBudgets: 'Cualquier monto',
      under250: 'Hasta US$ 250,000',
      mid250_550: 'US$ 250,000 – US$ 550,000',
      over550: 'Desde US$ 550,000',
      searchBtn: 'Buscar',
    },
    reel: {
      ariaLabel: 'Galería de vistas aéreas de Huayopata',
      eyebrow: 'Huayopata · La Convención',
      heading: 'Vistas reales del valle',
      hint: '',
      closeLightbox: 'Cerrar imagen',
    },
    properties: {
      eyebrow: 'Propiedades disponibles',
      heading: 'Fincas, viviendas y terrenos en venta',
      liveRate: '',
      allTabs: 'Todas',
      allZones: 'Todas las zonas',
      budgetFilterAria: 'Filtrar por presupuesto',
      budgetAll: 'Todo presupuesto',
      budgetUnder250: 'Hasta US$ 250k',
      budgetMid: 'US$ 250k – 550k',
      budgetOver550: 'Desde US$ 550k',
      clearFilters: 'Limpiar filtros',
      foundSingular: 'propiedad',
      foundPlural: 'propiedades',
      emptyHeading: 'No encontramos propiedades con esos filtros',
      emptyBody:
        'Prueba quitando algún filtro o escríbenos directamente para contarnos qué tipo de terreno o vivienda estás buscando.',
      viewAll: 'Ver todas las propiedades',
      roomsShort: 'Hab.',
      bathsShort: 'Baños',
      viewSheet: 'Ver ficha',
      requestDossier: 'Consultar',
      viewDetails: 'Ver detalles',
      prevPhoto: 'Foto anterior',
      nextPhoto: 'Foto siguiente',
      goToPhoto: 'Ver foto',
    },
    modal: {
      closeLabel: 'Cerrar ficha',
      prevPhoto: 'Foto anterior',
      nextPhoto: 'Siguiente foto',
      seePhoto: 'Ver foto',
      refPrefix: 'Referencia',
      refShortPrefix: 'Ref.',
      extensionLabel: 'Extensión',
      profileLabel: 'Uso',
      builtAreaLabel: 'Área construida',
      bedroomsLabel: 'Habitaciones',
      bathroomsLabel: 'Baños',
      downPayment: 'Inicial',
      termYears: 'Plazo',
      yearsLabel: 'años',
      perMonth: '/mes',
      downPaymentAria: 'Porcentaje de inicial',
      termAria: 'Plazo en años',
      simNote: 'Cálculo referencial (TEA 8.5%). Sujeto a evaluación bancaria o acuerdo directo.',
      hideSimulator: 'Ocultar cálculo',
      showSimulator: 'Calcular cuota',
      copied: 'Copiado',
      copySummary: 'Copiar datos',
      requestDossierAndPlans: 'Solicitar información y planos',
    },
    map: {
      eyebrow: 'Mapa de La Convención, Cusco',
      allDistrictsHeading: 'Ubicación de propiedades en el valle',
      viewFullValley: 'Ver todo el valle',
      layerAria: 'Vista del mapa',
      terrain: 'Relieve',
      hybrid: 'Satélite',
      roadmap: 'Rutas',
      loading: 'Cargando mapa...',
      failedTitle: 'Mapa no disponible en este momento',
      failedBody: 'Puedes seguir revisando las propiedades en el listado superior.',
      noKeyTitle: 'Mapa pendiente de configuración',
      noKeyBody: 'Puedes consultar la ubicación exacta de cada propiedad con nuestros asesores.',
      legendReady: '',
      legendEmpty: '',
      viewSheet: 'Ver ficha',
      dossier: 'Consultar',
    },
    zones: {
      eyebrow: 'Zonas del valle',
      heading: 'Distritos donde trabajamos',
      subtitle:
        'Cada zona tiene su propia altitud y clima, desde sectores cafetaleros de altura hasta zonas urbanas y cálidas.',
      tabsAria: 'Distritos de La Convención',
      playAerial: 'Ver video',
      viewPhoto: 'Ver foto',
      ctaPrefix: 'Ver propiedades en',
    },
    manifesto: {
      eyebrow: 'Cómo trabajamos',
      heading: 'Compras claras, revisadas en campo y en registros',
      subtitle:
        'Antes de ofrecer cualquier propiedad, confirmamos sus medidas en el terreno y verificamos su documentación en Registros Públicos.',
      pillars: [
        {
          number: '01',
          title: 'Revisión real en campo',
          description:
            'Recorremos la propiedad para comprobar sus linderos, vías de acceso y disponibilidad de agua antes de cerrar cualquier trato.',
        },
        {
          number: '02',
          title: 'Papeles al día en SUNARP',
          description:
            'Verificamos que la partida esté limpia, sin cargas ni superposiciones, lista para una transferencia segura en notaría.',
        },
        {
          number: '03',
          title: 'Orientación práctica',
          description:
            'Te asesoramos sobre el clima, tipo de suelo, cultivos recomendados o posibilidades de construcción según lo que buscas.',
        },
      ],
      videoEyebrow: 'Huayopata y Alto Urubamba',
      videoCaption: 'Entorno natural, accesos y relieve del valle',
      expandView: 'Ampliar video',
      closeExpanded: 'Cerrar video',
      expandedAria: 'Vista aérea de La Convención',
    },
    team: {
      eyebrow: 'Nuestro equipo',
      heading: 'Atención directa en el valle',
      subtitle:
        'Comunícate directamente con Mariano para visitas de campo y tomas con dron, o con José para revisión de documentos y tasaciones.',
      marianoBadge: 'Campo · Huayopata',
      joseBadge: 'Oficina · Quillabamba',
      whatsappBtnPrefix: 'WhatsApp',
      requestAppointment: 'Agendar cita',
    },
    socialProof: {
      metrics: [
        { value: '1,420 Ha', label: 'Hectáreas evaluadas en el valle' },
        { value: '14 años', label: 'Trabajando en La Convención' },
        { value: '100% SUNARP', label: 'Títulos revisados antes de publicar' },
        { value: '32 cierres', label: 'Ventas concretadas con éxito' },
      ],
      eyebrow: 'Experiencia',
      heading: 'Clientes que ya invirtieron con nosotros',
      badge: 'Acompañamiento notarial en Quillabamba y Cusco',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      heading: 'Dudas comunes antes de comprar',
      subtitle:
        'Información práctica sobre títulos en SUNARP, visitas a los predios y el proceso de compra.',
      assistantEyebrow: 'Consultas directas',
      assistantHeading: '¿Te quedó alguna duda?',
      remainingLabel: (rem: number, limit: number) =>
        `${rem} de ${limit} consultas disponibles`,
      consultationCounter: (idx: number, limit: number, ch: 'voz' | 'texto') =>
        `Pregunta ${idx} de ${limit} · ${ch === 'voz' ? 'Voz' : 'Texto'}`,
      connectingVoice: 'Conectando audio...',
      activeMic: 'Micrófono activo — haz tu pregunta',
      stopVoice: 'Terminar',
      youLabel: 'Tú:',
      assistantLabel: 'Respuesta:',
      limitTitle: 'Completaste tus 2 consultas en línea',
      limitBody:
        'Si deseas planos, partidas o coordinar una visita presencial, escríbenos directamente por WhatsApp:',
      quickLabel: 'Consultas habituales:',
      quickPrompts: [
        '¿Qué finca recomiendan para café en Huayopata?',
        '¿Cómo verifican los linderos antes de comprar?',
        '¿Con quién coordino una visita en Quillabamba?',
      ],
      inputLabel: (_limit: number) => 'Escribe tu pregunta',
      inputPlaceholder:
        'Ej. ¿La finca de Huayopata tiene ingreso vehicular todo el año?',
      submittingBtn: 'Consultando...',
      submitBtn: (rem: number) =>
        `Enviar pregunta (${rem} disponible${rem === 1 ? '' : 's'})`,
      voiceBtn: 'Preguntar por voz',
      minCharError: 'Escribe una pregunta de al menos 4 caracteres.',
      connectionError: 'No se pudo enviar tu consulta. Inténtalo nuevamente.',
      voiceConnError:
        'No se pudo iniciar la llamada de voz. Puedes escribir tu pregunta o contactarnos por WhatsApp.',
      micError:
        'No pudimos acceder al micrófono. Revisa los permisos o escribe tu consulta.',
    },
    lead: {
      eyebrow: 'Contacto',
      heading: 'Agenda una visita o pide información',
      subtitle:
        'Escríbenos si buscas comprar una propiedad o vender la tuya en La Convención. Mariano y José te atienden directamente.',
      officeLabel: 'Oficina Quillabamba:',
      officeValue: 'Jr. Espinar 248, La Convención, Cusco',
      hoursLabel: 'Horario:',
      hoursValue: 'Lunes a sábado, 08:30 – 18:00 h',
      whatsappDirect: 'WhatsApp directo con nuestros agentes:',
      tabAria: 'Motivo de consulta',
      tabBuy: 'Busco comprar',
      tabSell: 'Quiero vender o tasar',
      refCodeLabel: 'Código de registro:',
      successTitle: 'Recibimos tu mensaje',
      successBody: (name: string, agentName: string, phone: string) =>
        `Gracias, ${name}. ${agentName} (${phone}) se comunicará contigo dentro de las próximas 24 horas hábiles.`,
      continueWhatsapp: (agentName: string) => `Escribir por WhatsApp a ${agentName}`,
      sendAnother: 'Enviar otra consulta',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Ej. Carlos Mendoza',
      phoneLabel: 'Teléfono / WhatsApp',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'nombre@correo.com',
      interestBuyLabel: 'Zona, presupuesto o propiedad de interés',
      interestSellLabel: 'Ubicación, tamaño aproximado y situación en SUNARP',
      interestBuyPlaceholder: 'Ej. Finca en Huayopata de 15 a 30 Ha',
      interestSellPlaceholder: 'Ej. Terreno de 15 Ha en Maranura inscrito en SUNARP',
      submittingBtn: 'Enviando...',
      submitBuyBtn: 'Enviar consulta',
      submitSellBtn: 'Solicitar tasación',
      errName: 'Ingresa tu nombre completo.',
      errEmail: 'Ingresa un correo electrónico válido.',
      errPhone: 'Ingresa un número de teléfono o WhatsApp válido.',
      errGeneric: 'No pudimos registrar tu mensaje. Inténtalo nuevamente.',
    },
    footer: {
      tagline:
        'Asesoría inmobiliaria en fincas productivas, casas de campo y terrenos en La Convención, Cusco.',
      navTitle: 'Secciones',
      links: {
        gallery: 'Galería',
        properties: 'Propiedades',
        zones: 'Zonas del Valle',
        manifesto: 'Cómo trabajamos',
        team: 'Equipo',
        socialProof: 'Experiencia',
        faq: 'Preguntas frecuentes',
        contact: 'Contacto',
      },
      districtsTitle: 'Distritos',
      officeTitle: 'Oficina y Agentes',
      address: 'Jr. Espinar 248, Quillabamba — La Convención, Cusco, Perú',
      copyright: (year: number) =>
        `© ${year} Terrantier Inmobiliaria · La Convención, Cusco, Perú.`,
      disclaimer: 'Propiedades sujetas a verificación registral en SUNARP.',
    },
  },
  en: {
    nav: {
      gallery: 'Gallery',
      properties: 'Properties',
      zones: 'Zones',
      team: 'Team',
      faq: 'FAQ',
      cta: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      langSwitchAria: 'Cambiar idioma a español',
    },
    hero: {
      eyebrow: 'La Convención, Cusco · Huayopata & Quillabamba',
      titleLine1: 'Farms, country homes &',
      titleLine2: 'land in La Convención',
      subtitle:
        'Curated valley properties verified on the ground with clean SUNARP registry titles.',
      searchAria: 'Property search in La Convención',
      locationLabel: 'Location',
      allLocations: 'All La Convención',
      categoryLabel: 'Type',
      allCategories: 'All types',
      budgetLabel: 'Budget',
      allBudgets: 'Any amount',
      under250: 'Up to US$ 250,000',
      mid250_550: 'US$ 250,000 – US$ 550,000',
      over550: 'From US$ 550,000',
      searchBtn: 'Search',
    },
    reel: {
      ariaLabel: 'Aerial photo gallery of Huayopata',
      eyebrow: 'Huayopata · La Convención',
      heading: 'Real valley views',
      hint: '',
      closeLightbox: 'Close image',
    },
    properties: {
      eyebrow: 'Available properties',
      heading: 'Farms, homes, and land for sale',
      liveRate: '',
      allTabs: 'All',
      allZones: 'All districts',
      budgetFilterAria: 'Filter by budget',
      budgetAll: 'Any budget',
      budgetUnder250: 'Up to US$ 250k',
      budgetMid: 'US$ 250k – 550k',
      budgetOver550: 'From US$ 550k',
      clearFilters: 'Clear filters',
      foundSingular: 'property',
      foundPlural: 'properties',
      emptyHeading: 'No properties match those filters',
      emptyBody:
        'Try clearing a filter or send us a message describing the land or home you are looking for.',
      viewAll: 'View all properties',
      roomsShort: 'Beds',
      bathsShort: 'Baths',
      viewSheet: 'View sheet',
      requestDossier: 'Inquire',
      viewDetails: 'Details',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      goToPhoto: 'View photo',
    },
    modal: {
      closeLabel: 'Close details',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      seePhoto: 'View photo',
      refPrefix: 'Reference',
      refShortPrefix: 'Ref.',
      extensionLabel: 'Size',
      profileLabel: 'Use',
      builtAreaLabel: 'Built area',
      bedroomsLabel: 'Bedrooms',
      bathroomsLabel: 'Bathrooms',
      downPayment: 'Down payment',
      termYears: 'Term',
      yearsLabel: 'years',
      perMonth: '/mo',
      downPaymentAria: 'Down payment percentage',
      termAria: 'Term in years',
      simNote: 'Estimated figure (8.5% APR). Subject to bank evaluation or direct agreement.',
      hideSimulator: 'Hide estimate',
      showSimulator: 'Estimate payment',
      copied: 'Copied',
      copySummary: 'Copy summary',
      requestDossierAndPlans: 'Request details & maps',
    },
    map: {
      eyebrow: 'La Convención Map, Cusco',
      allDistrictsHeading: 'Property locations across the valley',
      viewFullValley: 'View full valley',
      layerAria: 'Map view',
      terrain: 'Terrain',
      hybrid: 'Satellite',
      roadmap: 'Roads',
      loading: 'Loading map...',
      failedTitle: 'Map unavailable right now',
      failedBody: 'You can continue browsing all properties in the catalog above.',
      noKeyTitle: 'Map configuration pending',
      noKeyBody: 'Ask our advisors directly for the exact location of any property.',
      legendReady: '',
      legendEmpty: '',
      viewSheet: 'View sheet',
      dossier: 'Inquire',
    },
    zones: {
      eyebrow: 'Valley districts',
      heading: 'Areas where we operate',
      subtitle:
        'Each district has its own elevation and climate, from highland coffee slopes to warm town centers.',
      tabsAria: 'La Convención districts',
      playAerial: 'Play video',
      viewPhoto: 'View photo',
      ctaPrefix: 'See properties in',
    },
    manifesto: {
      eyebrow: 'How we work',
      heading: 'Clear purchases checked on the ground and in records',
      subtitle:
        'Before listing any property, we verify physical measurements on site and review its title record at the Public Registry.',
      pillars: [
        {
          number: '01',
          title: 'On-site verification',
          description:
            'We walk the property to confirm boundaries, road access, and water availability before any agreement is signed.',
        },
        {
          number: '02',
          title: 'Clean SUNARP paperwork',
          description:
            'We confirm the title record is free of liens or overlaps and ready for a smooth notarial transfer.',
        },
        {
          number: '03',
          title: 'Practical guidance',
          description:
            'We advise you honestly on climate, soil suitability, crops, or construction options based on your goals.',
        },
      ],
      videoEyebrow: 'Huayopata & Alto Urubamba',
      videoCaption: 'Natural surroundings, road access, and valley terrain',
      expandView: 'Expand video',
      closeExpanded: 'Close video',
      expandedAria: 'Aerial view of La Convención',
    },
    team: {
      eyebrow: 'Our team',
      heading: 'Direct attention in the valley',
      subtitle:
        'Reach out directly to Mariano for field tours and drone views, or to José for title checks and market valuations.',
      marianoBadge: 'Field · Huayopata',
      joseBadge: 'Office · Quillabamba',
      whatsappBtnPrefix: 'WhatsApp',
      requestAppointment: 'Book visit',
    },
    socialProof: {
      metrics: [
        { value: '1,420 Ha', label: 'Hectares evaluated across the valley' },
        { value: '14 years', label: 'Working in La Convención' },
        { value: '100% SUNARP', label: 'Titles reviewed before listing' },
        { value: '32 closings', label: 'Completed sales across the valley' },
      ],
      eyebrow: 'Track record',
      heading: 'Clients who invested with us',
      badge: 'Notarial support in Quillabamba & Cusco',
    },
    faq: {
      eyebrow: 'Frequently asked questions',
      heading: 'Common questions before buying',
      subtitle:
        'Practical answers on SUNARP title deeds, site tours, and the buying process.',
      assistantEyebrow: 'Direct questions',
      assistantHeading: 'Still have a question?',
      remainingLabel: (rem: number, limit: number) =>
        `${rem} of ${limit} questions available`,
      consultationCounter: (idx: number, limit: number, ch: 'voz' | 'texto') =>
        `Question ${idx} of ${limit} · ${ch === 'voz' ? 'Voice' : 'Text'}`,
      connectingVoice: 'Connecting audio...',
      activeMic: 'Microphone active — ask your question',
      stopVoice: 'End',
      youLabel: 'You:',
      assistantLabel: 'Answer:',
      limitTitle: 'You have completed your 2 online questions',
      limitBody:
        'For maps, title copies, or to schedule an on-site tour, message our team directly on WhatsApp:',
      quickLabel: 'Common questions:',
      quickPrompts: [
        'Which farm do you recommend for coffee in Huayopata?',
        'How do you verify boundaries before buying?',
        'Who coordinates visits in Quillabamba?',
      ],
      inputLabel: (_limit: number) => 'Write your question',
      inputPlaceholder:
        'E.g., Does the Huayopata farm have year-round vehicle access?',
      submittingBtn: 'Checking...',
      submitBtn: (rem: number) =>
        `Send question (${rem} available)`,
      voiceBtn: 'Ask by voice',
      minCharError: 'Please enter a question with at least 4 characters.',
      connectionError: 'Could not send your question. Please try again.',
      voiceConnError:
        'Could not start voice call. You can type your question or contact us on WhatsApp.',
      micError:
        'Microphone access unavailable. Check browser permissions or type your question.',
    },
    lead: {
      eyebrow: 'Contact',
      heading: 'Schedule a visit or request details',
      subtitle:
        'Message us if you are looking to buy a property or sell yours in La Convención. Mariano and José respond directly.',
      officeLabel: 'Quillabamba Office:',
      officeValue: 'Jr. Espinar 248, La Convención, Cusco',
      hoursLabel: 'Hours:',
      hoursValue: 'Monday to Saturday, 08:30 – 18:00 h',
      whatsappDirect: 'Direct WhatsApp with our agents:',
      tabAria: 'Inquiry type',
      tabBuy: 'Looking to buy',
      tabSell: 'Sell or appraise',
      refCodeLabel: 'Reference code:',
      successTitle: 'Message received',
      successBody: (name: string, agentName: string, phone: string) =>
        `Thank you, ${name}. ${agentName} (${phone}) will get back to you within 24 business hours.`,
      continueWhatsapp: (agentName: string) => `Message ${agentName} on WhatsApp`,
      sendAnother: 'Send another inquiry',
      nameLabel: 'Full name',
      namePlaceholder: 'E.g. Carlos Mendoza',
      phoneLabel: 'Phone / WhatsApp',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@email.com',
      interestBuyLabel: 'District, budget, or property of interest',
      interestSellLabel: 'Location, approximate size, and SUNARP status',
      interestBuyPlaceholder: 'E.g. Farm in Huayopata around 15 to 30 Ha',
      interestSellPlaceholder: 'E.g. 15 Ha parcel in Maranura registered in SUNARP',
      submittingBtn: 'Sending...',
      submitBuyBtn: 'Send inquiry',
      submitSellBtn: 'Request valuation',
      errName: 'Please enter your full name.',
      errEmail: 'Please enter a valid email address.',
      errPhone: 'Please enter a valid phone or WhatsApp number.',
      errGeneric: 'Could not save your message. Please try again.',
    },
    footer: {
      tagline:
        'Real estate advisory for productive farms, country homes, and land in La Convención, Cusco.',
      navTitle: 'Sections',
      links: {
        gallery: 'Gallery',
        properties: 'Properties',
        zones: 'Valley Zones',
        manifesto: 'How we work',
        team: 'Team',
        socialProof: 'Track record',
        faq: 'FAQ',
        contact: 'Contact',
      },
      districtsTitle: 'Districts',
      officeTitle: 'Office & Agents',
      address: 'Jr. Espinar 248, Quillabamba — La Convención, Cusco, Peru',
      copyright: (year: number) =>
        `© ${year} Terrantier Inmobiliaria · La Convención, Cusco, Peru.`,
      disclaimer: 'All properties subject to SUNARP registry verification.',
    },
  },
} as const;
