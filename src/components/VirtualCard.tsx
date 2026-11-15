import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Wallet,
  Lock,
  ShieldCheck,
  Smartphone,
  Download,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  type CardNetwork,
  type WalletPlatform,
  type WalletProvisioningPass,
  resolveVirtualCardDisplay,
  createWalletProvisioningPass,
} from '../utils/virtualCardLogic';

export type VirtualCardTheme = 'obsidian' | 'coral' | 'sapphire';

export interface VirtualCardProps {
  cardId?: string;
  network?: CardNetwork;
  cardholderName?: string | null;
  pan?: string | null;
  maskedPan?: string | null;
  last4?: string | null;
  expiryMonth?: string | null;
  expiryYear?: string | null;
  cvv?: string | null;
  status?: 'active' | 'frozen' | 'preview';
  isLinkedVerified?: boolean;
  spendingLimitUsd?: number;
  issuerBrand?: string;
  theme?: VirtualCardTheme;
  /** Optional controlled visibility for Show/Hide toggle */
  isRevealed?: boolean;
  onToggleReveal?: () => void;
  /** Optional provisioned wallet pass state */
  initialWalletPass?: WalletProvisioningPass | null;
  onWalletProvisioned?: (pass: WalletProvisioningPass) => void;
  /** Optional extra action buttons (e.g. Freeze, Verify Link, 3DS OTP) */
  extraActions?: React.ReactNode;
  className?: string;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({
  cardId = 'preview-card',
  network = 'VISA',
  cardholderName,
  pan,
  maskedPan,
  last4,
  expiryMonth,
  expiryYear,
  cvv,
  status = 'active',
  isLinkedVerified = false,
  spendingLimitUsd,
  issuerBrand = 'EYEMAZE',
  theme,
  isRevealed: controlledRevealed,
  onToggleReveal,
  initialWalletPass = null,
  onWalletProvisioned,
  extraActions,
  className = '',
}) => {
  const [internalRevealed, setInternalRevealed] = useState(false);
  const isRevealed =
    typeof controlledRevealed === 'boolean' ? controlledRevealed : internalRevealed;

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<WalletPlatform>('APPLE_WALLET');
  const [provisionedPass, setProvisionedPass] = useState<WalletProvisioningPass | null>(
    initialWalletPass
  );

  const display = resolveVirtualCardDisplay({
    cardholderName,
    pan,
    maskedPan,
    last4,
    expiryMonth,
    expiryYear,
    cvv,
    network,
    isRevealed,
  });

  const handleToggleVisibility = () => {
    if (onToggleReveal) {
      onToggleReveal();
    } else {
      setInternalRevealed((prev) => !prev);
    }
  };

  const handleCopyCardNumber = () => {
    const raw = (pan || '').replace(/\D/g, '');
    const copyValue = raw.length >= 13 ? raw : display.cardNumberDisplay;
    navigator.clipboard?.writeText(copyValue).catch(() => {});
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleProvisionWallet = () => {
    const pass = createWalletProvisioningPass({
      platform: selectedPlatform,
      cardId,
      network,
      cardholderName: display.isPlaceholderHolder ? 'EYEMAZE MEMBER' : cardholderName,
      expiryMonth: display.isPlaceholderExpiry ? '11' : expiryMonth,
      expiryYear: display.isPlaceholderExpiry ? '30' : expiryYear,
      last4: last4 || (pan ? pan.slice(-4) : '0000'),
    });
    setProvisionedPass(pass);
    onWalletProvisioned?.(pass);
  };

  const handleDownloadPassFile = (pass: WalletProvisioningPass) => {
    const payload = JSON.stringify(
      {
        standard: 'EMVCo-Payment-Tokenisation-v2',
        issuer: 'Eyemaze Graphics Enterprises',
        ...pass,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pass.platform.toLowerCase()}-${pass.network.toLowerCase()}-${pass.dpanLast4}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resolvedTheme: VirtualCardTheme =
    theme ?? (network === 'MASTERCARD' ? 'sapphire' : 'obsidian');

  const cardSurfaceClasses: Record<VirtualCardTheme, string> = {
    obsidian:
      'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-slate-700/80 text-white',
    coral:
      'brand-gradient border-white/25 text-white',
    sapphire:
      'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-indigo-400/25 text-white',
  };

  const isFrozen = status === 'frozen';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Modern Fintech Card Canvas (ISO/IEC 7810 ID-1 Banking Proportions) */}
      <div
        data-testid={`virtual-card-${cardId}`}
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 min-h-[214px] flex flex-col justify-between shadow-lg transition-opacity duration-200 ${cardSurfaceClasses[resolvedTheme]} ${
          isFrozen ? 'opacity-70 grayscale' : ''
        }`}
      >
        {/* Subtle banking brushed-metal geometric sheen (non-distracting CSS pattern) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 18%, rgba(255,255,255,0.28) 0%, transparent 45%), radial-gradient(circle at 12% 90%, rgba(255,91,20,0.22) 0%, transparent 42%)',
          }}
        />

        {/* Row 1: Issuer Brand, Tier Descriptor & Contactless NFC Emblem */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <polygon points="12 2 19 6 22 13 17 21 7 21 2 13 5 6 12 2" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-display font-bold text-xs tracking-[0.18em] text-white truncate">
                {issuerBrand}
              </p>
              <p className="text-[10px] text-slate-300 tracking-wide">
                Virtual Debit · EMV 3DS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isFrozen && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Frozen</span>
              </span>
            )}
            {/* NFC Contactless Symbol */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white/85"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-label="Contactless NFC enabled"
            >
              <path d="M5 10.2Q7 12 5 13.8" />
              <path d="M8.5 8Q12 12 8.5 16" />
              <path d="M12 5.8Q17 12 12 18.2" />
              <path d="M15.5 3.6Q22 12 15.5 20.4" />
            </svg>
          </div>
        </div>

        {/* Row 2: Precision Metallic EMV Chip & PAN */}
        <div className="relative z-10 space-y-3.5 my-3">
          <div className="flex items-center justify-between">
            {/* Metallic EMV Chip */}
            <div
              aria-hidden="true"
              className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-100/60 shadow-inner relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-amber-800/35" />
              <div className="absolute inset-y-0 left-1/3 w-px bg-amber-800/35" />
              <div className="absolute inset-y-0 right-1/3 w-px bg-amber-800/35" />
              <div className="absolute inset-2 rounded-[2px] border border-amber-800/35" />
            </div>

            {typeof spendingLimitUsd === 'number' && (
              <span className="font-mono tabular-nums text-[11px] text-slate-300">
                Limit ${spendingLimitUsd.toLocaleString()}
              </span>
            )}
          </div>

          {/* Card Number with Tabular Alignment & Inline Copy */}
          <div className="flex items-center justify-between gap-2">
            <p
              data-testid={`virtual-card-pan-${cardId}`}
              className={`font-mono tabular-nums text-base sm:text-[19px] tracking-[0.14em] font-semibold whitespace-nowrap ${
                display.isPlaceholderNumber && !isRevealed ? 'text-slate-300' : 'text-white'
              }`}
            >
              {display.cardNumberDisplay}
            </p>

            {(display.canRevealFullSecrets || !display.isPlaceholderNumber) && (
              <button
                type="button"
                onClick={handleCopyCardNumber}
                aria-label={copiedNumber ? 'Card number copied' : 'Copy card number'}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {copiedNumber ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Cardholder Name, Expiry, CVV & Network Mark */}
        <div className="relative z-10 flex items-end justify-between gap-4 pt-1">
          <div className="grid grid-cols-12 gap-3 flex-1 min-w-0">
            <div className="col-span-6 min-w-0">
              <span className="block text-[9px] font-semibold tracking-wider text-slate-300/80 uppercase">
                Card Holder
              </span>
              <span
                data-testid={`virtual-card-holder-${cardId}`}
                className={`block text-xs sm:text-sm font-semibold tracking-wide truncate mt-0.5 ${
                  display.isPlaceholderHolder ? 'text-slate-300/80' : 'text-white'
                }`}
              >
                {display.cardholderName}
              </span>
            </div>

            <div className="col-span-3">
              <span className="block text-[9px] font-semibold tracking-wider text-slate-300/80 uppercase">
                Expires
              </span>
              <span
                data-testid={`virtual-card-expiry-${cardId}`}
                className={`block font-mono tabular-nums text-xs sm:text-sm font-semibold mt-0.5 ${
                  display.isPlaceholderExpiry ? 'text-slate-300/80' : 'text-white'
                }`}
              >
                {display.expiryDisplay}
              </span>
            </div>

            <div className="col-span-3">
              <span className="block text-[9px] font-semibold tracking-wider text-slate-300/80 uppercase">
                CVV
              </span>
              <span
                data-testid={`virtual-card-cvv-${cardId}`}
                className="block font-mono tabular-nums text-xs sm:text-sm font-semibold text-white mt-0.5"
              >
                {display.cvvDisplay}
              </span>
            </div>
          </div>

          {/* Network Logo Mark */}
          <div className="shrink-0 flex items-center" aria-label={`${network} network`}>
            {network === 'MASTERCARD' ? (
              <div className="flex items-center -space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#EB001B]/95 block" />
                <span className="w-6 h-6 rounded-full bg-[#F79E1B]/95 block" />
              </div>
            ) : (
              <span className="font-display font-black italic text-lg tracking-tight text-white">
                VISA
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metadata strip: Quiet unboxed typography (Zero-Pill Rule) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 px-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`font-semibold ${
              isFrozen
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {isFrozen ? 'Frozen' : status === 'preview' ? 'Virtual Preview' : 'Active'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {isLinkedVerified ? '3DS Verified' : 'Luhn & EMV 3DS 2.2 Ready'}
          </span>
          {provisionedPass && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                In {provisionedPass.walletLabel} (DPAN {provisionedPass.dpanLast4})
              </span>
            </>
          )}
        </div>

        {isRevealed && !display.canRevealFullSecrets && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Tokenized vault mask active
          </span>
        )}
      </div>

      {/* Primary Banking Action Controls: Show/Hide Toggle + Add to Apple/Google Wallet */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleToggleVisibility}
          aria-pressed={isRevealed}
          aria-label={isRevealed ? 'Hide card number and CVV' : 'Show card number and CVV'}
          className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-white"
        >
          {isRevealed ? (
            <EyeOff className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
          )}
          <span>{isRevealed ? 'Hide Details' : 'Show Details'}</span>
        </button>

        <button
          type="button"
          onClick={() => setWalletModalOpen(true)}
          className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-white"
        >
          <Wallet className="w-4 h-4" aria-hidden="true" />
          <span>
            {provisionedPass
              ? `In ${provisionedPass.walletLabel}`
              : 'Add to Apple / Google Wallet'}
          </span>
        </button>

        {extraActions}
      </div>

      {/* Interactive Apple Wallet / Google Wallet Provisioning Modal */}
      {walletModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`wallet-modal-title-${cardId}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3
                    id={`wallet-modal-title-${cardId}`}
                    className="font-display font-bold text-base text-slate-900 dark:text-white"
                  >
                    Add Virtual Card to Mobile Wallet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    EMVCo Tokenised Device PAN (DPAN) provisioning
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close mobile wallet dialog"
                onClick={() => setWalletModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector (Segmented Control) */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Wallet Platform
              </span>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('APPLE_WALLET')}
                  className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                    selectedPlatform === 'APPLE_WALLET'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                  </svg>
                  <span>Apple Wallet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('GOOGLE_WALLET')}
                  className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                    selectedPlatform === 'GOOGLE_WALLET'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Google Wallet</span>
                </button>
              </div>
            </div>

            {/* Card Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Card Holder</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate">
                  {display.cardholderName}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Funding Card</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {network} · {display.cardNumberDisplay}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Expiry</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {display.expiryDisplay}
                </span>
              </div>
            </div>

            {/* Provisioned Result */}
            {provisionedPass && provisionedPass.platform === selectedPlatform ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Added to {provisionedPass.walletLabel}</span>
                </div>
                <div className="space-y-1 font-mono tabular-nums text-[11px] text-emerald-900 dark:text-emerald-200">
                  <p>Device PAN (DPAN): {provisionedPass.dpanMasked}</p>
                  <p>Token Requestor: {provisionedPass.tokenRequestorId}</p>
                  <p>Pass ID: {provisionedPass.deviceProvisioningId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadPassFile(provisionedPass)}
                  className="min-h-[40px] w-full px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Tokenized Pass Receipt</span>
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Generates a tokenized NFC Device Account Number (DPAN) separated from your underlying card number for contactless Apple Pay or Google Pay simulation.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleProvisionWallet}
                className="min-h-[40px] px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors cursor-pointer whitespace-nowrap"
              >
                {provisionedPass?.platform === selectedPlatform
                  ? `Re-Provision ${selectedPlatform === 'APPLE_WALLET' ? 'Apple' : 'Google'} Token`
                  : `Add to ${selectedPlatform === 'APPLE_WALLET' ? 'Apple Wallet' : 'Google Wallet'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
