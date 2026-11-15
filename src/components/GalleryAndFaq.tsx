import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import {
  PORTFOLIO_ITEMS,
  PRINT_FAQS,
  PRINT_SPECS_MATRIX,
  type PortfolioItem,
} from '../data/eyemazeData';
import type { PrintCategory, PrintFinish } from '../utils/printPricing';

interface GalleryAndFaqProps {
  onSelectSpecForQuote: (category: PrintCategory, finish: PrintFinish) => void;
}

export const GalleryAndFaq: React.FC<GalleryAndFaqProps> = ({ onSelectSpecForQuote }) => {
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const visiblePortfolio =
    galleryFilter === 'all'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === galleryFilter);

  return (
    <>
      {/* Payowire-Style Crisp Floating Spec Selector Grid */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                Stock & Finish Directory
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Click any specification to load it in the Estimator
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              12 standard production specs ready for rapid quoting
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {PRINT_SPECS_MATRIX.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => onSelectSpecForQuote(spec.category, spec.finish)}
                className="bg-white dark:bg-slate-950 rounded-2xl px-4 py-3.5 border border-slate-200/80 dark:border-slate-800 payo-card-shadow hover:border-rose-400 dark:hover:border-rose-500 hover:-translate-y-0.5 transition-all text-left flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                    {spec.label}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{spec.detail}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-700 dark:group-hover:text-rose-400 shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio & Photography Showcase */}
      <section id="gallery" className="py-20 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
                Selected Press & Studio Work
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Print, Packaging & Photography Showcase
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              {[
                { id: 'all', label: 'All Work' },
                { id: 'stationery', label: 'Stationery' },
                { id: 'packaging', label: 'Packaging' },
                { id: 'flex', label: 'Banners' },
                { id: 'photography', label: 'Photography' },
                { id: 'offset', label: 'Offset' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGalleryFilter(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    galleryFilter === tab.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {visiblePortfolio.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden payo-card-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      width={960}
                      height={717}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <span>{item.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.client}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{item.specLine}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:text-orange-700 dark:hover:text-orange-400 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Inspect deliverables
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Press FAQ Accordion */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
              Pre-Press Questions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Artwork, turnaround & delivery
            </h2>
          </div>

          <div className="space-y-3">
            {PRINT_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-90 text-rose-600 dark:text-rose-400' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-slate-100">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  aria-label="Close project details"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/75 text-white hover:bg-slate-950 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{selectedItem.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedItem.client}</span>
                  </div>
                  <h3 id="portfolio-modal-title" className="font-display text-2xl font-extrabold text-slate-900">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs font-mono text-rose-600">{selectedItem.specLine}</p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{selectedItem.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Production Deliverables
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedItem.deliverables.map((del) => (
                      <li
                        key={del}
                        className="text-xs font-medium text-slate-800 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Close
                  </button>
                  <a
                    href="#portal"
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white brand-gradient hover:opacity-95"
                  >
                    Quote Similar Run
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
