'use client';

import { useState, FormEvent } from 'react';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function AtelierNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 500);
  };

  return (
    <div className="salon-card">
      <div className="salon-card__grid">
        {/* Left Column: Context & Incentive */}
        <div className="salon-card__editorial">
          <div className="salon-card__sanskrit">
            <span className="salon-card__devanagari">पत्रिका संवादः</span>
            <span className="salon-card__dot">•</span>
            <span className="salon-card__translit">Patrikā Saṁvādaḥ</span>
          </div>
          
          <h2 className="salon-card__title">The Atelier Journal</h2>
          
          <p className="salon-card__subtitle">
            Private salon previews, rare handloom releases, and a <strong>complimentary $50 / ₹4,000 welcome courtesy</strong> toward your maiden order.
          </p>
        </div>

        {/* Right Column: High-Legibility Input with Direct Visual Context */}
        <div className="salon-card__action-col">
          {status === 'success' ? (
            <div className="salon-card__success-state">
              <CheckCircle2 size={32} style={{ color: 'var(--maharani-maroon)' }} />
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
                  Welcome to the Inner Circle
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--stone-taupe)', lineHeight: 1.5 }}>
                  Your private invitation and welcome courtesy have been dispatched to <strong>{email}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="salon-card__form" noValidate>
              <div className="salon-card__field-wrapper">
                <label htmlFor="newsletter-email-input" className="salon-card__field-label">
                  <Mail size={15} style={{ color: 'var(--gargi-gold)' }} />
                  <span>Your Personal Email Address</span>
                </label>

                <div className="salon-card__input-group">
                  <div className="salon-card__input-relative">
                    <input
                      id="newsletter-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@domain.com"
                      aria-label="Your personal email address"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="salon-card__submit-btn"
                    disabled={status === 'loading'}
                  >
                    <span>{status === 'loading' ? 'Requesting...' : 'Join Atelier'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              <div className="salon-card__privacy">
                <span>✦ Sent once a month. No spam ever. Unsubscribe anytime with 1-click.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
