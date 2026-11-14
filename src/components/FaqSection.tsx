import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { AGENTS } from '../data/valleyData';
import { STATIC_FAQS_BY_LANG, UI_COPY, type LanguageCode } from '../i18n/translations';
import {
  askFaqQuestion,
  fetchFaqQuota,
  getFaqLiveWebSocketUrl,
  type FaqQuota,
} from '../services/api';
import { RevealText } from './RevealText';

interface FaqSectionProps {
  language: LanguageCode;
}

interface QaEntry {
  id: string;
  channel: 'texto' | 'voz';
  question: string;
  answer: string;
}

function float32ToPcm16Base64(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const clamped = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function pcm16Base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const sampleCount = Math.floor(bytes.byteLength / 2);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }
  return float32;
}

export function FaqSection({ language }: FaqSectionProps) {
  const copy = UI_COPY[language].faq;
  const staticFaqs = STATIC_FAQS_BY_LANG[language];
  const [openFaqId, setOpenFaqId] = useState<string>(staticFaqs[0].id);
  const [question, setQuestion] = useState('');
  const [entries, setEntries] = useState<QaEntry[]>([]);
  const [quota, setQuota] = useState<FaqQuota>({ used: 0, remaining: 2, limit: 2 });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [voiceState, setVoiceState] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [liveUserDraft, setLiveUserDraft] = useState('');
  const [liveModelDraft, setLiveModelDraft] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const userTranscriptAccRef = useRef('');
  const modelTranscriptAccRef = useRef('');

  useEffect(() => {
    let cancelled = false;
    fetchFaqQuota()
      .then((serverQuota) => {
        if (!cancelled) {
          setQuota(serverQuota);
        }
      })
      .catch(() => {
        // Keep initial default quota state
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stopScheduledAudio = () => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // ignore
      }
    }
    activeSourcesRef.current.clear();
    if (outputCtxRef.current) {
      nextStartTimeRef.current = outputCtxRef.current.currentTime;
    } else {
      nextStartTimeRef.current = 0;
    }
  };

  const cleanupVoiceSession = () => {
    stopScheduledAudio();

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {
        // ignore
      }
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    if (inputCtxRef.current) {
      inputCtxRef.current.close().catch(() => {});
      inputCtxRef.current = null;
    }

    if (outputCtxRef.current) {
      outputCtxRef.current.close().catch(() => {});
      outputCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    setVoiceState('idle');
  };

  useEffect(() => {
    return () => {
      cleanupVoiceSession();
    };
  }, []);

  const playOutputAudioChunk = (base64Pcm: string) => {
    const ctx = outputCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const float32 = pcm16Base64ToFloat32(base64Pcm);
    if (float32.length === 0) return;

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now, nextStartTimeRef.current);
    source.start(startAt);
    nextStartTimeRef.current = startAt + buffer.duration;

    activeSourcesRef.current.add(source);
    source.onended = () => {
      activeSourcesRef.current.delete(source);
    };
  };

  const startVoiceConsultation = async () => {
    if (quota.remaining <= 0 || voiceState !== 'idle') return;

    setErrorMessage(null);
    setLiveUserDraft('');
    setLiveModelDraft('');
    userTranscriptAccRef.current = '';
    modelTranscriptAccRef.current = '';
    setVoiceState('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const ws = new WebSocket(getFaqLiveWebSocketUrl(language));
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as {
            type?: string;
            audio?: string;
            text?: string;
            error?: string;
            quota?: FaqQuota;
            limitReached?: boolean;
          };

          if (msg.type === 'ready') {
            setVoiceState('active');
            if (msg.quota) setQuota(msg.quota);

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
              const channelData = e.inputBuffer.getChannelData(0);
              const base64 = float32ToPcm16Base64(channelData);
              wsRef.current.send(JSON.stringify({ audio: base64 }));
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
            return;
          }

          if (msg.type === 'inputTranscript' && msg.text) {
            userTranscriptAccRef.current = `${userTranscriptAccRef.current} ${msg.text}`.trim();
            setLiveUserDraft(userTranscriptAccRef.current);
            return;
          }

          if (msg.type === 'outputTranscript' && msg.text) {
            modelTranscriptAccRef.current = `${modelTranscriptAccRef.current} ${msg.text}`.trim();
            setLiveModelDraft(modelTranscriptAccRef.current);
            return;
          }

          if (msg.type === 'audio' && msg.audio) {
            playOutputAudioChunk(msg.audio);
            return;
          }

          if (msg.type === 'interrupted') {
            stopScheduledAudio();
            return;
          }

          if (msg.type === 'turnComplete') {
            const qText =
              userTranscriptAccRef.current ||
              (language === 'en' ? 'Voice question' : 'Consulta de voz');
            const aText =
              modelTranscriptAccRef.current ||
              (language === 'en'
                ? 'Response delivered via audio.'
                : 'Respuesta entregada por audio.');
            setEntries((prev) => [
              ...prev,
              {
                id: `voice-${Date.now()}`,
                channel: 'voz',
                question: qText,
                answer: aText,
              },
            ]);
            userTranscriptAccRef.current = '';
            modelTranscriptAccRef.current = '';
            setLiveUserDraft('');
            setLiveModelDraft('');

            if (msg.quota) {
              setQuota(msg.quota);
            }
            if (msg.limitReached) {
              setTimeout(() => {
                cleanupVoiceSession();
              }, 1400);
            }
            return;
          }

          if (msg.type === 'error') {
            if (msg.quota) setQuota(msg.quota);
            setErrorMessage(
              msg.error ?? copy.voiceConnError,
            );
            cleanupVoiceSession();
          }
        } catch {
          // Ignore malformed WS message
        }
      };

      ws.onerror = () => {
        setErrorMessage(copy.voiceConnError);
        cleanupVoiceSession();
      };

      ws.onclose = () => {
        cleanupVoiceSession();
      };
    } catch {
      setErrorMessage(copy.micError);
      cleanupVoiceSession();
    }
  };

  const handleAskText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || quota.remaining <= 0) return;

    const trimmed = question.trim();
    if (trimmed.length < 4) {
      setErrorMessage(copy.minCharError);
      return;
    }

    setErrorMessage(null);
    setSubmitting(true);

    try {
      const result = await askFaqQuestion(trimmed, language);
      setQuota(result.quota);

      if (!result.ok || !result.answer) {
        setErrorMessage(result.error ?? copy.connectionError);
        return;
      }

      setEntries((prev) => [
        ...prev,
        {
          id: `text-${Date.now()}`,
          channel: 'texto',
          question: trimmed,
          answer: result.answer!,
        },
      ]);
      setQuestion('');
    } catch {
      setErrorMessage(copy.connectionError);
    } finally {
      setSubmitting(false);
    }
  };

  const limitReached = quota.remaining <= 0;

  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-[#FAF8F3] text-[#0E2F1E] py-20 md:py-28 px-6 md:px-10 border-t border-[#0E2F1E]/8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        {/* Columna izquierda: Preguntas frecuentes clave */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <p className="text-sm font-medium text-[#9A783A] mb-2">
              {copy.eyebrow}
            </p>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.4vw,2.85rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
                {copy.heading}
              </h2>
            </RevealText>
            <p className="mt-3 text-sm md:text-[15px] text-[#2D3332]/75 leading-relaxed">
              {copy.subtitle}
            </p>
          </div>

          <div className="divide-y divide-[#0E2F1E]/10 border-y border-[#0E2F1E]/10">
            {staticFaqs.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                    className="w-full flex items-start justify-between gap-4 text-left cursor-pointer py-1"
                  >
                    <span className="font-serif text-lg font-normal text-[#0E2F1E] leading-snug">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9A783A] shrink-0 mt-1.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 pr-6 text-sm text-[#2D3332]/80 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna derecha: Consulta directa (máx. 2 preguntas por usuario) */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-white border border-[#0E2F1E]/12 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#0E2F1E]/10 pb-5">
              <div>
                <p className="text-xs font-medium text-[#9A783A]">
                  {copy.assistantEyebrow}
                </p>
                <h3 className="font-serif text-2xl font-normal text-[#0E2F1E] mt-1">
                  {copy.assistantHeading}
                </h3>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3EFE6] border border-[#0E2F1E]/10 px-3 py-1.5 text-xs font-medium text-[#0E2F1E] tabular-nums">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A783A]" />
                  <span>{copy.remainingLabel(quota.remaining, quota.limit)}</span>
                </span>
              </div>
            </div>

            {/* Historial breve de 1-2 preguntas */}
            {entries.length > 0 && (
              <div className="space-y-4">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="rounded-xl bg-[#FAF8F3] border border-[#0E2F1E]/10 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#9A783A]">
                      <span>
                        {copy.consultationCounter(idx + 1, quota.limit, entry.channel)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#0E2F1E]">
                      “{entry.question}”
                    </p>
                    <p className="text-sm text-[#2D3332]/85 leading-relaxed border-t border-[#0E2F1E]/8 pt-2.5">
                      {entry.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Estado activo de conversación por voz */}
            {voiceState !== 'idle' && (
              <div className="rounded-xl bg-[#0E2F1E] text-[#FAF8F3] p-4 space-y-3 border border-[#C8A562]/30">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#E3C992]">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>
                      {voiceState === 'connecting'
                        ? copy.connectingVoice
                        : copy.activeMic}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={cleanupVoiceSession}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/12 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white cursor-pointer transition-colors"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{copy.stopVoice}</span>
                  </button>
                </div>

                {(liveUserDraft || liveModelDraft) && (
                  <div className="space-y-1.5 text-xs border-t border-white/12 pt-2.5">
                    {liveUserDraft && (
                      <p className="text-[#FAF8F3]/80">
                        <span className="font-medium text-[#E3C992]">{copy.youLabel}</span>{' '}
                        {liveUserDraft}
                      </p>
                    )}
                    {liveModelDraft && (
                      <p className="text-[#FAF8F3]">
                        <span className="font-medium text-[#E3C992]">{copy.assistantLabel}</span>{' '}
                        {liveModelDraft}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {limitReached ? (
              <div className="rounded-xl bg-[#F3EFE6] border border-[#0E2F1E]/12 p-5 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#0E2F1E]">
                    {copy.limitTitle}
                  </p>
                  <p className="text-xs text-[#2D3332]/75 leading-relaxed">
                    {copy.limitBody}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AGENTS.map((agent) => (
                    <a
                      key={agent.id}
                      href={`https://wa.me/${agent.whatsappNumber}?text=${encodeURIComponent(
                        language === 'en'
                          ? `Hello ${agent.name}, I completed my FAQ questions and would like to discuss a property in La Convención.`
                          : `Hola ${agent.name}, realicé mis consultas en Preguntas Frecuentes y deseo conversar sobre una propiedad en La Convención.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E2F1E] hover:bg-[#1B4730] text-[#FAF8F3] text-xs font-medium px-4 py-3 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0 text-[#E3C992]" />
                      <span>
                        {agent.name} · {agent.phoneDisplay}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#2D3332]/65">
                    {copy.quickLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {copy.quickPrompts.map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setQuestion(sample)}
                        className="text-left text-xs rounded-lg border border-[#0E2F1E]/14 bg-[#FAF8F3] hover:bg-[#F3EFE6] px-3 py-1.5 text-[#0E2F1E]/85 transition-colors cursor-pointer"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAskText} className="space-y-3">
                  <div>
                    <label
                      htmlFor="faq-question-input"
                      className="block text-xs font-medium text-[#2D3332]/80 mb-1.5"
                    >
                      {copy.inputLabel(quota.limit)}
                    </label>
                    <textarea
                      id="faq-question-input"
                      rows={3}
                      maxLength={400}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={submitting || voiceState !== 'idle'}
                      placeholder={copy.inputPlaceholder}
                      className="w-full rounded-xl border border-[#0E2F1E]/18 bg-[#FAF8F3] px-4 py-3 text-sm text-[#0E2F1E] placeholder:text-[#2D3332]/40 focus:border-[#0E2F1E] focus:bg-white focus:outline-none disabled:opacity-60 resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="text-xs font-medium text-[#9B2C2C]">
                      {errorMessage}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="submit"
                      disabled={submitting || voiceState !== 'idle'}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E2F1E] hover:bg-[#1B4730] disabled:opacity-60 text-[#FAF8F3] text-xs font-medium px-5 py-3 transition-colors cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{copy.submittingBtn}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#E3C992]" />
                          <span>{copy.submitBtn(quota.remaining)}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={submitting || voiceState !== 'idle'}
                      onClick={startVoiceConsultation}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0E2F1E]/25 bg-[#FAF8F3] hover:bg-[#F3EFE6] disabled:opacity-60 text-[#0E2F1E] text-xs font-medium px-4 py-3 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Mic className="w-3.5 h-3.5 text-[#9A783A]" />
                      <span>{copy.voiceBtn}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
