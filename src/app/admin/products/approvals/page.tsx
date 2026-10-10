'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

const PENDING_PRODUCTS = [
  {
    id: 'qc-01',
    name: 'Varanasi Shikargah Animal Motif Katan Saree',
    artisan: 'Ramdas Mishra Pit Loom Guild',
    craft: 'Shikargah Weave Pit Loom',
    price: 36000,
    silkMark: true,
    leadTime: 'Ready to Ship',
    images: 4,
  },
  {
    id: 'qc-02',
    name: 'Korvai Peacock Border Contrast Saree',
    artisan: 'Sundaramurthy Chettiar',
    craft: 'Korvai Interlocked Warp',
    price: 29500,
    silkMark: true,
    leadTime: '14 Days Loom Weave',
    images: 3,
  },
];

export default function ProductApprovalsPage() {
  const [products, setProducts] = useState(PENDING_PRODUCTS);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    alert('Product ' + id + ' marked as ' + action.toUpperCase() + '.');
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Product QC & Storefront Approvals
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Inspect newly added artisan products, verify photography quality and craft attributes before making visible on the boutique.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {products.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', background: '#FAF7F2', borderRadius: 4, color: 'var(--stone-taupe)' }}>
            All submitted products have been reviewed and curated!
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--soft-gold-line)',
                borderRadius: 4,
                padding: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--maharani-maroon)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {p.artisan}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, margin: '0.2rem 0', color: 'var(--ink-brown)' }}>
                  {p.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', display: 'flex', gap: '1rem', marginTop: 4 }}>
                  <span>Craft: <strong>{p.craft}</strong></span>
                  <span>Retail Price: <strong>₹{p.price.toLocaleString('en-IN')}</strong></span>
                  <span>Lead Time: <strong>{p.leadTime}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleAction(p.id, 'approve')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 2,
                    border: 'none',
                    backgroundColor: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Approve for Storefront
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(p.id, 'reject')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 2,
                    border: '1px solid #D8CBB6',
                    backgroundColor: 'transparent',
                    color: 'var(--stone-taupe)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Request Edits
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
