'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Upload, 
  Images, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  ImagePlus
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

const CATEGORY_OPTIONS = [
  { value: 'sarees', label: 'Sarees' },
  { value: 'lehengas', label: 'Lehengas' },
  { value: 'kurta-sets', label: 'Kurta Sets' },
  { value: 'accessories', label: 'Accessories' },
];

export default function NewProductCreationPage() {
  // Form fields matching Customer Portal & Atelier Specifications
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sarees');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [craftTechnique, setCraftTechnique] = useState('');
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('');
  const [region, setRegion] = useState('');
  const [care, setCare] = useState('');
  const [sizes, setSizes] = useState('');
  const [description, setDescription] = useState('');

  // Gallery Imagery - starts empty with placeholder icon
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Submission & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdProductNo, setCreatedProductNo] = useState('');

  // Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingFiles(true);

    const readers: Promise<string>[] = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (uploadEvt) => {
          if (uploadEvt.target?.result) {
            resolve(uploadEvt.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImgs) => {
      setImages((prev) => [...prev, ...newImgs]);
      setUploadingFiles(false);
    }).catch(() => setUploadingFiles(false));

    e.target.value = '';
  };

  // Add Image by URL
  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput('');
  };

  // Reorder Images
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  // Set as Cover
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setSubmitting(true);
    try {
      const newId = `art-piece-${Date.now()}`;
      const pNo = `ART-${Math.floor(10000 + Math.random() * 90000)}`;

      const parsedSizes = sizes.trim()
        ? sizes.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Free Size'];

      const payload = {
        id: newId,
        productNo: pNo,
        name: name.trim(),
        category: category.toLowerCase(),
        price: parseInt(price, 10),
        stock: parseInt(stock, 10) || 5,
        artType: craftTechnique.trim() || 'Handloom Kadwa Weave',
        technique: craftTechnique.trim() || 'Handloom Kadwa Weave',
        fabric: fabric.trim() || 'Pure Silk',
        occasion: occasion.trim() || 'Festive & Ceremonial',
        region: region.trim() || 'India',
        care: care.trim() || 'Dry clean recommended.',
        sizes: parsedSizes,
        description: description.trim() || 'Authentic handcrafted heritage creation from master artisan pit looms.',
        images: images.length > 0 ? images : ['/images/category-sarees.png'],
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
    <div style={{ maxWidth: '1060px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* ── Top Header Card (Conforming to Atelier Dashboard Style) ── */}
      <div 
        className="atelier-header-card" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1.25rem',
          marginBottom: '2rem' 
        }}
      >
        <div className="atelier-title-group" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div 
            className="atelier-title-icon"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#FAF7F2',
              border: '1.5px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--maharani-maroon)',
              flexShrink: 0,
            }}
          >
            <PlusCircle style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <h1 
              className="atelier-page-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--ink-brown)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Add New Couture <span style={{ color: 'var(--maharani-maroon)' }}>Creation</span>
            </h1>
            <p style={{ fontSize: '0.96rem', color: '#4A3E36', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Unified catalog register &bull; Publish master pit loom creations directly to client storefront
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            href="/seller/products"
            style={{
              background: 'var(--pure-white)',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '4px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ink-brown)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(43, 31, 24, 0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to Loom Inventory
          </Link>
        </div>
      </div>

      {submitted ? (
        /* ── Submission Confirmation Card ── */
        <div 
          style={{ 
            background: 'var(--pure-white)', 
            border: '1.5px solid var(--soft-gold-line)', 
            borderRadius: 12, 
            padding: '3.5rem 2rem', 
            textAlign: 'center', 
            maxWidth: '680px', 
            margin: '0 auto', 
            boxShadow: '0 8px 24px rgba(43, 31, 24, 0.06)' 
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F5E9', border: '1px solid #C8E6C9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <CheckCircle2 style={{ width: 36, height: 36, color: '#2E7D32' }} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-brown)', margin: '0 0 0.5rem', fontSize: '1.65rem', fontWeight: 700 }}>
            Creation Registered Successfully!
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', padding: '0.35rem 0.85rem', borderRadius: 4, margin: '0.5rem 0 1rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>Assigned Piece Code:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)', fontSize: '0.92rem' }}>
              {createdProductNo || 'ART-84920'}
            </span>
          </div>

          <p style={{ color: 'var(--stone-taupe)', fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 2rem' }}>
            Your piece <strong>{name}</strong> is now cataloged in your atelier inventory and live on the customer boutique storefront.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/seller/products"
              style={{ 
                padding: '0.75rem 1.6rem', 
                borderRadius: 4, 
                border: 'none', 
                background: 'var(--maharani-maroon)', 
                color: '#FFF', 
                fontWeight: 700, 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontFamily: 'var(--font-nav)',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 12px rgba(122, 35, 49, 0.25)',
              }}
            >
              View in Loom Inventory &rarr;
            </Link>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setPrice('');
                setStock('');
                setCraftTechnique('');
                setFabric('');
                setOccasion('');
                setRegion('');
                setCare('');
                setSizes('');
                setDescription('');
                setImages([]);
              }}
              style={{ 
                padding: '0.75rem 1.4rem', 
                borderRadius: 4, 
                border: '1.5px solid var(--soft-gold-line)', 
                background: '#FAF7F2', 
                color: 'var(--ink-brown)', 
                fontWeight: 700, 
                cursor: 'pointer', 
                fontSize: '0.9rem',
                fontFamily: 'var(--font-nav)',
              }}
            >
              Add Another Creation
            </button>
          </div>
        </div>
      ) : (
        /* ── Creation Registration Form ── */
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            background: 'var(--pure-white)', 
            border: '1.5px solid var(--soft-gold-line)', 
            borderRadius: 12, 
            padding: '2.25rem 2.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem', 
            boxShadow: '0 4px 20px rgba(43, 31, 24, 0.04)' 
          }}
        >
          {/* ── Section 1: Couture Identity & Classification ── */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>01</span>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Couture Identity &amp; Classification
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Creation Title */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Creation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>

              {/* Category & Craft Technique */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                    Category *
                  </label>
                  <CustomDropdown
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(val) => setCategory(val)}
                    placeholder="Select category"
                    fullWidth
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                    Craft Technique
                  </label>
                  <input
                    type="text"
                    placeholder="Enter craft technique"
                    value={craftTechnique}
                    onChange={(e) => setCraftTechnique(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 4,
                      border: '1px solid var(--soft-gold-line)',
                      background: '#FFFFFF',
                      color: 'var(--ink-brown)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Pricing & Atelier Stock ── */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>02</span>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pricing &amp; Atelier Stock
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Retail Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="Enter retail price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Atelier Stock *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Enter stock quantity"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Fabric Specifications & Customer Details ── */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>03</span>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Fabric Specifications &amp; Customer Details
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Fabric
                </label>
                <input
                  type="text"
                  placeholder="Enter fabric composition"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Occasion
                </label>
                <input
                  type="text"
                  placeholder="Enter occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Region of Origin
                </label>
                <input
                  type="text"
                  placeholder="Enter region of origin"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Care Guide
                </label>
                <input
                  type="text"
                  placeholder="Enter care instructions"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                Sizes Available
              </label>
              <input
                type="text"
                placeholder="Enter available sizes"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FFFFFF',
                  color: 'var(--ink-brown)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
              />
            </div>
          </div>

          {/* ── Section 4: Creation Story & Description ── */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>04</span>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Description &amp; Story
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter piece description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FFFFFF',
                  color: 'var(--ink-brown)',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
              />
            </div>
          </div>

          {/* ── Section 5: Showcase Gallery Images ── */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>05</span>
                <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Creation Gallery Images
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
                {images.length} {images.length === 1 ? 'image' : 'images'} in gallery
              </span>
            </div>

            {/* Current Images Preview Grid or Empty State Placeholder Icon Box */}
            {images.length === 0 ? (
              <div
                style={{
                  border: '1.5px dashed var(--soft-gold-line)',
                  borderRadius: 8,
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: '#FAF7F2',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid var(--soft-gold-line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--maharani-maroon)',
                  }}
                >
                  <ImagePlus style={{ width: 26, height: 26 }} />
                </div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink-brown)' }}>
                  No Creation Images Added Yet
                </p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--stone-taupe)', maxWidth: '380px', lineHeight: 1.5 }}>
                  Add your handcrafted creation photos by uploading files from your device or entering direct image URLs below.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {images.map((imgUrl, idx) => {
                  const isCover = idx === 0;
                  return (
                    <div
                      key={idx}
                      style={{
                        border: isCover ? '2px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        background: '#FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '120px', background: '#F0EBE1' }}>
                        <img
                          src={imgUrl}
                          alt={`Preview ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/category-sarees.png';
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            background: 'rgba(35, 24, 18, 0.85)',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: 3,
                          }}
                        >
                          #{idx + 1}
                        </span>
                        {isCover && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'var(--maharani-maroon)',
                              color: '#FFFFFF',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '2px 5px',
                              borderRadius: 3,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Star size={9} fill="#FFF" /> Cover
                          </span>
                        )}
                      </div>

                      <div style={{ padding: '0.4rem', background: '#FAF7F2', borderTop: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            title="Move Earlier"
                            style={{
                              padding: '3px',
                              border: '1px solid var(--soft-gold-line)',
                              borderRadius: 3,
                              background: idx === 0 ? '#EBE6DC' : '#FFFFFF',
                              color: idx === 0 ? '#AFA79B' : 'var(--ink-brown)',
                              cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === images.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            title="Move Later"
                            style={{
                              padding: '3px',
                              border: '1px solid var(--soft-gold-line)',
                              borderRadius: 3,
                              background: idx === images.length - 1 ? '#EBE6DC' : '#FFFFFF',
                              color: idx === images.length - 1 ? '#AFA79B' : 'var(--ink-brown)',
                              cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>

                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: 'var(--maharani-maroon)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: '0 2px',
                            }}
                          >
                            Make Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove image"
                          style={{
                            padding: '3px',
                            border: '1px solid #FFCDD2',
                            borderRadius: 3,
                            background: '#FFEBEE',
                            color: '#C62828',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Image Upload / Input controls */}
            <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 8, padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-brown)', marginBottom: '0.35rem' }}>
                    Upload Photos from Device:
                  </label>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.15rem',
                      borderRadius: 4,
                      border: '1.5px dashed var(--soft-gold-line)',
                      background: '#FFFFFF',
                      color: 'var(--ink-brown)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      width: '100%',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Upload size={15} color="var(--maharani-maroon)" />
                    <span>{uploadingFiles ? 'Reading Files...' : 'Browse Image Files'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingFiles}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-brown)', marginBottom: '0.35rem' }}>
                    Or Add Image URL:
                  </label>
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <input
                      type="text"
                      placeholder="https://... or /images/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '0.65rem 0.75rem',
                        borderRadius: 4,
                        border: '1px solid var(--soft-gold-line)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        background: '#FFFFFF',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!imageUrlInput.trim()}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: 4,
                        border: 'none',
                        background: imageUrlInput.trim() ? 'var(--maharani-maroon)' : '#D8CBB6',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: imageUrlInput.trim() ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Form Actions ── */}
          <div style={{ borderTop: '1px solid var(--soft-gold-line)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/seller/products"
              style={{
                padding: '0.8rem 1.4rem',
                borderRadius: 4,
                border: '1.5px solid var(--soft-gold-line)',
                background: '#FAF7F2',
                color: 'var(--ink-brown)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-nav)',
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.85rem 2rem',
                borderRadius: 4,
                border: 'none',
                background: 'var(--maharani-maroon)',
                color: '#FFF',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-nav)',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(122, 35, 49, 0.28)',
                transition: 'opacity 0.15s ease',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Registering Creation...</span>
                </>
              ) : (
                <span>Publish Piece to Inventory &amp; Boutique &rarr;</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
