import React from 'react';
import { Star, MapPin, Mail, Phone, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { EYEMAZE_LOCATION } from '../data/eyemazeLocation';

interface PayowireFooterProps {
  onOpenSecurity: () => void;
}

export const PayowireFooter: React.FC<PayowireFooterProps> = ({ onOpenSecurity }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Reviews Banner (Payowire Style) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1 text-emerald-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-emerald-400 text-emerald-400" />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Rated Excellent 4.9 out of 5
              </p>
              <p className="text-xs text-slate-400">
                Based on 2,400+ verified corporate print orders across Nepal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSecurity}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Banking-Grade Security Audit</span>
            </button>
          </div>
        </div>

        {/* 4-Column Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center text-white font-bold text-sm shadow-md">
                E
              </span>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Eyemaze
              </span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Eyemaze Graphics Enterprises (eyemaze.com.np) — मरिण–६, छाप, सिन्धुली (Marin-6, Chhap, Sindhuli) मा आधारित कमर्सियल प्रिन्टिङ, ग्राफिक डिजाइन, प्याकेजिङ तथा स्टेसनरी व्यवसाय।
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              eyemaze.com.np · {EYEMAZE_LOCATION.addressNepali} ({EYEMAZE_LOCATION.plusCode})
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-white text-xs">
              Services
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Heidelberg CMYK Offset Printing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Gold Foil & Embossed Visiting Cards
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  UV Star Flex Banners & Signage
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Custom Rigid Die-Cut Packaging Boxes
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Commercial Studio Packshot Photography
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Tools */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-white text-xs">
              Client Tools
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#portal" className="hover:text-white transition-colors">
                  Instant NPR Print Cost Estimator
                </a>
              </li>
              <li>
                <a href="#proof-studio" className="hover:text-white transition-colors">
                  Interactive 3D Foil & Spot UV Simulator
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Portfolio & Technical Paper Specs
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Artwork Pre-Press File Checker
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSecurity}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Verify Banking Security Protocols
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Press Desk & Contact */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-white text-xs">
              Press Desk
            </h3>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-medium">
                    {EYEMAZE_LOCATION.addressNepali}
                  </span>
                  <a
                    href={EYEMAZE_LOCATION.googleMapsPlaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 mt-0.5"
                  >
                    <span>Google Maps ({EYEMAZE_LOCATION.plusCode})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{EYEMAZE_LOCATION.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>
                  <a href="tel:+9779844251392" className="hover:text-white transition-colors">
                    9844251392
                  </a>{' '}
                  ·{' '}
                  <a href="tel:+9779814850300" className="hover:text-white transition-colors">
                    9814850300
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Sun – Fri: 9:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Eyemaze Graphics Enterprises. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#contact" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#contact" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <button
              type="button"
              onClick={onOpenSecurity}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
