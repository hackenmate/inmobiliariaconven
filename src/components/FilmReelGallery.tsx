import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { HUAYOPATA_REEL_PHOTOS, type FilmReelPhoto } from '../data/valleyData';
import { getLocalizedReelPhoto, UI_COPY, type LanguageCode } from '../i18n/translations';
import { preloadImageUrl } from '../services/visualCatalog';
import { TerrantierGoldRule } from './BrandLogo';
import { RevealText } from './RevealText';

interface FilmReelGalleryProps {
  language: LanguageCode;
  photos?: FilmReelPhoto[];
}

export function FilmReelGallery({
  language,
  photos = HUAYOPATA_REEL_PHOTOS,
}: FilmReelGalleryProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const copy = UI_COPY[language].reel;
  const localizedPhotos = photos.map((p) => getLocalizedReelPhoto(p, language));
  const selectedPhoto =
    localizedPhotos.find((p) => p.id === selectedPhotoId) ?? null;

  useEffect(() => {
    if (!selectedPhotoId) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhotoId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhotoId]);

  return (
    <section
      id="cinta-aerea"
      aria-label={copy.ariaLabel}
      className="scroll-mt-20 relative bg-[#F3EFE6] text-[#0E2F1E] pt-0 pb-18 md:pb-24 overflow-hidden"
    >
      <TerrantierGoldRule />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-18 mb-9 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="h-px w-6 bg-[#9A783A]" aria-hidden="true" />
            <p className="font-brand text-xs font-medium tracking-[0.16em] uppercase text-[#8B6A2E]">
              {copy.eyebrow}
            </p>
          </div>
          <RevealText>
            <h2 className="font-serif text-[clamp(1.95rem,3.5vw,2.9rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
              {copy.heading}
            </h2>
          </RevealText>
        </div>
      </div>

      {/* Cinta de película continua */}
      <div className="w-full overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] will-change-transform">
          {[0, 1].map((loopIndex) => (
            <div
              key={`reel-track-${loopIndex}`}
              aria-hidden={loopIndex === 1}
              className="flex flex-shrink-0 items-center gap-6 md:gap-8 pr-6 md:pr-8"
            >
              {localizedPhotos.map((photo, idx) => (
                <figure
                  key={`reel-${loopIndex}-${photo.id}`}
                  onMouseEnter={() => preloadImageUrl(photo.src)}
                  onClick={() => setSelectedPhotoId(photo.id)}
                  className="group relative flex-shrink-0 h-[320px] sm:h-[390px] md:h-[450px] w-[85vw] sm:w-[560px] md:w-[700px] rounded-2xl overflow-hidden bg-[#0E2F1E] border border-[#C8A562]/30 shadow-[0_14px_34px_rgba(14,47,30,0.14)] cursor-pointer"
                >
                  <img
                    src={photo.thumb ?? photo.src}
                    alt={photo.title}
                    loading={loopIndex === 0 && idx < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover saturate-[1.15] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#091F14]/85 via-[#091F14]/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white pointer-events-none">
                    <p className="text-xs font-medium text-[#E8CF96] mb-1">{photo.caption}</p>
                    <p className="font-serif text-xl md:text-2xl font-normal tracking-tight text-white">
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
          onClick={() => setSelectedPhotoId(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedPhotoId(null)}
            aria-label={copy.closeLightbox}
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
