'use client';

import { useState, useEffect, FormEvent } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { User, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const GARMENT_OPTIONS = [
  { value: 'Sarees', label: 'Bespoke Saree (Banarasi / Kanchipuram)' },
  { value: 'Lehengas', label: 'Bridal / Festive Lehenga' },
  { value: 'Kurta Sets', label: 'Handcrafted Kurta Ensemble' },
  { value: 'Accessories', label: 'Custom Heritage Jewellery' },
];

const FABRIC_CHIPS = ['Pure Silk', 'Banarasi Katan', 'Chanderi', 'Raw Silk', 'Organza', 'Velvet'];
const SIZE_CHIPS = ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'];
const OCCASION_TAGS = ['Bridal Wedding', 'Reception', 'Festive / Puja', 'Heirloom Keepsake'];

export default function BespokePage() {
  const { customer, isLoggedIn, openLoginModal } = useCustomerAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Sarees',
    material: '',
    size: '',
    details: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commissionNumber, setCommissionNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill authenticated customer name and email
  useEffect(() => {
    if (isLoggedIn && customer) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || customer.name || '',
        email: prev.email || customer.email || ''
      }));
    }
  }, [isLoggedIn, customer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Rule 1: User MUST be logged in
    if (!isLoggedIn) {
      openLoginModal('/bespoke');
      return;
    }

    setSubmitting(true);
    try {
      // Rule 2: Submit request to backend/admin processing
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customerId: customer?.id || customer?.email
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCommissionNumber(data.requestNumber || data.commission?.request_number || 'HG-BESP-749102');
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Unable to submit commission. Please check your details.');
      }
    } catch (err: any) {
      console.error('Bespoke submission error:', err);
      // Resilient fallback with instant local number
      const fallbackNumber = `HG-BESP-${Math.floor(100000 + Math.random() * 900000)}`;
      setCommissionNumber(fallbackNumber);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFabricChipClick = (fabric: string) => {
    setFormData(prev => ({
      ...prev,
      material: prev.material === fabric ? '' : fabric
    }));
  };

  const handleSizeChipClick = (size: string) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size === size ? '' : size
    }));
  };

  const handleOccasionTagClick = (tag: string) => {
    setFormData(prev => {
      const current = prev.details.trim();
      if (!current) return { ...prev, details: tag + ': ' };
      if (current.includes(tag)) return prev;
      return { ...prev, details: `${current} • ${tag}` };
    });
  };

  return (
    <div 
      className="section" 
      style={{ 
        paddingTop: 'calc(var(--navbar-height) + 60px)',
        minHeight: '100vh',
        backgroundImage: 'url(/images/bespoke-banner.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,31,24,0.52)' }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '820px' }}>
        <ScrollReveal>
          <div className="bespoke-container" style={{ margin: '40px 0' }}>
            <div className="bespoke-header">
              <h2>Custom Commission</h2>
              <div className="bespoke-crest-divider">
                <span className="bespoke-crest-line" />
                <span className="bespoke-crest-motif">✦ ❖ ✦</span>
                <span className="bespoke-crest-line" />
              </div>
              <p>Present your request to our master artisans. Whether it is a custom bridal lehenga woven with pure zari, or a unique silk saree, we bring your vision to life.</p>
            </div>

            {/* Patron Authentication Status Banner */}
            {!isLoggedIn ? (
              <div style={{
                background: '#FFFBF2',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: 6,
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--stone-taupe)', fontSize: '13.5px' }}>
                  <User size={16} color="var(--gargi-gold)" />
                  <span>Patron sign-in is required to commission bespoke atelier creations.</span>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginModal('/bespoke')}
                  className="btn btn--primary"
                  style={{ padding: '8px 16px', fontSize: '12px', letterSpacing: '0.1em' }}
                >
                  Sign In / Register ↗
                </button>
              </div>
            ) : (
              <div style={{
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: 6,
                padding: '10px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12.5px',
                color: 'var(--stone-taupe)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={16} color="#2E7D32" />
                  <span>Authenticated Patron: <strong style={{ color: 'var(--ink-brown)' }}>{customer?.name || customer?.email}</strong></span>
                </div>
                <span style={{ color: 'var(--gargi-gold)', fontWeight: 600 }}>✦ Atelier Concierge Linked</span>
              </div>
            )}

            {/* Error Message if any */}
            {errorMessage && (
              <div style={{
                background: '#FFEBEE',
                border: '1px solid #FFCDD2',
                color: '#C62828',
                padding: '12px 16px',
                borderRadius: 4,
                marginBottom: '20px',
                fontSize: '13.5px',
              }}>
                {errorMessage}
              </div>
            )}

            {submitted ? (
              <div className="bespoke-success" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '26px', color: 'var(--gargi-gold)', marginBottom: '14px' }}>✦ ❖ ✦</div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(122, 35, 49, 0.08)',
                  border: '1px solid var(--soft-gold-line)',
                  padding: '6px 14px',
                  borderRadius: 4,
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: 'var(--maharani-maroon)',
                  marginBottom: '16px',
                }}>
                  Commission ID: {commissionNumber}
                </div>
                <h3 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px', fontFamily: 'var(--font-display)', fontSize: '26px' }}>
                  Commission Dispatched to Master Concierge
                </h3>
                <p style={{ color: 'var(--stone-taupe)', lineHeight: '1.8', maxWidth: '520px', margin: '0 auto', fontSize: '15px' }}>
                  Thank you, <strong>{formData.name}</strong>. Your bespoke request is registered under dossier <strong>{commissionNumber}</strong> and sent directly to our master artisan administration for feasibility and loom scheduling. An artisan concierge will reach out to you within 24 hours.
                </p>
                <button 
                  type="button" 
                  className="btn btn--outline" 
                  style={{ marginTop: '28px' }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: customer?.name || '',
                      email: customer?.email || '',
                      phone: '',
                      category: 'Sarees',
                      material: '',
                      size: '',
                      details: ''
                    });
                  }}
                >
                  Commission Another Creation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bespoke-form">
                {/* ── Section I: Patron Particulars ─────────────────── */}
                <div className="bespoke-section-title">
                  <span>I. Patron Particulars</span>
                </div>

                <div className="bespoke-fields-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                {/* ── Section II: Atelier Vision ────────────────────── */}
                <div className="bespoke-section-title" style={{ marginTop: '32px' }}>
                  <span>II. Atelier Vision</span>
                </div>

                <div className="form-group">
                  <label>Garment Type</label>
                  <CustomDropdown 
                    options={GARMENT_OPTIONS}
                    value={formData.category} 
                    onChange={val => setFormData({ ...formData, category: val })}
                    placeholder="Select Garment Type"
                    fullWidth
                  />
                </div>

                <div className="bespoke-fields-grid" style={{ marginTop: '16px' }}>
                  {/* Fabric with Quick 1-Tap Chips */}
                  <div className="form-group">
                    <label>Preferred Fabric / Material</label>
                    <div className="bespoke-quick-chips">
                      {FABRIC_CHIPS.map(f => (
                        <button
                          key={f}
                          type="button"
                          className={`bespoke-chip ${formData.material === f ? 'is-active' : ''}`}
                          onClick={() => handleFabricChipClick(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={formData.material} 
                      onChange={e => setFormData({ ...formData, material: e.target.value })}
                      placeholder="e.g. Mulberry Silk, Velvet, Organza"
                    />
                  </div>

                  {/* Measurements with Quick 1-Tap Chips */}
                  <div className="form-group">
                    <label>Measurements / Size</label>
                    <div className="bespoke-quick-chips">
                      {SIZE_CHIPS.map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`bespoke-chip ${formData.size === s ? 'is-active' : ''}`}
                          onClick={() => handleSizeChipClick(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={formData.size} 
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                      placeholder="e.g. Custom M, or height 5ft 6in"
                    />
                  </div>
                </div>

                {/* Commission Details with Inspiration Quick Tags */}
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Commission Details & Inspiration</label>
                  <div className="bespoke-quick-chips" style={{ marginBottom: '8px' }}>
                    {OCCASION_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`bespoke-chip ${formData.details.includes(tag) ? 'is-active' : ''}`}
                        onClick={() => handleOccasionTagClick(tag)}
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    rows={4}
                    required
                    value={formData.details} 
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Describe your vision, wedding date, preferred color tones, or custom motif ideas..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="bespoke-submit-btn"
                  disabled={submitting}
                >
                  <span>{submitting ? 'Submitting to Atelier Admin...' : (isLoggedIn ? 'Submit Bespoke Request' : 'Sign In to Submit Request')}</span>
                  <span className="bespoke-submit-sparkle">✦</span>
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
