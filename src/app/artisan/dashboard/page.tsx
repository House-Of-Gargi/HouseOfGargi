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
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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
    artStyle: 'Tangail Jamdani Pit Loom',
    regionalBelonging: 'Shantipur, Nadia, West Bengal',
  });

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
      const [ordersRes, prodsRes, artisanRes] = await Promise.all([
        fetch('/api/orders').then(r => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/admin/products').then(r => r.json()).catch(() => ({ products: [] })),
        fetch(`/api/artisan/me${email ? `?email=${encodeURIComponent(email)}` : ''}`).then(r => r.json()).catch(() => ({})),
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
          artStyle: artisanRes.artisan.artStyle || 'Tangail Jamdani Pit Loom',
          regionalBelonging: artisanRes.artisan.regionalBelonging || 'Shantipur, Nadia, West Bengal',
        });
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
    router.push('/seller/login?logout=true');
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
              fontSize: '2.35rem',
              fontWeight: 800,
              color: 'var(--ink-brown)',
              margin: 0,
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              fontFamily: 'var(--font-serif)',
            }}
          >
            Welcome, <span style={{ color: 'var(--maharani-maroon)' }}>{artisan.name}</span>
          </h1>
          <p
            style={{
              margin: '0.45rem 0 0',
              color: '#4A3E36',
              fontSize: '1.02rem',
              lineHeight: 1.5,
              fontWeight: 500,
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
              fontWeight: 700,
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
              fontWeight: 700,
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
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <TrendingUp style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Workshop Gross Sales
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                color: 'var(--ink-brown)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
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
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <IndianRupee style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Your Atelier Share (85%)
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                color: 'var(--maharani-maroon)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
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
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <ShoppingBag style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Active Loom Orders
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                color: 'var(--ink-brown)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
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
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Package style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Live Loom Stock
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                color: 'var(--ink-brown)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {metrics.totalStock}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. COLLECTION PORTFOLIO (CUSTOMER CATEGORY NAMES)         */}
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
            href="/seller/inventory"
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
