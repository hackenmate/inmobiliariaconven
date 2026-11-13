import { Mail, MapPin, Phone } from 'lucide-react';
import type { ZoneId } from '../data/valleyData';

interface FooterProps {
  onSelectZone: (zone: ZoneId) => void;
}

const DISTRICTS: ZoneId[] = ['Huayopata', 'Quillabamba', 'Santa Teresa', 'Echarati', 'Maranura'];

export function Footer({ onSelectZone }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#18241E] text-[#FAF9F6] pt-16 pb-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/12">
          <div className="md:col-span-4 space-y-4">
            <a
              href="#inicio"
              className="inline-block font-serif text-2xl font-medium tracking-tight text-[#FAF9F6]"
            >
              Selva Alta Realty
            </a>
            <p className="text-sm text-[#FAF9F6]/70 max-w-sm leading-relaxed">
              Corretaje inmobiliario y gestión patrimonial especializada en fincas productivas,
              reservas ecológicas y residencias en La Convención, Cusco.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-medium text-[#E4CFAF] uppercase tracking-wider">
              Navegación
            </p>
            <ul className="space-y-2.5 text-sm text-[#FAF9F6]/80">
              <li>
                <a href="#cinta-aerea" className="hover:text-white transition-colors">
                  Galería aérea
                </a>
              </li>
              <li>
                <a href="#propiedades" className="hover:text-white transition-colors">
                  Propiedades
                </a>
              </li>
              <li>
                <a href="#zonas" className="hover:text-white transition-colors">
                  Zonas del Valle
                </a>
              </li>
              <li>
                <a href="#manifiesto" className="hover:text-white transition-colors">
                  Metodología
                </a>
              </li>
              <li>
                <a href="#respaldo" className="hover:text-white transition-colors">
                  Respaldo
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">
                  Cotizar o vender
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-medium text-[#E4CFAF] uppercase tracking-wider">
              Distritos
            </p>
            <ul className="space-y-2.5 text-sm text-[#FAF9F6]/80">
              {DISTRICTS.map((zone) => (
                <li key={zone}>
                  <button
                    type="button"
                    onClick={() => onSelectZone(zone)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {zone}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-medium text-[#E4CFAF] uppercase tracking-wider">
              Oficina Regional
            </p>
            <ul className="space-y-3 text-sm text-[#FAF9F6]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E4CFAF] shrink-0 mt-0.5" />
                <span>Jr. Espinar 248, Quillabamba — La Convención, Cusco, Perú</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E4CFAF] shrink-0" />
                <a href="tel:+51984000000" className="hover:text-white transition-colors">
                  +51 984 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E4CFAF] shrink-0" />
                <a
                  href="mailto:contacto@selvaaltarealty.pe"
                  className="hover:text-white transition-colors"
                >
                  contacto@selvaaltarealty.pe
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FAF9F6]/55">
          <p>© {currentYear} Selva Alta Realty · La Convención, Cusco.</p>
          <p>Asesoría inmobiliaria sujeta a verificación registral en SUNARP.</p>
        </div>
      </div>
    </footer>
  );
}
