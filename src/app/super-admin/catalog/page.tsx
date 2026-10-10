'use client';

import { useState } from 'react';
import { Grid, Eye, EyeOff } from 'lucide-react';

const CATALOG = [
  { id: '1', title: 'Banarasi Katan Silk Kadwa Saree', artisan: 'Ramdas Mishra', isVisible: true, isHero: true },
  { id: '2', title: 'Royal Zardozi Bridal Lehenga', artisan: 'Haji Rafi', isVisible: true, isHero: false },
  { id: '3', title: 'Kanchipuram Pure Mulberry Korvai Saree', artisan: 'Sundaramurthy', isVisible: true, isHero: true },
  { id: '4', title: 'Chanderi Gold Zari Handwoven Kurta Set', artisan: 'Anand Loom Guild', isVisible: true, isHero: false },
  { id: '5', title: 'Paithani Peacock Asawali Silk Saree', artisan: 'Khatri Atelier', isVisible: true, isHero: false },
];

export default function MasterCatalogPage() {
  const [items, setItems] = useState(CATALOG);

  const toggleVisibility = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isVisible: !it.isVisible } : it))
    );
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Master Catalog Governance & Storefront Display
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Exclusive Super Admin control: toggle global product display visibility and select pieces for the boutique hero carousel.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem' }}>Artisan Partner</th>
              <th style={{ padding: '0.85rem 1rem' }}>Display State</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Storefront Visibility Toggle</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>{it.title}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{it.artisan}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 2, background: it.isVisible ? '#E8F5E9' : '#FFEBEE', color: it.isVisible ? '#2E7D32' : '#C62828' }}>
                    {it.isVisible ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(it.id)}
                    style={{
                      padding: '0.45rem 0.95rem',
                      borderRadius: 2,
                      border: '1px solid var(--soft-gold-line)',
                      background: '#FAF7F2',
                      color: it.isVisible ? '#C62828' : '#2E7D32',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    {it.isVisible ? 'Hide from Storefront' : 'Publish to Storefront'}
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
