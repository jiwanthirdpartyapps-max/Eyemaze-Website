import React from 'react';
import { Bike, Truck, Plane, Zap, CheckCircle2, Globe2 } from 'lucide-react';

export const NetworkTransferSection: React.FC = () => {
  const networks = [
    {
      title: 'Local Valley Courier',
      badge: 'LVC',
      desc: 'Same-day motorcycle and rapid van dispatch across Kathmandu, Patan, and Bhaktapur.',
      icon: <Bike className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: 'Express Regional Cargo',
      badge: 'ERC',
      desc: 'Next-day express parcel cargo routes connecting Pokhara, Chitwan, Butwal, and Biratnagar.',
      icon: <Truck className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Heavy Freight & Air Cargo',
      badge: 'HFA',
      desc: 'Palletized road transport and air freight for high-volume catalogs, books, and large flex hoardings.',
      icon: <Plane className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-400">
            Delivery Networks
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Print & packaging logistics for growing brands
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
            Distribute print runs across Kathmandu Valley & express cargo lines across all 7 provinces of Nepal.
          </p>
        </div>

        {/* 2-Column Split: 3 Cards Left + Interactive Delivery Map Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 3 Delivery Network Cards */}
          <div className="lg:col-span-5 space-y-4">
            {networks.map((n) => (
              <div
                key={n.title}
                className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}>
                    {n.icon}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-13">
                  {n.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Dot Matrix Delivery Map with Animated Courier Arc */}
          <div className="lg:col-span-7 bg-gradient-to-br from-pink-50 via-rose-50/50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-rose-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            {/* Top Badge */}
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-rose-600 dark:text-rose-400">
                <Zap className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Arrives in hours
              </span>
            </div>

            {/* Map Canvas with SVG Curved Arc */}
            <div className="relative py-8 my-auto flex items-center justify-center">
              {/* Dot Grid Background Simulation */}
              <div className="absolute inset-0 opacity-20 dark:opacity-30">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-rose-600" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dot-grid)" />
                </svg>
              </div>

              {/* Transit Arc SVG */}
              <svg className="w-full h-44 z-10" viewBox="0 0 500 180" fill="none">
                {/* Curved dashed track */}
                <path
                  d="M 60 140 Q 250 10 440 100"
                  stroke="#FDA4AF"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="dark:stroke-rose-950"
                />
                {/* Active animated stroke */}
                <path
                  d="M 60 140 Q 250 10 440 100"
                  stroke="url(#gradient-arc)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F41D63" />
                    <stop offset="100%" stopColor="#FF5B14" />
                  </linearGradient>
                </defs>

                {/* Origin Point: Kathmandu Press Studio */}
                <circle cx="60" cy="140" r="7" fill="#F41D63" className="animate-pulse" />
                <circle cx="60" cy="140" r="14" stroke="#F41D63" strokeWidth="1.5" opacity="0.4" />
                <text x="60" y="165" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold" className="text-slate-800 dark:text-slate-200">
                  Kathmandu HQ
                </text>

                {/* Midpoints: Chitwan & Butwal */}
                <circle cx="210" cy="55" r="5" fill="#FF5B14" />
                <circle cx="310" cy="62" r="5" fill="#3B82F6" />

                {/* Destination Point: Pokhara Hub */}
                <circle cx="440" cy="100" r="7" fill="#FF5B14" className="animate-pulse" />
                <circle cx="440" cy="100" r="16" stroke="#FF5B14" strokeWidth="2" opacity="0.4" />
                <text x="440" y="125" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold" className="text-slate-800 dark:text-slate-200">
                  Pokhara Branch
                </text>
              </svg>
            </div>

            {/* Bottom Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              {/* Active Dispatch Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center text-xs font-bold">
                  🇳🇵
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Kathmandu → Pokhara
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    1,000 Offset Catalogs
                  </p>
                </div>
                <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Received
                </span>
              </div>

              {/* 7 Provinces Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300">
                <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>7 Provinces · 77 Districts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
