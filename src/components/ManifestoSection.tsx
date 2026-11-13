import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { HUAYOPATA_VALLEY_VIDEO, MEDIA_ASSETS } from '../data/valleyData';
import { AutoPlayVideo, MediaImage, ORGANIC_EASE, RevealText } from './RevealText';

const PILLARS = [
  {
    number: '01',
    title: 'Levantamiento topográfico RTK',
    description:
      'Delimitamos cada vértice, quebrada, trocha carrozable y naciente de agua con vuelo fotogramétrico de alta precisión antes de cualquier oferta.',
  },
  {
    number: '02',
    title: 'Auditoría registral en SUNARP',
    description:
      'Revisamos tracto sucesivo, certificados negativos de superposición, cargas y servidumbres de paso para garantizar transferencia notarial limpia.',
  },
  {
    number: '03',
    title: 'Vocación productiva y arquitectónica',
    description:
      'Evaluamos altitud, radiación solar, calidad de suelo cafetalero/cacaotero y factibilidad constructiva para inversión patrimonial a largo plazo.',
  },
];

export function ManifestoSection() {
  const [theaterOpen, setTheaterOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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
      className="scroll-mt-20 bg-[#FAF9F6] text-[#18241E] pt-20 md:pt-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-sm font-medium text-[#2A4736] mb-2">
                Metodología de campo y respaldo legal
              </p>
              <RevealText>
                <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#18241E]">
                  Inversión territorial en selva alta con rigor técnico
                </h2>
              </RevealText>
            </div>

            <p className="text-sm md:text-[15px] leading-relaxed text-[#18241E]/75 max-w-xl">
              Adquirir una finca productiva o una residencia en La Convención exige verificar linderos
              reales sobre el terreno con levantamiento aéreo en campo y su correlato jurídico en
              Registros Públicos.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden bg-[#F1EFEA] border border-[#18241E]/10 aspect-[16/10]">
              <MediaImage
                src={MEDIA_ASSETS.huayopataCampo}
                alt="Inspección aerofotogramétrica de campo en trocha de Huayopata"
                fallbackTitle="Inspección de campo en Huayopata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: ORGANIC_EASE }}
              className="rounded-2xl bg-[#F1EFEA] p-7 md:p-8 border border-[#18241E]/8 flex flex-col justify-between gap-4"
            >
              <span className="font-serif text-3xl font-normal text-[#8C6239] tabular-nums">
                {pillar.number}
              </span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-normal text-[#18241E] mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#18241E]/75">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unboxed edge-to-edge full-width autoplaying aerial video band */}
      <div className="relative w-full h-[54vh] min-h-[380px] max-h-[640px] bg-[#101A14]">
        <AutoPlayVideo
          src={HUAYOPATA_VALLEY_VIDEO}
          ariaLabel="Recorrido aéreo continuo por el valle de Huayopata y La Convención"
          className="w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0D1611]/75 via-transparent to-[#0D1611]/25 pointer-events-none"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[#FAF9F6]">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[#E4CFAF] mb-1">
              Inspección aérea · Huayopata y Alto Urubamba
            </p>
            <p className="font-serif text-xl md:text-2xl font-normal text-[#FAF9F6]">
              Verificación directa de acceso vial, topografía y nacientes de agua
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTheaterOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#FAF9F6]/90 hover:bg-[#FAF9F6] text-[#18241E] text-xs font-medium px-4 py-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expandir vista</span>
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
            aria-label="Vista aérea ampliada de La Convención"
          >
            <button
              type="button"
              onClick={() => setTheaterOpen(false)}
              aria-label="Cerrar vista ampliada"
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
