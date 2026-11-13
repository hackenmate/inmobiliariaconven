import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onRequestQuote: () => void;
}

const NAV_LINKS = [
  { label: 'Galería', href: '#cinta-aerea' },
  { label: 'Propiedades', href: '#propiedades' },
  { label: 'Zonas del Valle', href: '#zonas' },
  { label: 'Metodología', href: '#manifiesto' },
  { label: 'Respaldo', href: '#respaldo' },
];

export function Navbar({ onRequestQuote }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#18241E]/10 text-[#18241E] py-3.5 shadow-[0_4px_24px_rgba(24,36,30,0.05)]'
          : 'bg-gradient-to-b from-[#101A14]/70 to-transparent text-[#FAF9F6] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between gap-8">
        <a
          href="#inicio"
          className="font-serif text-xl md:text-2xl font-medium tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A4736]"
        >
          Selva Alta Realty
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative whitespace-nowrap shrink-0 py-1 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A4736] ${
                scrolled
                  ? 'text-[#18241E]/80 hover:text-[#18241E] after:bg-[#2A4736]'
                  : 'text-[#FAF9F6]/90 hover:text-white after:bg-[#FAF9F6]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRequestQuote}
            className={`hidden sm:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4736] ${
              scrolled
                ? 'bg-[#18241E] text-[#FAF9F6] hover:bg-[#2A4736]'
                : 'bg-[#FAF9F6] text-[#18241E] hover:bg-[#F1EFEA]'
            }`}
          >
            Cotizar Propiedad
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors cursor-pointer ${
              scrolled ? 'text-[#18241E] hover:bg-[#18241E]/8' : 'text-[#FAF9F6] hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#FAF9F6] text-[#18241E] border-t border-[#18241E]/10 px-6 py-6 shadow-xl">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium py-3 border-b border-[#18241E]/8 text-[#18241E]"
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
              className="mt-5 w-full rounded-full bg-[#18241E] text-[#FAF9F6] px-5 py-3.5 text-sm font-medium cursor-pointer"
            >
              Cotizar Propiedad
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
