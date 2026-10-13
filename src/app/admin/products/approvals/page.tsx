'use client';

import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

export default function ProductApprovalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPending() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('curation_status', 'pending');

        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching pending products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPending();
  }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await supabase
        .from('products')
        .update({ curation_status: action })
        .eq('id', id);

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error updating product status:', err);
    }
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Product QC & Storefront <span style={{ color: 'var(--maharani-maroon)' }}>Approvals</span>
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.94rem', fontFamily: 'var(--font-subtitle)' }}>
          Review artisan submissions and verify craft authenticity before publishing to the boutique catalog.
        </p>
      </div>

      {loading ? (
        <AdminPageLoadingBlock minHeight="220px" message="Loading pending curation queue..." />
      ) : products.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            color: 'var(--stone-taupe)',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--gargi-gold)' }}>
            <Sparkles style={{ width: 22, height: 22 }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            No Products Pending QC
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--stone-taupe)', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
            The curation queue is clear. When artisans upload new creations via their atelier portal, they will appear here for quality inspection.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '10px',
                boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink-brown)', margin: '0 0 0.25rem' }}>
                  {p.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--stone-taupe)' }}>
                  Category: {p.category} &bull; Price: ₹{Number(p.price_in_rupees || 0).toLocaleString('en-IN')} &bull; Stock: {p.stock || 0}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleAction(p.id, 'approved')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-nav)',
                  }}
                >
                  Approve & Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(p.id, 'rejected')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    color: 'var(--ink-brown)',
                    border: '1px solid var(--soft-gold-line)',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-nav)',
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
