import { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import {
  PROPERTIES,
  type BudgetRange,
  type CurrencyCode,
  type HeroSearchFilters,
  type PropertyCategory,
  type PropertyItem,
  type ZoneId,
} from '../data/valleyData';
import { RevealText } from './RevealText';
import { PropertyCard } from './PropertyCard';
import { PropertyModal } from './PropertyModal';
import { LaConvencionMap } from './LaConvencionMap';

interface PropertiesSectionProps {
  filters: HeroSearchFilters;
  currency: CurrencyCode;
  penRate: number;
  isLiveRate: boolean;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onChangeCategory: (category: 'all' | PropertyCategory) => void;
  onChangeZone: (zone: 'all' | ZoneId) => void;
  onChangeBudget: (budget: BudgetRange) => void;
  onResetFilters: () => void;
  onSelectPropertyForLead: (property: PropertyItem) => void;
}

const TABS: Array<{ id: 'all' | PropertyCategory; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'Fincas & Haciendas', label: 'Fincas y Haciendas' },
  { id: 'Villas & Residencias', label: 'Villas y Residencias' },
  { id: 'Terrenos de Inversión', label: 'Terrenos de Inversión' },
];

const ZONE_FILTERS: Array<'all' | ZoneId> = [
  'all',
  'Huayopata',
  'Quillabamba',
  'Santa Teresa',
  'Echarati',
  'Maranura',
];

const BUDGET_OPTIONS: Array<{ value: BudgetRange; label: string }> = [
  { value: 'all', label: 'Todo presupuesto' },
  { value: 'under-250', label: 'Hasta US$ 250k' },
  { value: '250-550', label: 'US$ 250k – 550k' },
  { value: 'over-550', label: 'Desde US$ 550k' },
];

export function PropertiesSection({
  filters,
  currency,
  penRate,
  isLiveRate,
  onChangeCurrency,
  onChangeCategory,
  onChangeZone,
  onChangeBudget,
  onResetFilters,
  onSelectPropertyForLead,
}: PropertiesSectionProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);

  const filteredProperties = PROPERTIES.filter((prop) => {
    if (filters.location !== 'all' && prop.zone !== filters.location) return false;
    if (filters.category !== 'all' && prop.category !== filters.category) return false;
    if (filters.budget === 'under-250' && prop.priceUsd > 250000) return false;
    if (filters.budget === '250-550' && (prop.priceUsd < 250000 || prop.priceUsd > 550000)) {
      return false;
    }
    if (filters.budget === 'over-550' && prop.priceUsd < 550000) return false;
    return true;
  }).slice(0, 6);

  const hasExtraFilters =
    filters.location !== 'all' || filters.category !== 'all' || filters.budget !== 'all';

  return (
    <section
      id="propiedades"
      className="scroll-mt-20 bg-[#FAF9F6] text-[#18241E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#2A4736] mb-2">
              Portafolio seleccionado
            </p>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#18241E]">
                Propiedades disponibles con verificación registral
              </h2>
            </RevealText>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F1EFEA] border border-[#18241E]/10 self-start">
              <button
                type="button"
                onClick={() => onChangeCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-[#18241E] shadow-sm'
                    : 'text-[#18241E]/65 hover:text-[#18241E]'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => onChangeCurrency('PEN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currency === 'PEN'
                    ? 'bg-white text-[#18241E] shadow-sm'
                    : 'text-[#18241E]/65 hover:text-[#18241E]'
                }`}
              >
                PEN (S/)
              </button>
              <span className="px-2.5 text-[11px] text-[#18241E]/60 tabular-nums whitespace-nowrap">
                T.C. S/ {penRate.toFixed(2)} {isLiveRate ? '· en vivo' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-8 mb-10 border-b border-[#18241E]/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filtrar por tipo de propiedad"
              className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F1EFEA]"
            >
              {TABS.map((tab) => {
                const isActive = filters.category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onChangeCategory(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#18241E] shadow-sm'
                        : 'text-[#18241E]/70 hover:text-[#18241E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  aria-label="Filtrar por presupuesto"
                  value={filters.budget}
                  onChange={(e) => onChangeBudget(e.target.value as BudgetRange)}
                  className="appearance-none rounded-lg border border-[#18241E]/15 bg-white pl-3.5 pr-8 py-2 text-xs font-medium text-[#18241E] focus:border-[#2A4736] focus:outline-none cursor-pointer"
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#18241E]/55 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {hasExtraFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8C6239] hover:text-[#18241E] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {ZONE_FILTERS.map((zone) => {
                const active = filters.location === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => onChangeZone(zone)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#18241E] text-[#FAF9F6] border-[#18241E]'
                        : 'bg-white text-[#18241E]/75 border-[#18241E]/12 hover:border-[#18241E]/35'
                    }`}
                  >
                    {zone === 'all' ? 'Todas las zonas' : zone}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-[#18241E]/55 tabular-nums">
              {filteredProperties.length}{' '}
              {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </span>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-[#F1EFEA] p-12 text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl font-normal text-[#18241E]">
              No hay coincidencias exactas para esa combinación
            </h3>
            <p className="mt-2.5 text-sm text-[#18241E]/70 leading-relaxed">
              Contamos con propiedades privadas fuera de catálogo en La Convención. Puedes
              restablecer los filtros o indicarnos tus criterios en el formulario de asesoría.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18241E] text-[#FAF9F6] text-sm font-medium px-6 py-3 hover:bg-[#2A4736] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ver todas las propiedades</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filteredProperties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                currency={currency}
                penRate={penRate}
                index={idx}
                onOpenModal={setSelectedProperty}
                onRequestDossier={onSelectPropertyForLead}
              />
            ))}
          </div>
        )}

        {/* Mapa interactivo de La Convención abajo del portafolio */}
        <div className="mt-12">
          <LaConvencionMap
            properties={filteredProperties}
            activeZone={filters.location}
            currency={currency}
            penRate={penRate}
            onChangeZone={onChangeZone}
            onOpenProperty={setSelectedProperty}
            onRequestDossier={onSelectPropertyForLead}
          />
        </div>
      </div>

      <PropertyModal
        property={selectedProperty}
        currency={currency}
        penRate={penRate}
        onClose={() => setSelectedProperty(null)}
        onInquire={(prop) => {
          setSelectedProperty(null);
          onSelectPropertyForLead(prop);
        }}
      />
    </section>
  );
}
