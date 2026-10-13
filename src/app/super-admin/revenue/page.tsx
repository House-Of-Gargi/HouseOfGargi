'use client';

import { DollarSign, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

export default function SuperAdminRevenuePage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
          Revenue & Financial <span style={{ color: 'var(--maharani-maroon)' }}>Ledger</span>
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '1.05rem', color: '#4A3E36' }}>
          Platform take-rate margins, gross marketplace volume, and artisan settlements ledger.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total GMV (All Time)</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹14,84,000
          </div>
          <span style={{ fontSize: '0.92rem', color: '#2E7D32', fontWeight: 600 }}>100% Marketplace Volume</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>House of Gargi Share (15%)</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹2,22,600
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)' }}>Net Platform Commission</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Artisan Weaver Share (85%)</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: '#1B5E20', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹12,61,400
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)' }}>Direct to Craftsmen Guilds</span>
        </div>
      </div>
    </div>
  );
}
