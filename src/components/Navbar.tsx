import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { UI_COPY, type LanguageCode } from '../i18n/translations';
import { TerrantierLogo } from './BrandLogo';

interface NavbarProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onRequestQuote: () => void;
}

export function Navbar({ language, onChangeLanguage, onRequestQuote }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const copy = UI_COPY[language].nav;

  const navLinks = [
    { label: copy.gallery, href: '#cinta-aerea' },
    { label: copy.properties, href: '#propiedades' },
    { label: copy.zones, href: '#zonas' },
    { label: copy.team, href: '#equipo' },
    { label: copy.faq, href: '#faq' },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? 'bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#0E2F1E]/10 text-[#0E2F1E] py-3 shadow-[0_4px_24px_rgba(14,47,30,0.06)]'
          : 'bg-gradient-to-b from-[#0E2F1E]/85 via-[#0E2F1E]/40 to-transparent text-[#FAF8F3] py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between gap-4 lg:gap-8">
        <a
          href="#inicio"
          aria-label="Terrantier Inmobiliaria"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A562]"
        >
          <TerrantierLogo variant="horizontal" theme={scrolled ? 'light' : 'dark'} />
        </a>

        <nav
          aria-label={language === 'en' ? 'Main navigation' : 'Navegación principal'}
          className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap shrink-0 py-1 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A562] ${
                scrolled
                  ? 'text-[#2D3332]/85 hover:text-[#0E2F1E] after:bg-[#C8A562]'
                  : 'text-[#FAF8F3]/90 hover:text-white after:bg-[#E3C992]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Selector de idioma ES / EN */}
          <div
            role="group"
            aria-label={copy.langSwitchAria}
            className={`inline-flex items-center rounded-full p-0.5 border text-xs font-medium transition-colors ${
              scrolled
                ? 'bg-[#F3EFE6] border-[#0E2F1E]/12 text-[#0E2F1E]'
                : 'bg-[#0E2F1E]/60 backdrop-blur-md border-[#C8A562]/30 text-[#FAF8F3]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 ml-2 mr-1 opacity-75 hidden sm:block" />
            {(['es', 'en'] as const).map((code) => {
              const active = language === code;
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeLanguage(code)}
                  className={`px-2.5 py-1 rounded-full uppercase tracking-wide transition-all cursor-pointer ${
                    active
                      ? scrolled
                        ? 'bg-[#0E2F1E] text-[#FAF8F3] shadow-xs'
                        : 'bg-[#C8A562] text-[#0E2F1E] font-semibold shadow-xs'
                      : scrolled
                        ? 'text-[#2D3332]/70 hover:text-[#0E2F1E]'
                        : 'text-[#FAF8F3]/80 hover:text-white'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onRequestQuote}
            className={`hidden sm:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A562] ${
              scrolled
                ? 'bg-[#0E2F1E] text-[#FAF8F3] font-medium hover:bg-[#1B4730] shadow-xs'
                : 'terrantier-gold-gradient text-[#0E2F1E] font-semibold hover:brightness-105 shadow-[0_6px_18px_-4px_rgba(232,207,150,0.45)]'
            }`}
          >
            {copy.cta}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={mobileOpen}
            className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors cursor-pointer ${
              scrolled ? 'text-[#0E2F1E] hover:bg-[#0E2F1E]/8' : 'text-[#FAF8F3] hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#FAF8F3] text-[#0E2F1E] border-t border-[#0E2F1E]/10 px-6 py-6 shadow-xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium py-3 border-b border-[#0E2F1E]/8 text-[#0E2F1E]"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onRequestQuote();
              }}
              className="mt-5 w-full rounded-full bg-[#0E2F1E] text-[#FAF8F3] px-5 py-3.5 text-sm font-medium cursor-pointer"
            >
              {copy.cta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
