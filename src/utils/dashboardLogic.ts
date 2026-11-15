export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountId: string;
  balanceNpr: number;
  balanceUsd: number;
  isVerified: boolean;
  totalCards: number;
  bankAccounts: number;
  role: 'client' | 'admin';
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

export const INITIAL_USER_PROFILE: UserProfile = {
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
};

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
