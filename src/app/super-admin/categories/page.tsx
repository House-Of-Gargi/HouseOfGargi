'use client';

import { useState, useEffect } from 'react';
import {
  FolderTree,
  PlusCircle,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
}

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
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

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setDisplayOrder(cat.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      if (editingCategory) {
        // Update existing category
        const res = await fetch('/api/super-admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name: name.trim(),
            description: description.trim(),
            displayOrder: Number(displayOrder),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(data.message || 'Error updating category');
        }
      } else {
        // Create new category
        const res = await fetch('/api/super-admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            displayOrder: Number(displayOrder),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(data.message || 'Error adding category');
        }
      }
    } catch (err) {
      console.error('Save category error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    try {
      const res = await fetch('/api/super-admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cat.id,
          isActive: !cat.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: !cat.isActive } : c))
        );
      }
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/super-admin/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message || 'Error deleting category');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Lockup - Clean, Simple, Data-focused */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--soft-gold-line)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <FolderTree style={{ width: 17, height: 17, color: 'var(--maharani-maroon)' }} />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--maharani-maroon)',
              }}
            >
              Storefront Categories
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.95rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'var(--ink-brown)',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Product <span style={{ color: 'var(--maharani-maroon)' }}>Categories</span>
          </h1>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.96rem', color: '#5C5043', lineHeight: 1.5 }}>
            Categories shown in the customer portal navigation slip and available for artisans to list products.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
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
            boxShadow: '0 2px 8px rgba(122,35,49,0.18)',
          }}
        >
          <PlusCircle style={{ width: 16, height: 16 }} />
          Add Category
        </button>
      </div>

      {/* Categories Cards Grid - Clean data-first representation */}
      {loading ? (
        <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
          <AdminLoadingSpinner size={28} />
        </div>
      ) : categories.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: 8,
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--stone-taupe)',
          }}
        >
          <p style={{ fontSize: '1rem', margin: '0 0 1rem' }}>No categories created yet.</p>
          <button
            type="button"
            onClick={openAddModal}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 4,
              border: 'none',
              background: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add First Category
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '8px',
                padding: '1.35rem',
                boxShadow: '0 2px 8px rgba(43,31,24,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        margin: '0 0 0.25rem',
                        color: 'var(--ink-brown)',
                      }}
                    >
                      {cat.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--stone-taupe)',
                          fontFamily: 'monospace',
                          background: '#FAF7F2',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 3,
                          border: '1px solid #EFE6D8',
                        }}
                      >
                        /category/{cat.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      background: '#FAF7F2',
                      border: '1px solid var(--soft-gold-line)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 3,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--ink-brown)',
                    }}
                  >
                    Order #{cat.displayOrder}
                  </span>
                </div>

                <p
                  style={{
                    margin: '0.85rem 0 1rem',
                    fontSize: '0.88rem',
                    color: '#5C5043',
                    lineHeight: 1.5,
                  }}
                >
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #F0E8DC',
                  paddingTop: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(cat)}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: cat.isActive ? '#2E7D32' : '#C62828',
                      background: cat.isActive ? '#E8F5E9' : '#FFEBEE',
                      border: 'none',
                      padding: '0.22rem 0.55rem',
                      borderRadius: 3,
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                    }}
                    title="Click to toggle status"
                  >
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>

                  <span style={{ fontSize: '0.8rem', color: 'var(--stone-taupe)', fontWeight: 500 }}>
                    {cat.productCount || 0} products
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--soft-gold-line)',
                      borderRadius: 3,
                      padding: '0.35rem 0.55rem',
                      color: 'var(--ink-brown)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                    title="Edit Category"
                  >
                    <Edit2 style={{ width: 13, height: 13 }} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #FFCDD2',
                      borderRadius: 3,
                      padding: '0.35rem 0.5rem',
                      color: 'var(--maharani-maroon)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Delete Category"
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
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
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: '460px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid var(--soft-gold-line)',
              boxShadow: '0 12px 36px rgba(43,31,24,0.15)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1.15rem 1.35rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAF7F2',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--ink-brown)',
                }}
              >
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <form
              onSubmit={handleSaveCategory}
              style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--ink-brown)',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarees, Lehengas, Dupattas"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontSize: '0.92rem',
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--ink-brown)',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingCategory}
                  placeholder="e.g. sarees, lehengas, dupattas"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontSize: '0.92rem',
                    backgroundColor: editingCategory ? '#F9F6F0' : '#FFFFFF',
                    color: editingCategory ? 'var(--stone-taupe)' : 'var(--ink-brown)',
                  }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--stone-taupe)', marginTop: '0.2rem', display: 'block' }}>
                  Destination URL: /category/{slug || 'name'}
                </span>
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--ink-brown)',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontSize: '0.92rem',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--ink-brown)',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description for customer and artisan guidance..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontSize: '0.92rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.15rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FAF7F2',
                    color: 'var(--ink-brown)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.6rem 1.35rem',
                    borderRadius: 4,
                    border: 'none',
                    background: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
