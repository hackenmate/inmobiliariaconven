import {
  GoogleGenAI,
  Modality,
  ThinkingLevel,
  type LiveServerMessage,
} from '@google/genai';
import type { Express, Request, Response } from 'express';
import type { Server as HttpServer } from 'node:http';
import fs from 'node:fs/promises';
import { WebSocketServer, type WebSocket } from 'ws';

export const MAX_FAQ_QUESTIONS = 2;
const QUOTA_FILE = '/tmp/terrantier_faq_quota.json';
const TEXT_MODEL = 'gemini-4-hydrogen';
const LIVE_MODEL = 'gemini-3.8-live';

export interface FaqQuotaStatus {
  used: number;
  remaining: number;
  limit: number;
}

const FAQ_SYSTEM_INSTRUCTION = `Eres el asistente de Preguntas Frecuentes de Terrantier Inmobiliaria, agencia especializada en La Convención, Cusco, Perú (Huayopata, Quillabamba, Santa Teresa, Echarati y Maranura).

Información verificada de nuestro portafolio y operaciones:
- Oficina: Jr. Espinar 248, Quillabamba, La Convención, Cusco. Correo: contacto@terrantier.pe. Horario: lunes a sábado de 08:30 a 18:00 h.
- Agentes locales directos:
  * Mariano (+51 950 155 945): Visitas de campo y tomas aéreas con dron en Huayopata, Santa Teresa y Maranura.
  * José (+51 982 908 264): Asesoría comercial, tasaciones y revisión registral SUNARP en Quillabamba, Echarati y todo el valle.
- Proceso técnico y legal: Todas las propiedades pasan por revisión de partidas en SUNARP (título saneado, libre de cargas) y verificación física de medidas y linderos antes de publicarse.
- Portafolio actual referencial:
  1) Reserva Bosque de Neblina · Huayopata: 46.0 Ha, 1,780 m s. n. m., US$ 520,000, partida SUNARP N.° 11048291, bosque maduro, trocha afirmada y suelos para café Geisha y té.
  2) Villa Mirador Alto Urubamba · Quillabamba: 540 m² construidos en terreno de 4,200 m², 5 dormitorios, piscina infinita, US$ 680,000, inscrita en SUNARP.
  3) Terreno Mirador & Laderas de Huayopata: 18.5 Ha, 1,690 m s. n. m., US$ 235,000, trocha consolidada, título definitivo SUNARP.
  4) Reserva Cañón Cocalmayo · Santa Teresa: 24.0 Ha con ribera de río y caída de agua, ruta a Machu Picchu, US$ 560,000.
  5) Estancia Panorámica Maranura: Casa de campo de 410 m² en terreno de 5,800 m², US$ 390,000, a 18 min de Quillabamba.
  6) Fundo Cacao Chuncho Echarati: 52.0 Ha (22 Ha de cacao Chuncho en producción), 890 m s. n. m., US$ 340,000.

Reglas estrictas de respuesta:
- Responde SIEMPRE en español claro, cordial y profesional.
- Sé conciso: máximo 3 o 4 oraciones directas (o 25 segundos si hablas por voz).
- Limítate a preguntas frecuentes sobre compra, venta, saneamiento SUNARP, visitas técnicas con dron, zonas del valle y propiedades del portafolio.
- Si preguntan algo fuera del rubro inmobiliario de La Convención o piden datos exactos no listados (ej. impuestos personales o negociación final), indícalo brevemente e invita a contactar por WhatsApp a Mariano (+51 950 155 945) o José (+51 982 908 264).
- No inventes propiedades, precios ni partidas registrales adicionales.`;

const quotaMap = new Map<string, number>();
let quotaLoaded = false;

async function ensureQuotaLoaded(): Promise<void> {
  if (quotaLoaded) return;
  quotaLoaded = true;
  try {
    const raw = await fs.readFile(QUOTA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Record<string, number>;
    if (parsed && typeof parsed === 'object') {
      for (const [key, val] of Object.entries(parsed)) {
        if (typeof val === 'number' && Number.isFinite(val)) {
          quotaMap.set(key, Math.min(MAX_FAQ_QUESTIONS, Math.max(0, Math.floor(val))));
        }
      }
    }
  } catch {
    // No persisted file yet
  }
}

async function persistQuota(): Promise<void> {
  try {
    const obj = Object.fromEntries(Array.from(quotaMap.entries()).slice(-1000));
    await fs.writeFile(QUOTA_FILE, JSON.stringify(obj), 'utf-8');
  } catch {
    // Non-fatal persistence fallback
  }
}

function sanitizeVisitorId(raw: unknown): string {
  if (typeof raw === 'string') {
    const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleaned.length >= 6 && cleaned.length <= 64) {
      return cleaned;
    }
  }
  return 'default-visitor';
}

function getQuotaStatus(visitorId: string): FaqQuotaStatus {
  const used = Math.min(MAX_FAQ_QUESTIONS, quotaMap.get(visitorId) ?? 0);
  return {
    used,
    remaining: Math.max(0, MAX_FAQ_QUESTIONS - used),
    limit: MAX_FAQ_QUESTIONS,
  };
}

async function incrementQuota(visitorId: string): Promise<FaqQuotaStatus> {
  await ensureQuotaLoaded();
  const current = quotaMap.get(visitorId) ?? 0;
  const next = Math.min(MAX_FAQ_QUESTIONS, current + 1);
  quotaMap.set(visitorId, next);
  await persistQuota();
  return getQuotaStatus(visitorId);
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function mapGeminiError(err: unknown): { status: number; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const upper = rawMessage.toUpperCase();

  if (upper.includes('RESOURCE_EXHAUSTED') || upper.includes('429')) {
    return {
      status: 429,
      message:
        'El servicio gratuito de consultas recibió muchas solicitudes simultáneas. Intenta nuevamente en unos segundos o escríbenos por WhatsApp.',
    };
  }

  if (
    upper.includes('PERMISSION_DENIED') ||
    upper.includes('API_KEY_INVALID') ||
    upper.includes('403') ||
    upper.includes('401')
  ) {
    return {
      status: 503,
      message:
        'El servicio de consultas automáticas requiere verificar la clave configurada en Settings > Secrets.',
    };
  }

  if (upper.includes('NOT_FOUND') || upper.includes('404')) {
    return {
      status: 502,
      message:
        'El modelo de consulta no estuvo disponible temporalmente. Por favor, contáctanos por WhatsApp.',
    };
  }

  return {
    status: 500,
    message:
      'No se pudo procesar tu consulta en este momento. Puedes escribir directamente a Mariano o José por WhatsApp.',
  };
}

export function registerFaqGeminiRoutes(app: Express, httpServer: HttpServer): void {
  app.get('/api/faq/quota', async (req: Request, res: Response) => {
    await ensureQuotaLoaded();
    const visitorId = sanitizeVisitorId(
      req.headers['x-visitor-id'] ?? req.query.visitorId,
    );
    res.json({ ok: true, quota: getQuotaStatus(visitorId) });
  });

  app.post('/api/faq/ask', async (req: Request, res: Response) => {
    await ensureQuotaLoaded();

    const body = req.body as { question?: unknown; visitorId?: unknown; lang?: unknown };
    const visitorId = sanitizeVisitorId(
      req.headers['x-visitor-id'] ?? body.visitorId,
    );
    const lang = body.lang === 'en' ? 'en' : 'es';
    const question = typeof body.question === 'string' ? body.question.trim() : '';

    const currentQuota = getQuotaStatus(visitorId);
    if (currentQuota.remaining <= 0) {
      res.status(429).json({
        ok: false,
        limitReached: true,
        quota: currentQuota,
        error:
          'Ya utilizaste tus 2 consultas gratuitas en Preguntas Frecuentes. Contáctanos por WhatsApp para atención personalizada.',
      });
      return;
    }

    if (question.length < 4) {
      res.status(400).json({
        ok: false,
        quota: currentQuota,
        error: 'Escribe una pregunta de al menos 4 caracteres.',
      });
      return;
    }

    if (question.length > 400) {
      res.status(400).json({
        ok: false,
        quota: currentQuota,
        error: 'La consulta no debe superar los 400 caracteres.',
      });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        ok: false,
        quota: currentQuota,
        error:
          'La clave de Gemini API no está configurada en el servidor (Settings > Secrets). Mientras tanto, puedes consultar con Mariano o José por WhatsApp.',
      });
      return;
    }

    try {
      const langDirective =
        lang === 'en'
          ? '\n\nIMPORTANT: The user is browsing in English. Answer strictly in clear, concise English (3-4 sentences max).'
          : '';
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: question,
        config: {
          systemInstruction: FAQ_SYSTEM_INSTRUCTION + langDirective,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        throw new Error('Empty response from Gemini');
      }

      const updatedQuota = await incrementQuota(visitorId);
      res.json({
        ok: true,
        model: TEXT_MODEL,
        answer,
        quota: updatedQuota,
        limitReached: updatedQuota.remaining <= 0,
      });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({
        ok: false,
        quota: currentQuota,
        error: mapped.message,
      });
    }
  });

  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (req, socket, head) => {
    try {
      const parsedUrl = new URL(req.url ?? '/', 'http://localhost');
      if (parsedUrl.pathname === '/api/faq/live') {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req);
        });
      }
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs: WebSocket, req) => {
    await ensureQuotaLoaded();
    const parsedUrl = new URL(req.url ?? '/', 'http://localhost');
    const visitorId = sanitizeVisitorId(parsedUrl.searchParams.get('visitorId'));
    const lang = parsedUrl.searchParams.get('lang') === 'en' ? 'en' : 'es';

    const initialQuota = getQuotaStatus(visitorId);
    if (initialQuota.remaining <= 0) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          limitReached: true,
          quota: initialQuota,
          error:
            'Ya utilizaste tus 2 consultas gratuitas en Preguntas Frecuentes. Escríbenos por WhatsApp para continuar.',
        }),
      );
      clientWs.close();
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          quota: initialQuota,
          error:
            'La clave de Gemini API no está configurada en el servidor (Settings > Secrets).',
        }),
      );
      clientWs.close();
      return;
    }

    let session: Awaited<ReturnType<typeof ai.live.connect>> | null = null;
    let isClosed = false;
    let countedCurrentTurn = false;

    const sendSafe = (payload: Record<string, unknown>) => {
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    try {
      session = await ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            lang === 'en'
              ? FAQ_SYSTEM_INSTRUCTION +
                '\n\nIMPORTANT: Respond in clear, natural spoken English (maximum 20 seconds per turn).'
              : FAQ_SYSTEM_INSTRUCTION +
                ' Responde de forma hablada, breve y natural en español (máximo 20 segundos por turno).',
        },
        callbacks: {
          onopen: () => {
            sendSafe({
              type: 'ready',
              model: LIVE_MODEL,
              quota: getQuotaStatus(visitorId),
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            if (isClosed) return;
            const content = message.serverContent;

            if (content?.inputTranscription?.text) {
              countedCurrentTurn = false;
              sendSafe({
                type: 'inputTranscript',
                text: content.inputTranscription.text,
              });
            }

            if (content?.outputTranscription?.text) {
              sendSafe({
                type: 'outputTranscript',
                text: content.outputTranscription.text,
              });
            }

            for (const part of content?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                sendSafe({
                  type: 'audio',
                  audio: part.inlineData.data,
                });
              }
            }

            if (content?.interrupted) {
              sendSafe({ type: 'interrupted' });
            }

            if (content?.turnComplete) {
              let updatedQuota = getQuotaStatus(visitorId);
              if (!countedCurrentTurn) {
                countedCurrentTurn = true;
                updatedQuota = await incrementQuota(visitorId);
              }
              const limitReached = updatedQuota.remaining <= 0;
              sendSafe({
                type: 'turnComplete',
                quota: updatedQuota,
                limitReached,
              });

              if (limitReached) {
                setTimeout(() => {
                  if (!isClosed) {
                    isClosed = true;
                    try {
                      session?.close();
                    } catch {
                      // ignore
                    }
                    if (clientWs.readyState === clientWs.OPEN) {
                      clientWs.close();
                    }
                  }
                }, 1200);
              }
            }
          },
          onerror: (err: unknown) => {
            const mapped = mapGeminiError(err);
            sendSafe({
              type: 'error',
              error: mapped.message,
              quota: getQuotaStatus(visitorId),
            });
          },
          onclose: () => {
            if (!isClosed && clientWs.readyState === clientWs.OPEN) {
              clientWs.close();
            }
          },
        },
      });
    } catch (err) {
      const mapped = mapGeminiError(err);
      sendSafe({
        type: 'error',
        error: mapped.message,
        quota: getQuotaStatus(visitorId),
      });
      clientWs.close();
      return;
    }

    clientWs.on('message', (rawData) => {
      if (isClosed || !session) return;
      try {
        const currentQuota = getQuotaStatus(visitorId);
        if (currentQuota.remaining <= 0) {
          sendSafe({
            type: 'error',
            limitReached: true,
            quota: currentQuota,
            error: 'Has alcanzado el límite de 2 consultas gratuitas por usuario.',
          });
          return;
        }

        const msg = JSON.parse(rawData.toString()) as {
          audio?: string;
          text?: string;
        };
        if (msg.audio) {
          session.sendRealtimeInput({
            audio: {
              data: msg.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (msg.text && msg.text.trim()) {
          countedCurrentTurn = false;
          session.sendRealtimeInput({
            text: msg.text.trim(),
          });
        }
      } catch {
        // Ignore malformed frame
      }
    });

    clientWs.on('close', () => {
      isClosed = true;
      try {
        session?.close();
      } catch {
        // ignore
      }
    });
  });
}
