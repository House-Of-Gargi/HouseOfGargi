'use client';

import { useState } from 'react';
import { PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NewProductCreationPage() {
  const [title, setTitle] = useState('');
  const [craftTechnique, setCraftTechnique] = useState('Pure Silk Kadwa Handloom');
  const [category, setCategory] = useState('Sarees');
  const [retailPrice, setRetailPrice] = useState('');
  const [stockCount, setStockCount] = useState('3');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Add New Craft Creation • নতুন সৃষ্টি যোগ করুন
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Submit handcrafted sarees, lehengas, or kurtas from your workshop looms for House of Gargi admin quality review.
        </p>
      </div>

      {submitted ? (
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <CheckCircle2 style={{ width: 44, height: 44, color: '#2E7D32', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            Creation Submitted for QC Review!
          </h2>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Your piece <strong>{title}</strong> has been sent to the House of Gargi Admin Curation desk. Once verified, it will be published to the public boutique.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setTitle(''); }}
            style={{ marginTop: '1.5rem', padding: '0.65rem 1.5rem', borderRadius: 2, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
          >
            Add Another Creation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '2rem', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
              Creation Title (পণ্যের নাম)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Banarasi Katan Silk Floral Kadwa Saree"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                Category (বিভাগ)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="Sarees">Royal Sarees</option>
                <option value="Lehengas">Bridal Lehengas</option>
                <option value="Kurta Sets">Heritage Kurta Sets</option>
                <option value="Accessories">Jewellery & Accessories</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                Craft Technique (শিল্পরীতি)
              </label>
              <input
                type="text"
                value={craftTechnique}
                onChange={(e) => setCraftTechnique(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                Retail Price (₹) (বিক্রয় মূল্য)
              </label>
              <input
                type="number"
                required
                placeholder="28500"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                Initial Stock Count (মজুত সংখ্যা)
              </label>
              <input
                type="number"
                required
                min="1"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ marginTop: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 2, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Submit for Admin Quality Review &rarr;
          </button>
        </form>
      )}
    </div>
  );
}
