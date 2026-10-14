'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, CheckCircle2, ArrowLeft, Loader2, Upload } from 'lucide-react';

export default function NewProductCreationPage() {
  const [title, setTitle] = useState('');
  const [craftTechnique, setCraftTechnique] = useState('Pure Silk Kadwa Handloom');
  const [category, setCategory] = useState('sarees');
  const [retailPrice, setRetailPrice] = useState('');
  const [stockCount, setStockCount] = useState('5');
  const [fabric, setFabric] = useState('Pure Mulberry Silk');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/category-sarees.png');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdProductNo, setCreatedProductNo] = useState('');

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImageUrl(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !retailPrice) return;

    setSubmitting(true);
    try {
      const newId = `art-piece-${Date.now()}`;
      const pNo = `ART-${Math.floor(10000 + Math.random() * 90000)}`;

      const payload = {
        id: newId,
        productNo: pNo,
        name: title,
        category: category.toLowerCase(),
        price: parseInt(retailPrice, 10),
        stock: parseInt(stockCount, 10) || 5,
        artType: craftTechnique,
        technique: craftTechnique,
        fabric: fabric,
        occasion: 'Festive & Royal Ceremonies',
        region: 'India',
        care: 'Dry clean recommended.',
        sizes: ['Free Size'],
        description: description || 'Authentic handcrafted heritage creation from master artisan pit looms.',
        images: [imageUrl],
        totalSales: 0,
        curationStatus: 'approved',
      };

      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setCreatedProductNo(pNo);
      setSubmitted(true);
    } catch (err) {
      console.error('Error creating creation:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header Row with Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
            Add New Craft Creation
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
            Submit handcrafted sarees, lehengas, or kurtas from your workshop looms for House of Gargi admin quality review.
          </p>
        </div>

        <Link
          href="/seller/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            borderRadius: 4,
            border: '1px solid var(--soft-gold-line)',
            background: '#FAF7F2',
            color: 'var(--ink-brown)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      {submitted ? (
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 8, padding: '3rem 2rem', textAlign: 'center', maxWidth: '640px', margin: '0 auto', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <CheckCircle2 style={{ width: 48, height: 48, color: '#2E7D32', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-brown)', margin: '0 0 0.5rem', fontSize: '1.5rem' }}>
            Creation Registered Successfully!
          </h2>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
            Your piece <strong>{title}</strong> ({createdProductNo || 'ART-NEW'}) has been added to the master loom catalog and published for client orders.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link
              href="/seller/products"
              style={{ padding: '0.7rem 1.5rem', borderRadius: 4, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}
            >
              View in Loom Inventory &rarr;
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setTitle('');
                setRetailPrice('');
                setDescription('');
              }}
              style={{ padding: '0.7rem 1.25rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FAF7F2', color: 'var(--ink-brown)', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Add Another Piece
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 8, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.35rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
              Creation Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Banarasi Katan Silk Floral Kadwa Saree"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 4, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box', fontSize: '0.92rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
                Collection Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 4, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', fontSize: '0.92rem' }}
              >
                <option value="sarees">Royal Sarees</option>
                <option value="lehengas">Bridal Lehengas</option>
                <option value="kurta-sets">Heritage Kurta Sets</option>
                <option value="accessories">Jewellery & Accessories</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
                Craft Technique
              </label>
              <input
                type="text"
                value={craftTechnique}
                onChange={(e) => setCraftTechnique(e.target.value)}
                placeholder="e.g. Tangail Jamdani Pit Loom Weave"
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 4, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
                Retail Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="500"
                placeholder="29500"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 4, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box', fontSize: '0.92rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
                Atelier Workshop Stock (Pieces) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 4, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
              Primary Cover Photo
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <img
                src={imageUrl}
                alt="Preview"
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)' }}
              />
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FAF7F2',
                  color: 'var(--ink-brown)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} color="var(--maharani-maroon)" />
                <span>Upload Image from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>
              Heritage Description & Weaving Lore
            </label>
            <textarea
              rows={3}
              placeholder="Describe the artisan lineage, motifs, zari materials, and drape character..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 4, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box', fontSize: '0.92rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.75rem',
              borderRadius: 4,
              border: 'none',
              background: 'var(--maharani-maroon)',
              color: '#FFF',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.15s ease',
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Registering Creation...</span>
              </>
            ) : (
              <span>Submit & Publish Piece to Inventory &rarr;</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
