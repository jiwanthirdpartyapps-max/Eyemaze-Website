import React from 'react';
import { ArrowRight, Printer, CreditCard, PenTool, Camera } from 'lucide-react';

interface EverythingInOneSectionProps {
  onSelectCategory?: (category: string) => void;
}

export const EverythingInOneSection: React.FC<EverythingInOneSectionProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      id: 'print-services',
      category: 'offset-brochures',
      title: 'Print Services',
      desc: 'Heidelberg multi-color offset, high-speed digital runs, large-format UV flex banners, and catalogs.',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60',
      iconText: 'text-indigo-600 dark:text-indigo-400',
      icon: <Printer className="w-6 h-6" />,
    },
    {
      id: 'stationery-services',
      category: 'visiting-cards',
      title: 'Stationery Services',
      desc: '350+ GSM gold-foiled visiting cards, CR80 PVC RFID smart IDs, executive letterheads, and notebooks.',
      iconBg: 'bg-rose-100 dark:bg-rose-950/60',
      iconText: 'text-rose-600 dark:text-rose-400',
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: 'design-services',
      category: 'packaging-boxes',
      title: 'Design Services',
      desc: 'Vector branding identities, custom packaging dielines, annual report layout, and CMYK color grading.',
      iconBg: 'bg-teal-100 dark:bg-teal-950/60',
      iconText: 'text-teal-600 dark:text-teal-400',
      icon: <PenTool className="w-6 h-6" />,
    },
    {
      id: 'photography-services',
      category: 'merchandise',
      title: 'Photography Services',
      desc: 'Commercial studio packshots, high-res e-commerce cataloging, model lookbooks, and CMYK color retouch.',
      iconBg: 'bg-amber-100 dark:bg-amber-950/60',
      iconText: 'text-amber-600 dark:text-amber-400',
      icon: <Camera className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-400">
            One Portal
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything in one print portal
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Design, proof, quote, print, and track corporate outputs from a single Eyemaze account.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-slate-800/80 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${card.iconBg} ${card.iconText} flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  {card.icon}
                </div>

                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {onSelectCategory ? (
                <button
                  type="button"
                  onClick={() => onSelectCategory(card.category)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-orange-500 transition-colors cursor-pointer"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <a
                  href="#portal"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-orange-500 transition-colors"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
