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
import { Compass, ExternalLink, Layers, MapPin, Navigation, Phone, Plus, Minus, LocateFixed, Eye } from 'lucide-react';
import { EYEMAZE_LOCATION } from '../data/eyemazeLocation';
import pressHeroImg from '../assets/images/printing_press_hero_1794657251905.jpg';

type MapTypeMode = 'hybrid' | 'roadmap';

interface StudioMapCanvasProps {
  mapType: MapTypeMode;
  recenterSignal: number;
  followUserSignal: number;
  onQuotaOrAuthError: () => void;
}

const StudioMapCanvas: React.FC<StudioMapCanvasProps> = ({
  mapType,
  recenterSignal,
  followUserSignal,
  onQuotaOrAuthError,
}) => {
  const map = useMap();
  const loadingStatus = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const [hoverPreviewOpen, setHoverPreviewOpen] = useState(false);

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
    try {
      map.setMapTypeId(mapType);
    } catch {
      // Ignore map type errors
    }
  }, [map, mapType]);

  useEffect(() => {
    if (!map || recenterSignal === 0) return;
    try {
      map.panTo(EYEMAZE_LOCATION.coordinates);
      map.setZoom(18);
    } catch {
      // Ignore pan errors
    }
  }, [map, recenterSignal]);

  useEffect(() => {
    if (!map || followUserSignal === 0) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            map.panTo(userCoords);
            map.setZoom(15);
          } catch {
            map.panTo(EYEMAZE_LOCATION.coordinates);
          }
        },
        () => {
          try {
            map.panTo(EYEMAZE_LOCATION.coordinates);
            map.setZoom(18);
          } catch {}
        },
        { timeout: 8000 }
      );
    } else {
      try {
        map.panTo(EYEMAZE_LOCATION.coordinates);
        map.setZoom(18);
      } catch {}
    }
  }, [map, followUserSignal]);

  if (
    loadingStatus === APILoadingStatus.AUTH_FAILURE ||
    loadingStatus === APILoadingStatus.FAILED
  ) {
    onQuotaOrAuthError();
    return null;
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
      className="w-full h-full"
    >
      {map && loadingStatus === APILoadingStatus.LOADED && (
        <MapErrorBoundary fallback={null} onError={onQuotaOrAuthError}>
          <div
            onMouseEnter={() => setHoverPreviewOpen(true)}
            onMouseLeave={() => setHoverPreviewOpen(false)}
          >
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

            {/* Hover Preview Thumbnail Overlay */}
            {hoverPreviewOpen && (
              <div className="absolute top-4 right-4 z-40 w-56 bg-slate-950/95 border border-rose-500/40 rounded-2xl overflow-hidden shadow-2xl p-2 space-y-1.5 animate-fade-in pointer-events-none">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 relative">
                  <img
                    src={pressHeroImg}
                    alt="Eyemaze Press Studio Snapshot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider">
                    Live Studio Feed
                  </div>
                </div>
                <p className="text-[11px] font-bold text-white px-1 leading-tight">
                  {EYEMAZE_LOCATION.addressNepali}
                </p>
                <p className="text-[10px] text-slate-300 px-1 font-mono">
                  Heidelberg Press &amp; Design Desk
                </p>
              </div>
            )}
          </div>

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
  const [mapType, setMapType] = useState<MapTypeMode>('hybrid');
  const [recenterSignal, setRecenterSignal] = useState(0);
  const [followUserSignal, setFollowUserSignal] = useState(0);
  const [mapError, setMapError] = useState(false);
  const [trafficLayerActive, setTrafficLayerActive] = useState(false);

  useEffect(() => {
    const markFailed = () => setMapError(true);
    const onWindowError = (event: ErrorEvent | Event) => {
      const msg = String((event as ErrorEvent).message || (event as CustomEvent).detail || '');
      const src = String((event as ErrorEvent).filename || '');
      if (
        src.includes('maps.googleapis.com') ||
        src.includes('react-google-maps') ||
        msg.includes("reading 'keys'") ||
        msg.includes('getRootNode') ||
        msg.includes('RefererNotAllowedMapError') ||
        msg.includes('Google Maps JavaScript API error')
      ) {
        if ('preventDefault' in event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        setMapError(true);
      }
    };

    window.addEventListener('gmp-auth-failure', markFailed);
    window.addEventListener('gmp-quota-exceeded', markFailed);
    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onWindowError);
    return () => {
      window.removeEventListener('gmp-auth-failure', markFailed);
      window.removeEventListener('gmp-quota-exceeded', markFailed);
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onWindowError);
    };
  }, []);

  useEffect(() => {
    if (apiKey) return;
    let active = true;
    fetch('/api/config/maps')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data && typeof data.apiKey === 'string' && data.apiKey.trim()) {
          setApiKey(data.apiKey.trim());
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [apiKey]);

  const handleQuotaOrAuthError = useCallback(() => {
    setMapError(true);
  }, []);

  const fallbackCard = (
    <div className="w-full h-full relative flex flex-col bg-slate-950">
      <iframe
        title="Eyemaze Graphics Enterprises Live Map Preview"
        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.408713291884!2d85.7323897!3d27.2644144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb85373ddf9c4b%3A0xaf6db41acaebe062!2sEyemaze%20Graphics%20Enterprises!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp${trafficLayerActive ? '&layer=t' : ''}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full absolute inset-0"
      />
      <div className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{EYEMAZE_LOCATION.businessName} · {EYEMAZE_LOCATION.addressNepali}</span>
          </p>
          <p className="text-[11px] text-slate-300 font-mono">
            GPS: {EYEMAZE_LOCATION.coordinates.lat}° N, {EYEMAZE_LOCATION.coordinates.lng}° E · Plus Code {EYEMAZE_LOCATION.plusCode}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={EYEMAZE_LOCATION.googleMapsPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-md"
          >
            <span>Open Maps App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={EYEMAZE_LOCATION.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-rose-400" />
            <span>Directions</span>
          </a>
        </div>
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
          {/* Map Mode & Traffic Toggle */}
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

          {/* Traffic Layer Toggle */}
          <button
            type="button"
            onClick={() => setTrafficLayerActive(!trafficLayerActive)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              trafficLayerActive
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Traffic</span>
          </button>

          {/* Follow Device Location Toggle */}
          <button
            type="button"
            onClick={() => setFollowUserSignal((s) => s + 1)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            title="Follow current device location"
          >
            <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
            <span>Follow GPS</span>
          </button>

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

      {/* Interactive Map Canvas */}
      <div className="w-full h-[360px] sm:h-[420px] relative bg-slate-950">
        <MapErrorBoundary fallback={fallbackCard} onError={handleQuotaOrAuthError}>
          {!mapError ? (
            <APIProvider apiKey={apiKey || 'AIzaSyDummyKeyForFallback'} libraries={['marker']} language="en" region="NP">
              <StudioMapCanvas
                mapType={mapType}
                recenterSignal={recenterSignal}
                followUserSignal={followUserSignal}
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
