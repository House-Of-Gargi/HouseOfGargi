'use client';

import { useState, useEffect } from 'react';
import { Boxes, Plus, Minus, CheckCircle2, AlertTriangle, Clock, RefreshCw, Loader2, Search } from 'lucide-react';

export default function ArtisanInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInventory = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching live inventory:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id: string, delta: number) => {
    const item = products.find((i) => i.id === id);
    if (!item) return;
    const currentStock = Number(item.stock) || 0;
    const newCount = Math.max(0, currentStock + delta);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stock: newCount } : i))
    );

    try {
      setUpdatingId(id);
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newCount }),
      });
    } catch (err) {
      console.error('Stock update error:', err);
      fetchInventory();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStock = async (id: string) => {
    const item = products.find((i) => i.id === id);
    if (!item) return;
    const currentStock = Number(item.stock) || 0;
    const newStock = currentStock > 0 ? 0 : 10;

    setProducts((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stock: newStock } : i))
    );

    try {
      setUpdatingId(id);
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock }),
      });
    } catch (err) {
      console.error('Toggle error:', err);
      fetchInventory();
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.productNo || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.artType || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Boxes style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
              Real-time Workshop Stock Manager
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
            Manage Product Quantities & <span style={{ color: 'var(--maharani-maroon)' }}>Inventory</span>
          </h1>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', color: '#4A3E36' }}>
            Live quantity stepper &bull; Adjust stock on your workshop looms, toggle availability, and sync directly with the storefront
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInventory}
          style={{
            background: 'var(--pure-white)',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '2px',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: 700,
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
          Sync Inventory
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem', maxWidth: '360px', position: 'relative' }}>
        <Search style={{ width: 15, height: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-taupe)' }} />
        <input
          type="text"
          placeholder="Search by title, piece code, or technique..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem 0.6rem 2.2rem',
            borderRadius: 4,
            border: '1.5px solid var(--soft-gold-line)',
            fontSize: '0.88rem',
            outline: 'none',
            background: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,31,24,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Product Creation</th>
              <th style={{ padding: '0.85rem 1rem' }}>Craft Technique</th>
              <th style={{ padding: '0.85rem 1rem' }}>Retail Price</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Live Loom Stock</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Availability Toggle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const stock = Number(item.stock) || 0;
              const isOut = stock <= 0;
              const isUpdating = updatingId === item.id;

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.images?.[0] || '/images/category-sarees.png'}
                        alt={item.name}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--ink-brown)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--maharani-maroon)', fontFamily: 'monospace', fontWeight: 700 }}>
                          {item.productNo || 'ART-2605'} &bull; <span style={{ textTransform: 'capitalize', color: 'var(--stone-taupe)', fontFamily: 'sans-serif' }}>{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>
                    {item.artType || 'Tangail Jamdani Pit Loom'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                    ₹ {(Number(item.price) || 0).toLocaleString('en-IN')}
                  </td>

                  {/* Real-time Inline Quantity Stepper */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, backgroundColor: '#FAF7F2', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateStock(item.id, -1)}
                        disabled={stock <= 0 || isUpdating}
                        style={{
                          width: 32,
                          height: 32,
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--ink-brown)',
                          cursor: stock <= 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Decrease stock count"
                      >
                        <Minus style={{ width: 14, height: 14 }} />
                      </button>

                      <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: stock <= 2 ? '#C62828' : 'var(--ink-brown)' }}>
                        {isUpdating ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : stock}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleUpdateStock(item.id, 1)}
                        disabled={isUpdating}
                        style={{
                          width: 32,
                          height: 32,
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--ink-brown)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Increase stock count"
                      >
                        <Plus style={{ width: 14, height: 14 }} />
                      </button>
                    </div>

                    {stock <= 2 && (
                      <div style={{ fontSize: '0.68rem', color: '#C62828', fontWeight: 700, marginTop: 4 }}>
                        {stock === 0 ? 'Out of Stock' : 'Low Stock Alert'}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    {stock > 0 ? (
                      <span style={{ color: '#2E7D32', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} /> In Stock ({stock})
                      </span>
                    ) : (
                      <span style={{ color: '#C62828', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={13} /> Depleted
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStock(item.id)}
                      disabled={isUpdating}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 2,
                        border: '1px solid var(--soft-gold-line)',
                        background: isOut ? '#E8F5E9' : '#FFEBEE',
                        color: isOut ? '#2E7D32' : '#C62828',
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isOut ? 'Mark In Stock' : 'Mark Out of Stock'}
                    </button>
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
