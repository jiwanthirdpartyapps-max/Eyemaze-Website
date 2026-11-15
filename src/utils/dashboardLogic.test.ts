import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_USER_PROFILE,
  INITIAL_TRANSACTIONS,
  toggleUserVerification,
  addWalletFunds,
  filterTransactions,
  formatCurrencyDisplay,
} from './dashboardLogic.js';

test('toggleUserVerification flips verification state cleanly', () => {
  const initial = { ...INITIAL_USER_PROFILE, isVerified: false };
  const verified = toggleUserVerification(initial);
  assert.equal(verified.isVerified, true);
  const unverified = toggleUserVerification(verified);
  assert.equal(unverified.isVerified, false);
});

test('addWalletFunds increments NPR and USD correctly', () => {
  const initial = { ...INITIAL_USER_PROFILE, balanceNpr: 10000, balanceUsd: 75.19 };
  const updated = addWalletFunds(initial, 5000, 133);
  assert.equal(updated.balanceNpr, 15000);
  assert.equal(updated.balanceUsd, 112.78);

  // Negative amount should not alter balance
  const unchanged = addWalletFunds(initial, -100);
  assert.equal(unchanged.balanceNpr, 10000);
});

test('filterTransactions filters by type and query correctly', () => {
  const credits = filterTransactions(INITIAL_TRANSACTIONS, 'credit', '');
  assert.equal(credits.length, 1);
  assert.equal(credits[0].type, 'credit');

  const debits = filterTransactions(INITIAL_TRANSACTIONS, 'debit', '');
  assert.equal(debits.length, 2);

  const searched = filterTransactions(INITIAL_TRANSACTIONS, 'all', 'Visiting');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'TXN-9041');
});

test('formatCurrencyDisplay handles NPR and USD formatting properly', () => {
  assert.equal(formatCurrencyDisplay(124555, 'NPR'), 'NPR 124,555');
  assert.equal(formatCurrencyDisplay(0, 'USD'), '$0.00');
  assert.equal(formatCurrencyDisplay(49.9, 'USD'), '$49.90');
});
