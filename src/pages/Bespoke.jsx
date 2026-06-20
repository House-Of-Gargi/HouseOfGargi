import { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function Bespoke() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sarees',
    material: '',
    size: '',
    details: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here we would typically send the data to a backend
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
              <div className="bespoke-success">
                <h3>Your Request is Received</h3>
                <p>Our master artisans will review your request and a member of our team will contact you shortly.</p>
              </div>
            ) : (
              <form className="bespoke-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. Gayatri Devi" 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Garment Type</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange}>
                      <option value="Sarees">Saree</option>
                      <option value="Lehengas">Lehenga</option>
                      <option value="Kurta Sets">Kurta Set</option>
                      <option value="Accessories">Jewellery / Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="material">Preferred Material</label>
                    <input 
                      type="text" 
                      id="material" 
                      name="material" 
                      required 
                      value={formData.material} 
                      onChange={handleChange} 
                      placeholder="e.g. Pure Kanchipuram Silk" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="size">Size & Measurements</label>
                  <input 
                    type="text" 
                    id="size" 
                    name="size" 
                    required 
                    value={formData.size} 
                    onChange={handleChange} 
                    placeholder="e.g. Standard M or custom measurements" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="details">Customization Details</label>
                  <textarea 
                    id="details" 
                    name="details" 
                    rows="5" 
                    required 
                    value={formData.details} 
                    onChange={handleChange} 
                    placeholder="Describe your vision... specific motifs, colors, or occasions." 
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary bespoke-submit">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
