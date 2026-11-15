import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeaturedStripProps {
  onSelectCategory?: (category: string) => void;
}

export const FeaturedStrip: React.FC<FeaturedStripProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      id: 'offset',
      title: 'Offset & Digital Printing',
      desc: 'High-speed Heidelberg offset & digital press runs for brochures, flyers, and catalogs.',
      category: 'offset-brochures',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      iconBorder: 'border-blue-200 dark:border-blue-800',
      svg: (
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
          {/* 3D Isometric Card Stack */}
          <rect x="8" y="24" width="38" height="24" rx="4" fill="#3B82F6" transform="rotate(-10 27 36)" opacity="0.4" />
          <rect x="14" y="20" width="38" height="24" rx="4" fill="#60A5FA" transform="rotate(-5 33 32)" opacity="0.7" />
          <rect x="18" y="16" width="38" height="24" rx="4" fill="#2563EB" />
          <circle cx="28" cy="28" r="4" fill="#FBBF24" />
          <circle cx="34" cy="28" r="4" fill="#F59E0B" opacity="0.8" />
          <rect x="22" y="34" width="16" height="2" rx="1" fill="#93C5FD" />
          <rect x="42" y="22" width="8" height="6" rx="1" fill="#FCD34D" />
        </svg>
      ),
    },
    {
      id: 'design',
      title: 'Creative Design & Pre-Press',
      desc: 'Vector brand guidelines, packaging dielines, and CMYK pre-flight proofs.',
      category: 'visiting-cards',
      iconBg: 'bg-sky-50 dark:bg-sky-950/40',
      iconBorder: 'border-sky-200 dark:border-sky-800',
      svg: (
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
          {/* 3D Bank / Creative Building */}
          <path d="M32 10L14 20V24H50V20L32 10Z" fill="#38BDF8" />
          <rect x="18" y="26" width="5" height="18" rx="1" fill="#0284C7" />
          <rect x="27" y="26" width="5" height="18" rx="1" fill="#0284C7" />
          <rect x="36" y="26" width="5" height="18" rx="1" fill="#0284C7" />
          <rect x="45" y="26" width="5" height="18" rx="1" fill="#0284C7" />
          <rect x="12" y="44" width="44" height="6" rx="2" fill="#BAE6FD" />
          <rect x="10" y="50" width="48" height="4" rx="1" fill="#0369A1" />
          <rect x="22" y="16" width="20" height="6" rx="1" fill="#E0F2FE" />
          <text x="32" y="21" textAnchor="middle" fill="#0369A1" fontSize="5" fontWeight="bold" fontFamily="sans-serif">STUDIO</text>
        </svg>
      ),
    },
    {
      id: 'stationery',
      title: 'Luxury Stationery & Cards',
      desc: '350+ GSM visiting cards, gold-foil stamping, PVC employee IDs, and letterheads.',
      category: 'stationery-sets',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      iconBorder: 'border-indigo-200 dark:border-indigo-800',
      svg: (
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
          {/* 3D Coin & Transfer */}
          <ellipse cx="24" cy="20" rx="8" ry="4" fill="#F59E0B" />
          <ellipse cx="24" cy="18" rx="8" ry="4" fill="#FCD34D" />
          <text x="24" y="20" textAnchor="middle" fill="#78350F" fontSize="5" fontWeight="bold">$</text>
          
          <ellipse cx="40" cy="20" rx="8" ry="4" fill="#F59E0B" />
          <ellipse cx="40" cy="18" rx="8" ry="4" fill="#FCD34D" />
          <text x="40" y="20" textAnchor="middle" fill="#78350F" fontSize="5" fontWeight="bold">$</text>

          <path d="M26 14C30 10 34 10 38 14" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 14L34 11M38 14L34 17" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Connected Columns */}
          <path d="M14 36L32 26L50 36V40H14V36Z" fill="#818CF8" />
          <rect x="18" y="42" width="6" height="14" rx="1" fill="#4F46E5" />
          <rect x="29" y="42" width="6" height="14" rx="1" fill="#4F46E5" />
          <rect x="40" y="42" width="6" height="14" rx="1" fill="#4F46E5" />
          <rect x="12" y="56" width="40" height="4" rx="1" fill="#C7D2FE" />
        </svg>
      ),
    },
    {
      id: 'packaging',
      title: 'Custom Packaging & Boxes',
      desc: 'Custom die-cut rigid gift boxes, retail paper bags, and merchandise.',
      category: 'packaging-boxes',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconBorder: 'border-emerald-200 dark:border-emerald-800',
      svg: (
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
          {/* 3D Shield Checkmark */}
          <path
            d="M32 10C42 16 48 18 48 28C48 42 38 52 32 56C26 52 16 42 16 28C16 18 22 16 32 10Z"
            fill="#38BDF8"
          />
          <path
            d="M32 14C40 19 45 21 45 29C45 40 37 49 32 52C27 49 19 40 19 29C19 21 24 19 32 14Z"
            fill="#0284C7"
          />
          <circle cx="32" cy="33" r="12" fill="#FBBF24" />
          <path
            d="M27 33L30.5 36.5L37 30"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section aria-label="Core Capabilities" className="relative z-30 -mt-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-7 payo-card-shadow border border-slate-100 dark:border-slate-800 flex flex-col justify-between items-center text-center space-y-5 hover:-translate-y-1.5 transition-all duration-200 group"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
              {card.svg}
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {card.desc}
              </p>
            </div>

            {onSelectCategory ? (
              <button
                type="button"
                onClick={() => onSelectCategory(card.category)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-orange-500 transition-colors cursor-pointer pt-1"
              >
                <span>Instant estimate</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <a
                href="#portal"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-orange-500 transition-colors cursor-pointer pt-1"
              >
                <span>Instant estimate</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
