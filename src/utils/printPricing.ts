export type PrintCategory =
  | 'visiting-cards'
  | 'flex-banners'
  | 'offset-brochures'
  | 'stationery-sets'
  | 'packaging-boxes'
  | 'merchandise';

export type PrintFinish = 'standard' | 'matte-lamination' | 'spot-uv' | 'gold-foil';
export type TurnaroundSpeed = 'standard' | 'express';

export interface PrintEstimateInput {
  category: PrintCategory;
  quantity: number;
  finish: PrintFinish;
  turnaround: TurnaroundSpeed;
}

export interface PrintEstimateResult {
  unitPriceNpr: number;
  subtotalNpr: number;
  discountPercent: number;
  discountAmountNpr: number;
  rushFeeNpr: number;
  totalNpr: number;
  estimatedDays: string;
}

export type OrderStatus = 'In Press' | 'Proof Review' | 'Dispatched' | 'Completed';

export interface PrintOrder {
  id: string;
  title: string;
  client: string;
  category: PrintCategory;
  spec: string;
  quantity: number;
  totalNpr: number;
  status: OrderStatus;
  updatedAt: string;
}

const BASE_UNIT_RATES: Record<PrintCategory, number> = {
  'visiting-cards': 4.5,
  'flex-banners': 48,
  'offset-brochures': 22,
  'stationery-sets': 65,
  'packaging-boxes': 115,
  'merchandise': 480,
};

const FINISH_MULTIPLIER: Record<PrintFinish, number> = {
  'standard': 1.0,
  'matte-lamination': 1.15,
  'spot-uv': 1.32,
  'gold-foil': 1.55,
};

export function getVolumeDiscountPercent(quantity: number): number {
  if (quantity >= 2500) return 18;
  if (quantity >= 1000) return 12;
  if (quantity >= 500) return 6;
  return 0;
}

export function calculatePrintEstimate(input: PrintEstimateInput): PrintEstimateResult {
  const safeQty = Math.max(1, Math.round(input.quantity));
  const baseUnit = BASE_UNIT_RATES[input.category];
  const finishMult = FINISH_MULTIPLIER[input.finish];
  const unitPriceNpr = Math.round(baseUnit * finishMult * 10) / 10;

  const subtotalNpr = Math.round(safeQty * unitPriceNpr);
  const discountPercent = getVolumeDiscountPercent(safeQty);
  const discountAmountNpr = Math.round((subtotalNpr * discountPercent) / 100);
  const afterDiscount = subtotalNpr - discountAmountNpr;
  const rushFeeNpr = input.turnaround === 'express' ? Math.round(afterDiscount * 0.2) : 0;
  const totalNpr = afterDiscount + rushFeeNpr;

  const estimatedDays =
    input.turnaround === 'express'
      ? input.category === 'offset-brochures' || input.category === 'packaging-boxes'
        ? '2-3 business days'
        : '24-48 hours'
      : input.category === 'offset-brochures' || input.category === 'packaging-boxes'
        ? '5-7 business days'
        : '3-4 business days';

  return {
    unitPriceNpr,
    subtotalNpr,
    discountPercent,
    discountAmountNpr,
    rushFeeNpr,
    totalNpr,
    estimatedDays,
  };
}

export function filterPrintOrders(
  orders: PrintOrder[],
  statusFilter: OrderStatus | 'All',
  searchQuery: string
): PrintOrder[] {
  const q = searchQuery.trim().toLowerCase();
  return orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    if (!matchesStatus) return false;
    if (!q) return true;
    return (
      order.id.toLowerCase().includes(q) ||
      order.title.toLowerCase().includes(q) ||
      order.client.toLowerCase().includes(q) ||
      order.spec.toLowerCase().includes(q)
    );
  });
}

export function computeDashboardSummary(orders: PrintOrder[]) {
  const activeOrders = orders.filter(
    (o) => o.status === 'In Press' || o.status === 'Proof Review'
  ).length;
  const dispatchedCount = orders.filter(
    (o) => o.status === 'Dispatched' || o.status === 'Completed'
  ).length;
  const totalVolumeNpr = orders.reduce((acc, o) => acc + o.totalNpr, 0);
  const totalUnits = orders.reduce((acc, o) => acc + o.quantity, 0);

  return {
    totalOrders: orders.length,
    activeOrders,
    dispatchedCount,
    totalVolumeNpr,
    totalUnits,
  };
}

export function formatNpr(amount: number): string {
  return `NPR ${Math.round(amount).toLocaleString('en-US')}`;
}
