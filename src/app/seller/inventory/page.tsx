'use client';

import { useState, useEffect } from 'react';
import { Boxes, Plus, Minus, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function ArtisanInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/artisan/inventory');
      const data = await res.json();
      if (data.success && data.inventory) {
        setInventory(data.inventory);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id: string, delta: number) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;
    const newCount = Math.max(0, item.stockCount + delta);

    // Optimistic UI update
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stockCount: newCount, isOutOfStock: newCount === 0 } : i))
    );

    try {
      setUpdatingId(id);
      await fetch('/api/artisan/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stockCount: newCount, isOutOfStock: newCount === 0 }),
      });
    } catch (err) {
      console.error('Stock update error:', err);
      fetchInventory();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStock = async (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;
    const newOutOfStock = !item.isOutOfStock;

    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isOutOfStock: newOutOfStock } : i))
    );

    try {
      setUpdatingId(id);
      await fetch('/api/artisan/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isOutOfStock: newOutOfStock }),
      });
    } catch (err) {
      console.error('Toggle error:', err);
      fetchInventory();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <Boxes style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Loom Stock & Quantity Manager • মজুত ও তাঁত
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Manage Product Quantities & Inventory
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Real-time quantity stepper: add or reduce pieces on your workshop looms, toggle stock availability, and set handloom weaving lead times.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Product Creation (পণ্য)</th>
              <th style={{ padding: '0.85rem 1rem' }}>Craft Technique (শিল্পরীতি)</th>
              <th style={{ padding: '0.85rem 1rem' }}>Retail Price</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Live Loom Stock (মজুত সংখ্যা)</th>
              <th style={{ padding: '0.85rem 1rem' }}>Loom Lead Time (সময়)</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Availability Toggle</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>{item.title}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>{item.category}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>
                  {item.craftTechnique}
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </td>

                {/* Real-time Inline Quantity Stepper */}
                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, backgroundColor: '#FAF7F2', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateStock(item.id, -1)}
                      disabled={item.stockCount <= 0}
                      style={{
                        width: 32,
                        height: 32,
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--ink-brown)',
                        cursor: item.stockCount <= 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Decrease stock count"
                    >
                      <Minus style={{ width: 14, height: 14 }} />
                    </button>

                    <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: item.stockCount <= 2 ? '#C62828' : 'var(--ink-brown)' }}>
                      {item.stockCount}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUpdateStock(item.id, 1)}
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

                  {item.stockCount <= 2 && (
                    <div style={{ fontSize: '0.68rem', color: '#C62828', fontWeight: 700, marginTop: 4 }}>
                      {item.stockCount === 0 ? 'Out of Stock' : 'Low Stock Alert'}
                    </div>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>
                  {item.leadTimeDays === 0 ? (
                    <span style={{ color: '#2E7D32', fontWeight: 600 }}>Ready to Ship</span>
                  ) : (
                    <span>Made on Order ({item.leadTimeDays} Days)</span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleStock(item.id)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 2,
                      border: '1px solid var(--soft-gold-line)',
                      background: item.isOutOfStock ? '#FFEBEE' : '#E8F5E9',
                      color: item.isOutOfStock ? '#C62828' : '#2E7D32',
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                    }}
                  >
                    {item.isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
