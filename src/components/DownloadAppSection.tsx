import React from 'react';
import { QrCode, CheckCircle2, Sparkles } from 'lucide-react';

export const DownloadAppSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-950/30 via-slate-950/80 to-slate-900/60" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: App Pitch & QR Code */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Eyemaze Mobile App
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Manage Eyemaze from your phone
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Review proofs on the go, track live Heidelberg offset runs, and dispatch orders across Nepal right from your pocket.
          </p>

          <div className="space-y-3 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-Tap CMYK proof sign-offs with zoomable 300 DPI preview</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time push alerts when plates are burned and orders dispatch</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-Click repeat re-orders for visiting cards, letterheads, and bags</span>
            </div>
          </div>

          {/* QR Code & Store Buttons */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            {/* QR Card */}
            <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 text-slate-900">
              <div className="w-16 h-16 bg-slate-900 rounded-xl p-1.5 flex items-center justify-center text-white">
                <QrCode className="w-12 h-12 text-white" />
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold leading-tight">Scan QR Code</p>
                <p className="text-[10px] text-slate-500">Instant web app launch</p>
              </div>
            </div>

            {/* Store Badges */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 flex items-center gap-3 cursor-pointer transition-colors">
                <span className="text-xl">▶</span>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Download on</p>
                  <p className="text-xs font-bold text-white leading-tight">Google Play</p>
                </div>
              </div>

              <div className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 flex items-center gap-3 cursor-pointer transition-colors">
                <span className="text-xl"></span>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Download on the</p>
                  <p className="text-xs font-bold text-white leading-tight">App Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Realistic Phone Simulator Displaying Eyemaze App */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[300px] sm:w-[320px] rounded-[42px] bg-slate-950 p-3 shadow-2xl border border-slate-700/80 -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="bg-slate-900 rounded-[32px] overflow-hidden p-4 space-y-4 text-white">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-mono">9:41</span>
                <span>•••</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Welcome,</p>
                  <h3 className="font-display font-bold text-sm">Eyemaze Press Mobile</h3>
                </div>
                <span className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center font-bold text-xs">
                  E
                </span>
              </div>

              {/* Status Banner */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-r from-rose-600 to-orange-600 space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-90">Live Press Status</p>
                <p className="font-display font-extrabold text-lg">Order #EYM-4082</p>
                <p className="text-xs opacity-90">1,000 Foil Cards · Heidelberg Speedmaster</p>
              </div>

              {/* Step Timeline */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-200">Vector Artwork Verified</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-200">Laser CTP Plates Burned</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                  <span className="text-rose-400 font-semibold">Running CMYK Offset Inks</span>
                </div>
                <div className="flex items-center gap-2.5 opacity-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span className="text-slate-400">Hot Foil Stamping & Cutting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
