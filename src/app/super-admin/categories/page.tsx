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
} from 'lucide-react';

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
            Categories & Storefront Taxonomies
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
            Exclusive Super Admin function: manage categories, Sanskrit lipi subtitles, hero banners, and display order.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 2,
            border: 'none',
            backgroundColor: 'var(--maharani-maroon)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <PlusCircle style={{ width: 16, height: 16 }} />
          Add New Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: 4,
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gargi-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {cat.sanskritLipi}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0', color: 'var(--ink-brown)' }}>
                  {cat.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontFamily: 'monospace' }}>
                  /category/{cat.slug}
                </span>
              </div>
              <span style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', padding: '0.2rem 0.5rem', borderRadius: 2, fontSize: '0.72rem', fontWeight: 700 }}>
                Order #{cat.displayOrder}
              </span>
            </div>

            <p style={{ margin: '1rem 0', fontSize: '0.82rem', color: 'var(--stone-taupe)', lineHeight: 1.5 }}>
              {cat.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0E8DC', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>
                {cat.productCount} Handcrafted Pieces
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2E7D32', background: '#E8F5E9', padding: '0.15rem 0.45rem', borderRadius: 2 }}>
                ACTIVE ON SITE
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
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
              width: '480px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 4,
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                Add New Luxury Category
              </h2>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
                  placeholder="e.g. Heritage Shawls & Stoles"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Sanskrit Lipi Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. पवित्र उत्तरीयम्"
                  value={sanskritLipi}
                  onChange={(e) => setSanskritLipi(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shawls"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Atelier collection description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 2, border: '1px solid #D8CBB6', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 2, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
