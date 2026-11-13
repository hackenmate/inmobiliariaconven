import { useEffect, useState } from 'react';
import type { CurrencyCode, HeroSearchFilters, PropertyItem, ZoneId } from './data/valleyData';
import { fetchExchangeRate } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertiesSection } from './components/PropertiesSection';
import { ZonesSection } from './components/ZonesSection';
import { FilmReelGallery } from './components/FilmReelGallery';
import { ManifestoSection } from './components/ManifestoSection';
import { SocialProofSection } from './components/SocialProofSection';
import { LeadCaptureSection } from './components/LeadCaptureSection';
import { Footer } from './components/Footer';

const DEFAULT_FILTERS: HeroSearchFilters = {
  location: 'all',
  category: 'all',
  budget: 'all',
};

export default function App() {
  const [filters, setFilters] = useState<HeroSearchFilters>(DEFAULT_FILTERS);
  const [preselectedProperty, setPreselectedProperty] = useState<PropertyItem | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [penRate, setPenRate] = useState<number>(3.75);
  const [isLiveRate, setIsLiveRate] = useState<boolean>(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#18241E] selection:bg-[#2A4736] selection:text-[#FAF9F6]">
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
      <Navbar onRequestQuote={() => scrollToSection('contacto')} />

      <main>
        <HeroSection filters={filters} onApplyFilters={setFilters} />

        <FilmReelGallery />

        <PropertiesSection
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

        <ZonesSection onFilterByZone={handleFilterByZone} />

        <ManifestoSection />

        <SocialProofSection />

        <LeadCaptureSection preselectedProperty={preselectedProperty} />
      </main>

      <Footer onSelectZone={handleFilterByZone} />
    </div>
  );
}
