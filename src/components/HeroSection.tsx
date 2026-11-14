import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ChevronDown, Search } from 'lucide-react';
import {
  HERO_VIDEO_POSTER,
  HUAYOPATA_AERIAL_VIDEO,
  MEDIA_ASSETS,
  type BudgetRange,
  type HeroSearchFilters,
  type PropertyCategory,
  type ZoneId,
} from '../data/valleyData';
import { AutoPlayVideo, ORGANIC_EASE } from './RevealText';
import { UI_COPY, type LanguageCode } from '../i18n/translations';

interface HeroSectionProps {
  language: LanguageCode;
  filters: HeroSearchFilters;
  onApplyFilters: (next: HeroSearchFilters) => void;
}

export function HeroSection({ language, filters, onApplyFilters }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const copy = UI_COPY[language].hero;

  const locations: Array<{ value: 'all' | ZoneId; label: string }> = [
    { value: 'all', label: copy.allLocations },
    { value: 'Huayopata', label: 'Huayopata' },
    { value: 'Quillabamba', label: 'Quillabamba' },
    { value: 'Santa Teresa', label: 'Santa Teresa' },
    { value: 'Echarati', label: 'Echarati' },
    { value: 'Maranura', label: 'Maranura' },
  ];

  const propertyTypes: Array<{ value: 'all' | PropertyCategory; label: string }> = [
    { value: 'all', label: copy.allCategories },
    {
      value: 'Fincas & Haciendas',
      label: language === 'en' ? 'Estates & Farms' : 'Fincas y Haciendas',
    },
    {
      value: 'Villas & Residencias',
      label: language === 'en' ? 'Villas & Residences' : 'Villas y Residencias',
    },
    {
      value: 'Terrenos de Inversión',
      label: language === 'en' ? 'Investment Land' : 'Terrenos de Inversión',
    },
  ];

  const budgetRanges: Array<{ value: BudgetRange; label: string }> = [
    { value: 'all', label: copy.allBudgets },
    { value: 'under-250', label: copy.under250 },
    { value: '250-550', label: copy.mid250_550 },
    { value: 'over-550', label: copy.over550 },
  ];

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
      className="relative min-h-[680px] h-[100svh] max-h-[1000px] w-full overflow-hidden bg-[#0E2F1E] text-[#FAF8F3]"
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
          poster={HERO_VIDEO_POSTER}
          fallbackImage={MEDIA_ASSETS.huayopataAerial}
          ariaHidden
          className="w-full h-full object-cover saturate-[1.16] contrast-[1.05] brightness-[1.03]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#091F14]/88 via-[#091F14]/20 to-[#091F14]/45 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#091F14]/65 via-[#091F14]/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        style={prefersReducedMotion ? undefined : { y: contentY }}
        className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-10 pt-28 pb-10 md:pb-12 flex flex-col justify-between"
      >
        <div className="my-auto max-w-3xl">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: ORGANIC_EASE }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-[1.5px] w-8 bg-gradient-to-r from-[#E6CC8F] to-[#C8A562]" aria-hidden="true" />
            <p className="font-brand text-xs sm:text-sm font-medium tracking-[0.14em] uppercase text-[#E8CF96] drop-shadow-sm">
              {copy.eyebrow}
            </p>
          </motion.div>

          <h1 className="font-serif text-[clamp(2.35rem,4.7vw,4.1rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReducedMotion ? undefined : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.06, ease: ORGANIC_EASE }}
                className="block"
              >
                {copy.titleLine1}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReducedMotion ? undefined : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.14, ease: ORGANIC_EASE }}
                className="block text-[#F3E2BA]"
              >
                {copy.titleLine2}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease: ORGANIC_EASE }}
            className="mt-5 max-w-2xl text-base md:text-[17px] leading-relaxed text-[#FAF8F3] font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
          >
            {copy.subtitle}
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: ORGANIC_EASE }}
          aria-label={copy.searchAria}
          className="w-full rounded-2xl bg-[#FAF8F3]/98 backdrop-blur-md text-[#0E2F1E] p-3.5 md:p-4 shadow-[0_24px_64px_rgba(0,0,0,0.38)] border border-[#C8A562]/55"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
            <div className="md:col-span-3 px-3 py-1 md:border-r md:border-[#0E2F1E]/14 relative">
              <label
                htmlFor="hero-location"
                className="block text-xs font-medium text-[#8B6A2E] mb-1"
              >
                {copy.locationLabel}
              </label>
              <div className="relative flex items-center">
                <select
                  id="hero-location"
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value as 'all' | ZoneId)}
                  className="w-full appearance-none bg-transparent pr-7 text-sm font-semibold text-[#0E2F1E] focus:outline-none cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9A783A] pointer-events-none absolute right-0" />
              </div>
            </div>

            <div className="md:col-span-3 px-3 py-1 md:border-r md:border-[#0E2F1E]/14 relative">
              <label
                htmlFor="hero-category"
                className="block text-xs font-medium text-[#8B6A2E] mb-1"
              >
                {copy.categoryLabel}
              </label>
              <div className="relative flex items-center">
                <select
                  id="hero-category"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as 'all' | PropertyCategory)}
                  className="w-full appearance-none bg-transparent pr-7 text-sm font-semibold text-[#0E2F1E] focus:outline-none cursor-pointer"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9A783A] pointer-events-none absolute right-0" />
              </div>
            </div>

            <div className="md:col-span-3 px-3 py-1 relative">
              <label
                htmlFor="hero-budget"
                className="block text-xs font-medium text-[#8B6A2E] mb-1"
              >
                {copy.budgetLabel}
              </label>
              <div className="relative flex items-center">
                <select
                  id="hero-budget"
                  value={draftBudget}
                  onChange={(e) => setDraftBudget(e.target.value as BudgetRange)}
                  className="w-full appearance-none bg-transparent pr-7 text-sm font-semibold text-[#0E2F1E] focus:outline-none cursor-pointer"
                >
                  {budgetRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9A783A] pointer-events-none absolute right-0" />
              </div>
            </div>

            <div className="md:col-span-3 flex">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl terrantier-gold-gradient text-[#0E2F1E] text-sm font-semibold px-6 py-3.5 shadow-[0_6px_18px_rgba(154,120,58,0.28)] transition-all duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1E]"
              >
                <Search className="w-4 h-4 text-[#0E2F1E]" strokeWidth={2.2} />
                <span>{copy.searchBtn}</span>
              </button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
