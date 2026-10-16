'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

const STATUS_OPTIONS = [
  { value: 'Processing', label: 'Processing' },
  { value: 'Bespoke Review', label: 'Bespoke Review' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders from backend:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);

      // Optimistic state update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status in backend:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = statusFilter === 'all' || (o.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchSearch = searchQuery === '' ||
        (o.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.delivery_city || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div>
      {/* Header Card */}
      <div className="atelier-header-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <ShoppingBag style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <h1 className="atelier-page-title">
              Client Order Manifests &amp; <span style={{ color: 'var(--maharani-maroon)' }}>Fulfillment</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#4A3E36', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Live order manifests &bull; Manage bespoke commissions, workshop fulfillment &amp; courier dispatches
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          style={{
            background: 'var(--pure-white)',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '2px',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: 500,
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
          Sync Orders
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="table-top-bar" style={{ background: 'var(--pure-white)', padding: '1rem 1.5rem', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'processing', label: 'Processing' },
            { id: 'bespoke review', label: 'Bespoke Review' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              style={{
                background: statusFilter === f.id ? 'var(--maharani-maroon)' : '#FAF7F2',
                color: statusFilter === f.id ? '#FFFFFF' : 'var(--ink-brown)',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-taupe)' }} />
          <input
            type="text"
            placeholder="Search by order #, client, or city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.1rem',
              fontSize: '0.88rem',
              borderRadius: '4px',
              border: '1px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              color: 'var(--ink-brown)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', overflow: 'hidden' }}>
        <table className="seller-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Client Name</th>
              <th>Delivery Destination</th>
              <th>Gross Retail</th>
              <th>Your 85% Share</th>
              <th>Status</th>
              <th>Update Manifest</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => {
                const gross = Number(order.total_rupees) || 0;
                const share = Math.round(gross * 0.85);
                const isUpdating = updatingId === order.id;

                return (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 500, color: 'var(--maharani-maroon)' }}>
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
                    <td style={{ fontWeight: 500, color: '#2E7D32' }}>
                      ₹ {share.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge badge--${(order.status || 'processing').toLowerCase().replace(' ', '-')}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td style={{ minWidth: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CustomDropdown
                          value={order.status || 'Processing'}
                          options={STATUS_OPTIONS}
                          onChange={(newVal) => handleStatusChange(order.id, newVal)}
                        />
                        {isUpdating && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', color: 'var(--maharani-maroon)' }} />}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--stone-taupe)' }}>
                  No order manifests found matching this criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
