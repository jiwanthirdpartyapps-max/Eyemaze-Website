import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Wallet,
  CreditCard,
  Layers,
  Send,
  ArrowRightLeft,
  Smartphone,
  RotateCw,
  Settings,
  Bell,
  ChevronDown,
  X,
  History,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Camera,
  ExternalLink,
  Plus,
  ShieldCheck,
  Copy,
  Check,
  Code2,
  Database,
  LogOut,
} from 'lucide-react';
import { FirebaseIntegrationHub } from './FirebaseIntegrationHub';
import { VirtualCardsStudio } from './VirtualCardsStudio';
import type { UserProfile, WalletTransaction } from '../utils/dashboardLogic';
import {
  getUserInitials,
  toggleUserVerification,
  addWalletFunds,
  formatCurrencyDisplay,
  INITIAL_TRANSACTIONS,
} from '../utils/dashboardLogic';

interface UserDashboardProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onExitToWebsite: () => void;
  onSignOut: () => void;
  onOpenSecurity: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

type DashboardTab =
  | 'dashboard'
  | 'bank-account'
  | 'add-fund'
  | 'create-card'
  | 'card-list'
  | 'send-money'
  | 'payment'
  | 'airtime'
  | 'transactions'
  | 'settings'
  | 'android-bridge'
  | 'firebase-hub';

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUpdateUser,
  onExitToWebsite,
  onSignOut,
  onOpenSecurity,
  isDark,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('USD');
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showAddFundModal, setShowAddFundModal] = useState(false);
  const [openCreateCardInStudio, setOpenCreateCardInStudio] = useState(false);
  const [fundAmountInput, setFundAmountInput] = useState('5000');
  const [fundPaymentMethod, setFundPaymentMethod] = useState('eSewa');
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick Action Click Router
  const handleQuickAction = (tab: DashboardTab) => {
    if (tab === 'add-fund') {
      setShowAddFundModal(true);
    } else if (tab === 'create-card') {
      setOpenCreateCardInStudio(true);
      setActiveTab('card-list');
    } else {
      setActiveTab(tab);
    }
  };

  const handleToggleVerify = () => {
    const updated = toggleUserVerification(user);
    onUpdateUser(updated);
  };

  const handleConfirmAddFund = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundAmountInput) || 0;
    if (amount <= 0) return;

    const updated = addWalletFunds(user, amount);
    onUpdateUser(updated);

    const newTx: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Wallet Top-Up (${fundPaymentMethod})`,
      type: 'credit',
      amountNpr: amount,
      amountUsd: Math.round((amount / 133) * 100) / 100,
      date: 'Just now',
      category: 'Deposit',
      status: 'Completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
    setShowAddFundModal(false);
  };

const ANDROID_KOTLIN_SNIPPET = `// In your Android Studio project: MainActivity.kt
package np.com.eyemaze.app

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.databaseEnabled = true
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // Loads the exact Payowire / Eyemaze Dashboard:
        webView.loadUrl("https://jj.4jsm-life.workers.dev/#dashboard")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;

  const handleCopyAndroidCode = () => {
    navigator.clipboard?.writeText(ANDROID_KOTLIN_SNIPPET).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Interactive Transfer / Payment / Airtime / Bank linking state
  const [transferRecipient, setTransferRecipient] = useState('Aeterna Press Settlement');
  const [transferAmount, setTransferAmount] = useState('2500');
  const [airtimePhone, setAirtimePhone] = useState('9841000000');
  const [airtimeCarrier, setAirtimeCarrier] = useState('NTC');
  const [bankName, setBankName] = useState('Nabil Bank Ltd.');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleTransferOrPayment = (e: React.FormEvent, label: string, category: string) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount) || 0;
    if (amount <= 0) return;

    const newTx: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: label,
      type: 'debit',
      amountNpr: amount,
      amountUsd: Math.round((amount / 133) * 100) / 100,
      date: 'Just now',
      category,
      status: 'Completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
    setActionFeedback(`${label} (NPR ${amount.toLocaleString()}) recorded successfully.`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleLinkBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAccountNo.trim()) return;
    onUpdateUser({ ...user, bankAccounts: user.bankAccounts + 1 });
    setBankAccountNo('');
    setActionFeedback(`Linked ${bankName} account to your Eyemaze Payowire wallet.`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f4f7fc] text-slate-900'} flex`}>
      {/* 1. LEFT SIDEBAR (Replicating exact Payowire sidebar in image_1f64d8e5.png) */}
      <aside className="w-64 sm:w-72 bg-white dark:bg-slate-900 m-3 sm:m-4 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <span className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold shadow-md">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6 12 2" />
              </svg>
            </span>
            <span className="font-display font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              Payowire
            </span>
          </div>

          {/* User Profile Card (Dynamic Authenticated User) */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              {/* Avatar with Camera Badge */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-orange-500 overflow-hidden flex items-center justify-center text-white font-bold text-base shadow-sm">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getUserInitials(user.name, user.email)}</span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] shadow-sm">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </div>

              {/* User Name & Details */}
              <div className="min-w-0">
                <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                  {user.name}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Account ID: {user.accountId}
                </p>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
                  Balance: <span className="font-mono">{formatCurrencyDisplay(currency === 'USD' ? user.balanceUsd : user.balanceNpr, currency)}</span>
                </p>
              </div>
            </div>

            {/* Verification Status Badge */}
            <button
              type="button"
              onClick={handleToggleVerify}
              title="Click to toggle account verification status"
              className={`w-full py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                user.isVerified
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {user.isVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Account</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Unverified (Click to Verify)</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Menu (Payowire Exact Item Order) */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard' as DashboardTab, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, color: 'text-orange-500' },
              { id: 'bank-account' as DashboardTab, label: 'Bank Account', icon: <Building2 className="w-4 h-4" />, color: 'text-purple-500' },
              { id: 'add-fund' as DashboardTab, label: 'Add Fund', icon: <Wallet className="w-4 h-4" />, color: 'text-emerald-500' },
              { id: 'create-card' as DashboardTab, label: 'Create Card', icon: <CreditCard className="w-4 h-4" />, color: 'text-pink-500' },
              { id: 'card-list' as DashboardTab, label: 'Card List', icon: <Layers className="w-4 h-4" />, color: 'text-orange-500' },
              { id: 'send-money' as DashboardTab, label: 'Send Money', icon: <Send className="w-4 h-4" />, color: 'text-blue-500' },
              { id: 'payment' as DashboardTab, label: 'Payment', icon: <ArrowRightLeft className="w-4 h-4" />, color: 'text-indigo-500' },
              { id: 'airtime' as DashboardTab, label: 'Mobile Airtime', icon: <Smartphone className="w-4 h-4" />, color: 'text-green-500' },
              { id: 'transactions' as DashboardTab, label: 'Transactions', icon: <RotateCw className="w-4 h-4" />, color: 'text-rose-500' },
              { id: 'android-bridge' as DashboardTab, label: 'Android App Bridge', icon: <Code2 className="w-4 h-4" />, color: 'text-teal-500' },
              { id: 'firebase-hub' as DashboardTab, label: 'System Audit & DB', icon: <Database className="w-4 h-4" />, color: 'text-amber-500' },
              { id: 'settings' as DashboardTab, label: 'Settings', icon: <Settings className="w-4 h-4" />, color: 'text-purple-500' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'add-fund') setShowAddFundModal(true);
                  else if (item.id === 'create-card') {
                    setOpenCreateCardInStudio(true);
                    setActiveTab('card-list');
                  } else setActiveTab(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#FFF3EC] dark:bg-orange-950/40 text-[#FF5B14] font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={activeTab === item.id ? 'text-[#FF5B14]' : item.color}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Exit & Sign Out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <button
            type="button"
            onClick={onExitToWebsite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Back to Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <span>Sign Out ({getUserInitials(user.name, user.email)})</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* Top Header Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitToWebsite}
              aria-label="Back to public website"
              className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              ←
            </button>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight capitalize">
              {activeTab === 'android-bridge'
                ? 'Android Studio App Bridge'
                : activeTab === 'firebase-hub'
                ? 'System Audit & Migration Hub (Phase 0–6)'
                : activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector (USD vs NPR) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 flex items-center text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-[#FF5B14] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('NPR')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  currency === 'NPR'
                    ? 'bg-[#FF5B14] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                NPR (रू)
              </button>
            </div>

            {/* Banking Security Shield */}
            <button
              type="button"
              onClick={onOpenSecurity}
              title="Banking-Grade Security Audit"
              className="p-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 transition-colors cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setActiveTab('transactions')}
              className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-colors cursor-pointer relative shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Avatar Button */}
            <button
              type="button"
              aria-label="Open profile settings"
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1.5 px-3 rounded-full shadow-2xs cursor-pointer"
            >
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                  {getUserInitials(user.name, user.email)}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Strip */}
        <nav aria-label="Mobile Dashboard Navigation" className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'dashboard' as DashboardTab, label: 'Dashboard' },
            { id: 'card-list' as DashboardTab, label: 'Virtual Cards' },
            { id: 'firebase-hub' as DashboardTab, label: 'System Audit & DB' },
            { id: 'android-bridge' as DashboardTab, label: 'Android Bridge' },
            { id: 'bank-account' as DashboardTab, label: 'Banks' },
            { id: 'send-money' as DashboardTab, label: 'Send Money' },
            { id: 'payment' as DashboardTab, label: 'Payment' },
            { id: 'airtime' as DashboardTab, label: 'Airtime' },
            { id: 'transactions' as DashboardTab, label: 'Transactions' },
            { id: 'settings' as DashboardTab, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FF5B14] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Peach Card: WALLET BALANCE (Payowire Exact) */}
            <section
              aria-label="Wallet Balance Summary"
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#FFF1E8] via-[#FFEADF] to-[#FFF5EE] dark:from-slate-900 dark:via-orange-950/20 dark:to-slate-900 border border-[#FFDFCE] dark:border-orange-900/40 shadow-sm space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#B45309] dark:text-orange-400">
                    WALLET BALANCE
                  </p>
                  <p className="font-display font-extrabold text-4xl sm:text-5xl text-slate-950 dark:text-white tracking-tight mt-1">
                    {formatCurrencyDisplay(currency === 'USD' ? user.balanceUsd : user.balanceNpr, currency)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 font-medium">
                    Welcome back, {user.name}
                  </p>
                </div>

                {/* Right Top Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFundModal(true)}
                    className="px-6 py-3 rounded-full text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors shadow-md shadow-orange-600/25 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Fund</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('transactions')}
                    className="px-5 py-3 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <History className="w-4 h-4 text-slate-500" />
                    <span>Transactions</span>
                  </button>
                </div>
              </div>

              {/* 3 Horizontal Stats Divided by Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#FFDFCE] dark:border-orange-900/30 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    <CreditCard className="w-4 h-4" />
                    <span>Total Cards</span>
                  </div>
                  <p className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    {user.totalCards}
                  </p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:border-r border-[#FFDFCE] dark:border-orange-900/30 pt-3 sm:pt-0">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>Bank Accounts</span>
                  </div>
                  <p className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    {user.bankAccounts}
                  </p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 border-[#FFDFCE] dark:border-orange-900/30 pt-3 sm:pt-0">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Account</span>
                  </div>
                  <p className={`font-display font-extrabold text-xl ${user.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS Card (Payowire Exact 8 Square Buttons) */}
            <section aria-label="Quick Actions" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                QUICK ACTIONS
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-2">
                {[
                  { id: 'create-card' as DashboardTab, label: 'Create Card', bg: 'bg-[#FF5B14]', icon: <CreditCard className="w-6 h-6 text-white" /> },
                  { id: 'card-list' as DashboardTab, label: 'Card List', bg: 'bg-[#3B82F6]', icon: <Layers className="w-6 h-6 text-white" /> },
                  { id: 'send-money' as DashboardTab, label: 'Send Money', bg: 'bg-[#14B8A6]', icon: <Send className="w-6 h-6 text-white" /> },
                  { id: 'payment' as DashboardTab, label: 'Payment', bg: 'bg-[#6366F1]', icon: <ArrowRightLeft className="w-6 h-6 text-white" /> },
                  { id: 'airtime' as DashboardTab, label: 'Airtime', bg: 'bg-[#22C55E]', icon: <Smartphone className="w-6 h-6 text-white" /> },
                  { id: 'bank-account' as DashboardTab, label: 'Bank Account', bg: 'bg-[#F59E0B]', icon: <Building2 className="w-6 h-6 text-white" /> },
                  { id: 'transactions' as DashboardTab, label: 'Transaction', bg: 'bg-[#EC4899]', icon: <RotateCw className="w-6 h-6 text-white" /> },
                  { id: 'android-bridge' as DashboardTab, label: 'Statement', bg: 'bg-[#8B5CF6]', icon: <FileText className="w-6 h-6 text-white" /> },
                ].map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-transform hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Bottom Row: 3 Feature Cards + Android App Connect Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: My Cards */}
              <button
                type="button"
                aria-label="My Cards"
                onClick={() => setActiveTab('card-list')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                    {user.totalCards}
                  </p>
                  <p className="text-xs text-slate-500">My Cards</p>
                </div>
              </button>

              {/* Card 2: Settings */}
              <button
                type="button"
                aria-label="Settings Profile & security"
                onClick={() => setActiveTab('settings')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-purple-300 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Settings
                  </p>
                  <p className="text-xs text-slate-500">Profile &amp; security</p>
                </div>
              </button>

              {/* Card 3: Android Studio Bridge */}
              <button
                type="button"
                aria-label="Android Studio Login clone & build"
                onClick={() => setActiveTab('android-bridge')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-300 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Android Studio
                  </p>
                  <p className="text-xs text-slate-500">Login clone &amp; build</p>
                </div>
              </button>

              {/* Card 4: Security Shield Audit */}
              <button
                type="button"
                aria-label="Banking Shield TLS 1.3 & AI Guard"
                onClick={onOpenSecurity}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-rose-300 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Banking Shield
                  </p>
                  <p className="text-xs text-slate-500">TLS 1.3 &amp; AI Guard</p>
                </div>
              </button>
            </div>

            {/* Recent Press Activity Table */}
            <section aria-label="Recent Account Activity" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  RECENT TRANSACTIONS & PRESS ORDERS
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  View All History →
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.slice(0, 3).map((t) => (
                  <div key={t.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                          t.type === 'credit'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {t.type === 'credit' ? '↓' : '↑'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {t.title}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {t.id} · {t.date}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm font-mono font-bold ${
                          t.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {t.type === 'credit' ? '+' : '-'}
                        {formatCurrencyDisplay(currency === 'USD' ? t.amountUsd : t.amountNpr, currency)}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 3. ANDROID STUDIO APP BRIDGE VIEW (Answers the user's explicit question) */}
        {activeTab === 'android-bridge' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    Android Studio App Clone & Login Integration Guide
                  </h2>
                  <p className="text-xs text-slate-500">
                    How to clone, build, and connect your Android Studio App with this login dashboard.
                  </p>
                </div>
              </div>

              {/* Nepali Explanation */}
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
                <p className="font-bold text-orange-900 dark:text-orange-300 text-sm">
                  तपाईंको प्रश्नको उत्तर (Android App मा कसरी Login clone / build गर्ने?):
                </p>
                <p>
                  तपाईंले Android Studio मा बनाउनुभएको Android App मा यो Web Login र Dashboard जोड्ने २ ओटा उत्तम तरिकाहरू छन्:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 pt-1">
                  <li>
                    <strong>विधि १ (सबैभन्दा सजिलो &amp; 100% Exact Clone): Android WebView / TWA</strong> — तपाईंको Android Studio को <code>MainActivity.kt</code> मा WebView राखेर यो Web App को URL load गरिदिनुहोस्। यसो गर्दा Web मा जे देखिन्छ, Android App भित्र पनि हुबहु 100% clone चल्छ र single session cookie मा login रहन्छ।
                  </li>
                  <li>
                    <strong>विधि २ (Native Android UI): Firebase Auth ID Token Verification</strong> — तपाईंको Android Studio मा प्रयोगकर्ताले Google Sign-In गरेपछि <code>FirebaseAuth.getInstance().currentUser?.getIdToken(true)</code> बाट रियल ID Token प्राप्त गरी <code>POST /api/auth/verify</code> मा <code>Authorization: Bearer &lt;token&gt;</code> मार्फत पठाउनुहोस्। सर्भरले Google को पब्लिक x509 प्रमाणपत्रबाट टोकन जाँच गरी सोही प्रयोगकर्ताको मात्र वास्तविक प्रोफाइल र UID फिर्ता गर्छ।
                  </li>
                </ol>
              </div>

              {/* Code Snippet: Kotlin for Android Studio */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Android Studio Kotlin Code (MainActivity.kt)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAndroidCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Kotlin Code'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{ANDROID_KOTLIN_SNIPPET}</pre>
                </div>
              </div>

              {/* Android REST API Specs */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Zero-Trust Firebase ID Token Verification Endpoint
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono">
                  <p className="text-emerald-600 font-bold">POST /api/auth/verify</p>
                  <p className="text-slate-500 dark:text-slate-400">Request Headers:</p>
                  <pre className="p-2 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
{`Authorization: Bearer <FIREBASE_GOOGLE_ID_TOKEN>`}
                  </pre>
                  <p className="text-slate-500 dark:text-slate-400">Response (200 OK — Dynamic Authenticated User):</p>
                  <pre className="p-2 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
{`{
  "success": true,
  "user": {
    "uid": "${user.id}",
    "name": "${user.name}",
    "email": "${user.email}",
    "accountId": "${user.accountId}",
    "emailVerified": ${Boolean(user.emailVerified)}
  }
}`}
                  </pre>
                </div>
              </div>

              {/* Callout to Phase 0-6 Architecture Hub */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-500" />
                    <span>Phase 0 to Phase 6 Architecture &amp; Migration Hub</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Verify Project IDs, copy google-services.json, run data deduplication, test offline sync and atomic transactions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('firebase-hub')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  Open System Audit Hub →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FIREBASE & ANDROID UNIFICATION ARCHITECTURE (Phase 0 - Phase 6) */}
        {activeTab === 'firebase-hub' && (
          <div className="space-y-6">
            <FirebaseIntegrationHub />
          </div>
        )}

        {/* 4. OTHER SUB-VIEWS: Transactions / Settings / Cards */}
        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                All Transactions & Press Payments
              </h2>
              <button
                type="button"
                onClick={() => setShowAddFundModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] cursor-pointer"
              >
                + Add Fund
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                        t.type === 'credit'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {t.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {t.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {t.id} · {t.date} · {t.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-mono font-bold ${
                        t.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {t.type === 'credit' ? '+' : '-'}
                      {formatCurrencyDisplay(currency === 'USD' ? t.amountUsd : t.amountNpr, currency)}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'card-list' && (
          <VirtualCardsStudio
            user={user}
            onCardCountChange={(count) => {
              if (user.totalCards !== count) {
                onUpdateUser({ ...user, totalCards: count });
              }
            }}
            onRecordTransaction={(tx) => setTransactions((prev) => [tx, ...prev])}
            openCreateDirectly={openCreateCardInStudio}
            onHandledOpenCreate={() => setOpenCreateCardInStudio(false)}
          />
        )}

        {activeTab === 'bank-account' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Linked Bank Accounts
                </h2>
                <p className="text-xs text-slate-500">Connect Nepali commercial banks via ConnectIPS / Fonepay</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#FF5B14]">
                {user.bankAccounts} Linked
              </span>
            </div>

            {actionFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}

            <form onSubmit={handleLinkBank} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="bank-name" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Bank Institution
                </label>
                <select
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option>Nabil Bank Ltd.</option>
                  <option>NIC Asia Bank</option>
                  <option>Global IME Bank</option>
                  <option>Siddhartha Bank</option>
                  <option>Himalayan Bank</option>
                </select>
              </div>
              <div>
                <label htmlFor="bank-acct" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Account Number
                </label>
                <input
                  id="bank-acct"
                  type="text"
                  required
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  placeholder="00101234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] cursor-pointer"
              >
                + Link Bank Account
              </button>
            </form>
          </div>
        )}

        {(activeTab === 'send-money' || activeTab === 'payment') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                {activeTab === 'send-money' ? 'Send Money & Vendor Payout' : 'Print Invoice Payment'}
              </h2>
              <p className="text-xs text-slate-500">
                Instant settlement across Eyemaze Press orders, paper suppliers, and Payowire accounts.
              </p>
            </div>

            {actionFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}

            <form
              onSubmit={(e) =>
                handleTransferOrPayment(
                  e,
                  `${activeTab === 'send-money' ? 'Transfer to' : 'Payment for'} ${transferRecipient}`,
                  activeTab === 'send-money' ? 'Transfer' : 'Press Invoice'
                )
              }
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label htmlFor="tx-recipient" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Recipient / Invoice ID
                </label>
                <input
                  id="tx-recipient"
                  type="text"
                  required
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
              <div>
                <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Amount (NPR)
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  min="100"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] cursor-pointer"
              >
                {activeTab === 'send-money' ? 'Send Money Now' : 'Pay Invoice Now'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'airtime' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                Mobile Airtime &amp; Data Top-Up
              </h2>
              <p className="text-xs text-slate-500">Instant Nepal Telecom (NTC), Ncell, and SmartCell recharge.</p>
            </div>

            {actionFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}

            <form
              onSubmit={(e) =>
                handleTransferOrPayment(e, `${airtimeCarrier} Recharge (${airtimePhone})`, 'Mobile Airtime')
              }
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label htmlFor="airtime-carrier" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Operator
                </label>
                <select
                  id="airtime-carrier"
                  value={airtimeCarrier}
                  onChange={(e) => setAirtimeCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option>NTC</option>
                  <option>Ncell</option>
                  <option>Nepal Telecom Fiber</option>
                </select>
              </div>
              <div>
                <label htmlFor="airtime-phone" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="airtime-phone"
                  type="tel"
                  required
                  value={airtimePhone}
                  onChange={(e) => setAirtimePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
              <div>
                <label htmlFor="airtime-amt" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Amount (NPR)
                </label>
                <input
                  id="airtime-amt"
                  type="number"
                  min="50"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#22C55E] hover:bg-emerald-600 cursor-pointer"
              >
                Recharge Now
              </button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
              Profile &amp; Account Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Full Name</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Email Address</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{user.email}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Account ID</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{user.accountId}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Verification Status</span>
                <span className={`font-bold text-sm ${user.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {user.isVerified ? 'Verified Account' : 'Unverified (Action Required)'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onOpenSecurity}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Banking Security Status</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExitToWebsite}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  Return to Website
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. FLOATING PWA / APP INSTALL BANNER (Bottom-Right in image_1f64d8e5.png) */}
      {showInstallBanner && (
        <aside
          aria-label="Install App Notification"
          className="fixed bottom-6 right-6 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 max-w-sm animate-fade-in"
        >
          {/* Jewel Icon */}
          <span className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6 12 2" />
            </svg>
          </span>

          <div className="min-w-0 pr-2">
            <p className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
              Install Payowire app
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Faster access to your cards and wallet.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('android-bridge')}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors cursor-pointer shadow-xs"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setShowInstallBanner(false)}
              aria-label="Close install prompt"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 6. ADD FUND MODAL */}
      {showAddFundModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-fund-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 id="add-fund-title" className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Add Funds to Wallet
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFundModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddFund} className="space-y-4">
              <div>
                <label htmlFor="fund-amount" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Amount in NPR (रू)
                </label>
                <input
                  id="fund-amount"
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={fundAmountInput}
                  onChange={(e) => setFundAmountInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Deposit Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['eSewa', 'Khalti', 'ConnectIPS', 'Bank Card', 'Wire Transfer', 'Cash at Press'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFundPaymentMethod(method)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        fundPaymentMethod === method
                          ? 'border-[#FF5B14] bg-orange-50 dark:bg-orange-950/40 text-[#FF5B14] font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors shadow-md shadow-orange-600/20 cursor-pointer"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
