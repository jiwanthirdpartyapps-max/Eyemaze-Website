import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Check,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Plus,
  Link2,
  RefreshCw,
  Receipt,
  Sparkles,
} from 'lucide-react';
import type { UserProfile, WalletTransaction } from '../utils/dashboardLogic';
import {
  type CardNetwork,
  type VirtualCardTokenized,
  type IssuedVirtualCardDetails,
  type ThreeDsChallenge,
  type ThreeDsReceipt,
  generateVirtualCard,
  formatPanSpaced,
  validateCardLinkInput,
  computePanFingerprint,
  create3dsChallenge,
  verify3dsOtpChallenge,
} from '../utils/virtualCardLogic';
import {
  listUserVirtualCards,
  saveUserVirtualCard,
  updateUserVirtualCard,
} from '../firebase';

interface VirtualCardsStudioProps {
  user: UserProfile;
  onCardCountChange: (count: number) => void;
  onRecordTransaction: (tx: WalletTransaction) => void;
  openCreateDirectly?: boolean;
  onHandledOpenCreate?: () => void;
}

export const VirtualCardsStudio: React.FC<VirtualCardsStudioProps> = ({
  user,
  onCardCountChange,
  onRecordTransaction,
  openCreateDirectly,
  onHandledOpenCreate,
}) => {
  const [cards, setCards] = useState<VirtualCardTokenized[]>([]);
  // Plaintext PAN/CVV held strictly in ephemeral memory for newly issued cards (never stored in Firestore per PCI-DSS)
  const [ephemeralSecrets, setEphemeralSecrets] = useState<
    Record<string, { pan: string; cvv: string }>
  >({});
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Issue Card form
  const [showIssuePanel, setShowIssuePanel] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<CardNetwork>('VISA');
  const [spendingLimitUsd, setSpendingLimitUsd] = useState('500');

  // Card Linking & Verification form
  const [linkPan, setLinkPan] = useState('');
  const [linkExpMonth, setLinkExpMonth] = useState('');
  const [linkExpYear, setLinkExpYear] = useState('');
  const [linkCvv, setLinkCvv] = useState('');
  const [linkTargetCardId, setLinkTargetCardId] = useState<string | null>(null);

  // Active 3DS 2.2 OTP Challenge + Receipt
  const [activeChallenge, setActiveChallenge] = useState<ThreeDsChallenge | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [latestReceipt, setLatestReceipt] = useState<ThreeDsReceipt | null>(null);

  useEffect(() => {
    if (openCreateDirectly) {
      setShowIssuePanel(true);
      onHandledOpenCreate?.();
    }
  }, [openCreateDirectly, onHandledOpenCreate]);

  useEffect(() => {
    let active = true;
    setLoadingCards(true);
    listUserVirtualCards(user.id)
      .then((fetched) => {
        if (!active) return;
        setCards(fetched);
        onCardCountChange(fetched.length);
      })
      .catch((err) => {
        if (!active) return;
        setStatusError(err instanceof Error ? err.message : 'Could not load virtual cards.');
      })
      .finally(() => {
        if (active) setLoadingCards(false);
      });
    return () => {
      active = false;
    };
  }, [user.id]);

  const handleIssueCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusError(null);
    try {
      const limit = Math.max(10, Math.min(100000, Number(spendingLimitUsd) || 500));
      const issued: IssuedVirtualCardDetails = generateVirtualCard({
        userId: user.id,
        cardholderName: user.name,
        network: selectedNetwork,
        spendingLimitUsd: limit,
      });
      await saveUserVirtualCard(issued);

      const { pan, cvv, ...tokenized } = issued;
      setEphemeralSecrets((prev) => ({ ...prev, [issued.id]: { pan, cvv } }));
      setCards((prev) => {
        const next = [tokenized, ...prev];
        onCardCountChange(next.length);
        return next;
      });
      setRevealedCardId(issued.id);
      setShowIssuePanel(false);

      // Pre-fill link verifier for immediate 1-click verification convenience
      setLinkTargetCardId(issued.id);
      setLinkPan(formatPanSpaced(pan));
      setLinkExpMonth(issued.expiryMonth);
      setLinkExpYear(issued.expiryYear);
      setLinkCvv(cvv);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Failed to issue virtual card.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFreeze = async (card: VirtualCardTokenized) => {
    const nextStatus = card.status === 'active' ? 'frozen' : 'active';
    setStatusError(null);
    try {
      await updateUserVirtualCard(user.id, card.id, { status: nextStatus });
      setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, status: nextStatus } : c)));
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Unable to update card lock state.');
    }
  };

  const handleCopyPan = (cardId: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAutofillForLinking = (card: VirtualCardTokenized) => {
    const secret = ephemeralSecrets[card.id];
    setLinkTargetCardId(card.id);
    setLinkExpMonth(card.expiryMonth);
    setLinkExpYear(card.expiryYear);
    if (secret) {
      setLinkPan(formatPanSpaced(secret.pan));
      setLinkCvv(secret.cvv);
    } else {
      setLinkPan('');
      setLinkCvv('');
    }
    setStatusError(null);
  };

  const handleStartCardLinkChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError(null);
    setOtpError(null);
    setLatestReceipt(null);

    const validation = validateCardLinkInput({
      pan: linkPan,
      expiryMonth: linkExpMonth,
      expiryYear: linkExpYear,
      cvv: linkCvv,
    });
    if (!validation.valid) {
      setStatusError(validation.error || 'Invalid card inputs.');
      return;
    }

    const fp = computePanFingerprint(
      linkPan,
      linkExpMonth.padStart(2, '0'),
      linkExpYear.padStart(2, '0'),
      user.id
    );
    const matchedCard =
      cards.find((c) => c.panFingerprint === fp) ||
      (linkTargetCardId ? cards.find((c) => c.id === linkTargetCardId) : undefined);

    if (!matchedCard) {
      setStatusError(
        'Card token not found in your Eyemaze PCI Vault. Issue a card first or paste an active issued card.'
      );
      return;
    }
    if (matchedCard.status === 'frozen') {
      setStatusError('This card is currently frozen. Unfreeze it before linking.');
      return;
    }

    const challenge = create3dsChallenge({
      card: matchedCard,
      merchantName: 'Payowire / Eyemaze Card Link Verification',
      amountUsd: 1.0,
      purpose: 'CARD_LINK_VERIFICATION',
    });
    setActiveChallenge(challenge);
    setOtpInput('');
  };

  const handleStartSandboxCheckout = (card: VirtualCardTokenized) => {
    setStatusError(null);
    setOtpError(null);
    setLatestReceipt(null);
    if (card.status === 'frozen') {
      setStatusError('Unfreeze this card before running a 3DS OTP checkout test.');
      return;
    }
    const challenge = create3dsChallenge({
      card,
      merchantName: 'Eyemaze Global Sandbox Checkout',
      amountUsd: 15.0,
      purpose: 'SANDBOX_CHECKOUT',
    });
    setActiveChallenge(challenge);
    setOtpInput('');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge) return;
    setOtpError(null);

    const result = verify3dsOtpChallenge(activeChallenge, otpInput);
    setActiveChallenge(result.challenge);

    if (!result.receipt) {
      setOtpError(result.error || 'OTP verification failed.');
      return;
    }

    setLatestReceipt(result.receipt);
    setActiveChallenge(null);

    if (activeChallenge.purpose === 'CARD_LINK_VERIFICATION') {
      try {
        await updateUserVirtualCard(user.id, activeChallenge.cardId, { isLinkedVerified: true });
        setCards((prev) =>
          prev.map((c) =>
            c.id === activeChallenge.cardId ? { ...c, isLinkedVerified: true } : c
          )
        );
      } catch {
        // Keep local UI synced even if rules update fails transiently
      }
    }

    onRecordTransaction({
      id: result.receipt.authCode,
      title: `${activeChallenge.merchantName} (•••• ${result.receipt.last4})`,
      type: 'debit',
      amountNpr: Math.round(result.receipt.amountUsd * 133),
      amountUsd: result.receipt.amountUsd,
      date: 'Just now (3DS 2.2 OTP)',
      category:
        activeChallenge.purpose === 'CARD_LINK_VERIFICATION'
          ? '3DS Card Verification ($1 Auth)'
          : '3DS Sandbox Checkout',
      status: 'Completed',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & PCI-DSS / 3DS Compliance Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                Virtual Cards &amp; EMV 3DS 2.2 OTP Vault
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                PCI-DSS + 3DS v2.2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Luhn-valid Visa/Mastercard generator, tokenized Cloud Firestore vault, card linking, and OTP-based Strong Customer Authentication (SCA).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowIssuePanel((v) => !v)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showIssuePanel ? 'Close Generator' : 'Issue New Card'}</span>
          </button>
        </div>

        {/* Honest Sandbox vs Live BIN Sponsor Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#FF5B14] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              3DS 2.2 Sandbox &amp; Tokenization Compliance Scope
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
              यहाँ बनेका Visa (`4539...`) र Mastercard (`5412...`) कार्डहरू ISO/IEC 7812 <strong>Luhn-valid</strong> छन् र Eyemaze Portal भित्र Card Linking, Verification र <strong>EMV 3DS 2.2 OTP</strong> checkout को लागि पूर्ण रूपमा चल्छन्। Firestore मा PCI-DSS नियमअनुसार केवल <code>maskedPan</code> र <code>cardToken</code> मात्र सुरक्षित गरिन्छ (raw CVV/PAN कहिल्यै DB मा राखिँदैन)। बाहिरी वास्तविक पसल/अन्तर्राष्ट्रिय साइटमा रियल पैसा चलाउन इजाजतप्राप्त <strong>BIN Sponsor / Issuing Bank API</strong> (जस्तै Stripe Issuing वा Marqeta) जडान आवश्यक हुन्छ।
            </p>
          </div>
        </div>

        {statusError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{statusError}</span>
          </div>
        )}

        {/* Issue Virtual Card Form */}
        {showIssuePanel && (
          <form
            onSubmit={handleIssueCard}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-[#FF5B14]" />
              <span>Generate Luhn-Valid 3DS Enrolled Virtual Card</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Card Network
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['VISA', 'MASTERCARD'] as CardNetwork[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setSelectedNetwork(net)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedNetwork === net
                          ? 'border-[#FF5B14] bg-orange-50 dark:bg-orange-950/40 text-[#FF5B14]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="card-limit-usd"
                  className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5"
                >
                  Monthly Limit (USD)
                </label>
                <input
                  id="card-limit-usd"
                  type="number"
                  min="10"
                  max="100000"
                  required
                  value={spendingLimitUsd}
                  onChange={(e) => setSpendingLimitUsd(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Tokenizing...' : 'Generate & Save to Vault'}
              </button>
            </div>
          </form>
        )}

        {/* Active Cards Grid */}
        {loadingCards ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading tokenized cards from Firestore...
          </div>
        ) : cards.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-[#FF5B14] flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                No Active Virtual Cards Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Issue a Luhn-valid virtual Visa or Mastercard with EMV 3DS 2.2 OTP verification and PCI-DSS tokenization.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowIssuePanel(true)}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#FF5B14] hover:bg-[#e04b08] cursor-pointer"
            >
              Issue My First 3DS Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cards.map((card) => {
              const secret = ephemeralSecrets[card.id];
              const isRevealed = revealedCardId === card.id && Boolean(secret);
              return (
                <div
                  key={card.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-4"
                >
                  {/* Visual Card */}
                  <div
                    className={`h-44 rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between transition-opacity ${
                      card.network === 'VISA'
                        ? 'brand-gradient'
                        : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800'
                    } ${card.status === 'frozen' ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold tracking-widest">PAYOWIRE · 3DS 2.2</span>
                      <span className="font-extrabold italic tracking-wide">{card.network}</span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-mono text-base sm:text-lg tracking-widest font-bold">
                        {isRevealed && secret ? formatPanSpaced(secret.pan) : card.maskedPan}
                      </p>
                      <div className="flex justify-between items-center text-[10px] font-mono opacity-90">
                        <span className="truncate max-w-[160px]">{card.cardholderName}</span>
                        <div className="flex items-center gap-3">
                          <span>
                            EXP {card.expiryMonth}/{card.expiryYear}
                          </span>
                          <span>CVV {isRevealed && secret ? secret.cvv : '•••'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                          card.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {card.status === 'active' ? 'Active' : 'Frozen'}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                          card.isLinkedVerified
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {card.isLinkedVerified ? 'Linked & 3DS Verified' : 'Pending Link Verification'}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500">Limit: ${card.spendingLimitUsd}</span>
                  </div>

                  {/* Card Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {secret && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedCardId(isRevealed ? null : card.id)
                          }
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isRevealed ? 'Hide' : 'Reveal PAN'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPan(card.id, secret.pan)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === card.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === card.id ? 'Copied' : 'Copy PAN'}</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleFreeze(card)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {card.status === 'active' ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      <span>{card.status === 'active' ? 'Freeze' : 'Unfreeze'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAutofillForLinking(card)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Verify Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartSandboxCheckout(card)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-[#FF5B14] hover:bg-[#e04b08] text-white flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Test 3DS OTP ($15)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Linking & 3DS 2.2 Verification Simulator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Link &amp; Verify Card (Luhn Checksum + $1.00 3DS 2.2 OTP Auth)
            </h3>
            <p className="text-xs text-slate-500">
              Test linking any issued Visa/Mastercard with ISO/IEC 7812 Luhn validation and EMV 3DS v2.2.0 OTP verification.
            </p>
          </div>
        </div>

        <form onSubmit={handleStartCardLinkChallenge} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label htmlFor="link-pan" className="block text-xs font-semibold text-slate-500 mb-1.5">
              16-Digit Card Number
            </label>
            <input
              id="link-pan"
              type="text"
              required
              value={linkPan}
              onChange={(e) => setLinkPan(e.target.value)}
              placeholder="4539 68XX XXXX XXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="link-mm" className="block text-xs font-semibold text-slate-500 mb-1.5">
              Exp MM
            </label>
            <input
              id="link-mm"
              type="text"
              required
              maxLength={2}
              value={linkExpMonth}
              onChange={(e) => setLinkExpMonth(e.target.value)}
              placeholder="11"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="link-yy" className="block text-xs font-semibold text-slate-500 mb-1.5">
              Exp YY
            </label>
            <input
              id="link-yy"
              type="text"
              required
              maxLength={2}
              value={linkExpYear}
              onChange={(e) => setLinkExpYear(e.target.value)}
              placeholder="30"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="link-cvv" className="block text-xs font-semibold text-slate-500 mb-1.5">
              CVV
            </label>
            <input
              id="link-cvv"
              type="password"
              required
              maxLength={3}
              value={linkCvv}
              onChange={(e) => setLinkCvv(e.target.value)}
              placeholder="123"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Link &amp; Verify
            </button>
          </div>
        </form>

        {/* Latest Verified 3DS Receipt */}
        {latestReceipt && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <Receipt className="w-4 h-4" />
              <span>EMV 3DS 2.2 Transaction &amp; Card Link Approved ({latestReceipt.scaCompliance})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900">
                <span className="text-slate-400 block">AUTH CODE</span>
                <span className="font-bold text-slate-900 dark:text-white">{latestReceipt.authCode}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900">
                <span className="text-slate-400 block">ECI / 3DS VER</span>
                <span className="font-bold text-emerald-600">
                  ECI {latestReceipt.eci} · v{latestReceipt.threeDsVersion}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900">
                <span className="text-slate-400 block">RRN</span>
                <span className="font-bold text-slate-900 dark:text-white">{latestReceipt.rrn}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900">
                <span className="text-slate-400 block">CARD / AMOUNT</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {latestReceipt.network} ••••{latestReceipt.last4} (${latestReceipt.amountUsd.toFixed(2)})
                </span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 break-all">
              ACS Trans ID: {latestReceipt.acsTransId} · CAVV: {latestReceipt.cavv}
            </p>
          </div>
        )}
      </div>

      {/* EMV 3DS 2.2 ACS OTP CHALLENGE MODAL */}
      {activeChallenge && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="threeds-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h3 id="threeds-modal-title" className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    {activeChallenge.network === 'VISA' ? 'Visa Secure (EMV 3DS 2.2)' : 'Mastercard ID Check (3DS 2.2)'}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500">
                    ACS ID: {activeChallenge.acsTransId} · ECI {activeChallenge.eci}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveChallenge(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeChallenge.merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-mono font-bold text-[#FF5B14]">${activeChallenge.amountUsd.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Card:</span>
                <span className="font-mono">{activeChallenge.maskedPan}</span>
              </div>
            </div>

            {/* Sandbox OTP Delivery Box */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-indigo-900 dark:text-indigo-200">
                  Simulated 3DS SMS / App OTP
                </p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Enter this 6-digit Strong Customer Auth code:
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 font-mono text-base font-extrabold tracking-widest text-indigo-600 border border-indigo-200 dark:border-indigo-700">
                {activeChallenge.otpCode}
              </span>
            </div>

            {otpError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300"
              >
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="threeds-otp-input" className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Enter 6-Digit 3DS OTP
                </label>
                <input
                  id="threeds-otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono text-lg font-bold tracking-[0.35em]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = create3dsChallenge({
                      card: {
                        id: activeChallenge.cardId,
                        userId: user.id,
                        network: activeChallenge.network,
                        cardholderName: user.name,
                        maskedPan: activeChallenge.maskedPan,
                        last4: activeChallenge.maskedPan.slice(-4),
                        expiryMonth: '01',
                        expiryYear: '30',
                        cardToken: 'resend',
                        panFingerprint: 'resend',
                        status: 'active',
                        isLinkedVerified: false,
                        threeDsEnrolled: true,
                        spendingLimitUsd: 500,
                      },
                      merchantName: activeChallenge.merchantName,
                      amountUsd: activeChallenge.amountUsd,
                      purpose: activeChallenge.purpose,
                    });
                    setActiveChallenge(next);
                    setOtpError(null);
                    setOtpInput('');
                  }}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend</span>
                </button>
                <button
                  type="submit"
                  disabled={activeChallenge.status !== 'CHALLENGE_PENDING'}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve 3DS Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
