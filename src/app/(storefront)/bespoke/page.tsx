'use client';

import { useState, FormEvent } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 600);
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

            {submitted ? (
              <div className="bespoke-success" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '26px', color: 'var(--gargi-gold)', marginBottom: '14px' }}>✦ ❖ ✦</div>
                <h3 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Your Commission is Received</h3>
                <p style={{ color: 'var(--stone-taupe)', lineHeight: '1.8', maxWidth: '520px', margin: '0 auto' }}>
                  Thank you, <strong>{formData.name}</strong>. An artisan concierge from House of Gargi will contact you within 24 hours to begin your private design consultation.
                </p>
                <button 
                  type="button" 
                  className="btn btn--outline" 
                  style={{ marginTop: '28px' }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
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
                  <span>{submitting ? 'Submitting Commission...' : 'Submit Bespoke Request'}</span>
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
