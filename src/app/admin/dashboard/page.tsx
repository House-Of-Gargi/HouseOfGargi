'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Package,
  IndianRupee,
  Clock,
  ShoppingBag,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminLoadingSpinner, AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';
import { usePortalRealtimeSync } from '@/lib/realtimeSync';

interface DailySale {
  date: string;
  label: string;
  shortLabel: string;
  sales: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unitsSold: number;
  revenue: number;
  imageUrl?: string;
}

interface TopArtisan {
  id: string;
  name: string;
  craft: string;
  state: string;
  unitsSold: number;
  totalSales: number;
}

interface DashboardData {
  totalArtisans: number;
  totalProducts: number;
  totalSales: number;
  pendingQueues: {
    total: number;
    pendingArtisans: number;
    pendingProducts: number;
  };
  sales7Days: DailySale[];
  sales30Days: DailySale[];
  topProducts: TopProduct[];
  topArtisans: TopArtisan[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [artisanPage, setArtisanPage] = useState<number>(1);
  const [productPage, setProductPage] = useState<number>(1);
  const PAGE_SIZE = 5;

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, []);

  // Live WebSocket synchronization across Artisan & Admin portals
  usePortalRealtimeSync(
    [
      'PRODUCT_CREATED',
      'PRODUCT_UPDATED',
      'PRODUCT_DELETED',
      'PRODUCT_VISIBILITY_CHANGED',
      'PRODUCT_STATUS_CHANGED',
      'ARTISAN_APPLICATION_CHANGED',
      'ORDER_STATUS_CHANGED',
      'PORTAL_CATALOG_SYNC',
    ],
    () => {
      fetchStats();
    }
  );

  const totalArtisans = data?.totalArtisans ?? 0;
  const totalProducts = data?.totalProducts ?? 0;
  const totalSales = data?.totalSales ?? 0;
  const pendingArtisans = data?.pendingQueues?.pendingArtisans ?? 0;

  const currentSalesData = timeRange === '7' ? (data?.sales7Days || []) : (data?.sales30Days || []);
  const maxSales = Math.max(...currentSalesData.map((d) => d.sales), 1000);

  const topProducts = data?.topProducts || [];
  const topArtisans = data?.topArtisans || [];

  const paginatedArtisans = topArtisans.slice((artisanPage - 1) * PAGE_SIZE, artisanPage * PAGE_SIZE);
  const totalArtisanPages = Math.ceil(topArtisans.length / PAGE_SIZE) || 1;

  const paginatedProducts = topProducts.slice((productPage - 1) * PAGE_SIZE, productPage * PAGE_SIZE);
  const totalProductPages = Math.ceil(topProducts.length / PAGE_SIZE) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title Lockup */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.95rem',
            fontWeight: 600,
            color: 'var(--ink-brown)',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
          }}
        >
          Operations <span style={{ color: 'var(--maharani-maroon)' }}>Dashboard</span>
        </h1>
        <p
          style={{
            margin: '0.4rem 0 0',
            color: '#4A3E36',
            fontSize: '0.98rem',
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          Real-time enterprise metrics, active catalog queues, and live revenue analytics.
        </p>
      </div>

      {/* ════════════ 1. THE 4 METRIC BOXES ════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Box 1: Total Artisans */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.6rem 1.6rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
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
              top: '1.4rem',
              right: '1.4rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Users style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#5C5043',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem',
              }}
            >
              Total Artisans
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? <AdminLoadingSpinner size={26} /> : totalArtisans}
            </div>
          </div>
        </div>

        {/* Box 2: Total Products */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.6rem 1.6rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
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
              top: '1.4rem',
              right: '1.4rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Package style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#5C5043',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem',
              }}
            >
              Total Products
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? <AdminLoadingSpinner size={26} /> : totalProducts}
            </div>
          </div>
        </div>

        {/* Box 3: Total Sales */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.6rem 1.6rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
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
              top: '1.4rem',
              right: '1.4rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <IndianRupee style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#5C5043',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem',
              }}
            >
              Total Sales
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--maharani-maroon)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? <AdminLoadingSpinner size={26} /> : ('₹' + totalSales.toLocaleString('en-IN'))}
            </div>
          </div>
        </div>

        {/* Box 4: Pending Artisans */}
        <Link
          href="/admin/artisans/applications"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.6rem 1.6rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            cursor: 'pointer',
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
              top: '1.4rem',
              right: '1.4rem',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Clock style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} strokeWidth={1.8} />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#5C5043',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem',
              }}
            >
              Pending Artisans
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? <AdminLoadingSpinner size={26} /> : pendingArtisans}
            </div>
          </div>
        </Link>
      </div>

      {/* ════════════ 2. BAR GRAPH OF SALES PER DAY ════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--soft-gold-line)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Daily Sales Revenue
            </h2>
            <p
              style={{
                margin: '0.35rem 0 0',
                color: '#5C5043',
                fontSize: '0.98rem',
                lineHeight: 1.5,
              }}
            >
              Actual transaction totals aggregated per day from the orders ledger
            </p>
          </div>

          {/* Timeframe Pill Switcher */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '9999px',
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <button
              type="button"
              onClick={() => setTimeRange('7')}
              style={{
                border: 'none',
                background: timeRange === '7' ? 'var(--maharani-maroon)' : 'transparent',
                color: timeRange === '7' ? '#FFFFFF' : '#4A3E36',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: timeRange === '7' ? '0 2px 6px rgba(122, 35, 49, 0.25)' : 'none',
              }}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30')}
              style={{
                border: 'none',
                background: timeRange === '30' ? 'var(--maharani-maroon)' : 'transparent',
                color: timeRange === '30' ? '#FFFFFF' : '#4A3E36',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: timeRange === '30' ? '0 2px 6px rgba(122, 35, 49, 0.25)' : 'none',
              }}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Bar Chart Area with High-Contrast Accessible Labels */}
        <div style={{ position: 'relative', width: '100%', height: '260px', paddingTop: '15px' }}>
          {/* Subtle Y-Axis Guidelines & Metric Scales */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              paddingBottom: '36px',
              paddingLeft: '65px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#5C5043', width: '60px', marginLeft: '-65px', textAlign: 'right', paddingRight: '12px' }}>
                {maxSales > 1000 ? (maxSales >= 100000 ? ('₹' + (maxSales / 100000).toFixed(1) + 'L') : ('₹' + (maxSales / 1000).toFixed(0) + 'k')) : '₹1k'}
              </span>
              <div style={{ borderBottom: '1px dashed rgba(228, 211, 174, 0.75)', flex: 1 }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#5C5043', width: '60px', marginLeft: '-65px', textAlign: 'right', paddingRight: '12px' }}>
                {maxSales > 1000 ? ('₹' + Math.round(maxSales / 2000) + 'k') : '₹500'}
              </span>
              <div style={{ borderBottom: '1px dashed rgba(228, 211, 174, 0.75)', flex: 1 }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#5C5043', width: '60px', marginLeft: '-65px', textAlign: 'right', paddingRight: '12px' }}>
                ₹0
              </span>
              <div style={{ borderBottom: '1.5px solid var(--soft-gold-line)', flex: 1 }} />
            </div>
          </div>

          {/* Interactive Bars Container */}
          <div
            style={{
              position: 'relative',
              height: 'calc(100% - 36px)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: timeRange === '7' ? '1.5rem' : '0.35rem',
              padding: '0 0.5rem 0 65px',
              justifyContent: 'space-between',
            }}
          >
            {currentSalesData.map((item, idx) => {
              const heightPercent = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={item.date}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: Math.max(heightPercent, 12) + 14 + '%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--ink-brown)',
                        color: '#FFFFFF',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        whiteSpace: 'nowrap',
                        zIndex: 20,
                        pointerEvents: 'none',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: 'var(--soft-gold-line)', fontSize: '0.98rem' }}>
                        {'₹' + item.sales.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>{item.label}</div>
                    </div>
                  )}

                  {/* Bar column */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: timeRange === '7' ? '54px' : '16px',
                      height: item.sales > 0 ? Math.max(heightPercent, 4) + '%' : '6px',
                      background:
                        item.sales > 0
                          ? isHovered
                            ? 'var(--gargi-gold)'
                            : 'linear-gradient(180deg, var(--gargi-gold) 0%, var(--maharani-maroon) 100%)'
                          : isHovered
                          ? 'var(--gargi-gold)'
                          : '#EFE6D8',
                      borderRadius: item.sales > 0 ? '4px 4px 0 0' : '3px',
                      transition: 'all 0.2s ease',
                      boxShadow: isHovered && item.sales > 0 ? '0 0 10px rgba(184, 142, 24, 0.4)' : 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Date Labels - Readable 14px */}
          <div
            style={{
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 0.5rem 0 65px',
              gap: timeRange === '7' ? '1.5rem' : '0.35rem',
              borderTop: '1.5px solid var(--soft-gold-line)',
            }}
          >
            {currentSalesData.map((item, idx) => {
              const showLabel = timeRange === '7' || idx % 4 === 0 || idx === currentSalesData.length - 1;

              return (
                <div
                  key={item.date}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '0.88rem',
                    color: '#4A3E36',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {showLabel ? item.shortLabel : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════ 3. NEXT ROW: TOP 10 ARTISANS & TOP 10 MOST SOLD ITEMS ════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {/* Left Column: Top 10 Artisans List */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Top 10 Artisans
            </h2>
            <p style={{ margin: '0.35rem 0 0', color: '#5C5043', fontSize: '0.98rem' }}>
              Ranked by verified craft volume and performance
            </p>
          </div>

          {loading ? (
            <AdminPageLoadingBlock minHeight="180px" message="Loading artisan rankings..." />
          ) : topArtisans.length === 0 ? (
            <div
              style={{
                flex: 1,
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#5C5043',
                background: '#FAF7F2',
                borderRadius: '10px',
                border: '1px solid #EAE2D5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.05rem',
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1.5px solid var(--soft-gold-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <Award style={{ width: 28, height: 28, color: 'var(--gargi-gold)' }} />
              </div>
              <div style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '1.15rem' }}>No verified artisan rankings yet.</div>
              <div style={{ fontSize: '0.95rem', color: '#5C5043', marginTop: '0.35rem', maxWidth: '360px' }}>
                Artisans approved through the application queue will appear here as orders generate.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {paginatedArtisans.map((artisan, index) => {
                  const rank = (artisanPage - 1) * PAGE_SIZE + index + 1;
                  return (
                    <div
                      key={artisan.id}
                      style={{
                        padding: '1rem 1.15rem',
                        border: '1px solid #F0E8DC',
                        borderRadius: '10px',
                        backgroundColor: '#FAF7F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = 'var(--gargi-gold)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,31,24,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAF7F2';
                        e.currentTarget.style.borderColor = '#F0E8DC';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: rank <= 3 ? 'var(--maharani-maroon)' : '#EAE2D5',
                            color: rank <= 3 ? '#FFFFFF' : 'var(--ink-brown)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {'#' + rank}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink-brown)' }}>
                            {artisan.name}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#5C5043', marginTop: '2px' }}>
                            {artisan.craft} &bull; {artisan.state}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--maharani-maroon)' }}>
                          {'₹' + artisan.totalSales.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#5C5043', fontWeight: 600, marginTop: '2px' }}>
                          {artisan.unitsSold} sold
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Artisan Pagination Controls */}
              {topArtisans.length > PAGE_SIZE && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #F0E8DC',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: '#5C5043', fontWeight: 600 }}>
                    Showing {(artisanPage - 1) * PAGE_SIZE + 1}–{Math.min(artisanPage * PAGE_SIZE, topArtisans.length)} of {topArtisans.length}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <button
                      type="button"
                      disabled={artisanPage === 1}
                      onClick={() => setArtisanPage((p) => Math.max(1, p - 1))}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        border: '1px solid var(--soft-gold-line)',
                        background: artisanPage === 1 ? '#FAF7F2' : '#FFFFFF',
                        color: artisanPage === 1 ? 'var(--stone-taupe)' : 'var(--ink-brown)',
                        cursor: artisanPage === 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: artisanPage === 1 ? 0.5 : 1,
                      }}
                      aria-label="Previous Page"
                    >
                      <ChevronLeft style={{ width: 16, height: 16 }} />
                    </button>

                    {Array.from({ length: totalArtisanPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setArtisanPage(pageNum)}
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          padding: '0 0.5rem',
                          borderRadius: '6px',
                          border: pageNum === artisanPage ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                          background: pageNum === artisanPage ? 'var(--maharani-maroon)' : '#FFFFFF',
                          color: pageNum === artisanPage ? '#FFFFFF' : 'var(--ink-brown)',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={artisanPage === totalArtisanPages}
                      onClick={() => setArtisanPage((p) => Math.min(totalArtisanPages, p + 1))}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        border: '1px solid var(--soft-gold-line)',
                        background: artisanPage === totalArtisanPages ? '#FAF7F2' : '#FFFFFF',
                        color: artisanPage === totalArtisanPages ? 'var(--stone-taupe)' : 'var(--ink-brown)',
                        cursor: artisanPage === totalArtisanPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: artisanPage === totalArtisanPages ? 0.5 : 1,
                      }}
                      aria-label="Next Page"
                    >
                      <ChevronRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Top 10 Most Sold Items */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Top 10 Most Sold Items
            </h2>
            <p style={{ margin: '0.35rem 0 0', color: '#5C5043', fontSize: '0.98rem' }}>
              Live catalog bestsellers ranked by verified units purchased
            </p>
          </div>

          {loading ? (
            <AdminPageLoadingBlock minHeight="180px" message="Loading product bestsellers..." />
          ) : topProducts.length === 0 ? (
            <div
              style={{
                flex: 1,
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#5C5043',
                background: '#FAF7F2',
                borderRadius: '10px',
                border: '1px solid #EAE2D5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.05rem',
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1.5px solid var(--soft-gold-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <ShoppingBag style={{ width: 28, height: 28, color: 'var(--gargi-gold)' }} />
              </div>
              <div style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '1.15rem' }}>No catalog products registered yet.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {paginatedProducts.map((product, index) => {
                  const rank = (productPage - 1) * PAGE_SIZE + index + 1;
                  return (
                    <div
                      key={product.id}
                      style={{
                        padding: '1rem 1.15rem',
                        border: '1px solid #F0E8DC',
                        borderRadius: '10px',
                        backgroundColor: '#FAF7F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = 'var(--gargi-gold)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,31,24,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAF7F2';
                        e.currentTarget.style.borderColor = '#F0E8DC';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: rank <= 3 ? 'var(--maharani-maroon)' : '#EAE2D5',
                            color: rank <= 3 ? '#FFFFFF' : 'var(--ink-brown)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {'#' + rank}
                        </span>

                        {/* Product Thumbnail */}
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1.5px solid var(--soft-gold-line)',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              backgroundColor: '#EAE2D5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--stone-taupe)',
                              flexShrink: 0,
                            }}
                          >
                            <Package style={{ width: 20, height: 20 }} />
                          </div>
                        )}

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '1.05rem',
                              color: 'var(--ink-brown)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#5C5043', textTransform: 'capitalize', marginTop: '2px' }}>
                            {product.category} &bull; <span style={{ color: 'var(--maharani-maroon)', fontWeight: 700 }}>{'₹' + product.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '9999px',
                            backgroundColor: product.unitsSold > 0 ? '#E8F5E9' : '#F0E8DC',
                            color: product.unitsSold > 0 ? '#1B5E20' : '#4A3E36',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            border: '1px solid rgba(228, 211, 174, 0.8)',
                          }}
                        >
                          {product.unitsSold} sold
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Product Pagination Controls */}
              {topProducts.length > PAGE_SIZE && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #F0E8DC',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: '#5C5043', fontWeight: 600 }}>
                    Showing {(productPage - 1) * PAGE_SIZE + 1}–{Math.min(productPage * PAGE_SIZE, topProducts.length)} of {topProducts.length}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <button
                      type="button"
                      disabled={productPage === 1}
                      onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        border: '1px solid var(--soft-gold-line)',
                        background: productPage === 1 ? '#FAF7F2' : '#FFFFFF',
                        color: productPage === 1 ? 'var(--stone-taupe)' : 'var(--ink-brown)',
                        cursor: productPage === 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: productPage === 1 ? 0.5 : 1,
                      }}
                      aria-label="Previous Page"
                    >
                      <ChevronLeft style={{ width: 16, height: 16 }} />
                    </button>

                    {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setProductPage(pageNum)}
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          padding: '0 0.5rem',
                          borderRadius: '6px',
                          border: pageNum === productPage ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                          background: pageNum === productPage ? 'var(--maharani-maroon)' : '#FFFFFF',
                          color: pageNum === productPage ? '#FFFFFF' : 'var(--ink-brown)',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={productPage === totalProductPages}
                      onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        border: '1px solid var(--soft-gold-line)',
                        background: productPage === totalProductPages ? '#FAF7F2' : '#FFFFFF',
                        color: productPage === totalProductPages ? 'var(--stone-taupe)' : 'var(--ink-brown)',
                        cursor: productPage === totalProductPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: productPage === totalProductPages ? 0.5 : 1,
                      }}
                      aria-label="Next Page"
                    >
                      <ChevronRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
