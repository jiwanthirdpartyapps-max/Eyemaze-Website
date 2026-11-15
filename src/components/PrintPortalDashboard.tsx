import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';
import {
  calculatePrintEstimate,
  computeDashboardSummary,
  filterPrintOrders,
  formatNpr,
  type OrderStatus,
  type PrintCategory,
  type PrintFinish,
  type PrintOrder,
  type TurnaroundSpeed,
} from '../utils/printPricing';

interface PrintPortalDashboardProps {
  orders: PrintOrder[];
  onAddOrder: (order: PrintOrder) => void;
  selectedCategory: PrintCategory;
  onCategoryChange: (cat: PrintCategory) => void;
  selectedFinish: PrintFinish;
  onFinishChange: (fin: PrintFinish) => void;
}

const CATEGORY_OPTIONS: { id: PrintCategory; label: string }[] = [
  { id: 'visiting-cards', label: 'Visiting Cards' },
  { id: 'flex-banners', label: 'Flex & Banners' },
  { id: 'offset-brochures', label: 'Offset Catalogs' },
  { id: 'stationery-sets', label: 'Stationery & IDs' },
  { id: 'packaging-boxes', label: 'Packaging Boxes' },
  { id: 'merchandise', label: 'Merchandise' },
];

const FINISH_OPTIONS: { id: PrintFinish; label: string }[] = [
  { id: 'standard', label: 'Standard CMYK' },
  { id: 'matte-lamination', label: 'Matte Lamination' },
  { id: 'spot-uv', label: 'Spot UV Gloss' },
  { id: 'gold-foil', label: 'Gold Foil Stamp' },
];

export const PrintPortalDashboard: React.FC<PrintPortalDashboardProps> = ({
  orders,
  onAddOrder,
  selectedCategory,
  onCategoryChange,
  selectedFinish,
  onFinishChange,
}) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [turnaround, setTurnaround] = useState<TurnaroundSpeed>('standard');
  const [jobTitle, setJobTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [formError, setFormError] = useState('');
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null);

  const summary = useMemo(() => computeDashboardSummary(orders), [orders]);
  const filteredOrders = useMemo(
    () => filterPrintOrders(orders, statusFilter, searchQuery),
    [orders, statusFilter, searchQuery]
  );

  const estimate = useMemo(
    () =>
      calculatePrintEstimate({
        category: selectedCategory,
        quantity,
        finish: selectedFinish,
        turnaround,
      }),
    [selectedCategory, quantity, selectedFinish, turnaround]
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !clientName.trim()) {
      setFormError('Please enter both a print job title and client or company name.');
      return;
    }
    setFormError('');

    const categoryLabel =
      CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.label ?? 'Print Job';
    const finishLabel =
      FINISH_OPTIONS.find((f) => f.id === selectedFinish)?.label ?? 'Standard';
    const newId = `EYM-${4083 + orders.length}`;

    const newOrder: PrintOrder = {
      id: newId,
      title: jobTitle.trim(),
      client: clientName.trim(),
      category: selectedCategory,
      spec: `${categoryLabel} · ${finishLabel} (${turnaround === 'express' ? 'Express' : 'Standard'})`,
      quantity,
      totalNpr: estimate.totalNpr,
      status: 'Proof Review',
      updatedAt: 'Just now',
    };

    onAddOrder(newOrder);
    setJustSubmittedId(newId);
    setJobTitle('');
    setClientName('');
    setTimeout(() => setJustSubmittedId(null), 4000);
  };

  const renderStatusIndicator = (status: OrderStatus) => {
    switch (status) {
      case 'In Press':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
            <Printer className="w-3.5 h-3.5" />
            In Press
          </span>
        );
      case 'Proof Review':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Proof Review
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
            <Truck className="w-3.5 h-3.5" />
            Dispatched
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
    }
  };

  return (
    <section id="portal" className="py-20 px-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              Client Print Portal & Estimator
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage print jobs, quotes & press queue
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Calculate instant NPR pricing with volume discounts and queue your print job directly into our live press tracker.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            मरिण–६, छाप, सिन्धुली Press · Currency: NPR
          </div>
        </div>

        {/* Unified SaaS Dashboard Frame (Single-elevation, 1px hairline borders, no nested card sandwiches) */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 payo-card-shadow overflow-hidden">
          {/* Top Dashboard KPI Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Press Volume</p>
              <p
                data-testid="summary-volume"
                className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums"
              >
                {formatNpr(summary.totalVolumeNpr)}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Print Orders</p>
              <p
                data-testid="summary-total-orders"
                className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums"
              >
                {summary.totalOrders}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active In Queue</p>
              <p className="font-display text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
                {summary.activeOrders}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Units Printed</p>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {summary.totalUnits.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Main Dashboard 2-Column Split: Left Estimator / New Order, Right Live Order Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left Column: Instant Print Estimator & Queue Submission */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-5 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  New Print Quote & Order
                </h3>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  {estimate.estimatedDays}
                </span>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  1. Print Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onCategoryChange(cat.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left truncate cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider & Numeric Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="print-quantity-range" className="text-xs font-semibold text-slate-600">
                    2. Quantity
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                    {quantity.toLocaleString()} units
                    {estimate.discountPercent > 0 ? ` (${estimate.discountPercent}% bulk off)` : ''}
                  </span>
                </div>
                <input
                  id="print-quantity-range"
                  type="range"
                  min={50}
                  max={3000}
                  step={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              {/* Finish & Lamination */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  3. Paper Finish & Coating
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FINISH_OPTIONS.map((fin) => (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => onFinishChange(fin.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left truncate cursor-pointer ${
                        selectedFinish === fin.id
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {fin.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Turnaround Speed */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  4. Production Speed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTurnaround('standard')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      turnaround === 'standard'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Standard Turnaround
                  </button>
                  <button
                    type="button"
                    onClick={() => setTurnaround('express')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      turnaround === 'express'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Express Rush (+20%)
                  </button>
                </div>
              </div>

              {/* Live Price Summary Line */}
              <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-500">Estimated Total</p>
                  <p className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
                    {formatNpr(estimate.totalNpr)}
                  </p>
                </div>
                <p className="text-xs font-mono text-slate-500 tabular-nums">
                  {formatNpr(estimate.unitPriceNpr)} / unit
                </p>
              </div>

              {/* Job Title & Client Name for Submitting to Queue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label htmlFor="job-title-input" className="block text-xs font-semibold text-slate-600 mb-1">
                    Job Title
                  </label>
                  <input
                    id="job-title-input"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Store Launch Flyers"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label htmlFor="client-name-input" className="block text-xs font-semibold text-slate-600 mb-1">
                    Client / Brand
                  </label>
                  <input
                    id="client-name-input"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Himalayan Roasters"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </p>
              )}

              {justSubmittedId && (
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  Order {justSubmittedId} added to Press Queue for Proof Review.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Submit to Press Queue
              </button>
            </form>

            {/* Right Column: Live Press Queue Data Grid */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Live Press Order Queue
                  </h3>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      aria-label="Search print orders"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ID, client, or job..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Status Filter Segmented Controls */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
                  {(['All', 'In Press', 'Proof Review', 'Dispatched', 'Completed'] as const).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          statusFilter === status
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>

                {/* Responsive Order Queue: Mobile Cards + Desktop Data Table */}
                <div>
                  {filteredOrders.length === 0 ? (
                    <div className="py-14 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-sm font-semibold text-slate-700">
                        No matching print orders found
                      </p>
                      <p className="text-xs text-slate-500">
                        Clear your search filter or submit a new print job on the left.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Stacked Order Cards */}
                      <div className="md:hidden divide-y divide-slate-100 border-t border-slate-200">
                        {filteredOrders.map((order) => (
                          <div key={order.id} className="py-4 space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-sm text-slate-900 leading-snug">
                                  {order.title}
                                </p>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">
                                  {order.id} · {order.spec}
                                </p>
                              </div>
                              <div className="shrink-0">{renderStatusIndicator(order.status)}</div>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className="text-slate-600 font-medium">{order.client}</span>
                              <div className="flex items-center gap-3 font-mono tabular-nums">
                                <span className="text-slate-500">{order.quantity.toLocaleString()} pcs</span>
                                <span className="font-semibold text-slate-900">{formatNpr(order.totalNpr)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop High-Density Data Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                              <th className="py-3 pr-4">Job & Spec</th>
                              <th className="py-3 px-3">Client</th>
                              <th className="py-3 px-3 text-right">Qty</th>
                              <th className="py-3 px-3 text-right">Total</th>
                              <th className="py-3 pl-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredOrders.map((order) => (
                              <tr
                                key={order.id}
                                className="hover:bg-slate-50/80 transition-colors"
                              >
                                <td className="py-3.5 pr-4">
                                  <p className="font-semibold text-slate-900 leading-snug">
                                    {order.title}
                                  </p>
                                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                                    {order.id} · {order.spec}
                                  </p>
                                </td>
                                <td className="py-3.5 px-3 text-xs font-medium text-slate-700 whitespace-nowrap">
                                  {order.client}
                                </td>
                                <td className="py-3.5 px-3 text-right font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                                  {order.quantity.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-3 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                                  {formatNpr(order.totalNpr)}
                                </td>
                                <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                                  {renderStatusIndicator(order.status)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Showing {filteredOrders.length} of {orders.length} press jobs</span>
                <span>Updated live from मरिण–६, छाप Press Floor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
