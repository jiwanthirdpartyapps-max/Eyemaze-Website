import React from 'react';
import {
  Bell,
  CreditCard,
  Layers,
  FileCheck2,
  DollarSign,
  Truck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface PowerFlexSectionProps {
  onOpenPortal: () => void;
}

export const PowerFlexSection: React.FC<PowerFlexSectionProps> = ({ onOpenPortal }) => {
  const features = [
    {
      title: 'Instant NPR Estimator',
      desc: 'Calculate exact paper, plates, and finishing costs instantly in real-time.',
      icon: <DollarSign className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Unlimited Print Runs',
      desc: 'From 100 premium business cards to 100,000 corporate brochures.',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: 'Factory Direct Rates',
      desc: 'Transparent pricing with no hidden pre-press or setup surcharges.',
      icon: <CreditCard className="w-5 h-5 text-teal-500" />,
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Precision CMYK Matching',
      desc: 'Heidelberg multi-color press calibrated to strict ISO Fogra standards.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Doorstep Express Delivery',
      desc: 'Same-day dispatch from मरिण–६, छाप, सिन्धुली & express cargo across Kathmandu and Nepal.',
      icon: <Truck className="w-5 h-5 text-sky-500" />,
      bg: 'bg-sky-50 dark:bg-sky-950/40',
    },
    {
      title: 'Live Proof Tracking',
      desc: 'Real-time pre-press status, plate burning, and production milestones.',
      icon: <FileCheck2 className="w-5 h-5 text-rose-600" />,
      bg: 'bg-pink-50 dark:bg-pink-950/40',
    },
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-400">
            Flexibility
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The power to make things happen
          </h2>
        </div>

        {/* 2-Column Split: Visual Terminal + 6 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual Container */}
          <div className="lg:col-span-5 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex items-center justify-center min-h-[440px]">
            {/* Instant alerts pill */}
            <div className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
              <Bell className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              <span>Instant alerts</span>
            </div>

            {/* Simulated POS Card Payment Terminal */}
            <div className="absolute -left-6 bottom-8 w-44 rounded-2xl bg-slate-900 p-3 shadow-2xl border border-slate-700 -rotate-6 z-10 hidden sm:block">
              {/* Screen */}
              <div className="bg-slate-800 rounded-xl p-2.5 text-center text-white space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Eyemaze Pay</p>
                <p className="text-[10px] text-rose-400 font-medium">Tap to pay</p>
                <p className="font-mono text-sm font-bold">NPR 4,200</p>
              </div>
              {/* Keypad */}
              <div className="grid grid-cols-3 gap-1 pt-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-slate-800" />
                ))}
              </div>
            </div>

            {/* Simulated Phone Screen */}
            <div className="w-[260px] sm:w-[280px] rounded-[32px] bg-slate-950 p-2.5 shadow-2xl border border-slate-800 z-10">
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">9:41</span>
                  <span>•••</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                    EM
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Hello,</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Eyemaze Portal</p>
                  </div>
                </div>

                {/* Available Balance Card */}
                <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md space-y-1">
                  <p className="text-[10px] opacity-90">Available balance</p>
                  <p className="font-display font-extrabold text-2xl">NPR 25,000</p>
                  <p className="text-[9px] opacity-80 font-mono">Visa •••• 4821</p>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recent transactions
                  </p>
                  <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                        V
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Visiting Cards</p>
                        <p className="text-[9px] text-slate-400">Yesterday</p>
                      </div>
                    </div>
                    <span className="font-mono text-rose-600 font-semibold">-NPR 4,200</span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
                        +
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Credit Top Up</p>
                        <p className="text-[9px] text-slate-400">Monday</p>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-600 font-semibold">+NPR 25,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 Feature Tiles */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feat) => (
              <div
                key={feat.title}
                onClick={onOpenPortal}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-rose-300 dark:hover:border-rose-900 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer group"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center shrink-0`}>
                  {feat.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
