import React, { useCallback, useEffect, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import { Compass, ExternalLink, Layers, MapPin, Navigation, Phone } from 'lucide-react';
import { EYEMAZE_LOCATION } from '../data/eyemazeLocation';

type MapTypeMode = 'hybrid' | 'roadmap';

interface StudioMapCanvasProps {
  mapType: MapTypeMode;
  recenterSignal: number;
  onQuotaOrAuthError: () => void;
}

const StudioMapCanvas: React.FC<StudioMapCanvasProps> = ({
  mapType,
  recenterSignal,
  onQuotaOrAuthError,
}) => {
  const map = useMap();
  const loadingStatus = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    if (
      loadingStatus === APILoadingStatus.AUTH_FAILURE ||
      loadingStatus === APILoadingStatus.FAILED
    ) {
      onQuotaOrAuthError();
    }
  }, [loadingStatus, onQuotaOrAuthError]);

  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(mapType);
  }, [map, mapType]);

  useEffect(() => {
    if (!map || recenterSignal === 0) return;
    map.panTo(EYEMAZE_LOCATION.coordinates);
    map.setZoom(18);
  }, [map, recenterSignal]);

  if (
    loadingStatus === APILoadingStatus.AUTH_FAILURE ||
    loadingStatus === APILoadingStatus.FAILED
  ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-200 space-y-3">
        <MapPin className="w-8 h-8 text-rose-400" />
        <p className="text-sm font-bold text-white">
          {EYEMAZE_LOCATION.businessName} · {EYEMAZE_LOCATION.addressNepali}
        </p>
        <p className="text-xs text-slate-400 font-mono">
          {EYEMAZE_LOCATION.coordinates.lat.toFixed(7)}° N,{' '}
          {EYEMAZE_LOCATION.coordinates.lng.toFixed(7)}° E · Plus Code {EYEMAZE_LOCATION.plusCode}
        </p>
        <a
          href={EYEMAZE_LOCATION.googleMapsPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <GoogleMap
      defaultCenter={EYEMAZE_LOCATION.coordinates}
      defaultZoom={18}
      mapId="DEMO_MAP_ID"
      mapTypeId={mapType}
      gestureHandling="cooperative"
      disableDefaultUI={false}
      streetViewControl={false}
      mapTypeControl={false}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      className="w-full h-full"
    >
      {map && loadingStatus === APILoadingStatus.LOADED && (
        <MapErrorBoundary fallback={null} onError={onQuotaOrAuthError}>
          <AdvancedMarker
            ref={markerRef}
            position={EYEMAZE_LOCATION.coordinates}
            title={`${EYEMAZE_LOCATION.businessName} — ${EYEMAZE_LOCATION.addressNepali}`}
            onClick={() => setInfoOpen((prev) => !prev)}
          >
            <Pin
              background="#F41D63"
              borderColor="#9F1239"
              glyphColor="#FFFFFF"
              scale={1.15}
            />
          </AdvancedMarker>

          {infoOpen && marker && (
            <InfoWindow
              anchor={marker}
              maxWidth={270}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div className="p-1 text-slate-900 space-y-1.5 font-sans">
                <p className="font-bold text-sm text-slate-900 leading-tight">
                  {EYEMAZE_LOCATION.businessName}
                </p>
                <p className="text-xs font-semibold text-rose-600">
                  {EYEMAZE_LOCATION.addressNepali}
                </p>
                <p className="text-[11px] text-slate-600">
                  {EYEMAZE_LOCATION.plusCode}, {EYEMAZE_LOCATION.locality}{' '}
                  {EYEMAZE_LOCATION.postalCode}
                </p>
                <div className="pt-1 border-t border-slate-200 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono text-slate-700">
                    {EYEMAZE_LOCATION.phones.join(' · ')}
                  </span>
                  <a
                    href={EYEMAZE_LOCATION.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-rose-600 hover:underline whitespace-nowrap"
                  >
                    Directions →
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </MapErrorBoundary>
      )}
    </GoogleMap>
  );
};

interface MapErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const EyemazeLocationMap: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(
    () => (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || ''
  );
  const [keyChecked, setKeyChecked] = useState<boolean>(() =>
    Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
  );
  const [mapType, setMapType] = useState<MapTypeMode>('hybrid');
  const [recenterSignal, setRecenterSignal] = useState(0);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const markFailed = () => setMapError(true);
    const onWindowError = (event: ErrorEvent) => {
      const msg = String(event.message || '');
      const src = String(event.filename || '');
      if (
        src.includes('maps.googleapis.com') ||
        src.includes('react-google-maps') ||
        msg.includes("reading 'keys'") ||
        msg.includes('getRootNode') ||
        msg.includes('RefererNotAllowedMapError')
      ) {
        event.preventDefault();
        setMapError(true);
      }
    };

    window.addEventListener('gmp-auth-failure', markFailed);
    window.addEventListener('gmp-quota-exceeded', markFailed);
    window.addEventListener('error', onWindowError);
    return () => {
      window.removeEventListener('gmp-auth-failure', markFailed);
      window.removeEventListener('gmp-quota-exceeded', markFailed);
      window.removeEventListener('error', onWindowError);
    };
  }, []);

  useEffect(() => {
    if (apiKey) {
      setKeyChecked(true);
      return;
    }
    let active = true;
    fetch('/api/config/maps')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data && typeof data.apiKey === 'string' && data.apiKey.trim()) {
          setApiKey(data.apiKey.trim());
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setKeyChecked(true);
      });
    return () => {
      active = false;
    };
  }, [apiKey]);

  const handleQuotaOrAuthError = useCallback(() => {
    setMapError(true);
  }, []);

  const fallbackCard = (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[radial-gradient(circle_at_top,_rgba(244,29,99,0.14),_transparent_65%)]">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
        <MapPin className="w-6 h-6" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <p className="text-base font-bold text-white">
          {EYEMAZE_LOCATION.businessName} — {EYEMAZE_LOCATION.addressNepali}
        </p>
        <p className="text-xs text-slate-300">
          {EYEMAZE_LOCATION.addressEnglish} · {EYEMAZE_LOCATION.locality}{' '}
          {EYEMAZE_LOCATION.postalCode}
        </p>
        <p className="text-xs text-slate-400 font-mono">
          GPS: {EYEMAZE_LOCATION.coordinates.lat}° N, {EYEMAZE_LOCATION.coordinates.lng}° E · Plus
          Code {EYEMAZE_LOCATION.plusCode}
        </p>
        {!keyChecked && (
          <p className="text-xs text-slate-500 pt-1">Loading interactive map…</p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={EYEMAZE_LOCATION.googleMapsPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
        >
          <span>View Pin on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a
          href={EYEMAZE_LOCATION.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-rose-400" />
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Map Top Utility Header */}
      <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              {EYEMAZE_LOCATION.businessName} · Google Map Location
            </h3>
            <p className="text-xs text-slate-400">
              {EYEMAZE_LOCATION.addressNepali} ({EYEMAZE_LOCATION.plusCode},{' '}
              {EYEMAZE_LOCATION.locality} {EYEMAZE_LOCATION.postalCode})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Map Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMapType('hybrid')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mapType === 'hybrid'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                mapType === 'roadmap'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Road Map
            </button>
          </div>

          <button
            type="button"
            onClick={() => setRecenterSignal((s) => s + 1)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span>Center Pin</span>
          </button>

          <a
            href={EYEMAZE_LOCATION.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl brand-gradient text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-95 transition-opacity"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Interactive Map Canvas (Explicit height required per CF2) */}
      <div className="w-full h-[360px] sm:h-[420px] relative bg-slate-950">
        <MapErrorBoundary fallback={fallbackCard} onError={handleQuotaOrAuthError}>
          {apiKey && !mapError ? (
            <APIProvider apiKey={apiKey} libraries={['marker']} language="en" region="NP">
              <StudioMapCanvas
                mapType={mapType}
                recenterSignal={recenterSignal}
                onQuotaOrAuthError={handleQuotaOrAuthError}
              />
            </APIProvider>
          ) : (
            fallbackCard
          )}
        </MapErrorBoundary>
      </div>

      {/* Bottom Exact Coordinates & Direct Phone Strip */}
      <div className="px-5 py-3.5 bg-slate-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
          <span>
            GPS: {EYEMAZE_LOCATION.coordinates.lat}° N, {EYEMAZE_LOCATION.coordinates.lng}° E
          </span>
          <span>Plus Code: {EYEMAZE_LOCATION.plusCode}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-300 font-semibold">
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <a href="tel:+9779844251392" className="hover:text-white transition-colors">
              9844251392
            </a>
            <span aria-hidden="true">·</span>
            <a href="tel:+9779814850300" className="hover:text-white transition-colors">
              9814850300
            </a>
          </span>
          <a
            href={EYEMAZE_LOCATION.googleMapsPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Google Maps Place</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
