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
import {
  CATEGORY_LABELS,
  getLocalizedProperty,
  UI_COPY,
  type LanguageCode,
} from '../i18n/translations';

interface PropertiesSectionProps {
  language: LanguageCode;
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

const ZONE_FILTERS: Array<'all' | ZoneId> = [
  'all',
  'Huayopata',
  'Quillabamba',
  'Santa Teresa',
  'Echarati',
  'Maranura',
];

export function PropertiesSection({
  language,
  filters,
  currency,
  penRate,
  isLiveRate: _isLiveRate,
  onChangeCurrency,
  onChangeCategory,
  onChangeZone,
  onChangeBudget,
  onResetFilters,
  onSelectPropertyForLead,
}: PropertiesSectionProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const copy = UI_COPY[language].properties;

  const tabs: Array<{ id: 'all' | PropertyCategory; label: string }> = [
    { id: 'all', label: copy.allTabs },
    { id: 'Fincas & Haciendas', label: CATEGORY_LABELS[language]['Fincas & Haciendas'] },
    { id: 'Villas & Residencias', label: CATEGORY_LABELS[language]['Villas & Residencias'] },
    { id: 'Terrenos de Inversión', label: CATEGORY_LABELS[language]['Terrenos de Inversión'] },
  ];

  const budgetOptions: Array<{ value: BudgetRange; label: string }> = [
    { value: 'all', label: copy.budgetAll },
    { value: 'under-250', label: copy.budgetUnder250 },
    { value: '250-550', label: copy.budgetMid },
    { value: 'over-550', label: copy.budgetOver550 },
  ];

  const filteredProperties = PROPERTIES.filter((prop) => {
    if (filters.location !== 'all' && prop.zone !== filters.location) return false;
    if (filters.category !== 'all' && prop.category !== filters.category) return false;
    if (filters.budget === 'under-250' && prop.priceUsd > 250000) return false;
    if (filters.budget === '250-550' && (prop.priceUsd < 250000 || prop.priceUsd > 550000)) {
      return false;
    }
    if (filters.budget === 'over-550' && prop.priceUsd < 550000) return false;
    return true;
  })
    .slice(0, 6)
    .map((p) => getLocalizedProperty(p, language));

  const selectedProperty =
    PROPERTIES.map((p) => getLocalizedProperty(p, language)).find(
      (p) => p.id === selectedPropertyId,
    ) ?? null;

  const hasExtraFilters =
    filters.location !== 'all' || filters.category !== 'all' || filters.budget !== 'all';

  return (
    <section
      id="propiedades"
      className="scroll-mt-20 bg-[#FAF8F3] text-[#0E2F1E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9A783A] mb-2">
              {copy.eyebrow}
            </p>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
                {copy.heading}
              </h2>
            </RevealText>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F3EFE6] border border-[#0E2F1E]/10 self-start">
              <button
                type="button"
                onClick={() => onChangeCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-[#0E2F1E] shadow-sm'
                    : 'text-[#2D3332]/70 hover:text-[#0E2F1E]'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => onChangeCurrency('PEN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currency === 'PEN'
                    ? 'bg-white text-[#0E2F1E] shadow-sm'
                    : 'text-[#2D3332]/70 hover:text-[#0E2F1E]'
                }`}
              >
                PEN (S/)
              </button>
              <span className="px-2.5 text-[11px] text-[#2D3332]/65 tabular-nums whitespace-nowrap">
                {language === 'en' ? 'FX' : 'T.C.'} S/ {penRate.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-8 mb-10 border-b border-[#0E2F1E]/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label={language === 'en' ? 'Filter by property type' : 'Filtrar por tipo de propiedad'}
              className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F3EFE6]"
            >
              {tabs.map((tab) => {
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
                        ? 'bg-white text-[#0E2F1E] shadow-sm'
                        : 'text-[#2D3332]/75 hover:text-[#0E2F1E]'
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
                  aria-label={copy.budgetFilterAria}
                  value={filters.budget}
                  onChange={(e) => onChangeBudget(e.target.value as BudgetRange)}
                  className="appearance-none rounded-lg border border-[#0E2F1E]/15 bg-white pl-3.5 pr-8 py-2 text-xs font-medium text-[#0E2F1E] focus:border-[#0E2F1E] focus:outline-none cursor-pointer"
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0E2F1E]/55 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {hasExtraFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#9A783A] hover:text-[#0E2F1E] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{copy.clearFilters}</span>
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
                        ? 'bg-[#0E2F1E] text-[#FAF8F3] border-[#0E2F1E]'
                        : 'bg-white text-[#2D3332]/80 border-[#0E2F1E]/12 hover:border-[#0E2F1E]/35'
                    }`}
                  >
                    {zone === 'all' ? copy.allZones : zone}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-[#2D3332]/65 tabular-nums">
              {filteredProperties.length}{' '}
              {filteredProperties.length === 1 ? copy.foundSingular : copy.foundPlural}
            </span>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-[#F3EFE6] p-12 text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl font-normal text-[#0E2F1E]">
              {copy.emptyHeading}
            </h3>
            <p className="mt-2.5 text-sm text-[#2D3332]/75 leading-relaxed">
              {copy.emptyBody}
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0E2F1E] text-[#FAF8F3] text-sm font-medium px-6 py-3 hover:bg-[#1B4730] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{copy.viewAll}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filteredProperties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                language={language}
                property={property}
                currency={currency}
                penRate={penRate}
                index={idx}
                onOpenModal={(p) => setSelectedPropertyId(p.id)}
                onRequestDossier={onSelectPropertyForLead}
              />
            ))}
          </div>
        )}

        {/* Mapa interactivo de La Convención abajo del portafolio */}
        <div className="mt-12">
          <LaConvencionMap
            language={language}
            properties={filteredProperties}
            activeZone={filters.location}
            currency={currency}
            penRate={penRate}
            onChangeZone={onChangeZone}
            onOpenProperty={(p) => setSelectedPropertyId(p.id)}
            onRequestDossier={onSelectPropertyForLead}
          />
        </div>
      </div>

      <PropertyModal
        language={language}
        property={selectedProperty}
        currency={currency}
        penRate={penRate}
        onClose={() => setSelectedPropertyId(null)}
        onInquire={(prop) => {
          setSelectedPropertyId(null);
          onSelectPropertyForLead(prop);
        }}
      />
    </section>
  );
}
