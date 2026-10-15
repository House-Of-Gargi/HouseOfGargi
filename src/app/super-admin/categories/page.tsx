'use client';

import { useState, useEffect } from 'react';
import {
  FolderTree,
  PlusCircle,
  Edit2,
  CheckCircle2,
  X,
  Layers,
  ArrowUpDown,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [sanskritLipi, setSanskritLipi] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/categories');
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/super-admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sanskritLipi, slug, description }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddOpen(false);
        setName('');
        setSanskritLipi('');
        setSlug('');
        setDescription('');
        fetchCategories();
      } else {
        alert(data.message || 'Error adding category');
      }
    } catch (err) {
      console.error('Add category error:', err);
    }
  };

  const totalCatalogCreations = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Lockup */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <FolderTree style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
              Storefront Taxonomy Architecture
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
            Categories & Storefront <span style={{ color: 'var(--maharani-maroon)' }}>Taxonomies</span>
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '1.02rem', color: '#4A3E36', lineHeight: 1.55 }}>
            Exclusive Super Admin function: manage categories, Sanskrit lipi subtitles, hero banners, and display order across public navigation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 4,
            border: 'none',
            backgroundColor: 'var(--maharani-maroon)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 8px rgba(122,35,49,0.2)',
          }}
        >
          <PlusCircle style={{ width: 16, height: 16 }} />
          Add New Taxonomy
        </button>
      </div>

      {/* 3 Metric Summary Boxes - Minimal Box Styling & Proportional Font Sizes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Active Taxonomies
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.025em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${categories.length} Taxonomies`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Published storefront categories
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Sanskrit Lipi Subtitles
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--maharani-maroon)', letterSpacing: '-0.025em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : '100% Attributed'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Traditional script heritage branding
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Assigned Catalog Pieces
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, color: '#1B5E20', letterSpacing: '-0.025em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${totalCatalogCreations} Mapped`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Associated artisan textiles
          </div>
        </div>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
          <AdminLoadingSpinner size={28} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '200px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
                e.currentTarget.style.borderColor = 'var(--gargi-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(43,31,24,0.03)';
                e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--gargi-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {cat.sanskritLipi}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0', color: 'var(--ink-brown)' }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontFamily: 'monospace' }}>
                      /category/{cat.slug}
                    </span>
                  </div>
                  <span style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', padding: '0.2rem 0.55rem', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                    Order #{cat.displayOrder}
                  </span>
                </div>

                <p style={{ margin: '0.85rem 0', fontSize: '0.88rem', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
                  {cat.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0E8DC', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
                  {cat.productCount} Handcrafted Pieces
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32', background: '#E8F5E9', padding: '0.18rem 0.5rem', borderRadius: 4, letterSpacing: '0.04em' }}>
                  ACTIVE ON SITE
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(35, 24, 18, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsAddOpen(false)}
        >
          <div
            style={{
              width: '500px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 12px 36px rgba(43,31,24,0.15)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                Add New Storefront Category
              </h2>
              <button
                onClick={() => setIsAddOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Shawls & Stoles"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Sanskrit Lipi Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. दिव्य प्रावरणम्"
                  value={sanskritLipi}
                  onChange={(e) => setSanskritLipi(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shawls-stoles"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Heritage Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Handwoven Pashmina and pure zari wool textiles handcrafted by Kashmiri guild masters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  style={{ padding: '0.65rem 1.15rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FAF7F2', color: 'var(--ink-brown)', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.35rem', borderRadius: 4, border: 'none', background: 'var(--maharani-maroon)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Publish Taxonomy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
