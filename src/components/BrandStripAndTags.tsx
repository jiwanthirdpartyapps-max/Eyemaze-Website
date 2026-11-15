import React from 'react';

export const BrandStripAndTags: React.FC = () => {
  const brands = [
    { name: 'Payoneer', icon: '🟧' },
    { name: 'Amazon', icon: '🛒' },
    { name: 'eBay', icon: '🛍️' },
    { name: 'Shopify', icon: '🛍️' },
    { name: 'Etsy', icon: '🟠' },
    { name: 'Google', icon: '🌐' },
    { name: 'Apple', icon: '🍏' },
    { name: 'Netflix', icon: '🎬' },
    { name: 'Nabil Bank', icon: '🏦' },
    { name: 'Himalayan Java', icon: '☕' },
    { name: 'Daraz', icon: '📦' },
    { name: 'Yeti Airlines', icon: '✈️' },
  ];

  const regionsAndFormats = [
    { name: 'Kathmandu Valley', badge: '🇳🇵', tag: 'HQ Hub' },
    { name: 'Pokhara & Gandaki', badge: '🏔️', tag: 'Next Day' },
    { name: 'Lalitpur & Patan', badge: '🏛️', tag: 'Same Day' },
    { name: 'Bhaktapur Heritage', badge: '🏺', tag: 'Same Day' },
    { name: 'Chitwan & Bharatpur', badge: '🦏', tag: 'Cargo Express' },
    { name: 'Butwal & Rupandehi', badge: '🏭', tag: 'Fast Line' },
    { name: 'Biratnagar & Morang', badge: '🏬', tag: 'Daily Freight' },
    { name: 'Dharan & Sunsari', badge: '🌲', tag: 'Direct Courier' },
    { name: 'Nepalgunj & Banke', badge: '✈️', tag: 'Air Cargo' },
    { name: 'Dhangadhi & Kailali', badge: '🚚', tag: 'Express' },
    { name: 'Itahari Commercial', badge: '🏙️', tag: 'Transit' },
    { name: 'Birtamod & Jhapa', badge: '🍵', tag: 'Eastern Line' },
    { name: 'Gold Foil Visiting Cards', badge: '✨', tag: '350 GSM' },
    { name: 'Rigid Luxury Boxes', badge: '🎁', tag: '1200 GSM' },
    { name: 'Heidelberg Offset Runs', badge: '🖨️', tag: 'CMYK Proof' },
    { name: '350 GSM Velvet Matte', badge: '📜', tag: 'Laminated' },
    { name: 'Star Flex Hoardings', badge: '🚩', tag: '440 GSM' },
    { name: 'PVC Smart ID Cards', badge: '🪪', tag: 'CR80 RFID' },
    { name: 'Studio Packshot Photos', badge: '📸', tag: '50MP RAW' },
    { name: 'Embossed Paper Bags', badge: '🛍️', tag: 'Kraft / Art' },
    { name: 'Annual Report Books', badge: '📚', tag: 'Perfect Bound' },
    { name: 'Sublimation Mugs & Merch', badge: '☕', tag: 'AAA Grade' },
    { name: 'DTF Cotton Apparel', badge: '👕', tag: 'Combed Cotton' },
    { name: 'Spot UV Brochures', badge: '💎', tag: 'Raised Gloss' },
  ];

  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Brand Logos Row */}
        <div className="text-center space-y-6">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Pay and get paid on platforms you already use · Trusted by leading enterprises across Nepal
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
            {brands.map((b) => (
              <div
                key={b.name}
                className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:shadow-md transition-shadow"
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Logos are trademarks of their respective owners and do not imply partnership or endorsement.
          </p>
        </div>

        {/* Popular Countries / Print Formats Pill Grid */}
        <div className="text-center space-y-8 pt-6">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-400">
            Worldwide & Nationwide
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular print formats and cities we deliver to
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Produce brochures, business cards, boxes, and signage with same-day dispatch across all 7 provinces of Nepal.
            </p>
          </div>

          {/* Grid of 24 rounded pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4">
            {regionsAndFormats.map((item) => (
              <div
                key={item.name}
                className="bg-white dark:bg-slate-900 rounded-full px-4 py-2.5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2 hover:border-rose-400 transition-colors group cursor-default"
              >
                <span className="text-base shrink-0">{item.badge}</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
