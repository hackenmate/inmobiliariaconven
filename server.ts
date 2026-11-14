import express from 'express';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { registerFaqGeminiRoutes } from './server/faqGemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const LEADS_FILE = '/tmp/terrantier_leads.json';

interface ZoneCoordinates {
  lat: number;
  lon: number;
  fallbackTempC: number;
  fallbackHumidity: number;
  fallbackCondition: string;
  elevationM: number;
}

const ZONE_COORDS: Record<string, ZoneCoordinates> = {
  Huayopata: {
    lat: -12.976,
    lon: -72.567,
    fallbackTempC: 18,
    fallbackHumidity: 78,
    fallbackCondition: 'Neblina de montaña',
    elevationM: 1780,
  },
  Quillabamba: {
    lat: -12.867,
    lon: -72.693,
    fallbackTempC: 24,
    fallbackHumidity: 64,
    fallbackCondition: 'Parcialmente nublado',
    elevationM: 1050,
  },
  'Santa Teresa': {
    lat: -13.124,
    lon: -72.593,
    fallbackTempC: 20,
    fallbackHumidity: 74,
    fallbackCondition: 'Nubosidad variable',
    elevationM: 1550,
  },
  Echarati: {
    lat: -12.768,
    lon: -72.581,
    fallbackTempC: 26,
    fallbackHumidity: 71,
    fallbackCondition: 'Cálido húmedo',
    elevationM: 850,
  },
  Maranura: {
    lat: -12.957,
    lon: -72.663,
    fallbackTempC: 23,
    fallbackHumidity: 66,
    fallbackCondition: 'Soleado con brisa',
    elevationM: 1120,
  },
};

function mapWmoCodeToSpanish(code: number): string {
  if (code === 0) return 'Cielo despejado';
  if (code === 1 || code === 2) return 'Parcialmente nublado';
  if (code === 3) return 'Nublado de valle';
  if (code === 45 || code === 48) return 'Neblina de altura';
  if (code >= 51 && code <= 57) return 'Llovizna ligera';
  if (code >= 61 && code <= 67) return 'Lluvia de selva alta';
  if (code >= 80 && code <= 82) return 'Chubascos aislados';
  if (code >= 95) return 'Tormenta en montaña';
  return 'Clima templado de valle';
}

interface CachedWeather {
  expiresAt: number;
  data: {
    zone: string;
    temperatureC: number;
    humidity: number;
    windKmh: number;
    condition: string;
    elevationM: number;
    isLive: boolean;
    updatedAt: string;
  };
}

interface CachedExchangeRate {
  expiresAt: number;
  data: {
    base: 'USD';
    target: 'PEN';
    rate: number;
    isLive: boolean;
    updatedAt: string;
    source: string;
  };
}

const weatherCache = new Map<string, CachedWeather>();
let fxCache: CachedExchangeRate | null = null;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '64kb' }));

  registerFaqGeminiRoutes(app, httpServer);

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'terrantier-inmobiliaria',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/maps-config', (_req, res) => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      '';
    res.json({ apiKey });
  });

  app.get('/api/weather', async (req, res) => {
    const requestedZone = typeof req.query.zone === 'string' ? req.query.zone : 'Huayopata';
    const zoneKey = ZONE_COORDS[requestedZone] ? requestedZone : 'Huayopata';
    const coords = ZONE_COORDS[zoneKey];

    const cached = weatherCache.get(zoneKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.json(cached.data);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America%2FLima`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo HTTP ${response.status}`);
      }

      const payload = (await response.json()) as {
        elevation?: number;
        current?: {
          temperature_2m?: number;
          relative_humidity_2m?: number;
          weather_code?: number;
          wind_speed_10m?: number;
          time?: string;
        };
      };

      const current = payload.current;
      if (!current || typeof current.temperature_2m !== 'number') {
        throw new Error('Invalid Open-Meteo payload');
      }

      const data = {
        zone: zoneKey,
        temperatureC: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m ?? coords.fallbackHumidity),
        windKmh: Math.round(current.wind_speed_10m ?? 8),
        condition: mapWmoCodeToSpanish(current.weather_code ?? 2),
        elevationM: coords.elevationM,
        isLive: true,
        updatedAt: current.time ?? new Date().toISOString(),
      };

      weatherCache.set(zoneKey, {
        expiresAt: Date.now() + 15 * 60 * 1000,
        data,
      });

      res.json(data);
    } catch {
      res.json({
        zone: zoneKey,
        temperatureC: coords.fallbackTempC,
        humidity: coords.fallbackHumidity,
        windKmh: 9,
        condition: coords.fallbackCondition,
        elevationM: coords.elevationM,
        isLive: false,
        updatedAt: new Date().toISOString(),
      });
    }
  });

  app.get('/api/exchange-rate', async (_req, res) => {
    if (fxCache && fxCache.expiresAt > Date.now()) {
      res.json(fxCache.data);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      const response = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`FX HTTP ${response.status}`);
      }

      const payload = (await response.json()) as {
        rates?: { PEN?: number };
        time_last_update_utc?: string;
      };

      const rate = payload.rates?.PEN;
      if (typeof rate !== 'number' || !Number.isFinite(rate)) {
        throw new Error('PEN rate missing');
      }

      const data = {
        base: 'USD' as const,
        target: 'PEN' as const,
        rate: Number(rate.toFixed(3)),
        isLive: true,
        updatedAt: payload.time_last_update_utc ?? new Date().toISOString(),
        source: 'ExchangeRate-API',
      };

      fxCache = {
        expiresAt: Date.now() + 60 * 60 * 1000,
        data,
      };

      res.json(data);
    } catch {
      res.json({
        base: 'USD' as const,
        target: 'PEN' as const,
        rate: 3.75,
        isLive: false,
        updatedAt: new Date().toISOString(),
        source: 'Referencial BCRP',
      });
    }
  });

  app.post('/api/leads', async (req, res) => {
    const body = req.body as {
      intent?: unknown;
      fullName?: unknown;
      email?: unknown;
      phone?: unknown;
      interest?: unknown;
    };

    const intent = body.intent === 'sell' ? 'sell' : 'buy';
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const interest = typeof body.interest === 'string' ? body.interest.trim() : '';

    if (fullName.length < 2) {
      res.status(400).json({ ok: false, error: 'Ingresa tu nombre completo.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ ok: false, error: 'Ingresa un correo electrónico válido.' });
      return;
    }

    if (phone.replace(/\D/g, '').length < 7) {
      res.status(400).json({ ok: false, error: 'Ingresa un teléfono o WhatsApp válido.' });
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `TR-${new Date().getFullYear()}-${randomCode}`;
    const receivedAt = new Date().toISOString();

    const record = {
      referenceCode,
      intent,
      fullName,
      email,
      phone,
      interest,
      receivedAt,
    };

    try {
      let existing: unknown[] = [];
      try {
        const raw = await fs.readFile(LEADS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
      existing.push(record);
      await fs.writeFile(LEADS_FILE, JSON.stringify(existing.slice(-200), null, 2), 'utf-8');
    } catch {
      // Non-fatal persistence fallback
    }

    res.status(201).json({
      ok: true,
      referenceCode,
      receivedAt,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Terrantier Inmobiliaria server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
