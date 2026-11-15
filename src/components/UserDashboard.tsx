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
} from 'lucide-react';
import type { UserProfile, WalletTransaction } from '../utils/dashboardLogic';
import {
  toggleUserVerification,
  addWalletFunds,
  formatCurrencyDisplay,
  INITIAL_TRANSACTIONS,
} from '../utils/dashboardLogic';

interface UserDashboardProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onExitToWebsite: () => void;
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
  | 'android-bridge';

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUpdateUser,
  onExitToWebsite,
  onOpenSecurity,
  isDark,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('USD');
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showAddFundModal, setShowAddFundModal] = useState(false);
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [fundAmountInput, setFundAmountInput] = useState('5000');
  const [fundPaymentMethod, setFundPaymentMethod] = useState('eSewa');
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick Action Click Router
  const handleQuickAction = (tab: DashboardTab) => {
    if (tab === 'add-fund') {
      setShowAddFundModal(true);
    } else if (tab === 'create-card') {
      setShowCreateCardModal(true);
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

  const handleCreateVirtualCard = () => {
    const updated = {
      ...user,
      totalCards: user.totalCards + 1,
    };
    onUpdateUser(updated);
    setShowCreateCardModal(false);
  };

  const handleCopyAndroidCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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

          {/* User Profile Card (Jiwan Kumar Majhi) */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              {/* Avatar with Camera Badge */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-orange-500 overflow-hidden flex items-center justify-center text-white font-bold text-base shadow-sm">
                  <span>JM</span>
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
              { id: 'settings' as DashboardTab, label: 'Settings', icon: <Settings className="w-4 h-4" />, color: 'text-purple-500' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'add-fund') setShowAddFundModal(true);
                  else if (item.id === 'create-card') setShowCreateCardModal(true);
                  else setActiveTab(item.id);
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

        {/* Exit back to Website */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onExitToWebsite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Back to Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitToWebsite}
              className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              ←
            </button>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight capitalize">
              {activeTab === 'android-bridge' ? 'Android Studio App Bridge' : activeTab.replace('-', ' ')}
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
              className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-colors cursor-pointer relative shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Avatar Dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1.5 px-3 rounded-full shadow-2xs cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                JM
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </header>

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
              <div
                onClick={() => setShowCreateCardModal(true)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors"
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
              </div>

              {/* Card 2: Settings */}
              <div
                onClick={() => setActiveTab('settings')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Settings
                  </p>
                  <p className="text-xs text-slate-500">Profile & security</p>
                </div>
              </div>

              {/* Card 3: Android Studio Bridge */}
              <div
                onClick={() => setActiveTab('android-bridge')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Android Studio
                  </p>
                  <p className="text-xs text-slate-500">Login clone & build</p>
                </div>
              </div>

              {/* Card 4: Security Shield Audit */}
              <div
                onClick={onOpenSecurity}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:border-rose-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Banking Shield
                  </p>
                  <p className="text-xs text-slate-500">TLS 1.3 & AI Guard</p>
                </div>
              </div>
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
                    <strong>विधि २ (Native Android UI): REST API Login</strong> — तपाईंको Android Studio को Login Screen बाट सिधै <code>POST /api/auth/login</code> मा Retrofit वा OkHttp बाट request पठाउनुहोस्। Server ले token र user data (Jiwan Kumar Majhi) फिर्ता गर्छ, जसलाई Android को <code>SharedPreferences</code> मा सेभ गरेर dashboard खोल्न सकिन्छ।
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
                  <pre>{`// In your Android Studio project: MainActivity.kt
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
}`}</pre>
                </div>
              </div>

              {/* Android REST API Specs */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Native Android REST API Auth Endpoint
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono">
                  <p className="text-emerald-600 font-bold">POST /api/auth/login</p>
                  <p className="text-slate-500 dark:text-slate-400">Request Body:</p>
                  <pre className="p-2 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
{`{
  "email": "4jsm.life@gmail.com",
  "password": "your_secure_password"
}`}
                  </pre>
                  <p className="text-slate-500 dark:text-slate-400">Response (200 OK):</p>
                  <pre className="p-2 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
{`{
  "success": true,
  "user": {
    "name": "Jiwan Kumar Majhi",
    "email": "4jsm.life@gmail.com",
    "accountId": "85050801",
    "balanceNpr": 124555
  },
  "token": "jwt_eyemaze_NDpzbS5saWZl"
}`}
                  </pre>
                </div>
              </div>
            </div>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  My Cards
                </h2>
                <p className="text-xs text-slate-500">Virtual & Physical Payowire Cards</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCardModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] cursor-pointer"
              >
                + Create Card
              </button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#FF5B14] flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  No Active Virtual Cards Yet
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Issue an instant virtual Visa or Mastercard for safe online print orders and international purchases.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCardModal(true)}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] cursor-pointer"
              >
                Issue My First Card
              </button>
            </div>
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

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenSecurity}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Banking Security Status</span>
              </button>

              <button
                type="button"
                onClick={onExitToWebsite}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white brand-gradient cursor-pointer"
              >
                Return to Website
              </button>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
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

      {/* 7. CREATE CARD MODAL */}
      {showCreateCardModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-card-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 id="create-card-title" className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Issue Virtual Payowire Card
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateCardModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Card */}
            <div className="h-44 rounded-2xl brand-gradient p-5 text-white shadow-xl flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold tracking-widest">PAYOWIRE / EYEMAZE</span>
                <span className="font-bold italic">VISA</span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-base tracking-widest font-bold">
                  4821 9081 3340 7712
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono opacity-85">
                  <span>{user.name.toUpperCase()}</span>
                  <span>12/29</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateVirtualCard}
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors cursor-pointer"
            >
              Issue Virtual Card Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
