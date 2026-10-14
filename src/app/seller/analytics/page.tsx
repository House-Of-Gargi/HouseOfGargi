'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Eye, Award, RefreshCw } from 'lucide-react';

export default function ArtisanAnalyticsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setItems(data.products);
      }
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalGross = items.reduce((acc, i) => {
    const units = Number(i.totalSales) || 0;
    const price = Number(i.price) || 0;
    return acc + (units * price);
  }, 0);

  const totalArtisanShare = Math.round(totalGross * 0.85);
  const totalUnits = items.reduce((acc, i) => acc + (Number(i.totalSales) || 0), 0);

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <TrendingUp style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
              Sales Performance &amp; Product Velocity
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
            Which Product Did How <span style={{ color: 'var(--maharani-maroon)' }}>Much</span>
          </h1>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', color: '#4A3E36' }}>
            Transparent artisan financial telemetry &bull; Exact units sold, gross value, and your direct 85% workshop payout per handcrafted design
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
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
          Sync Analytics
        </button>
      </div>

      {/* 3 Summary Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Total Workshop Sales
          </span>
          <div style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹ {totalGross.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>Gross value across all designs</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Your Net Atelier Earnings (85%)
          </span>
          <div style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹ {totalArtisanShare.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.88rem', color: '#2E7D32', fontWeight: 600 }}>Direct settlement to your workshop account</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Total Pieces Dispatched
          </span>
          <div style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            {totalUnits} Pieces
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)' }}>Across {items.length} master creations</span>
        </div>
      </div>

      {/* "Which Product Did How Much" Sales Velocity Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Price</th>
              <th style={{ padding: '0.85rem 1rem' }}>Units Sold</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total Gross</th>
              <th style={{ padding: '0.85rem 1rem' }}>Your 85% Share</th>
              <th style={{ padding: '0.85rem 1rem' }}>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const units = Number(item.totalSales) || 0;
              const price = Number(item.price) || 0;
              const gross = units * price;
              const share = Math.round(gross * 0.85);
              const stock = Number(item.stock) || 0;

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={item.images?.[0] || '/images/category-sarees.png'}
                        alt={item.name}
                        style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)' }}
                      />
                      <div>
                        <div>{item.name}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>{item.artType || 'Handloom Pit Loom'}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    ₹ {price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                    {units} Pieces
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    ₹ {gross.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2E7D32' }}>
                    ₹ {share.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {stock > 0 ? (
                      <span style={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.8rem' }}>
                        {stock} in stock
                      </span>
                    ) : (
                      <span style={{ color: '#C62828', fontWeight: 600, fontSize: '0.8rem' }}>
                        Depleted
                      </span>
                    )}
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
