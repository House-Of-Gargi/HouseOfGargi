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
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchLiveSupabaseData = async () => {
    try {
      setRefreshing(true);
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to load Supabase dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveSupabaseData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/seller/login');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status in Supabase:', err);
      alert('Could not update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Compute live business metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_rupees) || 0), 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const activeFulfillment = orders.filter(o => {
      const s = (o.status || '').toLowerCase();
      return s === 'processing' || s === 'shipped' || s.includes('bespoke');
    }).length;

    // Category breakdown directly from products
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
      {/* 1. ATELIER HEADER CARD                                    */}
      {/* ========================================================= */}
      <div className="atelier-header-card">
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <Sparkles style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h1 className="atelier-page-title">
                Atelier Seller Dashboard
              </h1>
              <span className="atelier-live-pill">
                <span className="atelier-live-dot" />
                SUPABASE LIVE
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--stone-taupe)', margin: '0.35rem 0 0 0', fontWeight: 400 }}>
              Handcrafted Indian Couture &bull; Live Order Fulfillment &amp; Catalog Management
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchLiveSupabaseData}
            title="Refresh Live Data"
            style={{
              background: 'var(--pure-white)',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '2px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.75rem',
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
            <RefreshCw style={{ width: 13, height: 13, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Sync
          </button>

          <Link
            href="/seller/products"
            style={{
              background: 'var(--maharani-maroon)',
              border: '1.5px solid var(--maharani-maroon)',
              borderRadius: '2px',
              padding: '0.55rem 1rem',
              fontSize: '0.75rem',
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
            <Plus style={{ width: 14, height: 14 }} />
            Add New Piece
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'transparent',
              border: '1.5px solid var(--gargi-gold)',
              borderRadius: '2px',
              padding: '0.55rem 0.95rem',
              fontSize: '0.75rem',
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
            <ExternalLink style={{ width: 13, height: 13 }} />
            Preview Boutique
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            style={{
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: '2px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.75rem',
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
            <span className="metric-label">Gross Sales</span>
            <div className="metric-icon-wrap">
              <TrendingUp style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              ₹ {metrics.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="metric-subtext">
              Real-time revenue from {metrics.totalOrders} client orders
            </p>
          </div>
        </div>

        {/* Card 2: Orders Received */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Client Orders</span>
            <div className="metric-icon-wrap">
              <ShoppingBag style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              {metrics.totalOrders}
            </div>
            <p className="metric-subtext">
              <span style={{ color: 'var(--maharani-maroon)', fontWeight: 700 }}>
                {metrics.activeFulfillment} active
              </span>
              &nbsp;in fulfillment pipeline
            </p>
          </div>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Order Value</span>
            <div className="metric-icon-wrap">
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              ₹ {metrics.aov.toLocaleString('en-IN')}
            </div>
            <p className="metric-subtext">
              High-ticket heirloom couture benchmark
            </p>
          </div>
        </div>

        {/* Card 4: Total Inventory */}
        <div className="luxury-metric-card">
          <div className="metric-header">
            <span className="metric-label">Catalog &amp; Stock</span>
            <div className="metric-icon-wrap">
              <PackageCheck style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div>
            <div className="metric-value">
              {metrics.totalStock} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--stone-taupe)' }}>units</span>
            </div>
            <p className="metric-subtext">
              Across {products.length} handcrafted master designs
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
            <p style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', margin: '0.2rem 0 0 0' }}>
              Live inventory distribution across House of Gargi couture lines
            </p>
          </div>

          <Link
            href="/seller/products"
            style={{
              fontFamily: 'var(--font-nav)',
              fontSize: '0.75rem',
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
            Manage Catalog <ChevronRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div className="category-grid">
          {metrics.categories.map(([key, data]) => (
            <div key={key} className="category-cell">
              <div>
                <span className="category-cell-title">{data.label}</span>
                <div className="category-cell-count">{data.count} <span style={{ fontSize: '0.8rem', color: 'var(--stone-taupe)', fontWeight: 400 }}>styles</span></div>
              </div>
              <div className="category-cell-stock">
                <strong>{data.stock}</strong> units in atelier stock
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Warning Banner if any */}
        {metrics.lowStockItems.length > 0 && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8rem',
            color: '#92400E',
          }}>
            <AlertTriangle style={{ width: 16, height: 16, color: '#D97706', flexShrink: 0 }} />
            <span>
              <strong>Inventory Notice:</strong> {metrics.lowStockItems.length} piece{metrics.lowStockItems.length > 1 ? 's have' : ' has'} low atelier stock (&le; 5 units):{' '}
              {metrics.lowStockItems.map(p => p.name).join(', ')}.
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
            <p style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', margin: '0.2rem 0 0 0' }}>
              Connected live to Supabase table &apos;orders&apos; &bull; Update status to sync tracking
            </p>
          </div>

          {/* Controls: Search and Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* Filter pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--ivory-silk)', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--soft-gold-line)' }}>
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
                    color: statusFilter === f.id ? 'var(--ivory-silk)' : 'var(--stone-taupe)',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--pure-white)',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '2px',
              padding: '0.35rem 0.65rem',
            }}>
              <Search style={{ width: 14, height: 14, color: 'var(--stone-taupe)', marginRight: '0.4rem' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order or client..."
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-brown)',
                  width: '160px',
                  background: 'transparent',
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Client Name</th>
                <th>Date Placed</th>
                <th style={{ textAlign: 'right' }}>Total (INR)</th>
                <th>Workflow Stage</th>
                <th style={{ textAlign: 'center' }}>Live State</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Loading client orders from Supabase...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    No orders found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const s = (order.status || '').toLowerCase();
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-nav)', color: 'var(--maharani-maroon)' }}>
                        {order.order_number || `#HG-${order.id.slice(0, 4)}`}
                      </td>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--ink-brown)' }}>
                          {order.customer_name}
                        </strong>
                        {order.customer_phone && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>
                            {order.customer_phone}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--stone-taupe)', fontSize: '0.82rem' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--ink-brown)' }}>
                        ₹ {Number(order.total_rupees || 0).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <select
                            value={order.status || 'Processing'}
                            disabled={isUpdating}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '2px',
                              border: '1px solid var(--soft-gold-line)',
                              background: 'var(--pure-white)',
                              color: 'var(--ink-brown)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.78rem',
                              outline: 'none',
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Bespoke Review">Bespoke Review</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          {isUpdating && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', color: 'var(--maharani-maroon)' }} />}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-pill ${
                          s === 'delivered' ? 'delivered' : s === 'shipped' ? 'shipped' : s.includes('bespoke') ? 'bespoke' : 'processing'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
