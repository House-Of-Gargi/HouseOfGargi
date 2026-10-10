'use client';

import { useState } from 'react';
import { Flame, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';

const BESTSELLERS = [
  {
    rank: 1,
    title: 'Banarasi Katan Silk Kadwa Saree',
    category: 'Sarees',
    artisan: 'Ramdas Mishra Pit Loom Guild',
    unitsSold: 14,
    revenue: 399000,
    conversion: '4.8%',
    isFeatured: true,
  },
  {
    rank: 2,
    title: 'Chanderi Gold Zari Handwoven Kurta Set',
    category: 'Kurta Sets',
    artisan: 'Anand Loom Guild',
    unitsSold: 18,
    revenue: 297000,
    conversion: '6.2%',
    isFeatured: false,
  },
  {
    rank: 3,
    title: 'Kanchipuram Pure Mulberry Korvai Saree',
    category: 'Sarees',
    artisan: 'Sundaramurthy Chettiar',
    unitsSold: 9,
    revenue: 288000,
    conversion: '3.9%',
    isFeatured: true,
  },
  {
    rank: 4,
    title: 'Royal Zardozi Bridal Lehenga',
    category: 'Lehengas',
    artisan: 'Haji Mohammed Rafi',
    unitsSold: 6,
    revenue: 270000,
    conversion: '2.4%',
    isFeatured: false,
  },
  {
    rank: 5,
    title: 'Paithani Peacock Asawali Silk Saree',
    category: 'Sarees',
    artisan: 'Khatri Artisan Atelier',
    unitsSold: 5,
    revenue: 190000,
    conversion: '3.1%',
    isFeatured: false,
  },
];

export default function SuperAdminBestsellersPage() {
  const [items, setItems] = useState(BESTSELLERS);

  const toggleFeatured = (rank: number) => {
    setItems((prev) =>
      prev.map((it) => (it.rank === rank ? { ...it, isFeatured: !it.isFeatured } : it))
    );
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <Flame style={{ width: 18, height: 18, color: '#E65100' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E65100' }}>
            Product Sales Velocity Intelligence
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Hot & Most Selling Products
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Ranked catalog performance by units sold and gross revenue. Promote bestselling creations to the Hero Carousel or Featured Curations.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Velocity Rank</th>
              <th style={{ padding: '0.85rem 1rem' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem' }}>Artisan Guild</th>
              <th style={{ padding: '0.85rem 1rem' }}>Units Moved</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total Gross Revenue</th>
              <th style={{ padding: '0.85rem 1rem' }}>Conversion Rate</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Storefront Pin</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.rank} style={{ borderBottom: '1px solid #F0E8DC' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ width: 28, height: 28, borderRadius: 2, background: it.rank <= 3 ? 'var(--maharani-maroon)' : '#F2E8D8', color: it.rank <= 3 ? '#FFF' : 'var(--ink-brown)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    #{it.rank}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {it.title}
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>{it.category}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{it.artisan}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-brown)' }}>{it.unitsSold} units</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>₹{it.revenue.toLocaleString('en-IN')}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#2E7D32', fontWeight: 600 }}>{it.conversion}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(it.rank)}
                    style={{
                      padding: '0.45rem 0.95rem',
                      borderRadius: 2,
                      border: '1px solid var(--soft-gold-line)',
                      background: it.isFeatured ? '#E8F5E9' : '#FAF7F2',
                      color: it.isFeatured ? '#2E7D32' : 'var(--ink-brown)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    {it.isFeatured ? '✓ Pinned on Hero' : '+ Pin to Hero'}
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
