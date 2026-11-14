import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/valleyData';
import { getLocalizedTestimonial, UI_COPY, type LanguageCode } from '../i18n/translations';
import { TerrantierPatternOverlay } from './BrandLogo';
import { ORGANIC_EASE, RevealText } from './RevealText';

interface SocialProofSectionProps {
  language: LanguageCode;
}

export function SocialProofSection({ language }: SocialProofSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const copy = UI_COPY[language].socialProof;
  const localizedTestimonials = TESTIMONIALS.map((t) => getLocalizedTestimonial(t, language));

  return (
    <section
      id="respaldo"
      className="scroll-mt-20 bg-[#FAF8F3] text-[#0E2F1E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="relative overflow-hidden rounded-2xl bg-[#0E2F1E] text-[#FAF8F3] p-8 md:p-12 border border-[#C8A562]/45 shadow-md">
          <TerrantierPatternOverlay opacityClass="opacity-[0.07]" />
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {copy.metrics.map((metric) => (
              <div key={metric.value} className="space-y-1.5">
                <div
                  aria-hidden="true"
                  className="h-[1.5px] w-8 bg-gradient-to-r from-[#E8CF96] to-transparent mb-3"
                />
                <p className="font-serif text-3xl md:text-4xl font-normal text-[#E8CF96] tabular-nums">
                  {metric.value}
                </p>
                <p className="text-sm text-[#FAF8F3]/90 leading-relaxed">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2.5">
                <span
                  aria-hidden="true"
                  className="h-[1.5px] w-7 bg-gradient-to-r from-[#C8A562] to-[#9A783A]"
                />
                <p className="font-brand text-xs font-medium uppercase tracking-[0.22em] text-[#8B6A2E]">
                  {copy.eyebrow}
                </p>
              </div>
              <RevealText>
                <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
                  {copy.heading}
                </h2>
              </RevealText>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1B4730]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#9A783A]" />
              <span>{copy.badge}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {localizedTestimonials.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: idx * 0.06, ease: ORGANIC_EASE }}
                className="rounded-2xl bg-white border border-[#0E2F1E]/12 border-t-2 border-t-[#C8A562] hover:border-[#C8A562]/80 transition-colors p-7 md:p-8 flex flex-col justify-between gap-6 shadow-sm"
              >
                <div className="space-y-4">
                  <p className="font-brand text-xs uppercase tracking-[0.12em] font-medium text-[#8B6A2E]">
                    {item.propertyAcquired}
                  </p>
                  <blockquote className="text-sm md:text-[15px] leading-relaxed text-[#2D3332]/95">
                    “{item.quote}”
                  </blockquote>
                </div>

                <div className="pt-5 border-t border-[#0E2F1E]/12 space-y-2">
                  <p className="text-xs font-semibold text-[#1B4730]">
                    {item.outcome}
                  </p>
                  <div>
                    <p className="font-serif text-lg font-medium text-[#0E2F1E]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#2D3332]/75">
                      {item.role} · {item.origin}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
