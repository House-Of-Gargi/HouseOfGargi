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
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,31,24,0.5)' }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
        <ScrollReveal>
          <div className="bespoke-container" style={{ margin: '40px 0' }}>
            <div className="bespoke-header">
              <h2>Custom Commission</h2>
              <hr style={{ width: '60px', margin: '16px auto 32px', border: 'none', borderTop: '1px solid var(--gargi-gold)' }} />
              <p>Present your request to our master artisans. Whether it is a custom bridal lehenga woven with pure zari, or a unique silk saree, we bring your vision to life.</p>
            </div>

            {submitted ? (
              <div className="bespoke-success" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h3 style={{ color: 'var(--gargi-gold)', marginBottom: '16px' }}>Your Request is Received</h3>
                <p style={{ color: 'var(--stone-taupe)', lineHeight: '1.8' }}>
                  Thank you, <strong>{formData.name}</strong>. An artisan concierge from House of Gargi will contact you within 24 hours to begin your design consultation.
                </p>
                <button 
                  type="button" 
                  className="btn btn--outline" 
                  style={{ marginTop: '24px' }}
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Commission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bespoke-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                    />
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Preferred Fabric / Material</label>
                    <input 
                      type="text" 
                      value={formData.material} 
                      onChange={e => setFormData({ ...formData, material: e.target.value })}
                      placeholder="e.g. Mulberry Silk, Velvet, Organza"
                    />
                  </div>
                  <div className="form-group">
                    <label>Approximate Measurements / Size</label>
                    <input 
                      type="text" 
                      value={formData.size} 
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                      placeholder="e.g. Custom M, or height 5ft 6in"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Commission Details & Inspiration</label>
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
                  className="btn btn--primary" 
                  style={{ width: '100%', marginTop: '24px', padding: '16px' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Commission...' : 'Submit Bespoke Request'}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
