'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Loader2, 
  ChevronRight,
  ExternalLink
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

      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--seller-text-main)', margin: 0 }}>
                Order Fulfillment & Manifest Tracking
              </h1>
              <span className="atelier-live-pill">
                <span className="atelier-live-dot" />
                {orders.length} LIVE ORDERS
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--seller-text-muted)', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
              Live customer orders directly connected to Supabase table &apos;orders&apos;
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="atelier-filter-bar">
        <div className="atelier-filter-tabs">
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
              className={`atelier-filter-btn ${statusFilter === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#F8FAFC',
          border: '1px solid var(--seller-border)',
          borderRadius: '8px',
          padding: '0.25rem 0.75rem',
        }}>
          <Search style={{ width: 14, height: 14, color: '#94A3B8', marginRight: '0.45rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order # or client..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.78rem',
              color: 'var(--seller-text-main)',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="atelier-table-card">
        <div className="table-header-row">
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--seller-text-main)', margin: 0 }}>
              Atelier Order Manifests
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--seller-text-muted)', margin: '0.15rem 0 0 0' }}>
              Update workflow stage directly to reflect in Supabase and client tracking
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            Showing {filteredOrders.length} orders
          </span>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table className="executive-table">
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
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Loading orders from Supabase...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => {
                  const statusLower = (o.status || '').toLowerCase();
                  const isUpdating = updatingId === o.id;

                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 800, color: 'var(--seller-brand)', fontFamily: 'ui-monospace, monospace' }}>
                        {o.order_number || `#HG-${o.id.slice(0, 4)}`}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--seller-text-main)', display: 'block' }}>
                          {o.customer_name}
                        </strong>
                        {o.customer_phone && (
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                            {o.customer_phone}
                          </span>
                        )}
                      </td>
                      <td style={{ color: '#64748B', fontSize: '0.78rem' }}>
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--seller-text-main)' }}>
                        ₹ {Number(o.total_rupees || 0).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            value={o.status || 'Processing'}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: '1px solid var(--seller-border)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: '#FFFFFF',
                              color: 'var(--seller-text-main)',
                              outline: 'none',
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <option value="Processing">Processing / In-Weave</option>
                            <option value="Bespoke Review">Bespoke Review</option>
                            <option value="Shipped">Shipped / In-Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          {isUpdating && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', color: 'var(--seller-brand)' }} />}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: statusLower === 'delivered' ? '#ECFDF5' : statusLower === 'shipped' ? '#EFF6FF' : statusLower.includes('bespoke') ? '#FFFBEB' : '#FAF7F0',
                          color: statusLower === 'delivered' ? '#047857' : statusLower === 'shipped' ? '#1D4ED8' : statusLower.includes('bespoke') ? '#B45309' : 'var(--seller-brand)',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}>
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
