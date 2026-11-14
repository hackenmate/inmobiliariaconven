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

export async function fetchZoneWeather(zone: ZoneId): Promise<WeatherData> {
  const response = await fetch(`/api/weather?zone=${encodeURIComponent(zone)}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el clima del valle');
  }
  return (await response.json()) as WeatherData;
}

export async function fetchExchangeRate(): Promise<ExchangeRateData> {
  const response = await fetch('/api/exchange-rate');
  if (!response.ok) {
    throw new Error('No se pudo obtener el tipo de cambio');
  }
  return (await response.json()) as ExchangeRateData;
}

export async function submitLeadInquiry(
  payload: LeadSubmissionPayload,
): Promise<LeadSubmissionResult> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LeadSubmissionResult;
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? 'No pudimos registrar la solicitud');
  }
  return data;
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

const VISITOR_ID_STORAGE_KEY = 'selva_alta_faq_visitor_id';

export function getFaqVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]{6,64}$/.test(existing)) {
      return existing;
    }
    const generated =
      typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `sa_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    return 'session-visitor';
  }
}

export async function fetchFaqQuota(): Promise<FaqQuota> {
  const visitorId = getFaqVisitorId();
  const response = await fetch(
    `/api/faq/quota?visitorId=${encodeURIComponent(visitorId)}`,
    {
      headers: {
        'x-visitor-id': visitorId,
      },
    },
  );
  if (!response.ok) {
    return { used: 0, remaining: 2, limit: 2 };
  }
  const data = (await response.json()) as { quota?: FaqQuota };
  return data.quota ?? { used: 0, remaining: 2, limit: 2 };
}

export async function askFaqQuestion(
  question: string,
  lang: 'es' | 'en' = 'es',
): Promise<FaqAskResponse> {
  const visitorId = getFaqVisitorId();
  const response = await fetch('/api/faq/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-visitor-id': visitorId,
    },
    body: JSON.stringify({ question, visitorId, lang }),
  });

  const data = (await response.json()) as FaqAskResponse;
  if (!response.ok || !data.ok) {
    return {
      ok: false,
      quota: data.quota ?? { used: 0, remaining: 2, limit: 2 },
      limitReached: data.limitReached,
      error: data.error ?? 'No se pudo procesar tu consulta.',
    };
  }
  return data;
}

export function getFaqLiveWebSocketUrl(lang: 'es' | 'en' = 'es'): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const visitorId = getFaqVisitorId();
  return `${protocol}//${window.location.host}/api/faq/live?visitorId=${encodeURIComponent(visitorId)}&lang=${lang}`;
}

