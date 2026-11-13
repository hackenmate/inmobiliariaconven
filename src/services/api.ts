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
