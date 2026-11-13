import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ChevronDown, Search } from 'lucide-react';
import {
  HUAYOPATA_AERIAL_VIDEO,
  type BudgetRange,
  type HeroSearchFilters,
  type PropertyCategory,
  type ZoneId,
} from '../data/valleyData';
import { AutoPlayVideo, ORGANIC_EASE } from './RevealText';

interface HeroSectionProps {
  filters: HeroSearchFilters;
  onApplyFilters: (next: HeroSearchFilters) => void;
}

const LOCATIONS: Array<{ value: 'all' | ZoneId; label: string }> = [
  { value: 'all', label: 'Todo La Convención' },
  { value: 'Huayopata', label: 'Huayopata' },
  { value: 'Quillabamba', label: 'Quillabamba' },
  { value: 'Santa Teresa', label: 'Santa Teresa' },
  { value: 'Echarati', label: 'Echarati' },
  { value: 'Maranura', label: 'Maranura' },
];

const PROPERTY_TYPES: Array<{ value: 'all' | PropertyCategory; label: string }> = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'Fincas & Haciendas', label: 'Fincas y Haciendas' },
  { value: 'Villas & Residencias', label: 'Villas y Residencias' },
  { value: 'Terrenos de Inversión', label: 'Terrenos de Inversión' },
];

const BUDGET_RANGES: Array<{ value: BudgetRange; label: string }> = [
  { value: 'all', label: 'Cualquier presupuesto' },
  { value: 'under-250', label: 'Hasta US$ 250,000' },
  { value: '250-550', label: 'US$ 250,000 – US$ 550,000' },
  { value: 'over-550', label: 'Desde US$ 550,000' },
];

export function HeroSection({ filters, onApplyFilters }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [draftLocation, setDraftLocation] = useState<'all' | ZoneId>(filters.location);
  const [draftCategory, setDraftCategory] = useState<'all' | PropertyCategory>(filters.category);
  const [draftBudget, setDraftBudget] = useState<BudgetRange>(filters.budget);

  useEffect(() => {
    setDraftLocation(filters.location);
    setDraftCategory(filters.category);
    setDraftBudget(filters.budget);
  }, [filters.location, filters.category, filters.budget]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters({
      location: draftLocation,
      category: draftCategory,
      budget: draftBudget,
    });
    const el = document.getElementById('propiedades');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[680px] h-[100svh] max-h-[1000px] w-full overflow-hidden bg-[#101A14] text-[#FAF9F6]"
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                y: videoY,
                scale: videoScale,
              }
        }
        className="absolute inset-0 will-change-transform"
      >
        <AutoPlayVideo
          src={HUAYOPATA_AERIAL_VIDEO}
          ariaHidden
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0D1611]/85 via-[#0D1611]/30 to-[#0D1611]/55 pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        style={prefersReducedMotion ? undefined : { y: contentY }}
        className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-10 pt-28 pb-10 md:pb-12 flex flex-col justify-between"
      >
        <div className="my-auto max-w-3xl">
          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: ORGANIC_EASE }}
            className="text-sm font-medium text-[#FAF9F6]/85 mb-4"
          >
            La Convención, Cusco · Huayopata y Quillabamba
          </motion.p>

          <h1 className="font-serif text-[clamp(2.25rem,4.5vw,3.9rem)] font-normal leading-[1.08] tracking-tight text-[#FAF9F6]">
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReducedMotion ? undefined : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.06, ease: ORGANIC_EASE }}
                className="block"
              >
                Propiedades rurales, fincas y
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReducedMotion ? undefined : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.14, ease: ORGANIC_EASE }}
                className="block"
              >
                residencias en La Convención
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease: ORGANIC_EASE }}
            className="mt-5 max-w-2xl text-base md:text-[17px] leading-relaxed text-[#FAF9F6]/90 font-normal"
          >
            Asesoría inmobiliaria especializada en activos productivos y residenciales con
            levantamiento topográfico y partidas saneadas en SUNARP.
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: ORGANIC_EASE }}
          aria-label="Buscador de propiedades en La Convención"
          className="w-full rounded-2xl bg-[#FAF9F6] text-[#18241E] p-3 md:p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] border border-white/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
            <div className="md:col-span-3 px-3 py-1 md:border-r md:border-[#18241E]/12 relative">
              <label
                htmlFor="hero-location"
                className="block text-xs font-medium text-[#18241E]/60 mb-1"
              >
                Ubicación
              </label>
              <div className="relative flex items-center">
                <select
                  id="hero-location"
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value as 'all' | ZoneId)}
                  className="w-full appearance-none bg-transparent pr-7 text-sm font-medium text-[#18241E] focus:outline-none cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#18241E]/55 pointer-events-none absolute right-0" />
              </div>
            </div>

            <div className="md:col-span-3 px-3 py-1 md:border-r md:border-[#18241E]/12 relative">
              <label
                htmlFor="hero-category"
                className="block text-xs font-medium text-[#18241E]/60 mb-1"
              >
                Categoría
              </label>
              <div className="relative flex items-center">
                <select
                  id="hero-category"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as 'all' | PropertyCategory)}
                  className="w-full appearance-none bg-transparent pr-7 text-sm font-medium text-[#18241E] focus:outline-none cursor-pointer"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#18241E]/55 pointer-events-none absolute right-0" />
              </div>
            </div>

            <div className="md:col-span-3 px-3 py-1 relative">
              <label
                htmlFor="hero-budget"
                className="block text-xs font-medium text-[#18241E]/60 mb-1"
              >
                Rango de inversión
              </label>
              <div className="relative flex items-center">
                <select
                  id="hero-budget"
                  value={draftBudget}
                  onChange={(e) => setDraftBudget(e.target.value as BudgetRange)}
                  className="w-full appearance-none bg-transparent pr-7 text-sm font-medium text-[#18241E] focus:outline-none cursor-pointer"
                >
                  {BUDGET_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#18241E]/55 pointer-events-none absolute right-0" />
              </div>
            </div>

            <div className="md:col-span-3 flex">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#18241E] hover:bg-[#2A4736] text-[#FAF9F6] text-sm font-medium px-6 py-3.5 transition-colors duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4736]"
              >
                <Search className="w-4 h-4" strokeWidth={2} />
                <span>Buscar propiedades</span>
              </button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
