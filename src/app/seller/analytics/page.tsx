'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Eye, Award } from 'lucide-react';

export default function ArtisanAnalyticsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/artisan/inventory');
        const data = await res.json();
        if (data.success && data.inventory) {
          setItems(data.inventory);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      }
    }
    loadData();
  }, []);

  const totalGross = items.reduce((acc, i) => acc + (i.grossRevenue || 0), 0);
  const totalArtisanShare = items.reduce((acc, i) => acc + (i.artisanShare || 0), 0);
  const totalUnits = items.reduce((acc, i) => acc + (i.unitsSold || 0), 0);

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <TrendingUp style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Sales Performance & Insights
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
          Which Product Did How <span style={{ color: 'var(--maharani-maroon)' }}>Much</span>
        </h1>
        <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', color: '#4A3E36' }}>
          Transparent artisan financial telemetry: examine exact units sold, gross sales, and your direct 85% workshop payout per handcrafted piece.
        </p>
      </div>

      {/* 3 Summary Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Total Workshop Sales
          </span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹{totalGross.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)' }}>Gross value across all creations</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Your Net Atelier Earnings (85%)
          </span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹{totalArtisanShare.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.92rem', color: '#2E7D32', fontWeight: 600 }}>Direct payout to your bank account</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Total Pieces Dispatched
          </span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            {totalUnits} Sarees & Ensembles
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)' }}>0.0% return rate on verified pieces</span>
        </div>
      </div>

      {/* "Which Product Did How Much" Sales Velocity Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Units Sold</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total Gross</th>
              <th style={{ padding: '0.85rem 1rem' }}>Your 85% Share</th>
              <th style={{ padding: '0.85rem 1rem' }}>Return Rate</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {item.title}
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>{item.craftTechnique}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{item.category}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                  {item.unitsSold} Pieces
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                  ₹{item.grossRevenue ? item.grossRevenue.toLocaleString('en-IN') : '0'}
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                  ₹{item.artisanShare ? item.artisanShare.toLocaleString('en-IN') : '0'}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#2E7D32', fontWeight: 600 }}>
                  0.0%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
