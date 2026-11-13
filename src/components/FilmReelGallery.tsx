import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { HUAYOPATA_REEL_PHOTOS, type FilmReelPhoto } from '../data/valleyData';
import { RevealText } from './RevealText';

interface FilmReelGalleryProps {
  photos?: FilmReelPhoto[];
}

export function FilmReelGallery({ photos = HUAYOPATA_REEL_PHOTOS }: FilmReelGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<FilmReelPhoto | null>(null);

  useEffect(() => {
    if (!selectedPhoto) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  return (
    <section
      id="cinta-aerea"
      aria-label="Galería fotográfica en cinta continua de Huayopata"
      className="scroll-mt-20 bg-[#FAF9F6] text-[#18241E] py-16 md:py-22 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#2A4736] mb-2">
            Archivo aéreo real · Huayopata
          </p>
          <RevealText>
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-normal leading-[1.12] tracking-tight text-[#18241E]">
              Recorrido continuo por el territorio
            </h2>
          </RevealText>
        </div>

        <p className="text-sm text-[#18241E]/65 max-w-md leading-relaxed">
          Pasa el cursor sobre cualquier fotograma para pausar la cinta o haz clic para inspeccionar
          la toma aérea en pantalla completa.
        </p>
      </div>

      {/* Cinta de película continua (overflow-hidden + pista duplicada sin saltos) */}
      <div className="w-full overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] will-change-transform">
          {[0, 1].map((loopIndex) => (
            <div
              key={`reel-track-${loopIndex}`}
              aria-hidden={loopIndex === 1}
              className="flex flex-shrink-0 items-center gap-6 md:gap-8 pr-6 md:pr-8"
            >
              {photos.map((photo) => (
                <figure
                  key={`reel-${loopIndex}-${photo.id}`}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative flex-shrink-0 h-[320px] sm:h-[390px] md:h-[450px] w-[85vw] sm:w-[560px] md:w-[700px] rounded-2xl overflow-hidden bg-[#101A14] cursor-pointer"
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white pointer-events-none">
                    <p className="text-xs font-medium text-[#E4CFAF] mb-1">{photo.caption}</p>
                    <p className="font-serif text-xl md:text-2xl font-normal tracking-tight">
                      {photo.title}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox inmersivo a pantalla completa */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Cerrar imagen ampliada"
            className="absolute top-5 right-5 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={selectedPhoto.src}
            alt={selectedPhoto.title}
            onClick={(e) => e.stopPropagation()}
            className="object-contain max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-center text-white max-w-[90vw]"
          >
            <p className="font-serif text-base md:text-lg font-normal leading-snug">
              {selectedPhoto.title}
            </p>
            <p className="text-xs text-white/65 mt-0.5">{selectedPhoto.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
