import React, { useState } from 'react';
import printingPressHeroImg from '../assets/images/printing_press_hero_1794657251905.jpg';
import {
  Play,
  ArrowRight,
  Bell,
  Printer,
  Layers,
  CreditCard,
  Camera,
  Truck,
  Sparkles,
  FileCheck2,
  PackageCheck,
  User,
  Home,
  Clock,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { formatNpr, type PrintOrder } from '../utils/printPricing';
import { EYEMAZE_LOCATION } from '../data/eyemazeLocation';

interface HeroSectionProps {
  orders: PrintOrder[];
  onOpenAiAdvisor: () => void;
  onJumpToPortal: () => void;
  onOpenVideoModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  orders,
  onOpenAiAdvisor,
  onJumpToPortal,
  onOpenVideoModal,
}) => {
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  const activeJobs = orders.filter(
    (o) => o.status === 'In Press' || o.status === 'Proof Review'
  ).length;
  const totalCreditNpr = orders.reduce((sum, o) => sum + o.totalNpr, 0);

  const quickActions = [
    { id: 'offset', label: 'Offset Press', bg: 'bg-orange-100 text-orange-600', icon: <Printer className="w-3.5 h-3.5" /> },
    { id: 'cards', label: 'Visiting Cards', bg: 'bg-blue-100 text-blue-600', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'design', label: 'Brand Design', bg: 'bg-teal-100 text-teal-600', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'packaging', label: 'Packaging', bg: 'bg-purple-100 text-purple-600', icon: <PackageCheck className="w-3.5 h-3.5" /> },
    { id: 'flex', label: 'Star Flex', bg: 'bg-emerald-100 text-emerald-600', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'foil', label: 'Gold Foil', bg: 'bg-amber-100 text-amber-600', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    { id: 'courier', label: 'Track Dispatch', bg: 'bg-rose-100 text-rose-600', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'calc', label: 'Cost Calc', bg: 'bg-indigo-100 text-indigo-600', icon: <Camera className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative">
      {/* Dark photographic hero canvas replicating Payowire */}
      <section className="relative overflow-hidden bg-[#0c101d] text-white pt-12 pb-36 lg:pb-32 px-6">
        {/* Background Image: Offset Press & Creator Studio Atmosphere */}
        <img
          src={printingPressHeroImg}
          alt="Eyemaze Graphics Enterprises commercial printing press and graphic design studio at मरिण–६, छाप, सिन्धुली, नेपाल"
          width={1280}
          height={714}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0c101d] via-[#0c101d]/90 to-[#0c101d]/60"
        />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6">
            {/* Studio Address & Map Direct Link */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-300">
              <a
                href="#location-map"
                className="inline-flex items-center gap-1.5 font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{EYEMAZE_LOCATION.addressNepali} (Google Map)</span>
              </a>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-200">
                <a href="tel:+9779844251392" className="hover:text-white transition-colors">
                  9844251392
                </a>
                ,{' '}
                <a href="tel:+9779814850300" className="hover:text-white transition-colors">
                  9814850300
                </a>
              </span>
            </div>

            {/* Payowire-style exact headline rhythm */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] text-white text-balance max-w-xl">
              Print, design, and create precision branding outputs.
            </h1>

            {/* Payowire-style supporting paragraphs */}
            <div className="space-y-1 text-slate-200 text-base sm:text-lg">
              <p className="font-medium">Easy printing for businesses and creators.</p>
              <p className="text-slate-300">All of your graphic and print tools on one platform.</p>
            </div>

            {/* Dual CTAs (Payowire Exact: Magenta GET STARTED + Orange PLAY VIDEO) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onJumpToPortal}
                className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-white bg-[#C81E6E] hover:bg-[#A6165A] transition-colors shadow-lg shadow-pink-600/30 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenVideoModal}
                className="px-7 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-white bg-[#C2410C] hover:bg-[#9A3412] transition-colors shadow-lg shadow-orange-600/30 flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>PLAY VIDEO</span>
              </button>
            </div>

            {/* Download Badges (Payowire Exact) */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <div
                onClick={onOpenAiAdvisor}
                className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer shadow-sm transition-colors"
              >
                <span className="text-base text-white">▶</span>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Download on</p>
                  <p className="text-xs font-bold text-white leading-tight">Google Play</p>
                </div>
              </div>

              <div
                onClick={onOpenAiAdvisor}
                className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer shadow-sm transition-colors"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.96 6.32c.68-.83 1.14-1.98 1.01-3.13-.98.04-2.16.65-2.86 1.48-.62.72-1.17 1.89-1.02 3.01 1.09.08 2.19-.54 2.87-1.36" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Download on the</p>
                  <p className="text-xs font-bold text-white leading-tight">App Store</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase: Floating Tilted 3D Eyemaze Card + Realistic Phone Simulator */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end min-h-[500px]">
            {/* Floating Tilted 3D Gradient Card (Payowire Signature) */}
            <div className="hidden sm:flex flex-col justify-between absolute -left-8 sm:left-4 md:left-8 bottom-16 w-64 h-40 rounded-2xl p-5 brand-gradient text-white shadow-2xl -rotate-12 z-20 border border-white/30 select-none">
              {/* Chip and Logo */}
              <div className="flex items-center justify-between">
                <span className="w-8 h-6 rounded bg-amber-300 border border-amber-100 flex items-center justify-center shadow-inner">
                  <span className="w-4 h-3 border-t border-b border-amber-600/40 block" />
                </span>
                <span className="font-display font-black text-sm tracking-wider text-white">
                  Eyemaze
                </span>
              </div>

              {/* Card Number */}
              <div className="pt-2">
                <p className="font-mono text-sm tracking-widest font-bold drop-shadow-sm">
                  5415 0080 0000 0000
                </p>
              </div>

              {/* Expiry, CVV & Mastercard Circles */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div>
                  <span className="text-[9px] text-white/70 block leading-none">EXPIRES</span>
                  <span className="font-bold">12/28</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/70 block leading-none">CVV</span>
                  <span className="font-bold">123</span>
                </div>
                {/* Mastercard-style overlapping circles */}
                <div className="flex -space-x-2">
                  <span className="w-6 h-6 rounded-full bg-red-500/90 shadow-sm" />
                  <span className="w-6 h-6 rounded-full bg-amber-400/90 shadow-sm" />
                </div>
              </div>
            </div>

            {/* Realistic iPhone / Android Simulator (Payowire Exact Layout) */}
            <div className="w-[310px] sm:w-[330px] rounded-[44px] bg-[#0c101d] p-3 shadow-2xl border border-slate-700/80 z-10 shrink-0">
              <div className="bg-slate-50 text-slate-900 rounded-[34px] overflow-hidden">
                {/* Status Bar */}
                <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-800 bg-white">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center text-white text-xs font-bold">
                      E
                    </span>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Hello,</p>
                      <p className="text-xs font-extrabold text-slate-900">Eyemaze</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Scrollable / Interactive Phone Body */}
                <div className="p-4 space-y-3.5 bg-slate-50">
                  {/* Coral Gradient Wallet Card */}
                  <div className="rounded-2xl p-4 text-white brand-gradient shadow-md space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">
                        WALLET BALANCE
                      </p>
                      <p className="text-2xl font-black font-display tracking-tight">
                        {formatNpr(totalCreditNpr || 124555)}
                      </p>
                      <p className="text-[10px] opacity-80 pt-0.5">Welcome back</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={onJumpToPortal}
                        className="flex-1 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        + Add Fund
                      </button>
                      <button
                        type="button"
                        onClick={onJumpToPortal}
                        className="flex-1 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Transactions
                      </button>
                    </div>

                    {/* 3 Stats: Cards, Accounts, Verified */}
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/20 text-center text-[10px]">
                      <div>
                        <p className="font-bold text-xs">3</p>
                        <p className="opacity-80">Total Cards</p>
                      </div>
                      <div>
                        <p className="font-bold text-xs">{orders.length}</p>
                        <p className="opacity-80">Press Jobs</p>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-emerald-300">Verified</p>
                        <p className="opacity-80">Account</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions (8 Icons in 2x4 Grid matching Payowire) */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                      QUICK ACTIONS
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {quickActions.map((qa) => (
                        <button
                          key={qa.id}
                          type="button"
                          onClick={() => {
                            setSelectedQuickAction(qa.label);
                            onJumpToPortal();
                          }}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 hover:border-rose-400 transition-colors shadow-2xs cursor-pointer group"
                        >
                          <span className={`w-8 h-8 rounded-full ${qa.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                            {qa.icon}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-700 leading-tight text-center truncate max-w-full">
                            {qa.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity (Payowire Exact) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        RECENT ACTIVITY
                      </p>
                      <button
                        type="button"
                        onClick={onJumpToPortal}
                        className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                            ↓
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Client Payout</p>
                            <p className="text-[10px] text-slate-600">Today · Offset Batch #4082</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          +NPR 28,500
                        </span>
                      </div>

                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Visiting Cards Approved</p>
                            <p className="text-[10px] text-slate-600">Yesterday · 350 GSM Gold Foil</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          +NPR 4,200
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Item Bottom App Navigation (Payowire Signature) */}
                <div className="grid grid-cols-5 bg-white border-t border-slate-200 py-2 px-2 text-center text-slate-600">
                  <button type="button" onClick={onJumpToPortal} className="flex flex-col items-center gap-0.5 text-rose-700">
                    <Home className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold">Home</span>
                  </button>
                  <button type="button" onClick={onJumpToPortal} className="flex flex-col items-center gap-0.5 hover:text-slate-900">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-semibold">Cards</span>
                  </button>
                  {/* Central floating send/order button */}
                  <button
                    type="button"
                    aria-label="Open print order portal"
                    onClick={onJumpToPortal}
                    className="w-9 h-9 -mt-3.5 rounded-full brand-gradient text-white flex items-center justify-center shadow-md mx-auto"
                  >
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </button>
                  <button type="button" onClick={onJumpToPortal} className="flex flex-col items-center gap-0.5 hover:text-slate-900">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-semibold">Activity</span>
                  </button>
                  <button type="button" onClick={onOpenAiAdvisor} className="flex flex-col items-center gap-0.5 hover:text-slate-900">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-semibold">Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
