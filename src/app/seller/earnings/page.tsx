'use client';

import { Wallet, ArrowDownCircle, CheckCircle2, Clock } from 'lucide-react';

export default function ArtisanEarningsPage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Earnings Ledger & Settlements • অর্জিত আয়
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Cleared funds, pending order escrows, and direct bank payout history.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>Cleared Balance (তোলার জন্য প্রস্তুত)</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹3,39,150
          </div>
          <button style={{ padding: '0.45rem 1rem', borderRadius: 2, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
            Request Payout Withdrawal
          </button>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>In Escrow (অর্ডার ট্রানজিটে)</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹84,200
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>Clears upon 7-day return expiration</span>
        </div>

        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>Lifetime Dispatched (মোট আয়)</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1B5E20', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
            ₹12,61,400
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>Settled directly to your bank account</span>
        </div>
      </div>
    </div>
  );
}
