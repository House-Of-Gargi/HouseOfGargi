'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Layers,
} from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';

interface CraftRegion {
  region: string;
  percentage: number;
  gmv: number;
}

interface OrderLedgerItem {
  id: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  totalRupees: number;
  platformCommission: number;
  artisanSettlement: number;
  status: string;
  createdAt: string;
}

interface RevenueData {
  gmvTotalRupees: number;
  platformCommissionRupees: number;
  artisanSettlementsRupees: number;
  totalOrders: number;
  averageOrderValue: number;
  craftRegionDistribution: CraftRegion[];
  ordersLedger: OrderLedgerItem[];
}

export default function SuperAdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        setLoading(true);
        const res = await fetch('/api/super-admin/revenue');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching revenue ledger:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Authoritative Financial Accounting
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.95rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.25 }}>
          Revenue & Financial <span style={{ color: 'var(--maharani-maroon)' }}>Ledger</span>
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.98rem', color: '#4A3E36', lineHeight: 1.55 }}>
          Real-time platform take-rate calculations, marketplace gross volume, and verified artisan guild disbursements.
        </p>
      </div>

      {/* 3 Macro Financial Boxes - Minimal Box Styling & Proportional Font Sizes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Box 1: Total GMV */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '148px',
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
            e.currentTarget.style.borderColor = 'var(--gargi-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(43,31,24,0.03)';
            e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Total GMV (Storefront Volume)
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `₹${(data?.gmvTotalRupees ?? 0).toLocaleString('en-IN')}`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.65rem' }}>
            100% Verified Customer Checkout Volume
          </div>
        </div>

        {/* Box 2: House of Gargi Share (15%) */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '148px',
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
            e.currentTarget.style.borderColor = 'var(--gargi-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(43,31,24,0.03)';
            e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp style={{ width: 20, height: 20, color: 'var(--maharani-maroon)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              House of Gargi Take-Rate (15%)
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--maharani-maroon)', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `₹${(data?.platformCommissionRupees ?? 0).toLocaleString('en-IN')}`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginTop: '0.65rem' }}>
            Net Platform Operating Commission
          </div>
        </div>

        {/* Box 3: Artisan Share (85%) */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '148px',
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
            e.currentTarget.style.borderColor = 'var(--gargi-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(43,31,24,0.03)';
            e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck style={{ width: 20, height: 20, color: '#1B5E20' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Artisan Weaver Share (85%)
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: '#1B5E20', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `₹${(data?.artisanSettlementsRupees ?? 0).toLocaleString('en-IN')}`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginTop: '0.65rem' }}>
            Direct Disbursements to Craftsmen Guilds
          </div>
        </div>
      </div>

      {/* Craft Region Distribution & Secondary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Regional Distribution */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(43,31,24,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart style={{ width: 20, height: 20, color: 'var(--gargi-gold)' }} />
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--ink-brown)' }}>
              Regional Craft Cluster Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(data?.craftRegionDistribution || []).map((item) => (
              <div key={item.region}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>{item.region}</span>
                  <span style={{ color: 'var(--stone-taupe)', fontWeight: 600 }}>{item.percentage}% ({item.gmv > 0 ? `₹${item.gmv.toLocaleString('en-IN')}` : 'Active Line'})</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#FAF7F2', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--gargi-gold), var(--maharani-maroon))',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Ratios */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(43,31,24,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Layers style={{ width: 20, height: 20, color: 'var(--maharani-maroon)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--ink-brown)' }}>
                Boutique Sales Performance Ratios
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0E8DC', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>Verified Storefront Orders</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {data?.totalOrders ?? 0} Orders
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0E8DC', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>Average Order Value (AOV)</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--maharani-maroon)' }}>
                  ₹{(data?.averageOrderValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0E8DC', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>Contracted Weaver Take</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1B5E20' }}>
                  85.0% Guaranteed
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>Boutique Commission Margin</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--gargi-gold)' }}>
                  15.0% Standard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Financial Ledger Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,31,24,0.03)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-brown)', fontWeight: 700 }}>
              Storefront Orders Financial Ledger
            </h3>
            <span style={{ fontSize: '0.84rem', color: 'var(--stone-taupe)' }}>
              Individual transaction breakdown with 15% platform fee and 85% artisan settlement
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <AdminLoadingSpinner size={28} />
          </div>
        ) : !data?.ordersLedger || data.ordersLedger.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <ShoppingBag style={{ width: 38, height: 38, margin: '0 auto 0.75rem', color: 'var(--soft-gold-line)' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-brown)', marginBottom: '0.35rem' }}>
              No Storefront Ledger Entries Yet
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--stone-taupe)', maxWidth: '460px', marginInline: 'auto' }}>
              As patrons complete checkout on the boutique, authoritative order ledgers and 15% take-rate splits will compute here in real time.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Order Reference</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Patron</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Gross Total</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>15% Platform Take</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>85% Weaver Settlement</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Fulfillment State</th>
              </tr>
            </thead>
            <tbody>
              {data.ordersLedger.map((row) => {
                const total = Number(row.totalRupees ?? (row as any).total ?? 0);
                const commission = Number(row.platformCommission ?? (row as any).platformCut ?? Math.round(total * 0.15));
                const settlement = Number(row.artisanSettlement ?? (row as any).artisanPayout ?? (total - commission));
                const custName = row.customerName || (row as any).customer || 'Valued Patron';
                const custEmail = row.customerEmail || (row as any).email || '';

                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--ink-brown)' }}>
                      {(row.id || '').slice(0, 14)}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>{custName}</div>
                      {custEmail && <div style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>{custEmail}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                      ₹{total.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                      ₹{commission.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#1B5E20' }}>
                      ₹{settlement.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 4, background: '#E8F5E9', color: '#2E7D32', textTransform: 'uppercase' }}>
                        {row.status || 'Processing'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
