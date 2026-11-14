import { useEffect, useState } from 'react';
import type {
  AgentProfile,
  CurrencyCode,
  HeroSearchFilters,
  PropertyItem,
  ZoneId,
} from './data/valleyData';
import type { LanguageCode } from './i18n/translations';
import { fetchExchangeRate } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertiesSection } from './components/PropertiesSection';
import { ZonesSection } from './components/ZonesSection';
import { FilmReelGallery } from './components/FilmReelGallery';
import { ManifestoSection } from './components/ManifestoSection';
import { TeamSection } from './components/TeamSection';
import { SocialProofSection } from './components/SocialProofSection';
import { FaqSection } from './components/FaqSection';
import { LeadCaptureSection } from './components/LeadCaptureSection';
import { Footer } from './components/Footer';

const DEFAULT_FILTERS: HeroSearchFilters = {
  location: 'all',
  category: 'all',
  budget: 'all',
};

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('es');
  const [filters, setFilters] = useState<HeroSearchFilters>(DEFAULT_FILTERS);
  const [preselectedProperty, setPreselectedProperty] = useState<PropertyItem | null>(null);
  const [preselectedAgent, setPreselectedAgent] = useState<AgentProfile | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [penRate, setPenRate] = useState<number>(3.75);
  const [isLiveRate, setIsLiveRate] = useState<boolean>(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchExchangeRate()
      .then((data) => {
        if (!cancelled) {
          setPenRate(data.rate);
          setIsLiveRate(data.isLive);
        }
      })
      .catch(() => {
        // Keep referential fallback 3.75
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterByZone = (zone: ZoneId) => {
    setFilters((prev) => ({ ...prev, location: zone }));
    scrollToSection('propiedades');
  };

  const handleSelectPropertyForLead = (property: PropertyItem) => {
    setPreselectedProperty(property);
    scrollToSection('contacto');
  };

  const handleSelectAgentForLead = (agent: AgentProfile) => {
    setPreselectedAgent(agent);
    scrollToSection('contacto');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#0E2F1E] selection:bg-[#C8A562]/30 selection:text-[#0E2F1E]">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Navbar
        language={language}
        onChangeLanguage={setLanguage}
        onRequestQuote={() => scrollToSection('contacto')}
      />

      <main>
        <HeroSection language={language} filters={filters} onApplyFilters={setFilters} />

        <FilmReelGallery language={language} />

        <PropertiesSection
          language={language}
          filters={filters}
          currency={currency}
          penRate={penRate}
          isLiveRate={isLiveRate}
          onChangeCurrency={setCurrency}
          onChangeCategory={(category) => setFilters((prev) => ({ ...prev, category }))}
          onChangeZone={(location) => setFilters((prev) => ({ ...prev, location }))}
          onChangeBudget={(budget) => setFilters((prev) => ({ ...prev, budget }))}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          onSelectPropertyForLead={handleSelectPropertyForLead}
        />

        <ZonesSection language={language} onFilterByZone={handleFilterByZone} />

        <ManifestoSection language={language} />

        <TeamSection language={language} onSelectAgent={handleSelectAgentForLead} />

        <SocialProofSection language={language} />

        <FaqSection language={language} />

        <LeadCaptureSection
          language={language}
          preselectedProperty={preselectedProperty}
          preselectedAgent={preselectedAgent}
        />
      </main>

      <Footer language={language} onSelectZone={handleFilterByZone} />
    </div>
  );
}
