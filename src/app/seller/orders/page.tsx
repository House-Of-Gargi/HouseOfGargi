'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  ShoppingBag, 
  Search, 
  Loader2 
} from 'lucide-react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state immediately
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status in Supabase:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

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
      {/* Header Card */}
      <div className="atelier-header-card">
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <ShoppingBag style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h1 className="atelier-page-title">
                Client Order Manifests &amp; Fulfillment
              </h1>
              <span className="atelier-live-pill">
                <span className="atelier-live-dot" />
                {orders.length} LIVE ORDERS
              </span>
            </div>
            <p style={{ fontSize: '0.98rem', color: 'var(--stone-taupe)', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Direct live sync with Supabase table &apos;orders&apos; &bull; Manage bespoke commissions &amp; courier manifests
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="table-top-bar" style={{ background: 'var(--pure-white)', padding: '1rem 1.5rem', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'processing', label: 'In-Weave / Processing' },
            { id: 'bespoke review', label: 'Bespoke Review' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background: statusFilter === tab.id ? 'var(--maharani-maroon)' : 'var(--ivory-silk)',
                color: statusFilter === tab.id ? 'var(--ivory-silk)' : 'var(--stone-taupe)',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '2px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {tab.label}
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
          padding: '0.45rem 0.85rem',
        }}>
          <Search style={{ width: 15, height: 15, color: 'var(--stone-taupe)', marginRight: '0.45rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order # or client..."
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--ink-brown)',
              width: '180px',
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="luxury-table-card">
        <div className="table-top-bar" style={{ paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink-brown)', margin: 0 }}>
              Live Order Pipeline
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)', margin: '0.2rem 0 0 0' }}>
              Update workflow stage directly to sync with Supabase and client tracking
            </p>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)', fontFamily: 'var(--font-nav)', fontWeight: 600 }}>
            Showing {filteredOrders.length} orders
          </span>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Client Name</th>
                <th>Placement Date</th>
                <th>Amount (INR)</th>
                <th>Update Status</th>
                <th style={{ textAlign: 'center' }}>Live State</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Loading orders from Supabase...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => {
                  const s = (o.status || '').toLowerCase();
                  const isUpdating = updatingId === o.id;

                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-nav)', color: 'var(--maharani-maroon)' }}>
                        {o.order_number || `#HG-${o.id.slice(0, 4)}`}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--ink-brown)', display: 'block', fontSize: '1rem' }}>
                          {o.customer_name}
                        </strong>
                        {o.customer_phone && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--stone-taupe)', fontWeight: 500 }}>
                            {o.customer_phone}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--stone-taupe)', fontSize: '0.92rem' }}>
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '1rem' }}>
                        ₹ {Number(o.total_rupees || 0).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            value={o.status || 'Processing'}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            style={{
                              padding: '0.45rem 0.75rem',
                              borderRadius: '2px',
                              border: '1px solid var(--soft-gold-line)',
                              fontSize: '0.9rem',
                              fontFamily: 'var(--font-sans)',
                              background: 'var(--pure-white)',
                              color: 'var(--ink-brown)',
                              fontWeight: 500,
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
                          {o.status || 'Pending'}
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
