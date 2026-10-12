'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Package,
  IndianRupee,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShoppingBag,
  Award,
} from 'lucide-react';

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

  useEffect(() => {
    async function fetchStats() {
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
    }
    fetchStats();
  }, []);

  const totalArtisans = data?.totalArtisans ?? 0;
  const totalProducts = data?.totalProducts ?? 0;
  const totalSales = data?.totalSales ?? 0;
  const pendingArtisans = data?.pendingQueues?.pendingArtisans ?? 0;
  const pendingProducts = data?.pendingQueues?.pendingProducts ?? 0;
  const totalPending = data?.pendingQueues?.total ?? 0;

  const currentSalesData = timeRange === '7' ? (data?.sales7Days || []) : (data?.sales30Days || []);
  const maxSales = Math.max(...currentSalesData.map((d) => d.sales), 1000);

  const topProducts = data?.topProducts || [];
  const topArtisans = data?.topArtisans || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title Lockup */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: 700,
            color: 'var(--ink-brown)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Operations Dashboard
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.86rem', fontFamily: 'var(--font-body)' }}>
          Real-time enterprise metrics, active catalog queues, and live revenue analytics.
        </p>
      </div>

      {/* ════════════ 1. THE 4 SLEEK BOXES ════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Box 1: Total Artisans */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '8px',
            padding: '1.4rem 1.5rem',
            position: 'relative',
            boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '138px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'rgba(122, 35, 49, 0.18)',
              pointerEvents: 'none',
            }}
          >
            <Users style={{ width: 38, height: 38 }} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--stone-taupe)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-nav)',
                marginBottom: '0.5rem',
              }}
            >
              Total Artisans
            </div>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
              }}
            >
              {loading ? '—' : totalArtisans}
            </div>
          </div>
        </div>

        {/* Box 2: Total Products */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '8px',
            padding: '1.4rem 1.5rem',
            position: 'relative',
            boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '138px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'rgba(122, 35, 49, 0.18)',
              pointerEvents: 'none',
            }}
          >
            <Package style={{ width: 38, height: 38 }} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--stone-taupe)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-nav)',
                marginBottom: '0.5rem',
              }}
            >
              Total Products
            </div>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
              }}
            >
              {loading ? '—' : totalProducts}
            </div>
          </div>
        </div>

        {/* Box 3: Total Sales */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '8px',
            padding: '1.4rem 1.5rem',
            position: 'relative',
            boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '138px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'rgba(122, 35, 49, 0.18)',
              pointerEvents: 'none',
            }}
          >
            <IndianRupee style={{ width: 38, height: 38 }} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--stone-taupe)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-nav)',
                marginBottom: '0.5rem',
              }}
            >
              Total Sales
            </div>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: 'var(--maharani-maroon)',
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
              }}
            >
              {loading ? '—' : `₹${totalSales.toLocaleString('en-IN')}`}
            </div>
          </div>
        </div>

        {/* Box 4: Pending Queues (with 2 quick links) */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '8px',
            padding: '1.4rem 1.5rem',
            position: 'relative',
            boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '138px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'rgba(122, 35, 49, 0.18)',
              pointerEvents: 'none',
            }}
          >
            <Clock style={{ width: 38, height: 38 }} />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--stone-taupe)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-nav)',
                marginBottom: '0.5rem',
              }}
            >
              Pending Queues
            </div>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
              }}
            >
              {loading ? '—' : totalPending}
            </div>
          </div>

          {/* Two Quick Links */}
          <div
            style={{
              marginTop: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              borderTop: '1px solid #F0E8DC',
              paddingTop: '0.75rem',
            }}
          >
            <Link
              href="/admin/artisans/applications"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--maharani-maroon)',
                textDecoration: 'none',
                fontWeight: 600,
                fontFamily: 'var(--font-nav)',
                transition: 'opacity 0.15s ease',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Pending Artisans <ArrowUpRight style={{ width: 13, height: 13 }} />
              </span>
              <span
                style={{
                  background: pendingArtisans > 0 ? '#FFF3E0' : '#F5F5F5',
                  color: pendingArtisans > 0 ? '#E65100' : 'var(--stone-taupe)',
                  padding: '0.12rem 0.5rem',
                  borderRadius: 3,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {pendingArtisans}
              </span>
            </Link>

            <Link
              href="/admin/products/approvals"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--maharani-maroon)',
                textDecoration: 'none',
                fontWeight: 600,
                fontFamily: 'var(--font-nav)',
                transition: 'opacity 0.15s ease',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Pending Products <ArrowUpRight style={{ width: 13, height: 13 }} />
              </span>
              <span
                style={{
                  background: pendingProducts > 0 ? '#FFF3E0' : '#F5F5F5',
                  color: pendingProducts > 0 ? '#E65100' : 'var(--stone-taupe)',
                  padding: '0.12rem 0.5rem',
                  borderRadius: 3,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {pendingProducts}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════ 2. BAR GRAPH OF SALES PER DAY ════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid var(--soft-gold-line)',
          borderRadius: '8px',
          padding: '1.75rem',
          boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
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
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
              }}
            >
              Daily Sales Revenue
            </h2>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
              Actual transaction totals aggregated per day from the orders ledger
            </p>
          </div>

          {/* Timeframe Pill Switcher */}
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: '9999px',
              backgroundColor: '#F5EFE6',
              border: '1px solid var(--soft-gold-line)',
            }}
          >
            <button
              type="button"
              onClick={() => setTimeRange('7')}
              style={{
                border: 'none',
                background: timeRange === '7' ? 'var(--maharani-maroon)' : 'transparent',
                color: timeRange === '7' ? '#FFFFFF' : 'var(--ink-brown)',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-nav)',
                transition: 'all 0.18s ease',
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
                color: timeRange === '30' ? '#FFFFFF' : 'var(--ink-brown)',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-nav)',
                transition: 'all 0.18s ease',
              }}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Bar Chart Area */}
        <div style={{ position: 'relative', width: '100%', height: '240px', paddingTop: '10px' }}>
          {/* Y-Axis Guidelines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              paddingBottom: '30px',
            }}
          >
            <div style={{ borderBottom: '1px dashed #EAE2D5', width: '100%', height: 0 }} />
            <div style={{ borderBottom: '1px dashed #EAE2D5', width: '100%', height: 0 }} />
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', width: '100%', height: 0 }} />
          </div>

          {/* Interactive Bars Container */}
          <div
            style={{
              position: 'relative',
              height: 'calc(100% - 30px)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: timeRange === '7' ? '1.5rem' : '0.35rem',
              padding: '0 0.5rem',
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
                        bottom: `${Math.max(heightPercent, 12) + 12}%`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--ink-brown)',
                        color: '#FFFFFF',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        whiteSpace: 'nowrap',
                        zIndex: 20,
                        pointerEvents: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        fontFamily: 'var(--font-nav)',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--soft-gold-line)' }}>
                        ₹{item.sales.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>{item.label}</div>
                    </div>
                  )}

                  {/* Bar column */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: timeRange === '7' ? '56px' : '18px',
                      height: `${Math.max(heightPercent, 4)}%`,
                      background:
                        item.sales > 0
                          ? isHovered
                            ? 'var(--gargi-gold)'
                            : 'linear-gradient(180deg, var(--gargi-gold) 0%, var(--maharani-maroon) 100%)'
                          : isHovered
                          ? '#E8DCBE'
                          : '#F2E8D8',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.18s ease',
                      border: item.sales > 0 ? 'none' : '1px solid rgba(228, 211, 174, 0.6)',
                      borderBottom: 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Date Labels */}
          <div
            style={{
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 0.5rem',
              gap: timeRange === '7' ? '1.5rem' : '0.35rem',
              borderTop: '1px solid var(--soft-gold-line)',
            }}
          >
            {currentSalesData.map((item, idx) => {
              // On 30-day view, show label every 3 days to avoid crowding
              const showLabel = timeRange === '7' || idx % 4 === 0 || idx === currentSalesData.length - 1;

              return (
                <div
                  key={item.date}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '0.68rem',
                    color: 'var(--stone-taupe)',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 500,
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {/* Left Column: Top 10 Artisans List */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
              }}
            >
              Top 10 Artisans
            </h2>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
              Ranked by verified craft volume and performance
            </p>
          </div>

          {topArtisans.length === 0 ? (
            <div
              style={{
                flex: 1,
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                color: 'var(--stone-taupe)',
                background: '#FAF7F2',
                borderRadius: '6px',
                border: '1px dashed var(--soft-gold-line)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.84rem',
                lineHeight: 1.6,
              }}
            >
              <Award style={{ width: 36, height: 36, color: 'var(--gargi-gold)', marginBottom: '0.75rem', opacity: 0.6 }} />
              <div>No verified artisan rankings yet.</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--stone-taupe)', marginTop: '0.25rem' }}>
                Artisans approved through the application queue will appear here as orders generate.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {topArtisans.map((artisan, index) => (
                <div
                  key={artisan.id}
                  style={{
                    padding: '0.75rem 0.95rem',
                    border: '1px solid #F0E8DC',
                    borderRadius: '6px',
                    backgroundColor: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: index < 3 ? 'var(--maharani-maroon)' : '#EAE2D5',
                        color: index < 3 ? '#FFFFFF' : 'var(--ink-brown)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-nav)',
                        flexShrink: 0,
                      }}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--ink-brown)' }}>
                        {artisan.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>
                        {artisan.craft} &bull; {artisan.state}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                      ₹{artisan.totalSales.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--stone-taupe)' }}>
                      {artisan.unitsSold} sold
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Top 10 Most Sold Items */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
              }}
            >
              Top 10 Most Sold Items
            </h2>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
              Live catalog bestsellers ranked by verified units purchased
            </p>
          </div>

          {topProducts.length === 0 ? (
            <div
              style={{
                flex: 1,
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                color: 'var(--stone-taupe)',
                background: '#FAF7F2',
                borderRadius: '6px',
                border: '1px dashed var(--soft-gold-line)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.84rem',
                lineHeight: 1.6,
              }}
            >
              <ShoppingBag style={{ width: 36, height: 36, color: 'var(--gargi-gold)', marginBottom: '0.75rem', opacity: 0.6 }} />
              <div>No catalog products registered yet.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    padding: '0.75rem 0.95rem',
                    border: '1px solid #F0E8DC',
                    borderRadius: '6px',
                    backgroundColor: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: index < 3 ? 'var(--maharani-maroon)' : '#EAE2D5',
                        color: index < 3 ? '#FFFFFF' : 'var(--ink-brown)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-nav)',
                        flexShrink: 0,
                      }}
                    >
                      #{index + 1}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          color: 'var(--ink-brown)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>
                        {product.category} &bull; ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        backgroundColor: product.unitsSold > 0 ? '#E8F5E9' : '#F0E8DC',
                        color: product.unitsSold > 0 ? '#2E7D32' : 'var(--stone-taupe)',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-nav)',
                      }}
                    >
                      {product.unitsSold} sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
