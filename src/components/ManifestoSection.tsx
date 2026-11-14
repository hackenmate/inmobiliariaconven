import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { HUAYOPATA_VALLEY_VIDEO, MEDIA_ASSETS } from '../data/valleyData';
import { AutoPlayVideo, MediaImage, ORGANIC_EASE, RevealText } from './RevealText';
import { UI_COPY, type LanguageCode } from '../i18n/translations';

interface ManifestoSectionProps {
  language: LanguageCode;
}

export function ManifestoSection({ language }: ManifestoSectionProps) {
  const [theaterOpen, setTheaterOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const copy = UI_COPY[language].manifesto;

  useEffect(() => {
    if (!theaterOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTheaterOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [theaterOpen]);

  return (
    <section
      id="manifiesto"
      className="scroll-mt-20 bg-[#FAF8F3] text-[#0E2F1E] pt-20 md:pt-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-sm font-medium text-[#9A783A] mb-2">
                {copy.eyebrow}
              </p>
              <RevealText>
                <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
                  {copy.heading}
                </h2>
              </RevealText>
            </div>

            <p className="text-sm md:text-[15px] leading-relaxed text-[#2D3332]/80 max-w-xl">
              {copy.subtitle}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden bg-[#F3EFE6] border border-[#0E2F1E]/10 aspect-[16/10]">
              <MediaImage
                src={MEDIA_ASSETS.huayopataCampo}
                alt="Recorrido de campo en camino rural de Huayopata"
                fallbackTitle="Recorrido de campo en Huayopata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {copy.pillars.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: ORGANIC_EASE }}
              className="rounded-2xl bg-[#F3EFE6] p-7 md:p-8 border border-[#0E2F1E]/10 flex flex-col justify-between gap-4"
            >
              <span className="font-serif text-3xl font-normal text-[#9A783A] tabular-nums">
                {pillar.number}
              </span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-normal text-[#0E2F1E] mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#2D3332]/80">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unboxed edge-to-edge full-width autoplaying aerial video band */}
      <div className="relative w-full h-[54vh] min-h-[380px] max-h-[640px] bg-[#0E2F1E]">
        <AutoPlayVideo
          src={HUAYOPATA_VALLEY_VIDEO}
          fallbackImage={MEDIA_ASSETS.huayopataCordillera}
          ariaLabel={copy.expandedAria}
          className="w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#091F14]/80 via-transparent to-[#091F14]/30 pointer-events-none"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[#FAF8F3]">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[#E3C992] mb-1">
              {copy.videoEyebrow}
            </p>
            <p className="font-serif text-xl md:text-2xl font-normal text-[#FAF8F3]">
              {copy.videoCaption}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTheaterOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F3]/95 hover:bg-[#FAF8F3] text-[#0E2F1E] text-xs font-medium px-4 py-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{copy.expandView}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {theaterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTheaterOpen(false)}
            className="fixed inset-0 z-50 bg-[#0D1611]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={copy.expandedAria}
          >
            <button
              type="button"
              onClick={() => setTheaterOpen(false)}
              aria-label={copy.closeExpanded}
              className="absolute top-5 right-5 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#18241E] hover:bg-[#F1EFEA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl aspect-video bg-black overflow-hidden shadow-2xl"
            >
              <video
                src={HUAYOPATA_VALLEY_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
