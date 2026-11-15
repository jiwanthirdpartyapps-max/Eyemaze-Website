import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Loader2,
  UserPlus,
  Lock,
} from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import type { UserProfile } from '../utils/dashboardLogic';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'android'>('login');

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const profile = await signInWithGoogle();
      onLoginSuccess(profile);
      onClose();
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completing verification.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('Popup was blocked by your browser. Please allow popups for Google sign-in.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError(
          'This domain is not yet authorized in Firebase Auth settings. Check Firebase Console → Authorized domains.'
        );
      } else {
        setAuthError(
          err instanceof Error ? err.message : 'Unable to authenticate with Google. Please retry.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold shadow-md">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6 12 2" />
              </svg>
            </span>
            <div>
              <h3 id="login-modal-title" className="font-display text-lg font-bold">
                Client Portal Sign In
              </h3>
              <p className="text-[11px] text-slate-400">
                Zero-Trust Firebase &amp; Google Identity Access
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
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Google Sign In / Sign Up
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Individual Account Isolation Enabled</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sign in with your own Google account. New users are automatically provisioned an
                  isolated Firestore profile (unique UID &amp; Account ID) with zero shared or
                  hardcoded credentials.
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  कुनै पनि नयाँ वा पुरानो प्रयोगकर्ताले आफ्नै Google Account बाट साइन अप वा लगइन गर्दा
                  तपाईंको आफ्नै नाम, इमेल र सुरक्षित ड्यासबोर्ड खुल्छ।
                </p>
              </div>

              {authError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
                    <span>Verifying with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <UserPlus className="w-3.5 h-3.5 text-orange-500" />
                <span>First-time visitors are registered automatically under their own Google UID</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Google Email + Cloud Firestore ABAC Rules Enforced</span>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>Android Studio Firebase Auth Bridge</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your Android App (<code>np.com.eyemaze.app</code>) and Web Portal share Firebase
                  Project <code>numeric-liberty-jwk2q</code> so any signed-in Google user gets the
                  same UID and Firestore document everywhere:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Option 1: WebView / TWA Shared Login
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Each Android user signs in via Google and enters their own dashboard URL:
                    </p>
                    <code className="block p-1.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-rose-600 dark:text-rose-400 break-all">
                      webView.loadUrl(&quot;https://jj.4jsm-life.workers.dev/#dashboard&quot;)
                    </code>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Option 2: Cryptographic Firebase ID Token API
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Send the authenticated user&apos;s Firebase JWT ID token to verify identity:
                    </p>
                    <code className="block p-1.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 break-all">
                      POST /api/auth/verify · Authorization: Bearer &lt;FIREBASE_ID_TOKEN&gt;
                    </code>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs font-bold text-white brand-gradient cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In with Google to View Full Kotlin Setup</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
