'use client';

import { useState, useEffect } from 'react';
import { Flame, Sparkles, TrendingUp, ArrowUpRight, Award, Check, Loader2 } from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';

interface BestsellerItem {
  id: string;
  rank: number;
  title: string;
  category: string;
  artisan: string;
  price: number;
  unitsSold: number;
  revenue: number;
  conversion: string;
  isFeatured: boolean;
  imageUrl?: string;
}

export default function SuperAdminBestsellersPage() {
  const [items, setItems] = useState<BestsellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchBestsellers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/bestsellers');
      const data = await res.json();
      if (data.success && data.bestsellers) {
        setItems(data.bestsellers);
      }
    } catch (err) {
      console.error('Error fetching bestsellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      const newStatus = !currentStatus;
      // Optimistic update
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isFeatured: newStatus } : it))
      );

      const res = await fetch('/api/super-admin/bestsellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, isFeatured: currentStatus } : it))
        );
      }
    } catch (err) {
      console.error('Toggle featured error:', err);
      // Revert on failure
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isFeatured: currentStatus } : it))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const totalPinned = items.filter((it) => it.isFeatured).length;
  const totalUnits = items.reduce((acc, it) => acc + (it.unitsSold || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Flame style={{ width: 18, height: 18, color: '#E65100' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E65100' }}>
            Product Sales Velocity Intelligence
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
          Hot & Most Selling <span style={{ color: 'var(--maharani-maroon)' }}>Creations</span>
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '1.02rem', color: '#4A3E36', lineHeight: 1.55 }}>
          Real-time catalog velocity ranked by live units sold and verified gross revenue. Super Admins can pin hot pieces to the public storefront hero showcase.
        </p>
      </div>

      {/* 3 Metric Summary Boxes - Minimal Box Styling & Proportional Font Sizes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Tracked Catalog Pieces
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.025em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${items.length} Creations`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Ranked live by patron velocity
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Pinned to Hero Carousel
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--maharani-maroon)', letterSpacing: '-0.025em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${totalPinned} Featured`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Promoted on boutique storefront
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Total Sales Velocity Units
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, color: '#1B5E20', letterSpacing: '-0.025em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${totalUnits} Units`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Accumulated patron acquisitions
          </div>
        </div>
      </div>

      {/* Bestsellers Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,31,24,0.03)' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <AdminLoadingSpinner size={28} />
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <Flame style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: 'var(--soft-gold-line)' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
              No Catalog Products Found
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Rank</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Creation Title</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Artisan Partner</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Units Moved</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Price & Revenue</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Conversion</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Storefront Pin</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        background: it.rank <= 3 ? 'var(--maharani-maroon)' : '#FAF7F2',
                        color: it.rank <= 3 ? '#FFFFFF' : 'var(--ink-brown)',
                        border: it.rank <= 3 ? 'none' : '1px solid var(--soft-gold-line)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      #{it.rank}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {it.imageUrl && (
                        <img
                          src={it.imageUrl}
                          alt={it.title}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>{it.title}</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>
                          {it.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--stone-taupe)' }}>
                    {it.artisan}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                    {it.unitsSold} units
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                      ₹{it.price.toLocaleString('en-IN')}
                    </div>
                    {it.revenue > 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--stone-taupe)' }}>
                        Gross: ₹{it.revenue.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#2E7D32', fontWeight: 600 }}>
                    {it.conversion}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      disabled={togglingId === it.id}
                      onClick={() => toggleFeatured(it.id, it.isFeatured)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: 4,
                        border: it.isFeatured ? '1px solid #C8E6C9' : '1px solid var(--soft-gold-line)',
                        background: it.isFeatured ? '#E8F5E9' : '#FAF7F2',
                        color: it.isFeatured ? '#2E7D32' : 'var(--ink-brown)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: togglingId === it.id ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {togglingId === it.id ? (
                        <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                      ) : it.isFeatured ? (
                        <>
                          <Check style={{ width: 12, height: 12 }} />
                          Pinned on Hero
                        </>
                      ) : (
                        '+ Pin to Hero'
                      )}
                    </button>
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
