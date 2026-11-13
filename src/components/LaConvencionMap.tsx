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

interface LaConvencionMapProps {
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
              ? 'bg-[#2A4736] text-[#FAF9F6] border-[#E4CFAF] scale-110 ring-2 ring-[#2A4736]/30'
              : isHovered
                ? 'bg-[#18241E] text-white border-white/40 scale-105'
                : 'bg-white text-[#18241E] border-[#18241E]/20 hover:bg-[#18241E] hover:text-white'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSelected ? 'bg-[#E4CFAF]' : 'bg-[#2A4736]'
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
          <div className="w-[235px] sm:w-[250px] text-[#18241E] font-sans">
            <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5 bg-[#F1EFEA]">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                {property.zone}
              </span>
            </div>

            <h4 className="font-serif text-base font-medium leading-snug text-[#18241E]">
              {property.title}
            </h4>

            <div className="mt-1.5 flex items-center justify-between text-xs text-[#18241E]/70">
              <span>
                {property.isLand ? `${property.hectares?.toFixed(1)} Ha` : `${property.areaSqm} m²`}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mountain className="w-3 h-3 text-[#2A4736]" />
                {property.altitude}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-[#18241E]/10 flex items-center justify-between">
              <span className="font-serif text-lg font-medium text-[#18241E] tabular-nums">
                {fullPrice}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#2A4736] font-medium">
                <ShieldCheck className="w-3 h-3" />
                SUNARP
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenProperty(property)}
                className="flex-1 rounded-lg border border-[#18241E]/20 px-2.5 py-1.5 text-xs font-medium text-[#18241E] hover:bg-[#F1EFEA] transition-colors cursor-pointer"
              >
                Ver ficha
              </button>
              <button
                type="button"
                onClick={() => onRequestDossier(property)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#18241E] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#2A4736] transition-colors cursor-pointer"
              >
                <span>Dossier</span>
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
  properties,
  activeZone,
  currency,
  penRate,
  mapType,
  onOpenProperty,
  onRequestDossier,
}: {
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
          No se pudo inicializar el mapa territorial
        </h3>
        <p className="mt-1.5 text-sm text-[#18241E]/70 max-w-md">
          Verifica la clave o cuota de Google Maps Platform. Puedes seguir explorando el catálogo completo
          de propiedades arriba.
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

      {/* Leyenda flotante discreta */}
      <div className="pointer-events-none absolute left-4 bottom-4 hidden sm:flex items-center gap-2 rounded-xl bg-[#18241E]/85 backdrop-blur-md text-[#FAF9F6] px-3.5 py-2 text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#E4CFAF]" />
        <span>
          {properties.length > 0
            ? 'Haz clic en un marcador para ver ficha, altitud y partida SUNARP'
            : '0 propiedades visibles con los filtros actuales'}
        </span>
      </div>
    </div>
  );
}

export function LaConvencionMap({
  properties,
  activeZone,
  currency,
  penRate,
  onChangeZone,
  onOpenProperty,
  onRequestDossier,
}: LaConvencionMapProps) {
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
      className="scroll-mt-24 rounded-2xl overflow-hidden bg-white border border-[#18241E]/12 shadow-sm"
    >
      {/* Cabecera territorial limpia sin botones duplicados de distrito */}
      <div className="px-5 md:px-7 py-4 border-b border-[#18241E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF9F6]/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#2A4736]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ubicación en La Convención, Cusco</span>
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-normal text-[#18241E] mt-0.5">
            {activeZone === 'all'
              ? 'Corredor del Alto Urubamba · Todos los distritos'
              : `${activeZone} · ${activeZoneMeta?.altitude ?? ''}`}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeZone !== 'all' && (
            <button
              type="button"
              onClick={() => onChangeZone('all')}
              className="px-3 py-1.5 rounded-lg border border-[#18241E]/15 bg-white hover:bg-[#F1EFEA] text-xs font-medium text-[#18241E] transition-colors cursor-pointer"
            >
              Ver todo el valle
            </button>
          )}

          {/* Selector de capa del mapa */}
          <div
            role="group"
            aria-label="Tipo de vista del mapa"
            className="inline-flex items-center gap-1 rounded-xl border border-[#18241E]/12 bg-white p-1"
          >
            <Layers className="w-3.5 h-3.5 text-[#18241E]/55 ml-1.5 mr-0.5" />
            {(
              [
                { id: 'terrain', label: 'Relieve' },
                { id: 'hybrid', label: 'Satélite' },
                { id: 'roadmap', label: 'Rutas' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMapType(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  mapType === mode.id
                    ? 'bg-[#18241E] text-white'
                    : 'text-[#18241E]/65 hover:text-[#18241E]'
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
          Cargando mapa de La Convención...
        </div>
      ) : apiKey ? (
        <APIProvider apiKey={apiKey} libraries={['marker']} language="es" region="PE">
          <LaConvencionMapCanvas
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
            Mapa interactivo de La Convención pendiente de clave
          </h3>
          <p className="mt-1.5 text-sm text-[#18241E]/70 max-w-md">
            Configura <code className="font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY</code> y reinicia el
            servidor para visualizar los pines georreferenciados en el valle.
          </p>
        </div>
      )}
    </div>
  );
}
