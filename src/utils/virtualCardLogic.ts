export type CardNetwork = 'VISA' | 'MASTERCARD';

export interface VirtualCardTokenized {
  id: string;
  userId: string;
  network: CardNetwork;
  cardholderName: string;
  maskedPan: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardToken: string;
  panFingerprint: string;
  status: 'active' | 'frozen';
  isLinkedVerified: boolean;
  threeDsEnrolled: boolean;
  spendingLimitUsd: number;
}

export interface IssuedVirtualCardDetails extends VirtualCardTokenized {
  pan: string;
  cvv: string;
}

export interface ThreeDsChallenge {
  acsTransId: string;
  cardId: string;
  maskedPan: string;
  network: CardNetwork;
  merchantName: string;
  amountUsd: number;
  purpose: 'CARD_LINK_VERIFICATION' | 'SANDBOX_CHECKOUT';
  otpCode: string;
  threeDsVersion: '2.2.0';
  eci: '05' | '02';
  expiresAtMs: number;
  attemptsUsed: number;
  maxAttempts: number;
  status: 'CHALLENGE_PENDING' | 'AUTHENTICATED' | 'FAILED' | 'EXPIRED';
}

export interface ThreeDsReceipt {
  acsTransId: string;
  authCode: string;
  rrn: string;
  eci: '05' | '02';
  cavv: string;
  threeDsVersion: '2.2.0';
  scaCompliance: 'PSD2_SCA_OTP_VERIFIED';
  network: CardNetwork;
  last4: string;
  merchantName: string;
  amountUsd: number;
  approvedAtIso: string;
}

/**
 * Computes the ISO/IEC 7812 Luhn check digit for a partial PAN payload (first 15 digits).
 */
export function computeLuhnCheckDigit(partialDigits: string): string {
  const digits = partialDigits.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = true; // rightmost of partial is 2nd from right in full PAN
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  const mod = sum % 10;
  return mod === 0 ? '0' : String(10 - mod);
}

/**
 * Validates any 13-19 digit card number using the official Luhn checksum algorithm.
 */
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function detectCardNetwork(cardNumber: string): CardNetwork | null {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4') && (digits.length === 13 || digits.length === 16)) {
    return 'VISA';
  }
  if (digits.length === 16) {
    const prefix2 = Number(digits.slice(0, 2));
    const prefix4 = Number(digits.slice(0, 4));
    if ((prefix2 >= 51 && prefix2 <= 55) || (prefix4 >= 2221 && prefix4 <= 2720)) {
      return 'MASTERCARD';
    }
  }
  return null;
}

export function formatPanSpaced(pan: string): string {
  const digits = pan.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function computePanFingerprint(pan: string, expiryMonth: string, expiryYear: string, uid: string): string {
  const raw = `${pan.replace(/\D/g, '')}|${expiryMonth}/${expiryYear}|${uid}|EYEMAZE_PCI_V1`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `fp_${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

function randomDigits(count: number, seedHint?: string): string {
  if (seedHint) {
    let h = 2166136261;
    let out = '';
    for (let i = 0; i < count; i++) {
      const ch = seedHint.charCodeAt(i % seedHint.length);
      h ^= ch + i * 31;
      h = Math.imul(h, 16777619);
      out += String(Math.abs(h) % 10);
    }
    return out;
  }
  let out = '';
  for (let i = 0; i < count; i++) {
    out += String(Math.floor(Math.random() * 10));
  }
  return out;
}

/**
 * Generates a Luhn-valid Visa or Mastercard virtual card + PCI-DSS tokenized metadata.
 */
export function generateVirtualCard(params: {
  userId: string;
  cardholderName: string;
  network: CardNetwork;
  spendingLimitUsd?: number;
  now?: Date;
  seedHint?: string;
}): IssuedVirtualCardDetails {
  const now = params.now ?? new Date();
  const bin = params.network === 'VISA' ? '453968' : '541275';
  const accountSegment = randomDigits(9, params.seedHint);
  const partial15 = `${bin}${accountSegment}`;
  const checkDigit = computeLuhnCheckDigit(partial15);
  const pan = `${partial15}${checkDigit}`;
  const last4 = pan.slice(-4);
  const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
  const expiryYear = String((now.getFullYear() + 4) % 100).padStart(2, '0');
  const cvv = randomDigits(3, params.seedHint ? `${params.seedHint}_cvv` : undefined).padStart(3, '0');
  const idSuffix = randomDigits(6, params.seedHint ? `${params.seedHint}_id` : undefined);
  const cardId = `crd_${idSuffix}_${last4}`;
  const cardToken = `tok_${params.network.toLowerCase()}_${randomDigits(10)}`;
  const panFingerprint = computePanFingerprint(pan, expiryMonth, expiryYear, params.userId);

  return {
    id: cardId,
    userId: params.userId,
    network: params.network,
    cardholderName: (params.cardholderName || 'EYEMAZE CLIENT').trim().slice(0, 100).toUpperCase(),
    maskedPan: `•••• •••• •••• ${last4}`,
    last4,
    expiryMonth,
    expiryYear,
    cardToken,
    panFingerprint,
    status: 'active',
    isLinkedVerified: false,
    threeDsEnrolled: true,
    spendingLimitUsd: Math.min(100000, Math.max(1, params.spendingLimitUsd ?? 500)),
    pan,
    cvv,
  };
}

/**
 * Validates card details submitted in a Card Linking / Checkout form.
 */
export function validateCardLinkInput(input: {
  pan: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  now?: Date;
}): { valid: boolean; network: CardNetwork | null; error?: string } {
  const digits = input.pan.replace(/\D/g, '');
  if (!isValidLuhn(digits)) {
    return { valid: false, network: null, error: 'Card number failed ISO/IEC 7812 Luhn checksum.' };
  }
  const network = detectCardNetwork(digits);
  if (!network) {
    return { valid: false, network: null, error: 'Only Visa (4xxx) and Mastercard (51-55 / 2221-2720) BINs are supported.' };
  }
  const mm = Number(input.expiryMonth);
  const yy = Number(input.expiryYear);
  if (!Number.isInteger(mm) || mm < 1 || mm > 12 || !Number.isInteger(yy) || yy < 0 || yy > 99) {
    return { valid: false, network, error: 'Invalid expiry date (MM/YY).' };
  }
  const now = input.now ?? new Date();
  const currentYY = now.getFullYear() % 100;
  const currentMM = now.getMonth() + 1;
  if (yy < currentYY || (yy === currentYY && mm < currentMM)) {
    return { valid: false, network, error: 'Card has expired.' };
  }
  if (!/^\d{3}$/.test(input.cvv.trim())) {
    return { valid: false, network, error: 'Invalid 3-digit CVV/CVC security code.' };
  }
  return { valid: true, network };
}

/**
 * Initiates an EMV 3DS 2.2 OTP-based challenge (PSD2 Strong Customer Authentication).
 */
export function create3dsChallenge(params: {
  card: VirtualCardTokenized;
  merchantName: string;
  amountUsd: number;
  purpose: 'CARD_LINK_VERIFICATION' | 'SANDBOX_CHECKOUT';
  nowMs?: number;
  otpOverride?: string;
}): ThreeDsChallenge {
  const nowMs = params.nowMs ?? Date.now();
  const otpCode = params.otpOverride ?? String(Math.floor(100000 + Math.random() * 900000));
  return {
    acsTransId: `acs_${nowMs.toString(36)}_${params.card.last4}`,
    cardId: params.card.id,
    maskedPan: params.card.maskedPan,
    network: params.card.network,
    merchantName: params.merchantName,
    amountUsd: params.amountUsd,
    purpose: params.purpose,
    otpCode,
    threeDsVersion: '2.2.0',
    eci: params.card.network === 'VISA' ? '05' : '02',
    expiresAtMs: nowMs + 120_000,
    attemptsUsed: 0,
    maxAttempts: 3,
    status: 'CHALLENGE_PENDING',
  };
}

/**
 * Verifies the user's 6-digit OTP against an active EMV 3DS 2.2 challenge and returns a cryptographic CAVV receipt.
 */
export function verify3dsOtpChallenge(
  challenge: ThreeDsChallenge,
  submittedOtp: string,
  nowMs: number = Date.now()
): { challenge: ThreeDsChallenge; receipt?: ThreeDsReceipt; error?: string } {
  if (challenge.status !== 'CHALLENGE_PENDING') {
    return { challenge, error: `Challenge already in terminal state (${challenge.status}).` };
  }
  if (nowMs > challenge.expiresAtMs) {
    return {
      challenge: { ...challenge, status: 'EXPIRED' },
      error: '3DS OTP expired after 120 seconds. Request a new OTP challenge.',
    };
  }

  const nextAttempts = challenge.attemptsUsed + 1;
  if (submittedOtp.trim() !== challenge.otpCode) {
    const failedOut = nextAttempts >= challenge.maxAttempts;
    return {
      challenge: {
        ...challenge,
        attemptsUsed: nextAttempts,
        status: failedOut ? 'FAILED' : 'CHALLENGE_PENDING',
      },
      error: failedOut
        ? 'Maximum 3DS OTP attempts exceeded (3/3). Authentication locked.'
        : `Incorrect 6-digit OTP (${challenge.maxAttempts - nextAttempts} attempts remaining).`,
    };
  }

  const verifiedChallenge: ThreeDsChallenge = {
    ...challenge,
    attemptsUsed: nextAttempts,
    status: 'AUTHENTICATED',
  };

  const cavvSeed = `${challenge.acsTransId}:${challenge.cardId}:${challenge.amountUsd}:${nowMs}`;
  const cavv = `CAVV_${computePanFingerprint(cavvSeed, '01', '29', challenge.cardId).replace('fp_', '').toUpperCase()}==`;

  return {
    challenge: verifiedChallenge,
    receipt: {
      acsTransId: challenge.acsTransId,
      authCode: `AUTH${String(Math.abs(nowMs) % 900000 + 100000)}`,
      rrn: `${String(nowMs).slice(-12)}`,
      eci: challenge.eci,
      cavv,
      threeDsVersion: '2.2.0',
      scaCompliance: 'PSD2_SCA_OTP_VERIFIED',
      network: challenge.network,
      last4: challenge.maskedPan.slice(-4),
      merchantName: challenge.merchantName,
      amountUsd: challenge.amountUsd,
      approvedAtIso: new Date(nowMs).toISOString(),
    },
  };
}
