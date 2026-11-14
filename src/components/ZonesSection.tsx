import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  CloudSun,
  Compass,
  Droplets,
  Image as ImageIcon,
  Mountain,
  Video,
} from 'lucide-react';
import { VALLEY_ZONES, type ValleyZone, type ZoneId } from '../data/valleyData';
import { fetchZoneWeather, type WeatherData } from '../services/api';
import { AutoPlayVideo, MediaImage, ORGANIC_EASE, RevealText } from './RevealText';
import { getLocalizedZone, UI_COPY, type LanguageCode } from '../i18n/translations';
import { TerrantierGoldRule, TerrantierPatternOverlay } from './BrandLogo';

interface ZonesSectionProps {
  language: LanguageCode;
  zones?: ValleyZone[];
  onFilterByZone: (zone: ZoneId) => void;
}

export function ZonesSection({
  language,
  zones = VALLEY_ZONES,
  onFilterByZone,
}: ZonesSectionProps) {
  const [activeZoneId, setActiveZoneId] = useState<ZoneId>('Huayopata');
  const [viewStillPhoto, setViewStillPhoto] = useState(false);
  const [weatherByZone, setWeatherByZone] = useState<Partial<Record<ZoneId, WeatherData>>>({});
  const prefersReducedMotion = useReducedMotion();
  const copy = UI_COPY[language].zones;

  const localizedZones = zones.map((z) => getLocalizedZone(z, language));
  const activeZone = localizedZones.find((z) => z.id === activeZoneId) ?? localizedZones[0];
  const liveWeather = weatherByZone[activeZone.id];

  useEffect(() => {
    if (weatherByZone[activeZoneId]) return;

    let cancelled = false;
    fetchZoneWeather(activeZoneId)
      .then((data) => {
        if (!cancelled) {
          setWeatherByZone((prev) => ({ ...prev, [activeZoneId]: data }));
        }
      })
      .catch(() => {
        // Fallback already handled inside server /api/weather
      });

    return () => {
      cancelled = true;
    };
  }, [activeZoneId, weatherByZone]);

  return (
    <section
      id="zonas"
      className="relative scroll-mt-20 bg-[#0E2F1E] text-[#FAF8F3] pt-20 md:pt-28 overflow-hidden"
    >
      <TerrantierPatternOverlay opacityClass="opacity-[0.05]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2.5">
              <span
                aria-hidden="true"
                className="h-[1.5px] w-7 bg-gradient-to-r from-[#E8CF96] to-[#9A783A]"
              />
              <p className="font-brand text-xs font-medium uppercase tracking-[0.22em] text-[#E8CF96]">
                {copy.eyebrow}
              </p>
            </div>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#FAF8F3]">
                {copy.heading}
              </h2>
            </RevealText>
          </div>

          <p className="text-sm md:text-[15px] text-[#FAF8F3]/85 max-w-md leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={copy.tabsAria}
          className="flex flex-wrap items-center gap-2.5 pb-8"
        >
          {localizedZones.map((zone) => {
            const isActive = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveZoneId(zone.id);
                  setViewStillPhoto(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'terrantier-gold-gradient font-semibold text-[#0E2F1E] shadow-[0_6px_20px_-4px_rgba(232,207,150,0.45)]'
                    : 'bg-white/8 text-[#FAF8F3]/85 font-medium hover:bg-white/15 hover:text-[#FAF8F3] border border-white/15'
                }`}
              >
                <span className={`text-xs mr-2 tabular-nums ${isActive ? 'opacity-80' : 'text-[#E8CF96]/80'}`}>
                  {zone.indexLabel}
                </span>
                <span>{zone.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edge-to-edge full-width unboxed aerial video stage */}
      <div className="relative w-full h-[56vh] min-h-[440px] max-h-[680px] bg-[#0E2F1E]">
        <AnimatePresence mode="wait">
          {viewStillPhoto ? (
            <motion.div
              key={`still-${activeZone.id}`}
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: ORGANIC_EASE }}
              className="absolute inset-0"
            >
              <MediaImage
                src={activeZone.image}
                alt={`Paisaje de ${activeZone.name} en La Convención`}
                fallbackTitle={activeZone.name}
                className="w-full h-full object-cover animate-ken-burns saturate-[1.15] contrast-[1.05]"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`video-${activeZone.id}`}
              initial={prefersReducedMotion ? undefined : { opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.45, ease: ORGANIC_EASE }}
              className="absolute inset-0 overflow-hidden"
            >
              <AutoPlayVideo
                src={activeZone.video}
                poster={activeZone.poster}
                fallbackImage={activeZone.image}
                lazyMount
                ariaLabel={`Sobrevolando ${activeZone.name} en La Convención, Cusco`}
                className={`w-full h-full object-cover saturate-[1.15] contrast-[1.05] ${activeZone.videoScaleOrigin}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#091F14]/88 via-[#091F14]/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="absolute top-5 inset-x-0 z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {liveWeather ? (
            <div className="pointer-events-auto inline-flex flex-wrap items-center gap-3 rounded-full bg-[#101A14]/75 backdrop-blur-md text-[#FAF9F6] text-xs font-medium px-4 py-2 border border-white/20 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-[#E4CFAF]" />
                <span>{liveWeather.temperatureC} °C</span>
              </span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span>{liveWeather.condition}</span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span className="inline-flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#E4CFAF]" />
                <span>{liveWeather.humidity}%</span>
              </span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setViewStillPhoto((prev) => !prev)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#101A14]/75 hover:bg-[#101A14]/90 backdrop-blur-md text-[#FAF9F6] text-xs font-medium px-4 py-2 border border-white/20 transition-colors cursor-pointer"
          >
            {viewStillPhoto ? (
              <>
                <Video className="w-3.5 h-3.5" />
                <span>{copy.playAerial}</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{copy.viewPhoto}</span>
              </>
            )}
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-10 pb-10 md:pb-12 flex items-end">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-end text-[#FAF8F3]">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#FAF8F3]/85 mb-3">
                <span className="inline-flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-[#E3C992]" />
                  {activeZone.altitude}
                </span>
                <span aria-hidden="true" className="text-white/35">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#E3C992]" />
                  {activeZone.driveTime}
                </span>
                <span aria-hidden="true" className="text-white/35">
                  ·
                </span>
                <span>{activeZone.microclimate}</span>
              </div>

              <h3 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#FAF8F3]">
                {activeZone.name}
              </h3>

              <p className="mt-3 text-sm md:text-base text-[#FAF8F3]/90 max-w-2xl leading-relaxed">
                {activeZone.description}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col lg:items-end justify-end gap-4">
              <ul className="flex flex-wrap lg:justify-end gap-2">
                {activeZone.highlights.map((item) => (
                  <li
                    key={item}
                    className="text-xs font-medium text-[#FAF8F3] bg-[#091F14]/65 backdrop-blur-sm border border-[#C8A562]/45 rounded-lg px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onFilterByZone(activeZone.id)}
                className="terrantier-gold-gradient inline-flex items-center justify-center gap-2 rounded-xl hover:brightness-105 text-[#0E2F1E] text-sm font-semibold px-6 py-3.5 shadow-[0_8px_24px_-6px_rgba(232,207,150,0.45)] transition-all cursor-pointer"
              >
                <span>
                  {copy.ctaPrefix} {activeZone.name}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <TerrantierGoldRule />
    </section>
  );
}
