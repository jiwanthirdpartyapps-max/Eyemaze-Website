import React from 'react';
import { UserPlus, Globe2, Truck } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenPortal: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenPortal }) => {
  const steps = [
    {
      num: '01',
      title: 'Select stock & submit brief',
      desc: 'Choose your paper GSM, dimensions, quantity, and luxury lamination in our instant online estimator.',
      icon: <UserPlus className="w-6 h-6 text-rose-500" />,
      circleBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    },
    {
      num: '02',
      title: 'Pre-press & digital CMYK proof',
      desc: 'Our studio verifies resolution, 3mm bleed margins, and Fogra 39 colour profiles with sign-off in 2 hours.',
      icon: <Globe2 className="w-6 h-6 text-indigo-500" />,
      circleBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900',
    },
    {
      num: '03',
      title: 'Press run & doorstep delivery',
      desc: 'Heidelberg offset production, automated die-cutting, and same-day courier dispatch right to your office.',
      icon: <Truck className="w-6 h-6 text-orange-500" />,
      circleBg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto text-center space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-700 dark:text-rose-400">
            How It Works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How printing works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            From digital artwork submission to finished print delivery in three simple, transparent steps.
          </p>
        </div>

        {/* 3 Steps Connected Track */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pt-4">
          {/* Horizontal Connecting Line (hidden on mobile) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-rose-300 via-indigo-300 to-orange-300 dark:from-rose-900 dark:via-indigo-900 dark:to-orange-900 z-0"
          />

          {steps.map((step) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center text-center space-y-4">
              {/* Icon Circle */}
              <div
                className={`w-24 h-24 rounded-full border-2 ${step.circleBg} flex items-center justify-center shadow-lg relative bg-white dark:bg-slate-900`}
              >
                {step.icon}

                {/* Step Number Bubble */}
                <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono text-white bg-gradient-to-r from-rose-500 to-orange-500 shadow-sm">
                  {step.num}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 pt-2 max-w-xs">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onOpenPortal}
            className="px-8 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white brand-gradient hover:opacity-95 transition-opacity shadow-lg shadow-rose-600/20 cursor-pointer"
          >
            Calculate Instant Estimate
          </button>
        </div>
      </div>
    </section>
  );
};
