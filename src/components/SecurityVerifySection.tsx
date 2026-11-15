import React, { useState } from 'react';
import { ShieldCheck, Lock, Heart, FileCheck, CheckCircle2, Award, EyeOff } from 'lucide-react';

interface SecurityVerifySectionProps {
  onOpenSecurityModal: () => void;
}

export const SecurityVerifySection: React.FC<SecurityVerifySectionProps> = ({ onOpenSecurityModal }) => {
  const [likes, setLikes] = useState<Record<string, number>>({
    encryption: 142,
    nda: 98,
    cmyk: 231,
    tamper: 187,
  });

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const toggleLike = (key: string) => {
    setLikes((prev) => ({
      ...prev,
      [key]: hasLiked[key] ? prev[key] - 1 : prev[key] + 1,
    }));
    setHasLiked((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const securityCards = [
    {
      key: 'encryption',
      title: '256-Bit TLS Artwork Encryption',
      desc: 'All vector CDR, AI, and PDF artwork uploaded to our portal is encrypted in transit and at rest using banking-grade AES-256 protocols.',
      icon: <Lock className="w-6 h-6 text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      key: 'nda',
      title: 'Strict Client NDA & Privacy Shield',
      desc: 'Your proprietary branding assets, upcoming campaign brochures, and confidential product packaging remain strictly protected under pre-signed NDAs.',
      icon: <EyeOff className="w-6 h-6 text-indigo-500" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      key: 'cmyk',
      title: 'Heidelberg ISO Fogra 39 Color Proof',
      desc: 'Automated pre-flight color separation and CTP plate inspection guarantee delta-E values under 1.5, matching your screen mockups to physical ink.',
      icon: <FileCheck className="w-6 h-6 text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      key: 'tamper',
      title: 'Tamper-Evident Packaging & Delivery',
      desc: 'Every completed carton is sealed with serialised barcode security tape and shipped via tracked dispatch, preventing tampering in transit.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-400">
            Security
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security you can verify
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Bank-grade file encryption, CMYK pre-flight verification, NDA-compliant print handling, and tamper-evident packaging.
          </p>
        </div>

        {/* 4 Cards with Like Counter Buttons (Payowire Pattern) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityCards.map((card) => (
            <div
              key={card.key}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center`}>
                  {card.icon}
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Interactive Like Counter Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleLike(card.key)}
                  aria-label={`Like ${card.title}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    hasLiked[card.key]
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform ${
                      hasLiked[card.key] ? 'fill-rose-500 text-rose-500 scale-110' : ''
                    }`}
                  />
                  <span>{likes[card.key]}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSecurityModal}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Inspect Audit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Security Badges Strip */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-display text-sm font-bold text-slate-900 dark:text-white">TLS 1.3 256-Bit</p>
            <p className="text-[11px] text-slate-500">End-to-End Encryption</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <p className="font-display text-sm font-bold text-slate-900 dark:text-white">ISO 27001 Architecture</p>
            <p className="text-[11px] text-slate-500">Zero-Trust Pre-Press</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="font-display text-sm font-bold text-slate-900 dark:text-white">AI Firewall Guard</p>
            <p className="text-[11px] text-slate-500">Prompt Injection Shield</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <p className="font-display text-sm font-bold text-slate-900 dark:text-white">Tamper Evident</p>
            <p className="text-[11px] text-slate-500">Sealed Delivery Boxes</p>
          </div>
        </div>
      </div>
    </section>
  );
};
