'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Total Catalog <span style={{ color: 'var(--maharani-maroon)' }}>Directory</span> ({products.length})
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem', fontFamily: 'var(--font-body)' }}>
          Live inventory of handcrafted pieces registered across the boutique.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,31,24,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-nav)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Retail Price</th>
              <th style={{ padding: '0.85rem 1rem' }}>Stock</th>
              <th style={{ padding: '0.85rem 1rem' }}>Units Sold</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                  <AdminPageLoadingBlock minHeight="140px" message="Loading catalog directory..." />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
                  No products registered in the database yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>{p.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>{p.category}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>₹{Number(p.price_in_rupees || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{p.stock ?? 0}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{p.total_units_sold ?? 0}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ background: p.curation_status === 'approved' ? '#E8F5E9' : '#FFF3E0', color: p.curation_status === 'approved' ? '#2E7D32' : '#E65100', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 3, textTransform: 'uppercase' }}>
                      {p.curation_status || 'active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
