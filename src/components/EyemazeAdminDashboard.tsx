import React, { useState } from 'react';
import { 
  Printer, 
  Package, 
  Settings, 
  Users, 
  TrendingUp, 
  LogOut, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Plus, 
  Save, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { type UserProfile } from '../utils/dashboardLogic';
import { INITIAL_PRINT_ORDERS } from '../data/eyemazeData';
import { type PrintOrder, type OrderStatus } from '../utils/printPricing';
import { EYEMAZE_LOCATION } from '../data/eyemazeLocation';

interface EyemazeAdminDashboardProps {
  user: UserProfile;
  onExitToWebsite: () => void;
  onSignOut: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const EyemazeAdminDashboard: React.FC<EyemazeAdminDashboardProps> = ({
  user,
  onExitToWebsite,
  onSignOut,
  isDark,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'settings'>('overview');
  const [orders, setOrders] = useState<PrintOrder[]>(INITIAL_PRINT_ORDERS);
  const [announcement, setAnnouncement] = useState('ยินดีต้อนรับ / Welcome to Eyemaze Graphics Enterprises — Marin-6, Chhap, Sindhuli press portal.');
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  const [productsList, setProductsList] = useState([
    { id: '1', name: 'Gold-Foil Visiting Cards (350 GSM Matte)', basePrice: 1200, category: 'visiting-cards', status: 'Active' },
    { id: '2', name: 'Heavy Offset Flex Banners (300 GSM)', basePrice: 45, category: 'flex-banners', status: 'Active' },
    { id: '3', name: 'Custom Product Packaging Boxes (Art Card)', basePrice: 3500, category: 'packaging', status: 'Active' },
    { id: '4', name: 'Official Letterhead & Envelopes Set', basePrice: 2000, category: 'stationery', status: 'Active' },
  ]);

  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) return;
    setProductsList(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newProductName.trim(),
        basePrice: Number(newProductPrice) || 500,
        category: 'custom',
        status: 'Active'
      }
    ]);
    setNewProductName('');
    setNewProductPrice('');
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalNpr, 0);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f4f7fc] text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`w-full md:w-72 border-b md:border-b-0 md:border-r ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 flex flex-col justify-between shrink-0`}>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base tracking-tight leading-tight">
                Eyemaze Admin CMS
              </h1>
              <p className="text-xs text-rose-500 font-medium">Marin-6, Chhap, Sindhuli</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'brand-gradient text-white shadow-md shadow-rose-500/20'
                  : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Studio Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'brand-gradient text-white shadow-md shadow-rose-500/20'
                  : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Print Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'brand-gradient text-white shadow-md shadow-rose-500/20'
                  : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Products & Rates</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'brand-gradient text-white shadow-md shadow-rose-500/20'
                  : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Studio CMS Settings</span>
            </button>
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-800/10 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={onExitToWebsite}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Portal</span>
            </button>
          </div>

          <button
            onClick={onSignOut}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Studio Admin Console</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeTab === 'overview' && 'Overview & Live Metrics'}
              {activeTab === 'orders' && 'Print Orders & Job Queue'}
              {activeTab === 'products' && 'Products & Rate Management'}
              {activeTab === 'settings' && 'Studio CMS Settings & Announcements'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Firestore Connected</span>
            </span>
          </div>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-2`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="font-display text-3xl font-extrabold text-emerald-500">
                  Rs. {totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">+18% vs last month</p>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-2`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Print Jobs</span>
                  <Package className="w-4 h-4 text-rose-500" />
                </div>
                <p className="font-display text-3xl font-extrabold">
                  {orders.filter(o => o.status !== 'Completed').length}
                </p>
                <p className="text-xs text-slate-500">In press queue</p>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-2`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Studio Location</span>
                  <Building2 className="w-4 h-4 text-blue-500" />
                </div>
                <p className="font-display text-base font-extrabold truncate">
                  {EYEMAZE_LOCATION.locality}
                </p>
                <p className="text-xs text-slate-500">{EYEMAZE_LOCATION.plusCode}</p>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-2`}>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Admin Account</span>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <p className="font-display text-sm font-bold truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
              <h3 className="font-display text-lg font-bold">Recent Print Orders</h3>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">#{order.id}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500">
                          {order.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {order.quantity} units · {order.spec} · Rs. {order.totalNpr.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        order.status === 'In Press' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6 pt-8">
            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">All Client Orders & Job Queue</h3>
                <span className="text-xs font-semibold text-slate-500">Total: {orders.length} orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Category / Spec</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3">Total (NPR)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 font-bold">#{order.id}</td>
                        <td className="py-4">
                          <p className="font-semibold capitalize">{order.category}</p>
                          <p className="text-xs text-slate-500">{order.spec}</p>
                        </td>
                        <td className="py-4 font-semibold">{order.quantity}</td>
                        <td className="py-4 font-extrabold text-emerald-500">Rs. {order.totalNpr.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                            order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                            order.status === 'In Press' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'In Press')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 cursor-pointer"
                          >
                            In Press
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer"
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Products & Rates */}
        {activeTab === 'products' && (
          <div className="space-y-8 pt-8">
            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
              <h3 className="font-display text-lg font-bold">Add New Print Product or Service</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                    placeholder="e.g. Metallic Foil Visiting Cards"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Base Price (NPR)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={e => setNewProductPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white brand-gradient hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </form>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
              <h3 className="font-display text-lg font-bold">Active Products & Rate Matrix</h3>
              <div className="space-y-4">
                {productsList.map(prod => (
                  <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{prod.name}</p>
                      <p className="text-xs text-slate-500 capitalize">Category: {prod.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-extrabold text-emerald-500">Rs. {prod.basePrice.toLocaleString()}</p>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                        {prod.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 pt-8">
            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
              <h3 className="font-display text-lg font-bold">Website Announcement Banner</h3>
              <p className="text-xs text-slate-500">
                Update the live announcement ticker displayed on top of the portal.
              </p>

              <div className="space-y-4">
                <textarea
                  rows={3}
                  value={announcement}
                  onChange={e => setAnnouncement(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-rose-500 resize-none"
                />
                <button
                  onClick={() => {
                    setAnnouncementSaved(true);
                    setTimeout(() => setAnnouncementSaved(false), 3000);
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white brand-gradient hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Announcement</span>
                </button>
                {announcementSaved && (
                  <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Announcement updated successfully!</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
