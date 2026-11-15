import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TRANSACTIONS,
  deriveAccountIdFromUid,
  getUserInitials,
  buildUserProfileFromFirebaseAuth,
  toggleUserVerification,
  addWalletFunds,
  filterTransactions,
  formatCurrencyDisplay,
} from './dashboardLogic.js';

const sampleAuthProfile = buildUserProfileFromFirebaseAuth({
  uid: 'uid_alpha_12345',
  displayName: 'Sita Sharma',
  email: 'sita.sharma@example.com',
  emailVerified: true,
});

test('buildUserProfileFromFirebaseAuth creates isolated profiles per authenticated user', () => {
  const userA = buildUserProfileFromFirebaseAuth({
    uid: 'uid_user_a_999',
    displayName: 'Aarav Shrestha',
    email: 'aarav@example.com',
    emailVerified: true,
  });
  const userB = buildUserProfileFromFirebaseAuth({
    uid: 'uid_user_b_888',
    displayName: 'Nisha Gurung',
    email: 'nisha@example.com',
    emailVerified: true,
  });

  assert.notEqual(userA.id, userB.id);
  assert.notEqual(userA.accountId, userB.accountId);
  assert.equal(userA.name, 'Aarav Shrestha');
  assert.equal(userB.name, 'Nisha Gurung');
  assert.equal(userA.role, 'client');
  assert.equal(userA.balanceNpr, 0);
  assert.equal(userA.isVerified, false);
});

test('deriveAccountIdFromUid is deterministic and 8 digits', () => {
  const first = deriveAccountIdFromUid('firebase_uid_xyz');
  const second = deriveAccountIdFromUid('firebase_uid_xyz');
  assert.equal(first, second);
  assert.match(first, /^\d{8}$/);
});

test('getUserInitials formats full name or email cleanly', () => {
  assert.equal(getUserInitials('Sita Sharma'), 'SS');
  assert.equal(getUserInitials('Aarav'), 'AA');
  assert.equal(getUserInitials('', 'client@example.com'), 'CL');
});

test('toggleUserVerification flips verification state cleanly', () => {
  const initial = { ...sampleAuthProfile, isVerified: false };
  const verified = toggleUserVerification(initial);
  assert.equal(verified.isVerified, true);
  const unverified = toggleUserVerification(verified);
  assert.equal(unverified.isVerified, false);
});

test('addWalletFunds increments NPR and USD correctly', () => {
  const initial = { ...sampleAuthProfile, balanceNpr: 10000, balanceUsd: 75.19 };
  const updated = addWalletFunds(initial, 5000, 133);
  assert.equal(updated.balanceNpr, 15000);
  assert.equal(updated.balanceUsd, 112.78);

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
