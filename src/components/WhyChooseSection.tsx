import React from 'react';
import { DollarSign, Zap, MousePointerClick, ShieldCheck } from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const benefits = [
    {
      title: 'Bank-beating rates',
      desc: 'Transparent factory-direct bulk unit costs with zero broker markups or hidden plate surcharges.',
      icon: <DollarSign className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-100 dark:bg-amber-950/60',
    },
    {
      title: "We're fast",
      desc: 'Same-day express dispatch for urgent flex and digital cards; 48-hour turnaround for bulk offset runs.',
      icon: <Zap className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-100 dark:bg-rose-950/60',
    },
    {
      title: 'Easy to use',
      desc: 'Instant online pricing in NPR, real-time 3D finish proofing, and one-click re-orders directly from your portal.',
      icon: <MousePointerClick className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-100 dark:bg-indigo-950/60',
    },
    {
      title: 'Secure by design',
      desc: 'Banking-grade 256-bit TLS file encryption, strict pre-press NDA confidentiality, and tamper-evident packaging.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    },
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Phone with Double-Click to Pay & Stacked Cards */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex items-center justify-center min-h-[460px]">
          {/* Floating 'Double-click to pay' pill */}
          <div className="absolute top-8 right-6 z-20 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-xs font-bold text-slate-800 dark:text-slate-100">
            Double-click to pay
          </div>

          {/* Smartphone Simulator */}
          <div className="w-[260px] sm:w-[280px] rounded-[36px] bg-slate-950 p-2.5 shadow-2xl border border-slate-800 z-10">
            <div className="bg-slate-900 text-white rounded-[28px] p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">9:41</span>
                <span>•••</span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base">Wallet</h3>
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">+</span>
              </div>

              {/* Stacked Cards Mockup */}
              <div className="relative h-48 pt-2">
                {/* Back Card (Silver/White) */}
                <div className="absolute top-0 inset-x-2 h-32 rounded-2xl bg-slate-100 text-slate-900 p-3 shadow-md border border-slate-300">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold">Eyemaze Press</span>
                    <span className="font-mono text-[9px]">•••• 2307</span>
                  </div>
                </div>

                {/* Front Card (Black Visa Card) */}
                <div className="absolute top-8 inset-x-0 h-36 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-4 shadow-2xl border border-white/20">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold tracking-widest text-rose-400">EYEMAZE</span>
                    <span className="text-xs font-extrabold italic tracking-wider">VISA</span>
                  </div>
                  <div className="pt-6">
                    <span className="w-7 h-5 rounded bg-amber-400/80 block mb-2" />
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
                      <span>AARAV SHRESTHA</span>
                      <span>•••• 4821</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready Indicator */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">Hold near press terminal to confirm order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Benefit Cards */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-400">
              Why Eyemaze
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why choose Eyemaze
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Eyemaze is a print & design enterprise built for businesses, agencies, and creators who need fast turnaround and immaculate press precision.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-rose-300 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center shrink-0`}>
                  {b.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {b.desc}
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
