'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  TrendingUp, 
  Sparkles, 
  PackageCheck, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  LogOut, 
  Plus, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shirt,
  Layers,
  Loader2,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import CustomDropdown from '@/components/CustomDropdown';

const STATUS_OPTIONS = [
  { value: 'Processing', label: 'Processing' },
  { value: 'Bespoke Review', label: 'Bespoke Review' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
];

export default function ArtisanDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [artisan, setArtisan] = useState<{
    name: string;
    artisanNo: string;
    artStyle?: string;
    regionalBelonging?: string;
  }>({
    name: 'Gopal Chandra Dey',
    artisanNo: 'HG-84192',
    artStyle: 'Tangail Jamdani Pit Loom',
    regionalBelonging: 'Shantipur, Nadia, West Bengal',
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchLiveBackendData = async () => {
    try {
      setRefreshing(true);

      const sessionStr = typeof window !== 'undefined'
        ? (localStorage.getItem('artisan_session') || localStorage.getItem('auth_session'))
        : null;

      let email = '';
      if (sessionStr) {
        try {
          const parsed = JSON.parse(sessionStr);
          if (parsed.email) email = parsed.email;
          if (parsed.name) setArtisan(prev => ({ ...prev, name: parsed.name }));
        } catch {}
      }

      // Parallel fetch from unified backend APIs
      const [ordersRes, prodsRes, artisanRes] = await Promise.all([
        fetch('/api/orders').then(r => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/admin/products').then(r => r.json()).catch(() => ({ products: [] })),
        fetch(`/api/artisan/me${email ? `?email=${encodeURIComponent(email)}` : ''}`).then(r => r.json()).catch(() => ({})),
      ]);

      if (ordersRes.success && Array.isArray(ordersRes.orders)) {
        setOrders(ordersRes.orders);
      }
      if (prodsRes.success && Array.isArray(prodsRes.products)) {
        setProducts(prodsRes.products);
      }
      if (artisanRes.success && artisanRes.artisan) {
        setArtisan({
          name: artisanRes.artisan.name || 'Gopal Chandra Dey',
          artisanNo: artisanRes.artisan.artisanNo || 'HG-84192',
          artStyle: artisanRes.artisan.artStyle || 'Tangail Jamdani Pit Loom',
          regionalBelonging: artisanRes.artisan.regionalBelonging || 'Shantipur, Nadia, West Bengal',
        });
      }
    } catch (err) {
      console.error('Failed to load artisan dashboard backend data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveBackendData();
  }, []);

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artisan_session');
      localStorage.removeItem('admin_session');
      localStorage.removeItem('super_admin_session');
      localStorage.removeItem('auth_session');
    }
    try {
      await supabase.auth.signOut();
    } catch {}
    router.push('/seller/login?logout=true');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);

      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status in backend:', err);
      alert('Could not update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Compute live business metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_rupees) || 0), 0);
    const artisanShare = Math.round(totalRevenue * 0.85);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const activeFulfillment = orders.filter(o => {
      const s = (o.status || '').toLowerCase();
      return s === 'processing' || s === 'shipped' || s.includes('bespoke');
    }).length;

    // Category breakdown directly from real products
    const categoriesMap: Record<string, { count: number; stock: number; label: string }> = {
      sarees: { count: 0, stock: 0, label: 'Banarasi Sarees' },
      lehengas: { count: 0, stock: 0, label: 'Bridal Lehengas' },
      'kurta-sets': { count: 0, stock: 0, label: 'Artisan Kurta Sets' },
      accessories: { count: 0, stock: 0, label: 'Heritage Jewellery' },
    };

    products.forEach(p => {
      const cat = (p.category || '').toLowerCase();
      if (categoriesMap[cat]) {
        categoriesMap[cat].count += 1;
        categoriesMap[cat].stock += Number(p.stock) || 0;
      }
    });

    // Low stock items (stock <= 5)
    const lowStockItems = products.filter(p => Number(p.stock) <= 5);

    return {
      totalRevenue,
      artisanShare,
      totalOrders,
      aov,
      totalStock,
      activeFulfillment,
      categories: Object.entries(categoriesMap),
      lowStockItems,
    };
  }, [orders, products]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = statusFilter === 'all' || (o.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchSearch = searchQuery === '' || 
        o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div>
      {/* ========================================================= */}
      {/* 1. PERSONALIZED ARTISAN WELCOME HEADER                    */}
      {/* ========================================================= */}
      <div className="atelier-header-card">
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <Sparkles style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <h1 className="atelier-page-title">
              Welcome, <span style={{ color: 'var(--maharani-maroon)' }}>{artisan.name}</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#4A3E36', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Artisan ID: <strong style={{ color: 'var(--maharani-maroon)' }}>{artisan.artisanNo}</strong> &bull; {artisan.artStyle} &bull; Live Workshop Orders &amp; Loom Inventory
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchLiveBackendData}
            title="Sync Live Data"
            style={{
              background: 'var(--pure-white)',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '2px',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ink-brown)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Sync Data
          </button>

          <Link
            href="/seller/products"
            style={{
              background: 'var(--maharani-maroon)',
              border: '1.5px solid var(--maharani-maroon)',
              borderRadius: '2px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ivory-silk)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <Plus style={{ width: 15, height: 15 }} />
            My Creations
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'transparent',
              border: '1.5px solid var(--gargi-gold)',
              borderRadius: '2px',
              padding: '0.65rem 1.1rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--maharani-maroon)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <ExternalLink style={{ width: 14, height: 14 }} />
            Storefront
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            style={{
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: '2px',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--maharani-maroon)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
            }}
          >
            <LogOut style={{ width: 13, height: 13 }} />
            Sign Out
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 4 EXECUTIVE E-COMMERCE METRIC SUMMARY CARDS             */}
      {/* ========================================================= */}
      <div className="luxury-metrics-grid">
        {/* Card 1: Gross Sales */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Workshop Gross Sales</span>
            <div className="metric-icon-wrap">
              <TrendingUp style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              ₹ {metrics.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="metric-subtext">
              Total sales volume across {metrics.totalOrders} client orders
            </p>
          </div>
        </div>

        {/* Card 2: 85% Artisan Payout */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Your Atelier Share (85%)</span>
            <div className="metric-icon-wrap">
              <DollarSign style={{ width: 18, height: 18, color: '#2E7D32' }} />
            </div>
          </div>
          <div>
            <div className="metric-value" style={{ color: '#2E7D32' }}>
              ₹ {metrics.artisanShare.toLocaleString('en-IN')}
            </div>
            <p className="metric-subtext">
              Direct workshop payout ledger
            </p>
          </div>
        </div>

        {/* Card 3: Active Orders */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Loom Orders</span>
            <div className="metric-icon-wrap">
              <ShoppingBag style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              {metrics.activeFulfillment}
            </div>
            <p className="metric-subtext">
              <span style={{ color: 'var(--maharani-maroon)', fontWeight: 700 }}>
                {metrics.activeFulfillment} active
              </span>
              &nbsp;in weaving &amp; dispatch pipeline
            </p>
          </div>
        </div>

        {/* Card 4: Total Inventory Stock */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Live Loom Stock</span>
            <div className="metric-icon-wrap">
              <PackageCheck style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              {metrics.totalStock} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--stone-taupe)' }}>units</span>
            </div>
            <p className="metric-subtext">
              Across {products.length} catalog couture creations
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. COLLECTION CATALOG BREAKDOWN & STOCK HEALTH            */}
      {/* ========================================================= */}
      <div className="category-overview-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink-brown)', margin: 0 }}>
              Collection Portfolio &amp; Loom Inventory
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)', margin: '0.2rem 0 0 0' }}>
              Live inventory distribution across House of Gargi couture lines
            </p>
          </div>

          <Link
            href="/seller/inventory"
            style={{
              fontFamily: 'var(--font-nav)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--maharani-maroon)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Manage Stock <ChevronRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div className="category-grid">
          {metrics.categories.map(([key, data]) => (
            <div key={key} className="category-cell">
              <div>
                <span className="category-cell-title">{data.label}</span>
                <div className="category-cell-count">{data.count} <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)', fontWeight: 500 }}>designs</span></div>
              </div>
              <div className="category-cell-stock">
                <strong>{data.stock}</strong> units in workshop stock
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Warning Banner if any */}
        {metrics.lowStockItems.length > 0 && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1.15rem',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.92rem',
            color: '#92400E',
          }}>
            <AlertTriangle style={{ width: 16, height: 16, color: '#D97706', flexShrink: 0 }} />
            <span>
              <strong>Loom Notice:</strong> {metrics.lowStockItems.length} design{metrics.lowStockItems.length > 1 ? 's have' : ' has'} low workshop inventory (&le; 5 units):{' '}
              {metrics.lowStockItems.map(p => p.name).slice(0, 3).join(', ')}{metrics.lowStockItems.length > 3 ? ` + ${metrics.lowStockItems.length - 3} more` : ''}.
            </span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. REAL-TIME ORDERS MANAGEMENT TABLE                      */}
      {/* ========================================================= */}
      <div className="luxury-table-card">
        <div className="table-top-bar">
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink-brown)', margin: 0 }}>
              Live Client Orders &amp; Fulfillment
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)', margin: '0.2rem 0 0 0' }}>
              Connected live to order fulfillment registry &bull; Changes update courier tracking in real time
            </p>
          </div>

          {/* Controls: Search and Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--ivory-silk)', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--soft-gold-line)' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'processing', label: 'Processing' },
                { id: 'bespoke review', label: 'Bespoke' },
                { id: 'shipped', label: 'Shipped' },
                { id: 'delivered', label: 'Delivered' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  style={{
                    background: statusFilter === f.id ? 'var(--maharani-maroon)' : 'transparent',
                    color: statusFilter === f.id ? 'var(--ivory-silk)' : 'var(--ink-brown)',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <Search style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-taupe)' }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.85rem',
                  borderRadius: '2px',
                  border: '1px solid var(--soft-gold-line)',
                  background: 'var(--pure-white)',
                  color: 'var(--ink-brown)',
                  outline: 'none',
                  minWidth: 180,
                }}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="seller-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Client Name</th>
                <th>Destination</th>
                <th>Gross Total</th>
                <th>Atelier Share (85%)</th>
                <th>Fulfillment Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const gross = Number(order.total_rupees) || 0;
                  const share = Math.round(gross * 0.85);
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                        {order.order_number || `#HG-${order.id}`}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {order.customer_name || 'Patron'}
                      </td>
                      <td style={{ color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
                        {order.delivery_city || 'India'}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ₹ {gross.toLocaleString('en-IN')}
                      </td>
                      <td style={{ fontWeight: 700, color: '#2E7D32' }}>
                        ₹ {share.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge badge--${(order.status || 'processing').toLowerCase().replace(' ', '-')}`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td style={{ minWidth: 170 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CustomDropdown
                            value={order.status || 'Processing'}
                            options={STATUS_OPTIONS}
                            onChange={(newVal) => handleUpdateOrderStatus(order.id, newVal)}
                          />
                          {isUpdating && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', color: 'var(--maharani-maroon)' }} />}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    No order records found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
