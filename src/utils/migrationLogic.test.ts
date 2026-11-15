import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deduplicateRecords,
  validateFinancialReconciliation,
  generateGoogleServicesJson,
} from './migrationLogic.js';

test('deduplicateRecords removes duplicate items and reports count', () => {
  const items = [
    { id: 'PROD-1', name: 'Visiting Cards' },
    { id: 'PROD-2', name: 'Letterhead' },
    { id: 'PROD-1', name: 'Visiting Cards Duplicate' },
    { id: 'PROD-3', name: 'Packaging Box' },
    { id: 'PROD-2', name: 'Letterhead Duplicate' },
  ];

  const result = deduplicateRecords(items);
  assert.equal(result.unique.length, 3);
  assert.equal(result.duplicatesCount, 2);
  assert.deepEqual(result.unique.map((x) => x.id), ['PROD-1', 'PROD-2', 'PROD-3']);
});

test('validateFinancialReconciliation computes totals correctly', () => {
  const orders = [{ totalNpr: 6160 }, { totalNpr: 83781 }, { totalNpr: 1200 }];
  const sales = [{ totalNpr: 91141 }];

  const res = validateFinancialReconciliation(orders, sales);
  assert.equal(res.ordersTotalNpr, 91141);
  assert.equal(res.salesTotalNpr, 91141);
  assert.equal(res.isBalanced, true);
});

test('generateGoogleServicesJson generates valid Android configuration JSON', () => {
  const jsonStr = generateGoogleServicesJson(
    'numeric-liberty-jwk2q',
    '1:126258391596:android:3e8271',
    '126258391596-t6u5hvu43jv6em5qfl9ql461dl3kseg6.apps.googleusercontent.com'
  );
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.project_info.project_id, 'numeric-liberty-jwk2q');
  assert.equal(parsed.client[0].client_info.android_client_info.package_name, 'np.com.eyemaze.app');
});
