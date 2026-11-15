import React, { useState } from 'react';
import { Compass, ExternalLink, Layers, MapPin, Navigation, Phone, Plus, Minus, LocateFixed, Eye } from 'lucide-react';
import { EYEMAZE_LOCATION } from '../data/eyemazeLocation';
import pressHeroImg from '../assets/images/printing_press_hero_1794657251905.jpg';

type MapTypeMode = 'hybrid' | 'roadmap';

export const EyemazeLocationMap: React.FC = () => {
  const [mapType, setMapType] = useState<MapTypeMode>('hybrid');
  const [trafficLayerActive, setTrafficLayerActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(18);
  const [hoverPreviewOpen, setHoverPreviewOpen] = useState(false);
  const [recenterKey, setRecenterKey] = useState(0);

  // Construct embed URL based on map type and traffic
  const embedTypeParam = mapType === 'hybrid' ? 'k' : 'm'; // k = satellite, m = roadmap
  const trafficParam = trafficLayerActive ? '&layer=t' : '';
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.408713291884!2d85.7323897!3d27.2644144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb85373ddf9c4b%3A0xaf6db41acaebe062!2sEyemaze%20Graphics%20Enterprises!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp${trafficParam}`;

  const handleFollowGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${EYEMAZE_LOCATION.coordinates.lat},${EYEMAZE_LOCATION.coordinates.lng}&origin=${lat},${lng}`, '_blank');
        },
        () => {
          window.open(EYEMAZE_LOCATION.googleMapsDirectionsUrl, '_blank');
        },
        { timeout: 8000 }
      );
    } else {
      window.open(EYEMAZE_LOCATION.googleMapsDirectionsUrl, '_blank');
    }
  };

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
              {EYEMAZE_LOCATION.businessName} · Live Studio Map
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

          {/* Follow Device Location GPS */}
          <button
            type="button"
            onClick={handleFollowGps}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            title="Navigate from your current GPS location"
          >
            <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
            <span>Follow GPS</span>
          </button>

          <button
            type="button"
            onClick={() => setRecenterKey(k => k + 1)}
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

      {/* Interactive Map Canvas with Hover Snapshot */}
      <div 
        className="w-full h-[360px] sm:h-[420px] relative bg-slate-950"
        onMouseEnter={() => setHoverPreviewOpen(true)}
        onMouseLeave={() => setHoverPreviewOpen(false)}
      >
        <iframe
          key={`${mapType}-${trafficLayerActive}-${recenterKey}`}
          title="Eyemaze Graphics Enterprises Live Map"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full absolute inset-0"
        />

        {/* Custom Zoom Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-xl">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(21, z + 1))}
            aria-label="Zoom in"
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
            aria-label="Zoom out"
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

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
