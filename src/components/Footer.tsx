import { Mail, MapPin, Phone } from 'lucide-react';
import { AGENTS, type ZoneId } from '../data/valleyData';
import { UI_COPY, type LanguageCode } from '../i18n/translations';
import { TerrantierGoldRule, TerrantierLogo, TerrantierPatternOverlay } from './BrandLogo';

interface FooterProps {
  language: LanguageCode;
  onSelectZone: (zone: ZoneId) => void;
}

const DISTRICTS: ZoneId[] = ['Huayopata', 'Quillabamba', 'Santa Teresa', 'Echarati', 'Maranura'];

export function Footer({ language, onSelectZone }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copy = UI_COPY[language].footer;

  return (
    <footer className="relative overflow-hidden bg-[#0E2F1E] text-[#FAF8F3]">
      <TerrantierGoldRule />
      <TerrantierPatternOverlay opacityClass="opacity-[0.04]" />

      <div className="relative z-10 max-w-7xl mx-auto pt-16 pb-12 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C8A562]/20">
          <div className="md:col-span-4 space-y-5">
            <a
              href="#inicio"
              aria-label="Terrantier Inmobiliaria"
              className="inline-block"
            >
              <TerrantierLogo variant="stacked" theme="dark" />
            </a>
            <p className="text-sm text-[#FAF8F3]/75 max-w-sm leading-relaxed">
              {copy.tagline}
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-brand text-xs font-medium text-[#E3C992] uppercase tracking-[0.18em]">
              {copy.navTitle}
            </p>
            <ul className="space-y-2.5 text-sm text-[#FAF8F3]/80">
              <li>
                <a href="#cinta-aerea" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.gallery}
                </a>
              </li>
              <li>
                <a href="#propiedades" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.properties}
                </a>
              </li>
              <li>
                <a href="#zonas" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.zones}
                </a>
              </li>
              <li>
                <a href="#manifiesto" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.manifesto}
                </a>
              </li>
              <li>
                <a href="#equipo" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.team}
                </a>
              </li>
              <li>
                <a href="#respaldo" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.socialProof}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.faq}
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-[#E3C992] transition-colors">
                  {copy.links.contact}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-brand text-xs font-medium text-[#E3C992] uppercase tracking-[0.18em]">
              {copy.districtsTitle}
            </p>
            <ul className="space-y-2.5 text-sm text-[#FAF8F3]/80">
              {DISTRICTS.map((zone) => (
                <li key={zone}>
                  <button
                    type="button"
                    onClick={() => onSelectZone(zone)}
                    className="hover:text-[#E3C992] transition-colors text-left cursor-pointer"
                  >
                    {zone}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="font-brand text-xs font-medium text-[#E3C992] uppercase tracking-[0.18em]">
              {copy.officeTitle}
            </p>
            <ul className="space-y-3 text-sm text-[#FAF8F3]/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A562] shrink-0 mt-0.5" />
                <span>{copy.address}</span>
              </li>
              {AGENTS.map((agent) => (
                <li key={agent.id} className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C8A562] shrink-0" />
                  <a
                    href={`tel:${agent.phoneHref}`}
                    className="hover:text-[#E3C992] transition-colors tabular-nums"
                  >
                    {agent.name}: {agent.phoneDisplay}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A562] shrink-0" />
                <a
                  href="mailto:contacto@terrantier.pe"
                  className="hover:text-[#E3C992] transition-colors"
                >
                  contacto@terrantier.pe
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FAF8F3]/60">
          <p>{copy.copyright(currentYear)}</p>
          <p>{copy.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
