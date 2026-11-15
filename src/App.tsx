import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedStrip } from './components/FeaturedStrip';
import { INITIAL_PRINT_ORDERS } from './data/eyemazeData';
import { EYEMAZE_LOCATION } from './data/eyemazeLocation';
import { type UserProfile } from './utils/dashboardLogic';
import type { PrintCategory, PrintFinish, PrintOrder } from './utils/printPricing';

const BrandStripAndTags = lazy(() =>
  import('./components/BrandStripAndTags').then((m) => ({ default: m.BrandStripAndTags }))
);
const HowItWorksSection = lazy(() =>
  import('./components/HowItWorksSection').then((m) => ({ default: m.HowItWorksSection }))
);
const PowerFlexSection = lazy(() =>
  import('./components/PowerFlexSection').then((m) => ({ default: m.PowerFlexSection }))
);
const EverythingInOneSection = lazy(() =>
  import('./components/EverythingInOneSection').then((m) => ({ default: m.EverythingInOneSection }))
);
const WhyChooseSection = lazy(() =>
  import('./components/WhyChooseSection').then((m) => ({ default: m.WhyChooseSection }))
);
const NetworkTransferSection = lazy(() =>
  import('./components/NetworkTransferSection').then((m) => ({ default: m.NetworkTransferSection }))
);
const SecurityVerifySection = lazy(() =>
  import('./components/SecurityVerifySection').then((m) => ({ default: m.SecurityVerifySection }))
);
const DownloadAppSection = lazy(() =>
  import('./components/DownloadAppSection').then((m) => ({ default: m.DownloadAppSection }))
);
const InteractiveProofStudio = lazy(() =>
  import('./components/InteractiveProofStudio').then((m) => ({ default: m.InteractiveProofStudio }))
);
const PrintPortalDashboard = lazy(() =>
  import('./components/PrintPortalDashboard').then((m) => ({ default: m.PrintPortalDashboard }))
);
const GalleryAndFaq = lazy(() =>
  import('./components/GalleryAndFaq').then((m) => ({ default: m.GalleryAndFaq }))
);
const EyemazeFooter = lazy(() =>
  import('./components/EyemazeFooter').then((m) => ({ default: m.EyemazeFooter }))
);
const EyemazeLocationMap = lazy(() =>
  import('./components/EyemazeLocationMap').then((m) => ({ default: m.EyemazeLocationMap }))
);
const VideoModal = lazy(() =>
  import('./components/VideoModal').then((m) => ({ default: m.VideoModal }))
);
const AiPrintAdvisorModal = lazy(() =>
  import('./components/AiPrintAdvisorModal').then((m) => ({ default: m.AiPrintAdvisorModal }))
);
const SecurityShieldModal = lazy(() =>
  import('./components/SecurityShieldModal').then((m) => ({ default: m.SecurityShieldModal }))
);
const LoginModal = lazy(() =>
  import('./components/LoginModal').then((m) => ({ default: m.LoginModal }))
);
const UserDashboard = lazy(() =>
  import('./components/UserDashboard').then((m) => ({ default: m.UserDashboard }))
);
const EyemazeAdminDashboard = lazy(() =>
  import('./components/EyemazeAdminDashboard').then((m) => ({ default: m.EyemazeAdminDashboard }))
);
const FirebaseIntegrationHub = lazy(() =>
  import('./components/FirebaseIntegrationHub').then((m) => ({ default: m.FirebaseIntegrationHub }))
);

const AUTH_HINT_KEY = 'eyemaze_auth_active';

export default function App() {
  const [orders, setOrders] = useState<PrintOrder[]>(INITIAL_PRINT_ORDERS);
  const [selectedCategory, setSelectedCategory] = useState<PrintCategory>('visiting-cards');
  const [selectedFinish, setSelectedFinish] = useState<PrintFinish>('gold-foil');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authRequested, setAuthRequested] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.hash === '#dashboard' ||
      window.localStorage.getItem(AUTH_HINT_KEY) === '1'
    );
  });
  const [wantsDashboard, setWantsDashboard] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#dashboard'
  );
  const [wantsAdminDashboard, setWantsAdminDashboard] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#admin'
  );

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [firebaseHubModalOpen, setFirebaseHubModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  const ensureAuthInitialized = useCallback(() => {
    setAuthRequested(true);
  }, []);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  // Load Firebase Auth only once auth is requested (#dashboard, #admin, prior session hint, or user interaction/login)
  useEffect(() => {
    if (!authRequested) {
      const onFirstInteraction = () => setAuthRequested(true);
      window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
      window.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });
      return () => {
        window.removeEventListener('pointerdown', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
      };
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    import('./firebase')
      .then(({ subscribeToAuthChanges }) => {
        if (cancelled) return;
        unsubscribe = subscribeToAuthChanges((authProfile) => {
          setUser(authProfile);
          setAuthReady(true);
          try {
            if (authProfile) {
              window.localStorage.setItem(AUTH_HINT_KEY, '1');
            } else {
              window.localStorage.removeItem(AUTH_HINT_KEY);
            }
          } catch {
            // Ignore storage access errors
          }
        });
      })
      .catch(() => {
        if (!cancelled) setAuthReady(true);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [authRequested]);

  // Track #dashboard or #admin hash safely
  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === '#dashboard') {
        setAuthRequested(true);
        setWantsDashboard(true);
        setWantsAdminDashboard(false);
      } else if (window.location.hash === '#admin') {
        setAuthRequested(true);
        setWantsAdminDashboard(true);
        setWantsDashboard(false);
      } else if (window.location.hash === '' || window.location.hash === '#') {
        setWantsDashboard(false);
        setWantsAdminDashboard(false);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // Enforce zero-trust auth gate: prompt Google Sign-In if #dashboard or #admin is requested unauthenticated
  useEffect(() => {
    if (authReady && (wantsDashboard || wantsAdminDashboard) && !user) {
      setLoginModalOpen(true);
    }
  }, [authReady, wantsDashboard, wantsAdminDashboard, user]);

  const isLoggedIn = user !== null;

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  // Contact Inquiry Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactService, setContactService] = useState('Print Services (Offset & Flex)');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleJumpToPortal = () => {
    const el = document.getElementById('portal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddOrder = (newOrder: PrintOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleSelectCategory = (catStr: string) => {
    setSelectedCategory(catStr as PrintCategory);
    handleJumpToPortal();
  };

  const handleSelectSpecForQuote = (cat: PrintCategory, fin: PrintFinish) => {
    setSelectedCategory(cat);
    setSelectedFinish(fin);
    handleJumpToPortal();
  };

  const handleLoginSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setWantsDashboard(true);
    try {
      window.localStorage.setItem(AUTH_HINT_KEY, '1');
    } catch {
      // Ignore storage access errors
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#dashboard';
    }
  };

  const handleSignOut = async () => {
    try {
      const { signOutFirebase } = await import('./firebase');
      await signOutFirebase();
    } finally {
      try {
        window.localStorage.removeItem(AUTH_HINT_KEY);
      } catch {
        // Ignore storage access errors
      }
      setUser(null);
      setWantsDashboard(false);
      setWantsAdminDashboard(false);
      if (typeof window !== 'undefined') {
        window.location.hash = '';
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  // IF AUTHENTICATED & IN ADMIN DASHBOARD: Render Eyemaze Admin CMS
  if (user && wantsAdminDashboard) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f4f7fc] text-slate-900'}`}>
        <Suspense fallback={<div className="min-h-screen bg-slate-950" aria-hidden="true" />}>
          <EyemazeAdminDashboard
            user={user}
            onExitToWebsite={() => {
              setWantsAdminDashboard(false);
              window.location.hash = '';
            }}
            onSignOut={handleSignOut}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          />
        </Suspense>
      </div>
    );
  }

  // IF AUTHENTICATED & IN DASHBOARD: Render the Payowire User Dashboard scoped strictly to `user`
  if (user && wantsDashboard) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f4f7fc] text-slate-900'}`}>
        <Suspense fallback={<div className="min-h-screen bg-slate-950" aria-hidden="true" />}>
          <UserDashboard
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onExitToWebsite={() => {
              setWantsDashboard(false);
              window.location.hash = '';
            }}
            onSignOut={handleSignOut}
            onOpenSecurity={() => setSecurityModalOpen(true)}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          />
        </Suspense>

        {securityModalOpen && (
          <Suspense fallback={null}>
            <SecurityShieldModal
              isOpen={securityModalOpen}
              onClose={() => setSecurityModalOpen(false)}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // PUBLIC MARKETING SITE: 1000% Exact Payowire Visual Clone
  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* 1. Payowire-Style Header / Navbar */}
      <Navbar
        onOpenOrderPortal={handleJumpToPortal}
        onOpenLogin={() => {
          ensureAuthInitialized();
          setLoginModalOpen(true);
        }}
        isLoggedIn={isLoggedIn}
        user={user}
        onGoToDashboard={() => {
          ensureAuthInitialized();
          if (user) {
            setWantsDashboard(true);
            window.location.hash = '#dashboard';
          } else {
            setLoginModalOpen(true);
          }
        }}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenSecurity={() => setSecurityModalOpen(true)}
        onOpenFirebaseHub={() => setFirebaseHubModalOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      <main>
        {/* 2. Hero Section: Exact Payowire Layout with Tilted 3D Card & 8-Action Phone Mockup */}
        <HeroSection
          orders={orders}
          onOpenAiAdvisor={() => setAiModalOpen(true)}
          onJumpToPortal={handleJumpToPortal}
          onOpenVideoModal={() => setVideoModalOpen(true)}
        />

        {/* 3. Section 1: 4-Column Overlapping Feature Strip (-mt-20) */}
        <div id="services">
          <FeaturedStrip onSelectCategory={handleSelectCategory} />
        </div>

        <Suspense fallback={<div className="min-h-[420px]" aria-hidden="true" />}>
          {/* 4. Section 2: Trusted Brand Marquee & Popular Regions Pill Grid */}
          <BrandStripAndTags />

          {/* 5. Section 3: 3-Step Process Track ('How Printing Works') */}
          <HowItWorksSection onOpenPortal={handleJumpToPortal} />

          {/* 6. Section 4: 'The power to make things happen' (POS Terminal Mockup + 6 Features) */}
          <PowerFlexSection onOpenPortal={handleJumpToPortal} />

          {/* 7. Section 5: 'Everything in one print portal' (4 Service Cards with Pastel Icons) */}
          <EverythingInOneSection onSelectCategory={handleSelectCategory} />

          {/* 8. Section 6: 'Why choose Eyemaze' (Apple Pay Wallet Stack + 4 Benefits) */}
          <div id="why-choose">
            <WhyChooseSection />
          </div>

          {/* 9. Section 7: 'Print & packaging logistics for growing brands' (Transit Arc Map + Networks) */}
          <NetworkTransferSection />

          {/* 10. Section 8: 'Security you can verify' (4 Cards with Hearts + 4 Security Badges) */}
          <SecurityVerifySection onOpenSecurityModal={() => setSecurityModalOpen(true)} />

          {/* 11. Section 9: 'Manage Eyemaze from your phone' (Mobile App Promo with QR Code) */}
          <DownloadAppSection />

          {/* 12. Interactive Live Print Portal & Live Cost Estimator */}
          <PrintPortalDashboard
            orders={orders}
            onAddOrder={handleAddOrder}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedFinish={selectedFinish}
            onFinishChange={setSelectedFinish}
          />

          {/* 13. Interactive 3D Finish Simulator */}
          <InteractiveProofStudio />

          {/* 14. Technical Specs Matrix, Portfolio & FAQs */}
          <GalleryAndFaq onSelectSpecForQuote={handleSelectSpecForQuote} />
        </Suspense>

        {/* 15. Contact & Press Studio Section */}
        <section id="contact" className="py-20 px-6 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-400">
                {EYEMAZE_LOCATION.addressNepali} · Press Studio
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-balance">
                Send your artwork or schedule a studio shoot
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-lg">
                Visit our press desk at {EYEMAZE_LOCATION.addressNepali} ({EYEMAZE_LOCATION.plusCode}, {EYEMAZE_LOCATION.locality}) for physical paper stock samples or submit your job requirements online for a same-day quotation.
              </p>

              <div className="space-y-3.5 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    {EYEMAZE_LOCATION.addressNepali} ({EYEMAZE_LOCATION.addressEnglish})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{EYEMAZE_LOCATION.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <a href="tel:+9779844251392" className="hover:text-white transition-colors">
                      +977 9844251392
                    </a>{' '}
                    ·{' '}
                    <a href="tel:+9779814850300" className="hover:text-white transition-colors">
                      +977 9814850300
                    </a>
                  </span>
                </div>
                <div className="pt-2">
                  <a
                    href="#location-map"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open Interactive Google Map ↓</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Print Inquiry Received
                  </h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    Our pre-press coordinator will review your requirements and respond within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white cursor-pointer"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-white pb-2 border-b border-white/10">
                    Request Custom Quote
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Full Name / Company
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name or company"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Service Division
                    </label>
                    <select
                      id="contact-service"
                      value={contactService}
                      onChange={(e) => setContactService(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    >
                      <option>Print Services (Offset & Flex)</option>
                      <option>Stationery Services (Cards & IDs)</option>
                      <option>Design Services (Branding & Packaging)</option>
                      <option>Photography Services (Product & Studio)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Specifications & Quantity
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Size, paper GSM, quantity, lamination, or photography brief..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white brand-gradient hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send Print Inquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div id="location-map" className="max-w-7xl mx-auto mt-12 scroll-mt-24">
            <Suspense fallback={<div className="h-[480px] rounded-3xl bg-slate-900 border border-white/10" aria-hidden="true" />}>
              <EyemazeLocationMap />
            </Suspense>
          </div>
        </section>
      </main>

      {/* 16. Eyemaze 4-Column Footer with Trustpilot Rating */}
      <Suspense fallback={null}>
        <EyemazeFooter onOpenSecurity={() => setSecurityModalOpen(true)} />
      </Suspense>

      {/* 17. Modals */}
      {loginModalOpen && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </Suspense>
      )}

      {videoModalOpen && (
        <Suspense fallback={null}>
          <VideoModal
            isOpen={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
          />
        </Suspense>
      )}

      {aiModalOpen && (
        <Suspense fallback={null}>
          <AiPrintAdvisorModal
            isOpen={aiModalOpen}
            onClose={() => setAiModalOpen(false)}
            defaultCategory={selectedCategory}
          />
        </Suspense>
      )}

      {securityModalOpen && (
        <Suspense fallback={null}>
          <SecurityShieldModal
            isOpen={securityModalOpen}
            onClose={() => setSecurityModalOpen(false)}
          />
        </Suspense>
      )}

      {firebaseHubModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="System Architecture and Firebase Integration Hub"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 overflow-y-auto"
        >
          <div className="relative w-full max-w-5xl my-8">
            <Suspense fallback={null}>
              <FirebaseIntegrationHub onClose={() => setFirebaseHubModalOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
