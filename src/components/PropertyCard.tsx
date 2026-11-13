import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';
import {
  formatPropertyPrice,
  type CurrencyCode,
  type PropertyItem,
} from '../data/valleyData';
import { MediaImage, ORGANIC_EASE } from './RevealText';

interface PropertyCardProps {
  property: PropertyItem;
  currency: CurrencyCode;
  penRate: number;
  index?: number;
  onOpenModal: (property: PropertyItem) => void;
  onRequestDossier: (property: PropertyItem) => void;
}

export function PropertyCard({
  property,
  currency,
  penRate,
  index = 0,
  onOpenModal,
  onRequestDossier,
}: PropertyCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastStepTimestampRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const totalPhotos = property.images.length;
  const hasGallery = totalPhotos > 1;
  const formattedPrice = formatPropertyPrice(property.priceUsd, currency, penRate);

  const stepPhoto = (direction: 1 | -1) => {
    if (!hasGallery) return;
    const now = Date.now();
    if (now - lastStepTimestampRef.current < 180) return;
    lastStepTimestampRef.current = now;
    setActiveIndex((prev) => (prev + direction + totalPhotos) % totalPhotos);
  };

  const handleWheelOnMedia = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!hasGallery) return;
    const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (Math.abs(horizontalDelta) < 12) return;
    stepPhoto(horizontalDelta > 0 ? 1 : -1);
  };

  const primaryDimension = property.isLand
    ? `${property.hectares?.toFixed(1)} Ha`
    : `${property.areaSqm} m² · ${property.bedrooms} Hab. · ${property.bathrooms} Baños`;

  return (
    <motion.article
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay: index * 0.05, ease: ORGANIC_EASE }}
      onClick={() => onOpenModal(property)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#18241E]/10 hover:border-[#18241E]/28 transition-colors duration-300 cursor-pointer"
    >
      {/* Galería visual interactiva al hover */}
      <div
        onWheel={handleWheelOnMedia}
        className="relative aspect-[4/3] overflow-hidden bg-[#101A14]"
      >
        <div className="relative w-full h-full">
          {property.images.map((imgSrc, idx) => (
            <div
              key={`${property.id}-slide-${idx}`}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                idx === activeIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
              }`}
            >
              <MediaImage
                src={imgSrc}
                alt={`${property.title} en ${property.zone} — vista ${idx + 1}`}
                fallbackTitle={property.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25 opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Insignia de zona + contador de fotos (1/5 visible en hover) */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 border border-white/15">
            <MapPin className="w-3 h-3 text-[#E4CFAF]" />
            <span>{property.zone}</span>
          </span>

          {hasGallery && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 border border-white/15 tabular-nums">
              {activeIndex + 1}/{totalPhotos}
            </span>
          )}
        </div>

        {/* Flechas laterales ubicadas en el tercio superior-medio para no chocar con el panel inferior */}
        {hasGallery && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onMouseEnter={() => stepPhoto(-1)}
              onClick={(e) => {
                e.stopPropagation();
                stepPhoto(-1);
              }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute left-3 top-[38%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              aria-label="Foto siguiente"
              onMouseEnter={() => stepPhoto(1)}
              onClick={(e) => {
                e.stopPropagation();
                stepPhoto(1);
              }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-3 top-[38%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Panel Quick Info compacto con glassmorphism deslizable al hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] bg-black/60 backdrop-blur-md text-white border-t border-white/15 p-3.5"
        >
          {hasGallery && (
            <div className="flex items-center gap-1.5 mb-2.5">
              {property.images.map((_, idx) => (
                <button
                  key={`${property.id}-dot-${idx}`}
                  type="button"
                  aria-label={`Ir a foto ${idx + 1}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 text-[11px] text-white/90 mb-2.5">
            <span className="inline-flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E4CFAF] shrink-0" />
              <span className="truncate">{property.sunarpStatus}</span>
            </span>
            <span className="shrink-0 font-medium text-[#E4CFAF] tabular-nums">
              {property.altitude}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenModal(property)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Ver ficha</span>
            </button>
            <button
              type="button"
              onClick={() => onRequestDossier(property)}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#FAF9F6] hover:bg-white text-[#18241E] text-[11px] font-semibold px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              <span>Solicitar dossier</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Cuerpo editorial */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div>
          <div className="text-xs font-medium text-[#8C6239]">
            <span>{property.zone}</span>
            <span aria-hidden="true" className="mx-2 text-[#18241E]/25">
              ·
            </span>
            <span className="text-[#18241E]/65">{property.category}</span>
          </div>

          <h3 className="mt-2 font-serif text-xl md:text-[22px] font-normal leading-snug text-[#18241E] group-hover:text-[#2A4736] transition-colors">
            {property.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-[#18241E]/70 line-clamp-2">
            {property.summary}
          </p>
        </div>

        <div className="pt-4 border-t border-[#18241E]/10 space-y-3">
          <div className="text-xs text-[#18241E]/75 tabular-nums flex flex-wrap items-center gap-x-2">
            <span className="font-semibold text-[#18241E]">{primaryDimension}</span>
            <span aria-hidden="true" className="text-[#18241E]/25">
              ·
            </span>
            <span>{property.altitude}</span>
          </div>

          <div className="flex items-baseline justify-between gap-4 pt-1">
            <span className="font-serif text-xl md:text-2xl font-medium tabular-nums text-[#18241E]">
              {formattedPrice}
            </span>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-[#2A4736] group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
              <span>Ver detalles</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
