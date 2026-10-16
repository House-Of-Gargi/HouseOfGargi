'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  IndianRupee,
  ShoppingBag, 
  Package, 
  RefreshCw, 
  LogOut, 
  ChevronRight, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface DailySale {
  date: string;
  label: string;
  shortLabel: string;
  sales: number;
  units: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unitsSold: number;
  revenue: number;
  artisanShare: number;
  imageUrl: string;
}

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
    artStyle: 'Tangail Jamdani Pit Loom Weave',
    regionalBelonging: 'Shantipur, Nadia, West Bengal',
  });

  // Analytics states
  const [sales7Days, setSales7Days] = useState<DailySale[]>([]);
  const [sales30Days, setSales30Days] = useState<DailySale[]>([]);
  const [top5Products, setTop5Products] = useState<TopProduct[]>([]);
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      const [ordersRes, prodsRes, artisanRes, analyticsRes] = await Promise.all([
        fetch('/api/orders').then(r => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/admin/products').then(r => r.json()).catch(() => ({ products: [] })),
        fetch(`/api/artisan/me${email ? `?email=${encodeURIComponent(email)}` : ''}`).then(r => r.json()).catch(() => ({})),
        fetch('/api/artisan/analytics').then(r => r.json()).catch(() => ({})),
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
          artStyle: artisanRes.artisan.artStyle || 'Tangail Jamdani Pit Loom Weave',
          regionalBelonging: artisanRes.artisan.regionalBelonging || 'Shantipur, Nadia, West Bengal',
        });
      }
      if (analyticsRes.success) {
        if (analyticsRes.sales7Days) setSales7Days(analyticsRes.sales7Days);
        if (analyticsRes.sales30Days) setSales30Days(analyticsRes.sales30Days);
        if (analyticsRes.top5Products) setTop5Products(analyticsRes.top5Products);
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
    router.push('/artisan/login?logout=true');
  };

  // Compute live business metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_rupees) || 0), 0);
    const artisanShare = Math.round(totalRevenue * 0.85);
    const totalOrders = orders.length;
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const activeFulfillment = orders.filter(o => {
      const s = (o.status || '').toLowerCase();
      return s === 'processing' || s === 'shipped' || s.includes('bespoke');
    }).length;

    // Categories matching customer portal exactly: Sarees, Lehengas, Kurta Sets, Accessories
    const categoriesMap: Record<string, { count: number; stock: number; label: string }> = {
      sarees: { count: 0, stock: 0, label: 'Sarees' },
      lehengas: { count: 0, stock: 0, label: 'Lehengas' },
      'kurta-sets': { count: 0, stock: 0, label: 'Kurta Sets' },
      accessories: { count: 0, stock: 0, label: 'Accessories' },
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
      totalStock,
      activeFulfillment,
      categories: Object.entries(categoriesMap),
      lowStockItems,
    };
  }, [orders, products]);

  // Current sales chart data based on active timeframe toggle
  const currentSalesData = timeRange === '7' ? sales7Days : sales30Days;
  const maxSales = Math.max(...currentSalesData.map((d) => d.sales), 1000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ========================================================= */}
      {/* 1. ELEGANT ADMIN-PORTAL-STYLED HEADER                     */}
      {/* ========================================================= */}
      <div
        style={{
          borderBottom: '1px solid var(--soft-gold-line)',
          paddingBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.95rem',
              fontWeight: 600,
              color: 'var(--ink-brown)',
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              fontFamily: 'var(--font-serif)',
            }}
          >
            Welcome, <span style={{ color: 'var(--maharani-maroon)' }}>{artisan.name}</span>
          </h1>
          <p
            style={{
              margin: '0.4rem 0 0',
              color: '#4A3E36',
              fontSize: '0.98rem',
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Artisan ID: <strong style={{ color: 'var(--maharani-maroon)' }}>{artisan.artisanNo}</strong> &bull; {artisan.artStyle} &bull; {artisan.regionalBelonging}
          </p>
        </div>

        {/* Action Controls: ONLY Sync Data & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchLiveBackendData}
            title="Sync Live Data"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '4px',
              padding: '0.6rem 1rem',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ink-brown)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Sync Data
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            style={{
              background: '#FFF5F5',
              border: '1.5px solid #F8D7DA',
              borderRadius: '4px',
              padding: '0.6rem 1rem',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#C62828',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            Sign Out
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THE 4 METRIC BOXES: HEADER, ICON & NUMBER ONLY         */}
      {/* ========================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Box 1: Gross Sales */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
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
            <TrendingUp style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#5C5043',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.45rem',
                paddingRight: '48px',
              }}
            >
              Workshop Gross Sales
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              ₹ {metrics.totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Box 2: Atelier Share (85%) */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
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
                marginBottom: '0.45rem',
                paddingRight: '48px',
              }}
            >
              Your Atelier Share (85%)
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--maharani-maroon)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              ₹ {metrics.artisanShare.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Box 3: Active Loom Orders */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
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
            <ShoppingBag style={{ width: 20, height: 20, color: 'var(--ink-brown)' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#5C5043',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.45rem',
                paddingRight: '48px',
              }}
            >
              Active Loom Orders
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {metrics.activeFulfillment}
            </div>
          </div>
        </div>

        {/* Box 4: Live Loom Stock */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
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
                marginBottom: '0.45rem',
                paddingRight: '48px',
              }}
            >
              Live Loom Stock
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {metrics.totalActiveProducts}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. 2-COLUMN SECTION: SALES GRAPH (7/30 DAYS) + TOP 5 ITEMS */}
      {/* ========================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Column: Interactive Daily Sales Revenue Bar Graph */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--ink-brown)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                Artisan Sales Velocity
              </h2>
              <p style={{ margin: '0.25rem 0 0', color: '#6A5A50', fontSize: '0.88rem' }}>
                Daily sales value &amp; sold pieces generated from your workshop
              </p>
            </div>

            {/* Timeframe Pill Switcher (7 Days vs 30 Days) */}
            <div
              style={{
                display: 'inline-flex',
                padding: '3px',
                borderRadius: '9999px',
                backgroundColor: '#FAF7F2',
                border: '1px solid var(--soft-gold-line)',
              }}
            >
              <button
                type="button"
                onClick={() => setTimeRange('7')}
                style={{
                  border: 'none',
                  background: timeRange === '7' ? 'var(--maharani-maroon)' : 'transparent',
                  color: timeRange === '7' ? '#FFFFFF' : '#4A3E36',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
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
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
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

          {/* Bar Chart Canvas with Y-Axis and Interactive Bars */}
          <div style={{ position: 'relative', width: '100%', height: '240px', paddingTop: '15px', flex: 1 }}>
            {/* Y-Axis Guidelines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                paddingBottom: '32px',
                paddingLeft: '55px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6A5A50', width: '50px', marginLeft: '-55px', textAlign: 'right', paddingRight: '10px' }}>
                  {maxSales > 1000 ? (`₹${Math.round(maxSales / 1000)}k`) : '₹1k'}
                </span>
                <div style={{ borderBottom: '1px dashed rgba(228, 211, 174, 0.75)', flex: 1 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6A5A50', width: '50px', marginLeft: '-55px', textAlign: 'right', paddingRight: '10px' }}>
                  {maxSales > 1000 ? (`₹${Math.round(maxSales / 2000)}k`) : '₹500'}
                </span>
                <div style={{ borderBottom: '1px dashed rgba(228, 211, 174, 0.75)', flex: 1 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6A5A50', width: '50px', marginLeft: '-55px', textAlign: 'right', paddingRight: '10px' }}>
                  ₹0
                </span>
                <div style={{ borderBottom: '1.5px solid var(--soft-gold-line)', flex: 1 }} />
              </div>
            </div>

            {/* Interactive Bars */}
            <div
              style={{
                position: 'relative',
                height: 'calc(100% - 32px)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: timeRange === '7' ? '1.25rem' : '0.25rem',
                padding: '0 0.5rem 0 55px',
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
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: Math.max(heightPercent, 12) + 14 + '%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'var(--ink-brown)',
                          color: '#FFFFFF',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          whiteSpace: 'nowrap',
                          zIndex: 30,
                          pointerEvents: 'none',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontWeight: 800, color: 'var(--soft-gold-line)', fontSize: '0.92rem' }}>
                          ₹ {item.sales.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.74rem', opacity: 0.9, marginTop: '2px' }}>
                          {item.label} &bull; {item.units} piece{item.units !== 1 ? 's' : ''} sold
                        </div>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: timeRange === '7' ? '46px' : '14px',
                        height: item.sales > 0 ? Math.max(heightPercent, 4) + '%' : '6px',
                        background:
                          item.sales > 0
                            ? isHovered
                              ? 'var(--gargi-gold)'
                              : 'linear-gradient(180deg, var(--gargi-gold) 0%, var(--maharani-maroon) 100%)'
                            : isHovered
                            ? 'var(--gargi-gold)'
                            : '#EFE6D8',
                        borderRadius: item.sales > 0 ? '4px 4px 0 0' : '2px',
                        transition: 'all 0.2s ease',
                        boxShadow: isHovered && item.sales > 0 ? '0 0 10px rgba(184, 142, 24, 0.4)' : 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Date Labels */}
            <div
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 0.5rem 0 55px',
                gap: timeRange === '7' ? '1.25rem' : '0.25rem',
                borderTop: '1.5px solid var(--soft-gold-line)',
              }}
            >
              {currentSalesData.map((item, idx) => {
                const showLabel = timeRange === '7' || idx % 5 === 0 || idx === currentSalesData.length - 1;

                return (
                  <div
                    key={item.date}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#5C5043',
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

        {/* Right Column: Top 5 Selling Items */}
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
          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
                letterSpacing: '-0.015em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              Top 5 Selling Items
            </h2>
            <p style={{ margin: '0.25rem 0 0', color: '#6A5A50', fontSize: '0.88rem' }}>
              Your atelier&apos;s highest volume master creations
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
            {top5Products.map((product, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={product.id}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #F0E8DC',
                    borderRadius: '8px',
                    backgroundColor: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'all 0.18s ease',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    {/* Rank Badge */}
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isTop3 ? 'var(--maharani-maroon)' : '#EAE2D5',
                        color: isTop3 ? '#FFFFFF' : 'var(--ink-brown)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {'#' + rank}
                    </span>

                    {/* Thumbnail */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        border: '1px solid var(--soft-gold-line)',
                        flexShrink: 0,
                      }}
                    />

                    {/* Name & Category */}
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          color: 'var(--ink-brown)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#6A5A50', marginTop: '1px' }}>
                        {product.category} &bull; ₹ {(Number(product.price) || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Units Sold & Artisan Share */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--maharani-maroon)' }}>
                      ₹ {product.artisanShare.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 700, marginTop: '1px' }}>
                      {product.unitsSold} sold
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. COLLECTION PORTFOLIO (CUSTOMER CATEGORY NAMES)         */}
      {/* ========================================================= */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--soft-gold-line)',
          borderRadius: '12px',
          padding: '1.75rem',
          boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
              Collection Portfolio
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#6A5A50', margin: '0.25rem 0 0 0' }}>
              Live inventory distribution across House of Gargi couture lines
            </p>
          </div>

          <Link
            href="/artisan/inventory"
            style={{
              fontFamily: 'var(--font-nav)',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '1.25rem',
          }}
        >
          {metrics.categories.map(([key, data]) => (
            <div
              key={key}
              style={{
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '8px',
                padding: '1.25rem 1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#5C5043',
                }}
              >
                {data.label}
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--ink-brown)',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.1,
                }}
              >
                {data.count}{' '}
                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--stone-taupe)' }}>
                  designs
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--stone-taupe)' }}>
                <strong style={{ color: 'var(--ink-brown)' }}>{data.stock}</strong> units in workshop stock
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Warning Banner if any */}
        {metrics.lowStockItems.length > 0 && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1.15rem',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.88rem',
              color: '#92400E',
            }}
          >
            <AlertTriangle style={{ width: 16, height: 16, color: '#D97706', flexShrink: 0 }} />
            <span>
              <strong>Loom Notice:</strong> {metrics.lowStockItems.length} design{metrics.lowStockItems.length > 1 ? 's have' : ' has'} low workshop inventory (&le; 5 units):{' '}
              {metrics.lowStockItems.map(p => p.name).slice(0, 3).join(', ')}{metrics.lowStockItems.length > 3 ? ` + ${metrics.lowStockItems.length - 3} more` : ''}.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
