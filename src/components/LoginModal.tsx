import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../utils/dashboardLogic';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('4jsm.life@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'android'>('login');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'usr_85050801',
        name: 'Jiwan Kumar Majhi',
        email: email || '4jsm.life@gmail.com',
        accountId: '85050801',
        balanceNpr: 124555,
        balanceUsd: 0.0,
        isVerified: false,
        totalCards: 0,
        bankAccounts: 0,
        role: 'client',
      });
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'usr_85050801',
        name: 'Jiwan Kumar Majhi',
        email: '4jsm.life@gmail.com',
        accountId: '85050801',
        balanceNpr: 124555,
        balanceUsd: 0.0,
        isVerified: false,
        totalCards: 0,
        bankAccounts: 0,
        role: 'client',
      });
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold shadow-md">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6 12 2" />
              </svg>
            </span>
            <div>
              <h3 id="login-modal-title" className="font-display text-lg font-bold">
                Client Portal Login
              </h3>
              <p className="text-[11px] text-slate-400">
                Eyemaze / Payowire Unified Access
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Web Portal Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android App Sync</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-5">
          {activeTab === 'login' ? (
            <>
              {/* Quick Login Badge for Jiwan Kumar Majhi */}
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm border-2 border-orange-500">
                    JM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Jiwan Kumar Majhi
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      4jsm.life@gmail.com · ID: 85050801
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={loading}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white brand-gradient hover:opacity-90 shadow-sm transition-opacity cursor-pointer whitespace-nowrap"
                >
                  {loading ? 'Entering...' : '1-Tap Login'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="4jsm.life@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password / Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-pass"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white brand-gradient hover:opacity-95 transition-opacity shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by 256-bit TLS encryption & AI firewall</span>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>Android Studio App Integration</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  तपाईंको Android App (Android Studio) बाट यो login र dashboard सजिलै चलाउन सकिन्छ:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">विकल्प १: Android WebView / TWA (सबैभन्दा सजिलो)</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Android Studio को <code>MainActivity.kt</code> मा यो URL load गर्नुहोस्:
                    </p>
                    <code className="block p-1.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-rose-600 dark:text-rose-400 break-all">
                      webView.loadUrl(&quot;https://jj.4jsm-life.workers.dev/#dashboard&quot;)
                    </code>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">विकल्प २: Native Android Retrofit REST API</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Android Studio बाट POST request पठाउनुहोस्:
                    </p>
                    <code className="block p-1.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 break-all">
                      POST /api/auth/login &#123;&quot;email&quot;: &quot;4jsm.life@gmail.com&quot;&#125;
                    </code>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-3 rounded-xl text-xs font-bold text-white brand-gradient cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Open Dashboard to view Full Android Studio Code</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
