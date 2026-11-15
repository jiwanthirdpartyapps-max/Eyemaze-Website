import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePrintEstimate,
  computeDashboardSummary,
  filterPrintOrders,
  formatNpr,
  getVolumeDiscountPercent,
  type PrintOrder,
} from './printPricing';

test('getVolumeDiscountPercent applies correct tier thresholds', () => {
  assert.equal(getVolumeDiscountPercent(100), 0);
  assert.equal(getVolumeDiscountPercent(500), 6);
  assert.equal(getVolumeDiscountPercent(1000), 12);
  assert.equal(getVolumeDiscountPercent(2500), 18);
});

test('calculatePrintEstimate computes base, volume discount, and express rush fee', () => {
  const std = calculatePrintEstimate({
    category: 'visiting-cards',
    quantity: 500,
    finish: 'matte-lamination',
    turnaround: 'standard',
  });
  // 4.5 * 1.15 = 5.175 -> 5.2 unitPrice; 500 * 5.2 = 2600; 6% discount = 156; total = 2444
  assert.equal(std.unitPriceNpr, 5.2);
  assert.equal(std.subtotalNpr, 2600);
  assert.equal(std.discountPercent, 6);
  assert.equal(std.discountAmountNpr, 156);
  assert.equal(std.rushFeeNpr, 0);
  assert.equal(std.totalNpr, 2444);

  const express = calculatePrintEstimate({
    category: 'visiting-cards',
    quantity: 500,
    finish: 'matte-lamination',
    turnaround: 'express',
  });
  assert.equal(express.rushFeeNpr, Math.round(2444 * 0.2));
  assert.equal(express.totalNpr, 2444 + express.rushFeeNpr);
});

test('filterPrintOrders filters accurately by status and search query', () => {
  const sample: PrintOrder[] = [
    {
      id: 'EYM-101',
      title: 'Gold Foil Business Cards',
      client: 'Himalayan Bank',
      category: 'visiting-cards',
      spec: '350 GSM Matte · Gold Foil',
      quantity: 1000,
      totalNpr: 6160,
      status: 'In Press',
      updatedAt: 'Today, 10:30 AM',
    },
    {
      id: 'EYM-102',
      title: 'Outdoor Flex Hoarding',
      client: 'Nabil Coffee',
      category: 'flex-banners',
      spec: '12x4 ft Star Flex · UV Ink',
      quantity: 10,
      totalNpr: 4800,
      status: 'Dispatched',
      updatedAt: 'Yesterday',
    },
  ];

  assert.equal(filterPrintOrders(sample, 'All', '').length, 2);
  assert.equal(filterPrintOrders(sample, 'In Press', '').length, 1);
  assert.equal(filterPrintOrders(sample, 'All', 'nabil').length, 1);
  assert.equal(filterPrintOrders(sample, 'Dispatched', 'EYM-101').length, 0);
});

test('computeDashboardSummary aggregates order counts and revenue', () => {
  const sample: PrintOrder[] = [
    {
      id: 'EYM-101',
      title: 'Gold Foil Business Cards',
      client: 'Himalayan Bank',
      category: 'visiting-cards',
      spec: '350 GSM',
      quantity: 1000,
      totalNpr: 6000,
      status: 'In Press',
      updatedAt: 'Today',
    },
    {
      id: 'EYM-102',
      title: 'Catalog Run',
      client: 'Everest Gear',
      category: 'offset-brochures',
      spec: '170 GSM Art Paper',
      quantity: 500,
      totalNpr: 12000,
      status: 'Completed',
      updatedAt: 'Mon',
    },
  ];

  const summary = computeDashboardSummary(sample);
  assert.equal(summary.totalOrders, 2);
  assert.equal(summary.activeOrders, 1);
  assert.equal(summary.dispatchedCount, 1);
  assert.equal(summary.totalVolumeNpr, 18000);
  assert.equal(summary.totalUnits, 1500);
  assert.equal(formatNpr(18000), 'NPR 18,000');
});
