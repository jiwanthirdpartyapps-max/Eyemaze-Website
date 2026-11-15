import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, CheckCircle2, ShieldCheck, Gauge } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h3 id="video-modal-title" className="text-sm font-bold text-white tracking-wide">
              Eyemaze Heidelberg 4-Colour Offset Press Live Run
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src="/src/assets/images/printing_press_hero_1794657251905.jpg"
            alt="Heidelberg Speedmaster multi-color offset press in action at Eyemaze मरिण–६, छाप, सिन्धुली"
            className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-90 scale-105 transition-transform duration-1000' : 'opacity-60'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

          {/* Center Play/Pause Overlay */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="absolute z-10 w-20 h-20 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Live Press Telemetry HUD */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-900/80 border border-slate-700 text-emerald-400 backdrop-blur-sm flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              15,000 Sheets / Hr
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-900/80 border border-slate-700 text-cyan-400 backdrop-blur-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ISO Fogra 39 CMYK Match
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-orange-500 w-3/4 animate-pulse" />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px]">02:18 / 03:00</span>
                <span className="text-slate-400">· Heidelberg Speedmaster CD 102</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Studio Proofing
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Footer */}
        <div className="px-6 py-4 bg-slate-950 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-t border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Press Model</span>
            <span className="text-white font-semibold">Heidelberg CD 102 4-Color</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Resolution</span>
            <span className="text-white font-semibold">2,400 DPI CTP Laser</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Paper Range</span>
            <span className="text-white font-semibold">70 GSM – 450 GSM</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Facility Location</span>
            <span className="text-white font-semibold">मरिण–६, छाप, सिन्धुली</span>
          </div>
        </div>
      </div>
    </div>
  );
};
