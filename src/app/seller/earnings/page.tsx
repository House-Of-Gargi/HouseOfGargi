'use client';

import { Wallet, ArrowDownCircle, CheckCircle2, Clock } from 'lucide-react';

export default function ArtisanEarningsPage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
          Earnings Ledger & <span style={{ color: 'var(--maharani-maroon)' }}>Settlements</span>
        </h1>
        <p style={{ margin: '0.35rem 0 0', fontSize: '1.05rem', color: '#4A3E36' }}>
          Cleared funds, pending order escrows, and direct bank payout history.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cleared Balance</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹3,39,150
          </div>
          <button style={{ padding: '0.45rem 1rem', borderRadius: 2, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
            Request Payout Withdrawal
          </button>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>In Escrow</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹84,200
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)' }}>Clears upon 7-day return expiration</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '12px', padding: '1.75rem 1.65rem', boxShadow: '0 2px 12px rgba(43,31,24,0.03)' }}>
          <span style={{ fontSize: '0.92rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Lifetime Dispatched</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.05, color: '#1B5E20', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹12,61,400
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)' }}>Settled directly to your bank account</span>
        </div>
      </div>
    </div>
  );
}
