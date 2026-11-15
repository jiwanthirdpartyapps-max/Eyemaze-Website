import React, { useState } from 'react';
import { Check, Layers, Sparkles, ShieldCheck, Truck } from 'lucide-react';

type FinishPresetId = 'gold-foil' | 'spot-uv' | 'velvet-matte';

interface FinishPreset {
  id: FinishPresetId;
  name: string;
  gsm: string;
  coating: string;
  turnaround: string;
  cardClass: string;
  badgeText: string;
}

const PRESETS: FinishPreset[] = [
  {
    id: 'gold-foil',
    name: 'Hot Gold Foil',
    gsm: '350 GSM Cotton Board',
    coating: 'Velvet Matte + Metallic Foil',
    turnaround: '3 Business Days',
    cardClass: 'bg-slate-900 text-amber-200 border border-amber-400/50',
    badgeText: 'FOIL STAMP',
  },
  {
    id: 'spot-uv',
    name: 'Raised Spot UV',
    gsm: '400 GSM Art Board',
    coating: 'High-Gloss Raised UV Layer',
    turnaround: '3 Business Days',
    cardClass: 'brand-gradient text-white border border-white/30',
    badgeText: 'SPOT UV 3D',
  },
  {
    id: 'velvet-matte',
    name: 'Silk Velvet Matte',
    gsm: '350 GSM Imported Card',
    coating: 'Soft-Touch Anti-Scuff Film',
    turnaround: '48 Hours',
    cardClass: 'bg-white text-slate-900 border border-slate-200',
    badgeText: 'SOFT TOUCH',
  },
];

export const InteractiveProofStudio: React.FC = () => {
  const [selectedId, setSelectedId] = useState<FinishPresetId>('gold-foil');
  const activePreset = PRESETS.find((p) => p.id === selectedId) ?? PRESETS[0];

  const benefits = [
    {
      icon: <Layers className="w-5 h-5 text-orange-600" />,
      bg: 'bg-orange-50',
      title: 'Factory-direct offset pricing',
      desc: 'In-house Heidelberg presses eliminate middleman markups on bulk runs.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50',
      title: 'Precision CMYK & foil calibration',
      desc: 'Spectrophotometer-checked color accuracy across every batch.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Complimentary pre-press file audit',
      desc: 'Our designers verify bleeds, safe margins, and 300 DPI sharpness.',
    },
    {
      icon: <Truck className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      title: 'Fast मरिण–६, सिन्धुली & nationwide dispatch',
      desc: 'Tracked courier delivery straight to your office or event venue.',
    },
  ];

  return (
    <section id="proof-studio" className="py-20 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* 3-Step Print Workflow Strip (Payowire How It Works Pattern) */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
            How Printing Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            From artwork to press in three steps
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Streamlined pre-press, proofing, and dispatch built for Nepali brands and enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
          {[
            {
              step: '01',
              title: 'Select stock & submit brief',
              desc: 'Pick your paper GSM, dimensions, and finish in our live calculator or upload your PDF/CDR artwork.',
              tint: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
            },
            {
              step: '02',
              title: 'Approve digital CMYK proof',
              desc: 'Review bleed lines, foil placement, and color separation directly inside the Eyemaze Print Portal.',
              tint: 'bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300',
            },
            {
              step: '03',
              title: 'Press run & doorstep delivery',
              desc: 'Your order enters our Heidelberg offset or large-format queue and ships with live status updates.',
              tint: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300',
            },
          ].map((item) => (
            <div key={item.step} className="text-center px-4 space-y-3">
              <div className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl ${item.tint} flex items-center justify-center font-display font-extrabold text-lg`}>
                  {item.step}
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Split Tactile Finish Simulator + Stacked Benefit List (Payowire Pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Interactive Soft-Lavender Showcase Panel */}
          <div className="lg:col-span-6 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-rose-50 via-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Interactive Finish Preview
              </span>
              <span className="text-xs font-mono text-slate-700 dark:text-slate-400">
                {activePreset.gsm}
              </span>
            </div>

            {/* Interactive Card Preview */}
            <div className="py-4 flex justify-center">
              <div
                className={`w-full max-w-sm rounded-2xl p-6 shadow-xl transition-all duration-200 ${activePreset.cardClass}`}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-bold text-base tracking-tight">
                    EYEMAZE PRESS
                  </span>
                  <span className="text-[11px] font-mono font-semibold tracking-wider opacity-80">
                    {activePreset.badgeText}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Aarav Shrestha</p>
                  <p className="text-xs opacity-75">Creative Director · मरिण–६, सिन्धुली</p>
                </div>
                <div className="mt-5 pt-4 border-t border-current/15 flex items-center justify-between text-[11px] font-mono opacity-80">
                  <span>{activePreset.coating}</span>
                  <span>{activePreset.turnaround}</span>
                </div>
              </div>
            </div>

            {/* Finish Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((preset) => {
                const isSelected = preset.id === selectedId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedId(preset.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-rose-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    <span className="truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Stacked Clean Rows */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
                Why Eyemaze Graphics
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Engineered for tactile brand impact
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                Every sheet, banner, and package passes strict ink-density and finishing inspection before leaving our मरिण–६, छाप facility.
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 payo-card-shadow flex items-start gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl ${b.bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
