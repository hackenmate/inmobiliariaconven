import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/valleyData';
import { ORGANIC_EASE, RevealText } from './RevealText';

const METRICS = [
  {
    value: '1,420 Ha',
    label: 'Hectáreas auditadas y gestionadas en el valle',
  },
  {
    value: '14 años',
    label: 'Trayectoria local en Quillabamba y Huayopata',
  },
  {
    value: '100% SUNARP',
    label: 'Partidas verificadas antes de publicación',
  },
  {
    value: '32 cierres',
    label: 'Transacciones rurales y residenciales exitosas',
  },
];

export function SocialProofSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="respaldo"
      className="scroll-mt-20 bg-[#FAF9F6] text-[#18241E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="rounded-2xl bg-[#18241E] text-[#FAF9F6] p-8 md:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {METRICS.map((metric) => (
              <div key={metric.value} className="space-y-1.5">
                <p className="font-serif text-3xl md:text-4xl font-normal text-[#FAF9F6] tabular-nums">
                  {metric.value}
                </p>
                <p className="text-sm text-[#FAF9F6]/70 leading-relaxed">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#2A4736] mb-2">
                Experiencia de clientes e inversionistas
              </p>
              <RevealText>
                <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#18241E]">
                  Operaciones respaldadas por documentación comprobable
                </h2>
              </RevealText>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2A4736]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Asesoría notarial y registral integral en Cusco</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {TESTIMONIALS.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: idx * 0.06, ease: ORGANIC_EASE }}
                className="rounded-2xl bg-white border border-[#18241E]/10 p-7 md:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <p className="text-xs font-medium text-[#8C6239]">
                    {item.propertyAcquired}
                  </p>
                  <blockquote className="text-sm md:text-[15px] leading-relaxed text-[#18241E]/85">
                    “{item.quote}”
                  </blockquote>
                </div>

                <div className="pt-5 border-t border-[#18241E]/10 space-y-2">
                  <p className="text-xs font-medium text-[#2A4736]">
                    {item.outcome}
                  </p>
                  <div>
                    <p className="font-serif text-lg font-medium text-[#18241E]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#18241E]/60">
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
