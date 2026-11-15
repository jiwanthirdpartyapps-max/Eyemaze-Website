import React, { useState } from 'react';
import { Menu, X, Sun, Moon, ShieldCheck, ChevronDown, User, LayoutDashboard, Database } from 'lucide-react';
import { getUserInitials, type UserProfile } from '../utils/dashboardLogic';

interface NavbarProps {
  onOpenOrderPortal: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  user?: UserProfile | null;
  onGoToDashboard: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSecurity: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenFirebaseHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderPortal,
  onOpenLogin,
  isLoggedIn,
  user,
  onGoToDashboard,
  isDark,
  onToggleTheme,
  onOpenSecurity,
  onSelectCategory,
  onOpenFirebaseHub,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [finishesDropdown, setFinishesDropdown] = useState(false);

  const servicesList = [
    { label: 'Heidelberg Offset Printing', cat: 'offset-brochures' },
    { label: 'Gold Foil Visiting Cards', cat: 'visiting-cards' },
    { label: 'Custom Packaging & Boxes', cat: 'packaging-boxes' },
    { label: 'UV Star Flex & Signage', cat: 'flex-banners' },
    { label: 'Commercial Studio Photography', cat: 'merchandise' },
  ];

  const finishesList = [
    { label: 'Metallic Hot Gold Foil', anchor: '#proof-studio' },
    { label: 'Raised Gloss Spot UV', anchor: '#proof-studio' },
    { label: 'Velvet Soft-Touch Matte', anchor: '#proof-studio' },
    { label: 'Rainbow Holographic Foil', anchor: '#proof-studio' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c101d]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Logo with Payowire Octagonal Gradient Jewel */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-white font-display font-extrabold text-2xl tracking-tight shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
        >
          {/* Octagonal Gemstone/Jewel Ring Icon */}
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-rose-600/30 p-1"
          >
            <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6 12 2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
            </svg>
          </span>
          <span>Eyemaze</span>
        </a>

        {/* Zone 2: Navigation Links with Payowire-Style Dropdowns */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Home
          </a>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Services</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {servicesDropdown && (
              <div className="absolute top-full left-0 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl p-2 shadow-2xl space-y-1 animate-fade-in">
                {servicesList.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(item.cat);
                      onOpenOrderPortal();
                      setServicesDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Finishes Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setFinishesDropdown(true)}
            onMouseLeave={() => setFinishesDropdown(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Finishes</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {finishesDropdown && (
              <div className="absolute top-full left-0 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl p-2 shadow-2xl space-y-1 animate-fade-in">
                {finishesList.map((item) => (
                  <a
                    key={item.label}
                    href={item.anchor}
                    onClick={() => setFinishesDropdown(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#portal"
            className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Pricing
          </a>

          <a
            href="#why-choose"
            className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Contact
          </a>

          <a
            href="#location-map"
            className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Map
          </a>

          <button
            type="button"
            onClick={isLoggedIn ? onGoToDashboard : onOpenLogin}
            className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            {isLoggedIn ? 'Dashboard' : 'Portal'}
          </button>
        </nav>

        {/* Zone 3: Security, Theme, Dual Pill Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Security Shield Modal Trigger */}
          <button
            type="button"
            onClick={onOpenSecurity}
            aria-label="View banking security and AI firewall"
            title="Banking-Grade Security Shield"
            className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Phase 0-6 Firebase & System Audit Hub Trigger */}
          {onOpenFirebaseHub && (
            <button
              type="button"
              onClick={onOpenFirebaseHub}
              aria-label="View Firebase & Android architecture audit (Phase 0-6)"
              title="System Audit & Migration Hub (Phase 0–6)"
              className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
            >
              <Database className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-200" />}
          </button>

          {/* If Logged in, show Dashboard shortcut pill, otherwise show Log in */}
          {isLoggedIn && user ? (
            <button
              type="button"
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors shadow-md cursor-pointer"
            >
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {getUserInitials(user.name, user.email)}
                </div>
              )}
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#E83E8C] hover:bg-[#d42d7a] transition-colors shadow-md shadow-pink-600/20 cursor-pointer"
            >
              Log in
            </button>
          )}

          {/* Payowire Orange 'Register' / 'Order Print' Pill */}
          <button
            type="button"
            onClick={onOpenOrderPortal}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors shadow-md shadow-orange-600/20 cursor-pointer"
          >
            Order Print
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden p-2 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0c101d] border-t border-slate-800 px-6 py-5 space-y-3">
          <a
            href="#"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Home
          </a>
          <a
            href="#services"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Services
          </a>
          <a
            href="#proof-studio"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Finishes & 3D Proofs
          </a>
          <a
            href="#portal"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Pricing & Estimator
          </a>
          <a
            href="#why-choose"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Why Choose Eyemaze
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Press Desk Contact
          </a>
          <a
            href="#location-map"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-rose-400 hover:text-rose-300"
          >
            Google Map Location
          </a>

          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (isLoggedIn) onGoToDashboard();
                else onOpenLogin();
              }}
              className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#E83E8C]"
            >
              {isLoggedIn ? 'Dashboard' : 'Log in'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenOrderPortal();
              }}
              className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#FF5B14]"
            >
              Order Print
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
