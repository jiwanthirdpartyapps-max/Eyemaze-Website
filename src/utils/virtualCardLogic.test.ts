import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidLuhn,
  detectCardNetwork,
  generateVirtualCard,
  validateCardLinkInput,
  create3dsChallenge,
  verify3dsOtpChallenge,
  computePanFingerprint,
} from './virtualCardLogic';

test('generateVirtualCard produces Luhn-valid VISA and MASTERCARD PANs with PCI-safe tokenized fields', () => {
  const fixedDate = new Date('2026-11-15T00:00:00Z');
  const visa = generateVirtualCard({
    userId: 'uid_abc123',
    cardholderName: 'Sita Sharma',
    network: 'VISA',
    spendingLimitUsd: 750,
    now: fixedDate,
    seedHint: 'visa-seed-1',
  });

  assert.equal(visa.network, 'VISA');
  assert.equal(visa.pan.length, 16);
  assert.equal(visa.pan.startsWith('4'), true);
  assert.equal(isValidLuhn(visa.pan), true);
  assert.equal(detectCardNetwork(visa.pan), 'VISA');
  assert.equal(visa.maskedPan, `•••• •••• •••• ${visa.last4}`);
  assert.equal(visa.expiryMonth, '11');
  assert.equal(visa.expiryYear, '30');
  assert.equal(visa.cvv.length, 3);
  assert.equal(visa.threeDsEnrolled, true);
  assert.equal(visa.isLinkedVerified, false);

  const mc = generateVirtualCard({
    userId: 'uid_abc123',
    cardholderName: 'Sita Sharma',
    network: 'MASTERCARD',
    now: fixedDate,
    seedHint: 'mc-seed-1',
  });

  assert.equal(mc.network, 'MASTERCARD');
  assert.equal(mc.pan.length, 16);
  assert.equal(isValidLuhn(mc.pan), true);
  assert.equal(detectCardNetwork(mc.pan), 'MASTERCARD');
});

test('validateCardLinkInput rejects bad Luhn and accepts valid issued cards', () => {
  const fixedDate = new Date('2026-11-15T00:00:00Z');
  const card = generateVirtualCard({
    userId: 'uid_xyz',
    cardholderName: 'Test User',
    network: 'VISA',
    now: fixedDate,
    seedHint: 'link-test',
  });

  const ok = validateCardLinkInput({
    pan: card.pan,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cvv: card.cvv,
    now: fixedDate,
  });
  assert.equal(ok.valid, true);
  assert.equal(ok.network, 'VISA');

  // Flip last digit to break Luhn
  const brokenPan = card.pan.slice(0, -1) + String((Number(card.pan.slice(-1)) + 1) % 10);
  const bad = validateCardLinkInput({
    pan: brokenPan,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cvv: card.cvv,
    now: fixedDate,
  });
  assert.equal(bad.valid, false);
});

test('EMV 3DS 2.2 OTP challenge succeeds with valid OTP and locks after 3 wrong attempts or expiry', () => {
  const fixedDate = new Date('2026-11-15T00:00:00Z');
  const card = generateVirtualCard({
    userId: 'uid_3ds',
    cardholderName: 'Aarav Shrestha',
    network: 'MASTERCARD',
    now: fixedDate,
    seedHint: '3ds-seed',
  });

  const fp = computePanFingerprint(card.pan, card.expiryMonth, card.expiryYear, 'uid_3ds');
  assert.equal(fp, card.panFingerprint);

  const challenge = create3dsChallenge({
    card,
    merchantName: 'Eyemaze Press Sandbox',
    amountUsd: 1.0,
    purpose: 'CARD_LINK_VERIFICATION',
    nowMs: 1_000_000,
    otpOverride: '482910',
  });

  assert.equal(challenge.threeDsVersion, '2.2.0');
  assert.equal(challenge.eci, '02');

  // Wrong attempt 1
  const wrong1 = verify3dsOtpChallenge(challenge, '000000', 1_010_000);
  assert.equal(wrong1.receipt, undefined);
  assert.equal(wrong1.challenge.status, 'CHALLENGE_PENDING');

  // Valid OTP on attempt 2
  const success = verify3dsOtpChallenge(wrong1.challenge, '482910', 1_020_000);
  assert.equal(success.challenge.status, 'AUTHENTICATED');
  assert.ok(success.receipt);
  assert.equal(success.receipt.eci, '02');
  assert.equal(success.receipt.scaCompliance, 'PSD2_SCA_OTP_VERIFIED');

  // Expired challenge
  const expired = verify3dsOtpChallenge(challenge, '482910', 1_200_000);
  assert.equal(expired.challenge.status, 'EXPIRED');
  assert.equal(expired.receipt, undefined);
});
