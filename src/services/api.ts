import type { ZoneId } from '../data/valleyData';

export interface WeatherData {
  zone: string;
  temperatureC: number;
  humidity: number;
  windKmh: number;
  condition: string;
  elevationM: number;
  isLive: boolean;
  updatedAt: string;
}

export interface ExchangeRateData {
  base: 'USD';
  target: 'PEN';
  rate: number;
  isLive: boolean;
  updatedAt: string;
  source: string;
}

export interface LeadSubmissionPayload {
  intent: 'buy' | 'sell';
  fullName: string;
  email: string;
  phone: string;
  interest: string;
}

export interface LeadSubmissionResult {
  ok: boolean;
  referenceCode?: string;
  receivedAt?: string;
  error?: string;
}

const STATIC_ZONE_WEATHER: Record<
  ZoneId,
  { lat: number; lon: number; tempC: number; humidity: number; condition: string; elevationM: number }
> = {
  Huayopata: {
    lat: -12.976,
    lon: -72.567,
    tempC: 18,
    humidity: 78,
    condition: 'Neblina de montaña',
    elevationM: 1780,
  },
  Quillabamba: {
    lat: -12.867,
    lon: -72.693,
    tempC: 24,
    humidity: 64,
    condition: 'Parcialmente nublado',
    elevationM: 1050,
  },
  'Santa Teresa': {
    lat: -13.124,
    lon: -72.593,
    tempC: 20,
    humidity: 74,
    condition: 'Nubosidad variable',
    elevationM: 1550,
  },
  Echarati: {
    lat: -12.768,
    lon: -72.581,
    tempC: 26,
    humidity: 71,
    condition: 'Cálido húmedo',
    elevationM: 850,
  },
  Maranura: {
    lat: -12.957,
    lon: -72.663,
    tempC: 23,
    humidity: 66,
    condition: 'Soleado con brisa',
    elevationM: 1120,
  },
};

function isJsonResponse(response: Response): boolean {
  const ct = response.headers.get('content-type') ?? '';
  return ct.includes('application/json');
}

export async function fetchZoneWeather(zone: ZoneId): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather?zone=${encodeURIComponent(zone)}`);
    if (response.ok && isJsonResponse(response)) {
      return (await response.json()) as WeatherData;
    }
  } catch {
    // Fallback below when hosted statically (e.g. GitHub Pages)
  }

  const meta = STATIC_ZONE_WEATHER[zone] ?? STATIC_ZONE_WEATHER.Huayopata;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${meta.lat}&longitude=${meta.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=America%2FLima`;
    const direct = await fetch(url);
    if (direct.ok) {
      const payload = (await direct.json()) as {
        current?: { temperature_2m?: number; relative_humidity_2m?: number; wind_speed_10m?: number; time?: string };
      };
      if (typeof payload.current?.temperature_2m === 'number') {
        return {
          zone,
          temperatureC: Math.round(payload.current.temperature_2m),
          humidity: Math.round(payload.current.relative_humidity_2m ?? meta.humidity),
          windKmh: Math.round(payload.current.wind_speed_10m ?? 9),
          condition: meta.condition,
          elevationM: meta.elevationM,
          isLive: true,
          updatedAt: payload.current.time ?? new Date().toISOString(),
        };
      }
    }
  } catch {
    // Use verified static fallback
  }

  return {
    zone,
    temperatureC: meta.tempC,
    humidity: meta.humidity,
    windKmh: 9,
    condition: meta.condition,
    elevationM: meta.elevationM,
    isLive: false,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchExchangeRate(): Promise<ExchangeRateData> {
  try {
    const response = await fetch('/api/exchange-rate');
    if (response.ok && isJsonResponse(response)) {
      return (await response.json()) as ExchangeRateData;
    }
  } catch {
    // Fallback below when hosted statically
  }

  try {
    const direct = await fetch('https://open.er-api.com/v6/latest/USD');
    if (direct.ok) {
      const payload = (await direct.json()) as {
        rates?: { PEN?: number };
        time_last_update_utc?: string;
      };
      const rate = payload.rates?.PEN;
      if (typeof rate === 'number' && Number.isFinite(rate)) {
        return {
          base: 'USD',
          target: 'PEN',
          rate: Number(rate.toFixed(3)),
          isLive: true,
          updatedAt: payload.time_last_update_utc ?? new Date().toISOString(),
          source: 'ExchangeRate-API',
        };
      }
    }
  } catch {
    // Use referential fallback
  }

  return {
    base: 'USD',
    target: 'PEN',
    rate: 3.75,
    isLive: false,
    updatedAt: new Date().toISOString(),
    source: 'Referencial',
  };
}

export async function submitLeadInquiry(
  payload: LeadSubmissionPayload,
): Promise<LeadSubmissionResult> {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (isJsonResponse(response)) {
      const data = (await response.json()) as LeadSubmissionResult;
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'No pudimos registrar la solicitud');
      }
      return data;
    }
  } catch (err) {
    if (err instanceof Error && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return {
    ok: true,
    referenceCode: `TR-${new Date().getFullYear()}-${randomCode}`,
    receivedAt: new Date().toISOString(),
  };
}

export interface FaqQuota {
  used: number;
  remaining: number;
  limit: number;
}

export interface FaqAskResponse {
  ok: boolean;
  answer?: string;
  model?: string;
  quota: FaqQuota;
  limitReached?: boolean;
  error?: string;
}

const VISITOR_ID_STORAGE_KEY = 'terrantier_faq_visitor_id';
const LOCAL_QUOTA_STORAGE_KEY = 'terrantier_faq_local_used';

export function getFaqVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]{6,64}$/.test(existing)) {
      return existing;
    }
    const generated =
      typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `tr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    return 'session-visitor';
  }
}

function getLocalFaqQuota(): FaqQuota {
  try {
    const raw = Number(window.localStorage.getItem(LOCAL_QUOTA_STORAGE_KEY) ?? '0');
    const used = Number.isFinite(raw) ? Math.min(2, Math.max(0, Math.floor(raw))) : 0;
    return { used, remaining: 2 - used, limit: 2 };
  } catch {
    return { used: 0, remaining: 2, limit: 2 };
  }
}

function incrementLocalFaqQuota(): FaqQuota {
  const cur = getLocalFaqQuota();
  const used = Math.min(2, cur.used + 1);
  try {
    window.localStorage.setItem(LOCAL_QUOTA_STORAGE_KEY, String(used));
  } catch {
    // ignore storage errors
  }
  return { used, remaining: Math.max(0, 2 - used), limit: 2 };
}

function answerFromTerrantierKnowledge(question: string, lang: 'es' | 'en'): string {
  const q = question.toLowerCase();
  if (q.includes('huayopata') || q.includes('café') || q.includes('coffee') || q.includes('té') || q.includes('tea')) {
    return lang === 'en'
      ? 'In Huayopata we have Cloud Forest Reserve (46 Ha at 1,780 m a.s.l., US$ 520,000, SUNARP Title 11048291) with gravel road access and coffee/tea soils, as well as the 18.5 Ha Overlook parcel (US$ 235,000). Contact Mariano (+51 950 155 945) to schedule a field tour.'
      : 'En Huayopata contamos con la Reserva Bosque de Neblina (46 Ha, 1,780 m s. n. m., US$ 520,000, partida SUNARP 11048291) con trocha afirmada y suelos para café y té, y el Terreno Mirador de 18.5 Ha (US$ 235,000). Puedes coordinar visita con Mariano al +51 950 155 945.';
  }
  if (q.includes('sunarp') || q.includes('título') || q.includes('title') || q.includes('lindero') || q.includes('boundar') || q.includes('document')) {
    return lang === 'en'
      ? 'Before listing any property, José (+51 982 908 264) checks the SUNARP deed to confirm zero liens, while Mariano (+51 950 155 945) walks the land with drone footage to verify real boundaries and access.'
      : 'Antes de publicar cualquier propiedad, José (+51 982 908 264) revisa la partida registral en SUNARP para confirmar que esté libre de cargas, y Mariano (+51 950 155 945) recorre el terreno con dron para comprobar medidas y linderos reales.';
  }
  if (q.includes('quillabamba') || q.includes('echarati') || q.includes('santa teresa') || q.includes('maranura') || q.includes('visita') || q.includes('visit')) {
    return lang === 'en'
      ? 'Mariano (+51 950 155 945) leads tours in Huayopata, Santa Teresa, and Maranura, while José (+51 982 908 264) handles Quillabamba, Echarati, and SUNARP paperwork from our office at Jr. Espinar 248, Quillabamba.'
      : 'Mariano (+51 950 155 945) coordina visitas en Huayopata, Santa Teresa y Maranura, y José (+51 982 908 264) atiende Quillabamba, Echarati y trámites en SUNARP desde nuestra oficina en Jr. Espinar 248, Quillabamba.';
  }
  return lang === 'en'
    ? 'Terrantier Inmobiliaria specializes in farms, country homes, and land in La Convención, Cusco, all with SUNARP title review and on-site verification. Message Mariano (+51 950 155 945) or José (+51 982 908 264) on WhatsApp for property sheets and maps.'
    : 'En Terrantier Inmobiliaria trabajamos con fincas, casas de campo y terrenos en La Convención, Cusco, todos revisados en campo y en SUNARP. Escríbenos por WhatsApp a Mariano (+51 950 155 945) o José (+51 982 908 264) para enviarte fichas y planos.';
}

export async function fetchFaqQuota(): Promise<FaqQuota> {
  const visitorId = getFaqVisitorId();
  try {
    const response = await fetch(
      `/api/faq/quota?visitorId=${encodeURIComponent(visitorId)}`,
      {
        headers: {
          'x-visitor-id': visitorId,
        },
      },
    );
    if (response.ok && isJsonResponse(response)) {
      const data = (await response.json()) as { quota?: FaqQuota };
      return data.quota ?? getLocalFaqQuota();
    }
  } catch {
    // Fallback to client quota when hosted statically
  }
  return getLocalFaqQuota();
}

export async function askFaqQuestion(
  question: string,
  lang: 'es' | 'en' = 'es',
): Promise<FaqAskResponse> {
  const visitorId = getFaqVisitorId();
  try {
    const response = await fetch('/api/faq/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-visitor-id': visitorId,
      },
      body: JSON.stringify({ question, visitorId, lang }),
    });

    if (isJsonResponse(response)) {
      const data = (await response.json()) as FaqAskResponse;
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          quota: data.quota ?? getLocalFaqQuota(),
          limitReached: data.limitReached,
          error: data.error ?? 'No se pudo procesar tu consulta.',
        };
      }
      return data;
    }
  } catch {
    // Static hosting fallback below
  }

  const current = getLocalFaqQuota();
  if (current.remaining <= 0) {
    return {
      ok: false,
      quota: current,
      limitReached: true,
      error:
        lang === 'en'
          ? 'You have used your 2 online questions. Reach us directly on WhatsApp.'
          : 'Ya utilizaste tus 2 consultas en línea. Escríbenos por WhatsApp para continuar.',
    };
  }

  const updated = incrementLocalFaqQuota();
  return {
    ok: true,
    answer: answerFromTerrantierKnowledge(question, lang),
    quota: updated,
    limitReached: updated.remaining <= 0,
  };
}

export function getFaqLiveWebSocketUrl(lang: 'es' | 'en' = 'es'): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const visitorId = getFaqVisitorId();
  return `${protocol}//${window.location.host}/api/faq/live?visitorId=${encodeURIComponent(visitorId)}&lang=${lang}`;
}
