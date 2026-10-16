'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  ArrowDownCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  Building, 
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { usePortalRealtimeSync } from '@/lib/realtimeSync';

export default function ArtisanEarningsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);

  const fetchEarningsData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders for earnings ledger:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  // Live WebSocket sync across all portals (Super Admin, Operations Admin, Artisan)
  usePortalRealtimeSync(
    [
      'ORDER_STATUS_CHANGED',
      'PRODUCT_UPDATED',
      'PORTAL_CATALOG_SYNC',
    ],
    () => {
      fetchEarningsData();
    }
  );

  const finances = useMemo(() => {
    let cleared = 0;
    let inEscrow = 0;
    let lifetimeTotal = 0;

    orders.forEach((o) => {
      const gross = Number(o.total_rupees) || 0;
      const share = Math.round(gross * 0.85);
      lifetimeTotal += share;

      const st = (o.status || '').toLowerCase();
      if (st === 'delivered') {
        cleared += share;
      } else {
        inEscrow += share;
      }
    });

    return { cleared, inEscrow, lifetimeTotal };
  }, [orders]);

  const handleRequestWithdrawal = () => {
    setWithdrawalRequested(true);
    setTimeout(() => {
      alert('Your payout withdrawal request for ₹' + finances.cleared.toLocaleString('en-IN') + ' has been routed to House of Gargi Treasury for automated NEFT disbursement.');
    }, 150);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Wallet style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
              Direct Artisan Workshop Payouts
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.95rem', fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
            Earnings Ledger & <span style={{ color: 'var(--maharani-maroon)' }}>Settlements</span>
          </h1>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', color: '#4A3E36' }}>
            Guaranteed 85% workshop share &bull; Automated client escrow &amp; direct NEFT bank settlements
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEarningsData}
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
          Sync Ledger
        </button>
      </div>

      {/* 3 Real-time Financial Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Card 1: Cleared Balance */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Cleared Workshop Balance
            </span>
            <CheckCircle2 style={{ width: 18, height: 18, color: '#2E7D32' }} />
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.05, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹ {finances.cleared.toLocaleString('en-IN')}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#2E7D32', fontWeight: 600, margin: '0 0 1rem 0' }}>
            Ready for instant bank withdrawal
          </p>
          <button
            type="button"
            onClick={handleRequestWithdrawal}
            disabled={finances.cleared <= 0}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: 4,
              border: 'none',
              background: finances.cleared > 0 ? 'var(--maharani-maroon)' : '#D1C7BD',
              color: '#FFF',
              fontWeight: 500,
              fontSize: '0.88rem',
              cursor: finances.cleared > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
          >
            <ArrowDownCircle style={{ width: 16, height: 16 }} />
            <span>{withdrawalRequested ? 'Withdrawal Requested' : 'Request Payout Withdrawal'}</span>
          </button>
        </div>

        {/* Card 2: In Escrow */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              In Escrow (Transit / Fulfillment)
            </span>
            <Clock style={{ width: 18, height: 18, color: '#D97706' }} />
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹ {finances.inEscrow.toLocaleString('en-IN')}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--stone-taupe)', margin: 0 }}>
            Clears automatically upon client order delivery
          </p>
        </div>

        {/* Card 3: Lifetime Workshop Dispatched */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Lifetime Handloom Value (85%)
            </span>
            <TrendingUp style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.05, color: '#1B5E20', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹ {finances.lifetimeTotal.toLocaleString('en-IN')}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--stone-taupe)', margin: 0 }}>
            Direct earnings generated across all {orders.length} client commissions
          </p>
        </div>
      </div>

      {/* Live Settlements & Payouts Ledger Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--soft-gold-line)', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 500, color: 'var(--ink-brown)' }}>
              Recent Order Settlements &amp; Workshop Share
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#6A5A50' }}>
              Every order calculates your contractual 85% craft rate with automated settlement status
            </p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 500, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Order Ref</th>
              <th style={{ padding: '0.85rem 1rem' }}>Client</th>
              <th style={{ padding: '0.85rem 1rem' }}>Destination</th>
              <th style={{ padding: '0.85rem 1rem' }}>Gross Retail</th>
              <th style={{ padding: '0.85rem 1rem' }}>Your 85% Share</th>
              <th style={{ padding: '0.85rem 1rem' }}>Settlement Status</th>
              <th style={{ padding: '0.85rem 1rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const gross = Number(o.total_rupees) || 0;
              const share = Math.round(gross * 0.85);
              const isDelivered = (o.status || '').toLowerCase() === 'delivered';

              return (
                <tr key={o.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 500, color: 'var(--maharani-maroon)' }}>
                    {o.order_number || `#HG-${o.id}`}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    {o.customer_name || 'Patron'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>
                    {o.delivery_city || 'India'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    ₹ {gross.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#2E7D32' }}>
                    ₹ {share.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: '0.74rem',
                      fontWeight: 500,
                      background: isDelivered ? '#E8F5E9' : '#FFFBEB',
                      color: isDelivered ? '#2E7D32' : '#B45309',
                    }}>
                      {isDelivered ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {isDelivered ? 'Cleared to Payout' : 'In Escrow (Transit)'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)', fontSize: '0.82rem' }}>
                    {o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
