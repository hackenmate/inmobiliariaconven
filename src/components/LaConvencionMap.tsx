/// <reference types="google.maps" />
import { useCallback, useEffect, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ArrowUpRight, Layers, MapPin, Mountain, ShieldCheck } from 'lucide-react';
import {
  formatPropertyPrice,
  VALLEY_ZONES,
  type CurrencyCode,
  type PropertyItem,
  type ZoneId,
} from '../data/valleyData';
import { UI_COPY, type LanguageCode } from '../i18n/translations';

interface LaConvencionMapProps {
  language: LanguageCode;
  properties: PropertyItem[];
  activeZone: 'all' | ZoneId;
  currency: CurrencyCode;
  penRate: number;
  onChangeZone: (zone: 'all' | ZoneId) => void;
  onOpenProperty: (property: PropertyItem) => void;
  onRequestDossier: (property: PropertyItem) => void;
}

type MapLayerMode = 'terrain' | 'hybrid' | 'roadmap';

const LA_CONVENCION_CENTER = { lat: -12.945, lng: -72.618 };

function formatShortPrice(priceUsd: number, currency: CurrencyCode, penRate: number): string {
  if (currency === 'PEN') {
    const penAmount = priceUsd * penRate;
    if (penAmount >= 1_000_000) {
      return `S/ ${(penAmount / 1_000_000).toFixed(2)}M`;
    }
    return `S/ ${Math.round(penAmount / 1000)}k`;
  }
  if (priceUsd >= 1_000_000) {
    return `US$ ${(priceUsd / 1_000_000).toFixed(2)}M`;
  }
  return `US$ ${Math.round(priceUsd / 1000)}k`;
}

function MapViewportController({
  activeZone,
  properties,
}: {
  activeZone: 'all' | ZoneId;
  properties: PropertyItem[];
}) {
  const map = useMap();
  const coreLib = useMapsLibrary('core');

  useEffect(() => {
    if (!map || !coreLib) return;

    if (activeZone !== 'all') {
      const zoneInfo = VALLEY_ZONES.find((z) => z.id === activeZone);
      if (properties.length === 1) {
        map.panTo(properties[0].coordinates);
        map.setZoom(13);
        return;
      }
      if (properties.length > 1) {
        const bounds = new coreLib.LatLngBounds();
        properties.forEach((p) => bounds.extend(p.coordinates));
        map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
        return;
      }
      if (zoneInfo) {
        map.panTo(zoneInfo.coordinates);
        map.setZoom(12);
      }
      return;
    }

    if (properties.length > 1) {
      const bounds = new coreLib.LatLngBounds();
      properties.forEach((p) => bounds.extend(p.coordinates));
      map.fitBounds(bounds, { top: 56, right: 56, bottom: 56, left: 56 });
    } else if (properties.length === 1) {
      map.panTo(properties[0].coordinates);
      map.setZoom(13);
    } else {
      map.panTo(LA_CONVENCION_CENTER);
      map.setZoom(10);
    }
  }, [map, coreLib, activeZone, properties]);

  return null;
}

function PropertyMarkerItem({
  language,
  property,
  isSelected,
  isHovered,
  zIndex,
  currency,
  penRate,
  onSelect,
  onHover,
  onClose,
  onOpenProperty,
  onRequestDossier,
}: {
  language: LanguageCode;
  property: PropertyItem;
  isSelected: boolean;
  isHovered: boolean;
  zIndex: number;
  currency: CurrencyCode;
  penRate: number;
  onSelect: (property: PropertyItem) => void;
  onHover: (id: string | null) => void;
  onClose: () => void;
  onOpenProperty: (property: PropertyItem) => void;
  onRequestDossier: (property: PropertyItem) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const shortLabel = formatShortPrice(property.priceUsd, currency, penRate);
  const fullPrice = formatPropertyPrice(property.priceUsd, currency, penRate);
  const copy = UI_COPY[language].map;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={property.coordinates}
        zIndex={zIndex}
        title={property.title}
        onClick={() => onSelect(property)}
        onMouseEnter={() => onHover(property.id)}
        onMouseLeave={() => onHover(null)}
      >
        <div
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all duration-200 cursor-pointer border ${
            isSelected
              ? 'bg-[#0E2F1E] text-[#FAF8F3] border-[#C8A562] scale-110 ring-2 ring-[#0E2F1E]/30'
              : isHovered
                ? 'bg-[#0E2F1E] text-white border-[#C8A562]/50 scale-105'
                : 'bg-white text-[#0E2F1E] border-[#0E2F1E]/20 hover:bg-[#0E2F1E] hover:text-white'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSelected ? 'bg-[#E3C992]' : 'bg-[#1B4730]'
            }`}
          />
          <span className="tabular-nums whitespace-nowrap">{shortLabel}</span>
        </div>
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={270}
          onCloseClick={onClose}
        >
          <div className="w-[235px] sm:w-[250px] text-[#0E2F1E] font-sans">
            <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5 bg-[#F3EFE6]">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0E2F1E]/85 text-white text-[10px] font-medium">
                {property.zone}
              </span>
            </div>

            <h4 className="font-serif text-base font-medium leading-snug text-[#0E2F1E]">
              {property.title}
            </h4>

            <div className="mt-1.5 flex items-center justify-between text-xs text-[#2D3332]/75">
              <span>
                {property.isLand ? `${property.hectares?.toFixed(1)} Ha` : `${property.areaSqm} m²`}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mountain className="w-3 h-3 text-[#9A783A]" />
                {property.altitude}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-[#0E2F1E]/10 flex items-center justify-between">
              <span className="font-serif text-lg font-medium text-[#0E2F1E] tabular-nums">
                {fullPrice}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#1B4730] font-medium">
                <ShieldCheck className="w-3 h-3 text-[#9A783A]" />
                SUNARP
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenProperty(property)}
                className="flex-1 rounded-lg border border-[#0E2F1E]/20 px-2.5 py-1.5 text-xs font-medium text-[#0E2F1E] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
              >
                {copy.viewSheet}
              </button>
              <button
                type="button"
                onClick={() => onRequestDossier(property)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#0E2F1E] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#1B4730] transition-colors cursor-pointer"
              >
                <span>{copy.dossier}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function LaConvencionMapCanvas({
  language,
  properties,
  activeZone,
  currency,
  penRate,
  mapType,
  onOpenProperty,
  onRequestDossier,
}: {
  language: LanguageCode;
  properties: PropertyItem[];
  activeZone: 'all' | ZoneId;
  currency: CurrencyCode;
  penRate: number;
  mapType: MapLayerMode;
  onOpenProperty: (property: PropertyItem) => void;
  onRequestDossier: (property: PropertyItem) => void;
}) {
  const status = useApiLoadingStatus();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const copy = UI_COPY[language].map;

  useEffect(() => {
    if (selectedId && !properties.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [properties, selectedId]);

  const handleSelect = useCallback((property: PropertyItem) => {
    setSelectedId((prev) => (prev === property.id ? null : property.id));
  }, []);

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="h-[380px] sm:h-[430px] md:h-[460px] w-full flex flex-col items-center justify-center bg-[#F1EFEA] px-6 text-center">
        <MapPin className="w-7 h-7 text-[#2A4736] mb-3" />
        <h3 className="font-serif text-xl text-[#18241E]">
          {copy.failedTitle}
        </h3>
        <p className="mt-1.5 text-sm text-[#18241E]/70 max-w-md">
          {copy.failedBody}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[380px] sm:h-[430px] md:h-[460px] w-full">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={LA_CONVENCION_CENTER}
        defaultZoom={10}
        mapTypeId={mapType}
        gestureHandling="cooperative"
        clickableIcons={false}
        disableDefaultUI
        zoomControl
        onClick={() => setSelectedId(null)}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <MapViewportController activeZone={activeZone} properties={properties} />

        {properties.map((property, index) => {
          const isSelected = selectedId === property.id;
          const isHovered = hoveredId === property.id;
          const zIndex = isSelected
            ? properties.length + 10
            : isHovered
              ? properties.length + 5
              : index + 1;

          return (
            <PropertyMarkerItem
              key={property.id}
              language={language}
              property={property}
              isSelected={isSelected}
              isHovered={isHovered}
              zIndex={zIndex}
              currency={currency}
              penRate={penRate}
              onSelect={handleSelect}
              onHover={setHoveredId}
              onClose={() => setSelectedId(null)}
              onOpenProperty={onOpenProperty}
              onRequestDossier={onRequestDossier}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

export function LaConvencionMap({
  language,
  properties,
  activeZone,
  currency,
  penRate,
  onChangeZone,
  onOpenProperty,
  onRequestDossier,
}: LaConvencionMapProps) {
  const copy = UI_COPY[language].map;
  const envKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_API_KEY : '') ||
    '';

  const [apiKey, setApiKey] = useState<string>(envKey);
  const [keyResolved, setKeyResolved] = useState<boolean>(Boolean(envKey));
  const [mapType, setMapType] = useState<MapLayerMode>('terrain');

  useEffect(() => {
    if (envKey) {
      setApiKey(envKey);
      setKeyResolved(true);
      return;
    }

    let cancelled = false;
    fetch('/api/maps-config')
      .then((res) => res.json())
      .then((data: { apiKey?: string }) => {
        if (!cancelled) {
          setApiKey(data.apiKey ?? '');
          setKeyResolved(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setKeyResolved(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [envKey]);

  const activeZoneMeta = VALLEY_ZONES.find((z) => z.id === activeZone);

  return (
    <div
      id="mapa-la-convencion"
      className="scroll-mt-24 rounded-2xl overflow-hidden bg-white border border-[#0E2F1E]/12 shadow-sm"
    >
      {/* Cabecera territorial */}
      <div className="px-5 md:px-7 py-4 border-b border-[#0E2F1E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#9A783A]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{copy.eyebrow}</span>
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-normal text-[#0E2F1E] mt-0.5">
            {activeZone === 'all'
              ? copy.allDistrictsHeading
              : `${activeZone} · ${activeZoneMeta?.altitude ?? ''}`}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeZone !== 'all' && (
            <button
              type="button"
              onClick={() => onChangeZone('all')}
              className="px-3 py-1.5 rounded-lg border border-[#0E2F1E]/15 bg-white hover:bg-[#F3EFE6] text-xs font-medium text-[#0E2F1E] transition-colors cursor-pointer"
            >
              {copy.viewFullValley}
            </button>
          )}

          {/* Selector de capa del mapa */}
          <div
            role="group"
            aria-label={copy.layerAria}
            className="inline-flex items-center gap-1 rounded-xl border border-[#0E2F1E]/12 bg-white p-1"
          >
            <Layers className="w-3.5 h-3.5 text-[#0E2F1E]/55 ml-1.5 mr-0.5" />
            {(
              [
                { id: 'terrain', label: copy.terrain },
                { id: 'hybrid', label: copy.hybrid },
                { id: 'roadmap', label: copy.roadmap },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMapType(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  mapType === mode.id
                    ? 'bg-[#0E2F1E] text-white'
                    : 'text-[#2D3332]/70 hover:text-[#0E2F1E]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lienzo de Google Maps */}
      {!keyResolved ? (
        <div className="h-[380px] sm:h-[430px] md:h-[460px] w-full flex items-center justify-center bg-[#F1EFEA] text-sm text-[#18241E]/60">
          {copy.loading}
        </div>
      ) : apiKey ? (
        <APIProvider apiKey={apiKey} libraries={['marker']} language={language} region="PE">
          <LaConvencionMapCanvas
            language={language}
            properties={properties}
            activeZone={activeZone}
            currency={currency}
            penRate={penRate}
            mapType={mapType}
            onOpenProperty={onOpenProperty}
            onRequestDossier={onRequestDossier}
          />
        </APIProvider>
      ) : (
        <div className="h-[380px] sm:h-[430px] md:h-[460px] w-full flex flex-col items-center justify-center bg-[#F1EFEA] px-6 text-center">
          <MapPin className="w-7 h-7 text-[#2A4736] mb-3" />
          <h3 className="font-serif text-xl text-[#18241E]">
            {copy.noKeyTitle}
          </h3>
          <p className="mt-1.5 text-sm text-[#18241E]/70 max-w-md">
            {copy.noKeyBody}
          </p>
        </div>
      )}
    </div>
  );
}
