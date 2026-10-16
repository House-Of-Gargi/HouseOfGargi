'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Flame,
  FolderTree,
  Users,
  Grid,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Loader2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';

interface TopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unitsSold: number;
  revenue: number;
  imageUrl?: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalRupees: number;
  platformCut: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

interface SuperAdminDashboardData {
  totalGmv: number;
  platformTakeRate: number;
  artisanPayouts: number;
  totalOrdersCount: number;
  completedOrdersCount: number;
  averageOrderValue: number;
  totalProductsCount: number;
  adminsCount: number;
  categoriesCount: number;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

export default function SuperAdminOverviewPage() {
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch('/api/super-admin/dashboard');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load super admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Executive Platform Governance
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.95rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.25 }}>
          House of Gargi Executive <span style={{ color: 'var(--maharani-maroon)' }}>Dashboard</span>
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.98rem', color: '#4A3E36', lineHeight: 1.55 }}>
          Global marketplace oversight: platform GMV, take-rate margins, admin team privileges, category architecture, and sales velocity.
        </p>
      </div>

      {/* 4 Macro Metric Tiles - Minimal Box Styling & Proportional Font Sizes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {/* Metric 1: Total GMV */}
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
            <Landmark style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Gross Merchandise Value (GMV)
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `₹${(data?.totalGmv ?? 0).toLocaleString('en-IN')}`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.65rem' }}>
            {data?.totalOrdersCount ? `${data.totalOrdersCount} verified marketplace orders` : 'Real-time verified checkout volume'}
          </div>
        </div>

        {/* Metric 2: Net House of Gargi Commission */}
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
              Platform Take-Rate (15%)
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--maharani-maroon)', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `₹${(data?.platformTakeRate ?? 0).toLocaleString('en-IN')}`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginTop: '0.65rem' }}>
            Cleared platform commission profit
          </div>
        </div>

        {/* Metric 3: Hot Velocity Products */}
        <Link
          href="/super-admin/bestsellers"
          style={{
            textDecoration: 'none',
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
            <Flame style={{ width: 20, height: 20, color: '#E65100' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Hot Velocity Products
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `${data?.topProducts?.length ?? 0} Tracked`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--maharani-maroon)', fontWeight: 600, marginTop: '0.65rem' }}>
            View Bestsellers Intelligence &rarr;
          </div>
        </Link>

        {/* Metric 4: Admin Team Count */}
        <Link
          href="/super-admin/admins"
          style={{
            textDecoration: 'none',
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
            <ShieldCheck style={{ width: 20, height: 20, color: 'var(--peacock-teal)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Admin Operations Staff
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
              {loading ? <AdminLoadingSpinner size={26} /> : `${data?.adminsCount ?? 4} Active`}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', fontWeight: 600, marginTop: '0.65rem' }}>
            Manage Staff & Privileges &rarr;
          </div>
        </Link>
      </div>

      {/* Quick Governance Actions Grid */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
            Executive Governance Controls
          </h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>
            Super Admin authoritative actions across teams, taxonomies, and catalog display
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <Link
            href="/super-admin/admins"
            style={{
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(43,31,24,0.02)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gargi-gold)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--maharani-maroon)', marginBottom: '0.5rem' }}>
              <ShieldCheck style={{ width: 22, height: 22 }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--ink-brown)' }}>
                Manage Admins & Privileges
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
              Invite operations curators, assign permission roles (e.g., approve products, review applications), or instantly revoke admin access.
            </p>
          </Link>

          <Link
            href="/super-admin/categories"
            style={{
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(43,31,24,0.02)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gargi-gold)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gargi-gold)', marginBottom: '0.5rem' }}>
              <FolderTree style={{ width: 22, height: 22 }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--ink-brown)' }}>
                Manage Categories & Taxonomies
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
              Create and edit luxury categories ({data?.categoriesCount ?? 5} active), Sanskrit lipi titles, banners, and homepage navigation order.
            </p>
          </Link>

          <Link
            href="/super-admin/catalog"
            style={{
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(43,31,24,0.02)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gargi-gold)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--ink-brown)', marginBottom: '0.5rem' }}>
              <Grid style={{ width: 22, height: 22 }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--ink-brown)' }}>
                Master Catalog Governance
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
              Toggle global product display visibility ({data?.totalProductsCount ?? 0} pieces) and pin selected creations to the boutique hero carousel.
            </p>
          </Link>
        </div>
      </div>

      {/* Live Recent Transactions / Orders Stream */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-brown)', fontWeight: 700 }}>
              Live Storefront Orders & Settlements
            </h3>
            <span style={{ fontSize: '0.84rem', color: 'var(--stone-taupe)' }}>
              Real-time patron checkout stream and automatic 15% platform split
            </span>
          </div>
          <Link
            href="/super-admin/revenue"
            style={{
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--maharani-maroon)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            View Full Ledger &rarr;
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <AdminLoadingSpinner size={28} />
          </div>
        ) : !data?.recentOrders || data.recentOrders.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <ShoppingBag style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: 'var(--soft-gold-line)' }} />
            <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--ink-brown)', marginBottom: '0.25rem' }}>
              No Storefront Orders Recorded Yet
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--stone-taupe)', maxWidth: '440px', marginInline: 'auto' }}>
              As patrons complete checkout on the public boutique, orders and 15% platform take-rate calculations will stream live into this ledger.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Order Ref</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Patron</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Items</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Total Amount</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>15% Take-Rate</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    {ord.id.slice(0, 12)}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>{ord.customerEmail}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--stone-taupe)' }}>
                    {ord.itemCount} piece{ord.itemCount > 1 ? 's' : ''}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                    ₹{ord.totalRupees.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                    ₹{ord.platformCut.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 4, background: '#E8F5E9', color: '#2E7D32', textTransform: 'uppercase' }}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
