export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountId: string;
  photoUrl?: string;
  emailVerified?: boolean;
  balanceNpr: number;
  balanceUsd: number;
  isVerified: boolean;
  totalCards: number;
  bankAccounts: number;
  role: 'client' | 'admin' | 'cashier' | 'press_operator';
}

export interface WalletTransaction {
  id: string;
  title: string;
  type: 'credit' | 'debit';
  amountNpr: number;
  amountUsd: number;
  date: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface AuthUserInput {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
}

/**
 * Generates a unique, deterministic 8-digit Account ID purely from a user's Firebase UID.
 * Ensures every Google Sign-In / Sign-Up gets their own isolated Account ID with zero hardcoding.
 */
export function deriveAccountIdFromUid(uid: string): string {
  const cleanUid = (uid || '').trim();
  if (!cleanUid) return '10000000';
  let hash = 2166136261;
  for (let i = 0; i < cleanUid.length; i++) {
    hash ^= cleanUid.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const normalized = (Math.abs(hash) % 90000000) + 10000000;
  return String(normalized);
}

/**
 * Computes clean 1-2 letter initials from any authenticated user's display name or email.
 */
export function getUserInitials(name?: string | null, email?: string | null): string {
  const cleanName = (name || '').trim();
  if (cleanName) {
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  }
  const cleanEmail = (email || '').trim();
  if (cleanEmail) {
    return cleanEmail.slice(0, 2).toUpperCase();
  }
  return 'U';
}

/**
 * Maps an authenticated Firebase Google user + optional Firestore document into a strictly user-scoped UserProfile.
 */
export function buildUserProfileFromFirebaseAuth(
  authUser: AuthUserInput,
  firestoreDoc?: Partial<UserProfile> | null
): UserProfile {
  const safeEmail = (firestoreDoc?.email || authUser.email || '').trim().slice(0, 100);
  const fallbackName = safeEmail ? safeEmail.split('@')[0] : 'Eyemaze Client';
  const safeName = (firestoreDoc?.name || authUser.displayName || fallbackName).trim().slice(0, 100);
  const balanceNpr = typeof firestoreDoc?.balanceNpr === 'number' && firestoreDoc.balanceNpr >= 0
    ? firestoreDoc.balanceNpr
    : 0;

  return {
    id: authUser.uid,
    name: safeName,
    email: safeEmail,
    accountId: (firestoreDoc?.accountId || deriveAccountIdFromUid(authUser.uid)).slice(0, 32),
    photoUrl: (firestoreDoc?.photoUrl || authUser.photoURL || '').slice(0, 512),
    emailVerified: Boolean(authUser.emailVerified ?? firestoreDoc?.emailVerified),
    balanceNpr,
    balanceUsd: Math.round((balanceNpr / 133) * 100) / 100,
    isVerified: Boolean(firestoreDoc?.isVerified),
    totalCards: typeof firestoreDoc?.totalCards === 'number' ? firestoreDoc.totalCards : 0,
    bankAccounts: typeof firestoreDoc?.bankAccounts === 'number' ? firestoreDoc.bankAccounts : 0,
    role: firestoreDoc?.role || 'client',
  };
}

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-9041',
    title: 'Visiting Cards Press Order #EYM-4082',
    type: 'debit',
    amountNpr: 6160,
    amountUsd: 46.5,
    date: 'Today, 11:20 AM',
    category: 'Print Order',
    status: 'Completed',
  },
  {
    id: 'TXN-9040',
    title: 'Wallet Fund Top-Up (eSewa / Bank)',
    type: 'credit',
    amountNpr: 25000,
    amountUsd: 188.0,
    date: 'Yesterday, 03:15 PM',
    category: 'Deposit',
    status: 'Completed',
  },
  {
    id: 'TXN-9038',
    title: 'Brochure Offset Print Run #EYM-4076',
    type: 'debit',
    amountNpr: 33414,
    amountUsd: 251.2,
    date: '12 Nov 2026',
    category: 'Print Order',
    status: 'Completed',
  },
];

export function toggleUserVerification(profile: UserProfile): UserProfile {
  return {
    ...profile,
    isVerified: !profile.isVerified,
  };
}

export function addWalletFunds(
  profile: UserProfile,
  amountNpr: number,
  currencyRateUsd: number = 133
): UserProfile {
  if (amountNpr <= 0) return profile;
  const newNpr = profile.balanceNpr + amountNpr;
  const newUsd = Math.round((newNpr / currencyRateUsd) * 100) / 100;
  return {
    ...profile,
    balanceNpr: newNpr,
    balanceUsd: newUsd,
  };
}

export function filterTransactions(
  transactions: WalletTransaction[],
  typeFilter: 'all' | 'credit' | 'debit',
  searchQuery: string
): WalletTransaction[] {
  const q = searchQuery.trim().toLowerCase();
  return transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });
}

export function formatCurrencyDisplay(
  amount: number,
  currency: 'NPR' | 'USD'
): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `NPR ${Math.round(amount).toLocaleString('en-US')}`;
}
