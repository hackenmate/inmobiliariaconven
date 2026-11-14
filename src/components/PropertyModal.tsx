import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  formatPropertyPrice,
  type CurrencyCode,
  type PropertyItem,
} from '../data/valleyData';
import { MediaImage, ORGANIC_EASE } from './RevealText';
import { CATEGORY_LABELS, UI_COPY, type LanguageCode } from '../i18n/translations';

interface PropertyModalProps {
  language: LanguageCode;
  property: PropertyItem | null;
  currency: CurrencyCode;
  penRate: number;
  onClose: () => void;
  onInquire: (property: PropertyItem) => void;
}

export function PropertyModal({
  language,
  property,
  currency,
  penRate,
  onClose,
  onInquire,
}: PropertyModalProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [years, setYears] = useState(10);
  const copy = UI_COPY[language].modal;
  const propCopy = UI_COPY[language].properties;

  useEffect(() => {
    setImageIndex(0);
    setCopied(false);
    setShowSimulator(false);
  }, [property?.id]);

  useEffect(() => {
    if (!property) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && property.images.length > 1) {
        setImageIndex((prev) => (prev + 1) % property.images.length);
      } else if (e.key === 'ArrowLeft' && property.images.length > 1) {
        setImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [property, onClose]);

  const handleCopySummary = async () => {
    if (!property) return;
    const priceLabel = formatPropertyPrice(property.priceUsd, currency, penRate);
    const metric = property.isLand
      ? `${property.hectares?.toFixed(1)} Ha`
      : `${property.areaSqm} m² (${property.bedrooms} Hab. / ${property.bathrooms} Baños)`;
    const summaryText = `${property.title} — ${property.zone} | ${priceLabel} | ${metric} | ${property.sunarpStatus}`;
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const calculateMonthlyPaymentUsd = (priceUsd: number) => {
    const principal = priceUsd * (1 - downPaymentPct / 100);
    const monthlyRate = 0.085 / 12;
    const months = years * 12;
    if (principal <= 0) return 0;
    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
  };

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          key="property-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: ORGANIC_EASE }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#0D1611]/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="property-modal-title"
        >
          <motion.div
            key="property-modal-panel"
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: ORGANIC_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#FAF8F3] text-[#0E2F1E] rounded-2xl overflow-hidden border border-[#0E2F1E]/12 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={copy.closeLabel}
              className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-[#0E2F1E] hover:bg-white transition-colors shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div
                onWheel={(e) => {
                  if (property.images.length <= 1) return;
                  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
                    setImageIndex((prev) =>
                      e.deltaX > 0
                        ? (prev + 1) % property.images.length
                        : (prev - 1 + property.images.length) % property.images.length,
                    );
                  }
                }}
                className="group/modal-gallery lg:col-span-7 flex flex-col bg-[#0E2F1E]"
              >
                <div className="relative overflow-hidden min-h-[280px] sm:min-h-[380px] lg:flex-1 lg:min-h-[460px]">
                  <MediaImage
                    src={property.images[imageIndex]}
                    alt={`${property.title} — vista ${imageIndex + 1}`}
                    fallbackTitle={property.title}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/modal-gallery:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#091F14]/70 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {property.images.length > 1 && (
                    <>
                      <div className="opacity-0 group-hover/modal-gallery:opacity-100 transition-opacity duration-300 absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="text-xs font-medium text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 tabular-nums">
                          {imageIndex + 1}/{property.images.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onMouseEnter={() =>
                          setImageIndex(
                            (prev) =>
                              (prev - 1 + property.images.length) % property.images.length,
                          )
                        }
                        onClick={() =>
                          setImageIndex(
                            (prev) =>
                              (prev - 1 + property.images.length) % property.images.length,
                          )
                        }
                        aria-label={copy.prevPhoto}
                        className="opacity-0 group-hover/modal-gallery:opacity-100 transition-opacity duration-300 absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/85 flex items-center justify-center cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onMouseEnter={() =>
                          setImageIndex((prev) => (prev + 1) % property.images.length)
                        }
                        onClick={() =>
                          setImageIndex((prev) => (prev + 1) % property.images.length)
                        }
                        aria-label={copy.nextPhoto}
                        className="opacity-0 group-hover/modal-gallery:opacity-100 transition-opacity duration-300 absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/85 flex items-center justify-center cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {property.images.length > 1 && (
                  <div className="flex items-center gap-2 p-3 bg-[#091F14] overflow-x-auto">
                    {property.images.map((imgSrc, idx) => (
                      <button
                        key={`${property.id}-thumb-${idx}`}
                        type="button"
                        onMouseEnter={() => setImageIndex(idx)}
                        onClick={() => setImageIndex(idx)}
                        aria-label={`${copy.seePhoto} ${idx + 1}`}
                        className={`relative w-16 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          imageIndex === idx
                            ? 'border-[#C8A562] opacity-100'
                            : 'border-transparent opacity-55 hover:opacity-90'
                        }`}
                      >
                        <img
                          src={property.thumbImages?.[idx] ?? imgSrc}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-5">
                <div>
                  <div className="text-xs font-medium text-[#9A783A] mb-1.5 pr-8">
                    <span>{property.zone}</span>
                    <span aria-hidden="true" className="mx-2 text-[#0E2F1E]/25">
                      ·
                    </span>
                    <span className="text-[#2D3332]/70">
                      {CATEGORY_LABELS[language][property.category]}
                    </span>
                  </div>

                  <h3
                    id="property-modal-title"
                    className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-[#0E2F1E]"
                  >
                    {property.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[#18241E]/10">
                    <div>
                      <span className="font-serif text-2xl sm:text-3xl font-medium tabular-nums text-[#18241E]">
                        {formatPropertyPrice(property.priceUsd, currency, penRate)}
                      </span>
                      <span className="block text-[11px] text-[#18241E]/55 tabular-nums">
                        {currency === 'PEN'
                          ? `${copy.refPrefix} US$ ${new Intl.NumberFormat('en-US').format(property.priceUsd)}`
                          : `${copy.refShortPrefix} S/ ${new Intl.NumberFormat('es-PE').format(Math.round(property.priceUsd * penRate))}`}
                      </span>
                    </div>
                    <span className="text-xs text-[#18241E]/65 tabular-nums">
                      {property.altitude}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-4 border-b border-[#18241E]/10 text-sm">
                    {property.isLand ? (
                      <>
                        <div>
                          <span className="block text-xs text-[#18241E]/55">
                            {copy.extensionLabel}
                          </span>
                          <span className="font-semibold tabular-nums">
                            {property.hectares?.toFixed(1)} Ha
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-xs text-[#18241E]/55">
                            {copy.profileLabel}
                          </span>
                          <span className="font-medium text-[#18241E]">
                            {property.productivityOrArchitecture}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="block text-xs text-[#18241E]/55">
                            {copy.builtAreaLabel}
                          </span>
                          <span className="font-semibold tabular-nums">
                            {property.areaSqm} m²
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-[#18241E]/55">
                            {copy.bedroomsLabel}
                          </span>
                          <span className="font-semibold tabular-nums">
                            {property.bedrooms} {propCopy.roomsShort}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-[#18241E]/55">
                            {copy.bathroomsLabel}
                          </span>
                          <span className="font-semibold tabular-nums">
                            {property.bathrooms} {propCopy.bathsShort}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#18241E]/80">
                    {property.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {property.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-[#18241E]/80">
                        <Check className="w-4 h-4 text-[#2A4736] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {showSimulator && (
                    <div className="mt-4 rounded-xl bg-[#F1EFEA] p-4 border border-[#18241E]/10 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#18241E]">
                          {copy.downPayment} ({downPaymentPct}%)
                        </span>
                        <span className="font-semibold tabular-nums text-[#2A4736]">
                          {formatPropertyPrice(
                            property.priceUsd * (downPaymentPct / 100),
                            currency,
                            penRate,
                          )}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={60}
                        step={5}
                        value={downPaymentPct}
                        onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                        aria-label={copy.downPaymentAria}
                        className="w-full accent-[#2A4736] cursor-pointer"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-medium text-[#18241E]">
                          {copy.termYears} ({years} {copy.yearsLabel})
                        </span>
                        <span className="font-semibold tabular-nums text-[#18241E]">
                          {formatPropertyPrice(
                            Math.round(calculateMonthlyPaymentUsd(property.priceUsd)),
                            currency,
                            penRate,
                          )}
                          {copy.perMonth}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={20}
                        step={5}
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        aria-label={copy.termAria}
                        className="w-full accent-[#2A4736] cursor-pointer"
                      />
                      <p className="text-[11px] text-[#18241E]/60">
                        {copy.simNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#0E2F1E]/10 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#2D3332]/80">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#9A783A] shrink-0" />
                      <span>{property.sunarpStatus}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSimulator((prev) => !prev)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0E2F1E]/18 bg-white hover:bg-[#F3EFE6] text-[#0E2F1E] text-xs font-medium px-3 py-2.5 transition-colors cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>{showSimulator ? copy.hideSimulator : copy.showSimulator}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0E2F1E]/18 bg-white hover:bg-[#F3EFE6] text-[#0E2F1E] text-xs font-medium px-3 py-2.5 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1B4730]" />
                          <span className="text-[#1B4730]">{copy.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copy.copySummary}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInquire(property)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E2F1E] hover:bg-[#1B4730] text-[#FAF8F3] text-sm font-medium px-6 py-3.5 transition-colors cursor-pointer"
                  >
                    <span>{copy.requestDossierAndPlans}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#E3C992]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
