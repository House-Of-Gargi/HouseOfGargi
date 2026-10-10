'use client';

import { DollarSign, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

export default function SuperAdminRevenuePage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Revenue & Financial Ledger
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Platform take-rate margins, gross marketplace volume, and artisan settlements ledger.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>Total GMV (All Time)</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹14,84,000
          </div>
          <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>100% Marketplace Volume</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>House of Gargi Share (15%)</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹2,22,600
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>Net Platform Commission</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>Artisan Weaver Share (85%)</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1B5E20', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹12,61,400
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>Direct to Craftsmen Guilds</span>
        </div>
      </div>
    </div>
  );
}
