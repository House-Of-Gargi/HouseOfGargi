'use client';

import { Layers, Search, Filter } from 'lucide-react';

const PRODUCTS = [
  { id: '1', name: 'Banarasi Katan Silk Kadwa Saree', artisan: 'Ramdas Mishra', category: 'Sarees', price: 28500, stock: 6, status: 'Active' },
  { id: '2', name: 'Royal Zardozi Bridal Lehenga', artisan: 'Haji Rafi', category: 'Lehengas', price: 45000, stock: 2, status: 'Active' },
  { id: '3', name: 'Kanchipuram Korvai Silk Saree', artisan: 'Sundaramurthy', category: 'Sarees', price: 32000, stock: 4, status: 'Active' },
  { id: '4', name: 'Chanderi Gold Zari Kurta Set', artisan: 'Anand Loom Guild', category: 'Kurta Sets', price: 16500, stock: 8, status: 'Active' },
  { id: '5', name: 'Paithani Peacock Asawali Saree', artisan: 'Khatri Atelier', category: 'Sarees', price: 38000, stock: 1, status: 'Active' },
];

export default function AdminProductsPage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Total Catalog Directory
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Overview of all handcrafted pieces across all artisan ateliers in the House of Gargi boutique.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem' }}>Artisan Partner</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Retail Price</th>
              <th style={{ padding: '0.85rem 1rem' }}>Stock</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>{p.name}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{p.artisan}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{p.category}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>₹{p.price.toLocaleString('en-IN')}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{p.stock}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 2 }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
