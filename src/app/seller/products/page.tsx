'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Shirt, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Loader2, 
  Check, 
  X, 
  Image as ImageIcon,
  Tag
} from 'lucide-react';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'sarees',
    price_in_rupees: '',
    stock: '',
    image_url: '/images/category-sarees.png',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newProduct.name || !newProduct.price_in_rupees || !newProduct.stock) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          category: newProduct.category,
          price_in_rupees: parseInt(newProduct.price_in_rupees, 10),
          stock: parseInt(newProduct.stock, 10),
          image_url: newProduct.image_url || '/images/category-sarees.png',
        }
      ]).select();

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts([data[0], ...products]);
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          category: 'sarees',
          price_in_rupees: '',
          stock: '',
          image_url: '/images/category-sarees.png',
        });
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to register new product.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = searchQuery === '' || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Top Header Card */}
      <div className="atelier-header-card">
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <Shirt style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--seller-text-main)', margin: 0 }}>
                Master Apparel & Catalog Management
              </h1>
              <span className="atelier-live-pill">
                <span className="atelier-live-dot" />
                {products.length} ATELIER PIECES
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--seller-text-muted)', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
              Live inventory tracking and bespoke SKU registration in Supabase
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            background: 'var(--seller-brand)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '0.55rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(58,53,100,0.18)',
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Add Master Piece
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="atelier-filter-bar">
        <div className="atelier-filter-tabs">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'sarees', label: 'Banarasi Sarees' },
            { id: 'lehengas', label: 'Bridal Lehengas' },
            { id: 'kurta-sets', label: 'Kurta Sets' },
            { id: 'accessories', label: 'Jewellery & Acc' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`atelier-filter-btn ${selectedCategory === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#F8FAFC',
          border: '1px solid var(--seller-border)',
          borderRadius: '8px',
          padding: '0.25rem 0.75rem',
        }}>
          <Search style={{ width: 14, height: 14, color: '#94A3B8', marginRight: '0.45rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece name..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.78rem',
              color: 'var(--seller-text-main)',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* Products Data Table */}
      <div className="atelier-table-card">
        <div className="table-header-row">
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--seller-text-main)', margin: 0 }}>
              Atelier Master Catalog
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--seller-text-muted)', margin: '0.15rem 0 0 0' }}>
              Fetched real-time from Supabase table &apos;products&apos;
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            Showing {filteredProducts.length} items
          </span>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table className="executive-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Preview</th>
                <th>Artisan Piece Name</th>
                <th>Category</th>
                <th>Price (INR)</th>
                <th>Godown Stock</th>
                <th style={{ textAlign: 'center' }}>Loom Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Loading catalog pieces from Supabase...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    No products found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.image_url || '/images/category-sarees.png'}
                        alt={p.name}
                        style={{ width: 44, height: 52, objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--seller-border)' }}
                      />
                    </td>
                    <td>
                      <strong style={{ color: 'var(--seller-text-main)', display: 'block', fontSize: '0.88rem' }}>
                        {p.name}
                      </strong>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'ui-monospace, monospace', color: '#94A3B8' }}>
                        SKU: {p.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        background: '#F1F5F9',
                        color: '#475569',
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--seller-text-main)' }}>
                      ₹ {Number(p.price_in_rupees || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.stock > 5 ? '#047857' : '#D97706' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: '#ECFDF5',
                        color: '#047857',
                        border: '1px solid #A7F3D0',
                      }}>
                        In Atelier
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '1.25rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--seller-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--seller-brand-tint)', color: 'var(--seller-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus style={{ width: 18, height: 18 }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--seller-text-main)' }}>
                  Register Handcrafted Piece
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {formError && (
              <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '0.65rem', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.35rem' }}>
                  Piece Title / Style
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Royal Tussar Silk Saree"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--seller-border)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--seller-border)', outline: 'none', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    <option value="sarees">Banarasi Sarees</option>
                    <option value="lehengas">Bridal Lehengas</option>
                    <option value="kurta-sets">Kurta Sets</option>
                    <option value="accessories">Jewellery & Acc</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.35rem' }}>
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price_in_rupees}
                    onChange={(e) => setNewProduct({ ...newProduct, price_in_rupees: e.target.value })}
                    placeholder="28500"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--seller-border)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.35rem' }}>
                    Initial Godown Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="10"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--seller-border)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.35rem' }}>
                    Image Preset
                  </label>
                  <select
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--seller-border)', outline: 'none', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    <option value="/images/category-sarees.png">Sarees Asset</option>
                    <option value="/images/category-lehengas.png">Lehengas Asset</option>
                    <option value="/images/category-kurtas.png">Kurtas Asset</option>
                    <option value="/images/category-accessories.png">Jewellery Asset</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--seller-border)', background: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', background: 'var(--seller-brand)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {submitting ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Check style={{ width: 14, height: 14 }} />}
                  Save to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
