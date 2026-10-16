'use client';

import { useState, useEffect } from 'react';
import { Grid, Eye, EyeOff, Search, Loader2, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';

interface CatalogItem {
  id: string;
  productNo: string;
  title: string;
  category: string;
  artisan: string;
  price: number;
  stock: number;
  isVisible: boolean;
  isHero: boolean;
  imageUrl?: string;
}

export default function MasterCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/catalog');
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      const newStatus = !currentStatus;
      // Optimistic update
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isVisible: newStatus } : it))
      );

      const res = await fetch('/api/super-admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVisible: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, isVisible: currentStatus } : it))
        );
      }
    } catch (err) {
      console.error('Toggle visibility error:', err);
      // Revert on failure
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isVisible: currentStatus } : it))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map((it) => it.category)))];

  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.productNo && it.productNo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || it.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalVisible = items.filter((it) => it.isVisible).length;
  const totalHidden = items.filter((it) => !it.isVisible).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Grid style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Catalog Governance & Visibility
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.95rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.25 }}>
          Master Catalog & Storefront <span style={{ color: 'var(--maharani-maroon)' }}>Display</span>
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.98rem', color: '#4A3E36', lineHeight: 1.55 }}>
          Exclusive Super Admin control: toggle global creation visibility on the public storefront, inspect artisan attribution, and govern master pricing.
        </p>
      </div>

      {/* 3 Stat Overview Tiles - Minimal Box Styling & Proportional Font Sizes */}
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
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Total Master Creations
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${items.length} Items`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Verified handloom artisan inventory
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
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Storefront Active (Visible)
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: '#1B5E20', letterSpacing: '-0.01em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${totalVisible} Live`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Published and shoppable by patrons
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
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Unpublished (Hidden)
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: totalHidden > 0 ? '#C62828' : 'var(--stone-taupe)', letterSpacing: '-0.01em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${totalHidden} Hidden`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Withheld from public storefront
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '420px' }}>
          <Search style={{ width: 18, height: 18, position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-taupe)' }} />
          <input
            type="text"
            placeholder="Search by title, code, or artisan partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: 4,
              border: '1px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              fontSize: '0.9rem',
              color: 'var(--ink-brown)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 4,
              border: '1px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--ink-brown)',
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'capitalize',
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,31,24,0.03)' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <AdminLoadingSpinner size={28} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <Grid style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: 'var(--soft-gold-line)' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
              No Creations Match Your Search
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Code</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Creation Title</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Artisan Guild</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Price</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Display State</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Storefront Visibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--ink-brown)', fontSize: '0.82rem' }}>
                    {it.productNo}
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--stone-taupe)' }}>ID: {it.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>
                    {it.category.replace('-', ' ')}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--stone-taupe)' }}>
                    {it.artisan}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                    ₹{it.price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 4,
                        background: it.isVisible ? '#E8F5E9' : '#FFEBEE',
                        color: it.isVisible ? '#2E7D32' : '#C62828',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {it.isVisible ? (
                        <>
                          <Eye style={{ width: 12, height: 12 }} />
                          VISIBLE
                        </>
                      ) : (
                        <>
                          <EyeOff style={{ width: 12, height: 12 }} />
                          HIDDEN
                        </>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      disabled={togglingId === it.id}
                      onClick={() => toggleVisibility(it.id, it.isVisible)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: 4,
                        border: '1px solid var(--soft-gold-line)',
                        background: '#FAF7F2',
                        color: it.isVisible ? '#C62828' : '#2E7D32',
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
                      ) : it.isVisible ? (
                        <>
                          <EyeOff style={{ width: 12, height: 12 }} />
                          Hide from Storefront
                        </>
                      ) : (
                        <>
                          <Eye style={{ width: 12, height: 12 }} />
                          Publish to Storefront
                        </>
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
