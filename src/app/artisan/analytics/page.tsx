'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, RefreshCw } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          borderBottom: '1px solid var(--soft-gold-line)',
          paddingBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.35rem',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: 'var(--ink-brown)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Which Product Did How <span style={{ color: 'var(--maharani-maroon)' }}>Much</span>
          </h1>
          <p
            style={{
              margin: '0.45rem 0 0',
              color: '#4A3E36',
              fontSize: '1.02rem',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            Transparent artisan financial telemetry &bull; Exact units sold, gross value, and your direct 85% workshop payout per handcrafted design
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '4px',
            padding: '0.6rem 1rem',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ink-brown)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw style={{ width: 14, height: 14, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Sync Analytics
        </button>
      </div>

      {/* 3 Clean Summary Tiles: Header, Icon & Number */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Tile 1 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrendingUp style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Total Workshop Sales
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 500,
                lineHeight: 1.05,
                color: 'var(--ink-brown)',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '-0.03em',
              }}
            >
              ₹ {totalGross.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Tile 2 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Your Atelier Share (85%)
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 500,
                lineHeight: 1.05,
                color: 'var(--maharani-maroon)',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '-0.03em',
              }}
            >
              ₹ {totalArtisanShare.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Tile 3 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.65rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '145px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.35rem',
              right: '1.35rem',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Package style={{ width: 20, height: 20, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#5C5043',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                paddingRight: '48px',
              }}
            >
              Total Pieces Dispatched
            </div>
            <div
              style={{
                fontSize: '2.6rem',
                fontWeight: 500,
                lineHeight: 1.05,
                color: 'var(--ink-brown)',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '-0.03em',
              }}
            >
              {totalUnits}
            </div>
          </div>
        </div>
      </div>

      {/* "Which Product Did How Much" Sales Velocity Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--soft-gold-line)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr
              style={{
                background: '#FAF7F2',
                borderBottom: '1px solid var(--soft-gold-line)',
                color: 'var(--stone-taupe)',
                fontWeight: 500,
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.images?.[0] || '/images/category-sarees.png'}
                        alt={item.name}
                        style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)' }}
                      />
                      <div style={{ fontWeight: 600, color: 'var(--ink-brown)', fontSize: '0.92rem' }}>
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    ₹ {price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 500, color: 'var(--ink-brown)' }}>
                    {units} Pieces
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    ₹ {gross.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 500, color: '#2E7D32' }}>
                    ₹ {share.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {stock > 0 ? (
                      <span style={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.82rem' }}>
                        {stock} in stock
                      </span>
                    ) : (
                      <span style={{ color: '#C62828', fontWeight: 600, fontSize: '0.82rem' }}>
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
