'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  Shirt, 
  Plus, 
  Search, 
  Loader2, 
  Check, 
  X, 
  PackageCheck,
  RefreshCw,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import CustomDropdown from '@/components/CustomDropdown';

const CATEGORY_OPTIONS = [
  { value: 'sarees', label: 'Banarasi Sarees' },
  { value: 'lehengas', label: 'Bridal Lehengas' },
  { value: 'kurta-sets', label: 'Kurta Sets' },
  { value: 'accessories', label: 'Heritage Jewellery' },
];

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'sarees',
    price_in_rupees: '',
    stock: '10',
    artType: 'Tangail Jamdani Pit Loom',
    image_url: '/images/category-sarees.png',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error loading products from unified API:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price_in_rupees || !newProduct.stock) {
      return;
    }

    setSubmitting(true);
    setFormSuccess('');

    try {
      const newId = `art-piece-${Date.now()}`;
      const createdItem = {
        id: newId,
        productNo: `ART-${Math.floor(10000 + Math.random() * 90000)}`,
        name: newProduct.name,
        category: newProduct.category,
        price: parseInt(newProduct.price_in_rupees, 10),
        stock: parseInt(newProduct.stock, 10),
        artType: newProduct.artType,
        images: [newProduct.image_url],
        totalSales: 0,
        curationStatus: 'approved',
      };

      // Save via patch endpoint
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newId,
          name: createdItem.name,
          price: createdItem.price,
          stock: createdItem.stock,
          images: createdItem.images,
          curationStatus: 'approved',
        }),
      });

      setProducts(prev => [createdItem, ...prev]);
      setFormSuccess('New piece registered successfully in the atelier catalog!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess('');
        setNewProduct({
          name: '',
          category: 'sarees',
          price_in_rupees: '',
          stock: '10',
          artType: 'Tangail Jamdani Pit Loom',
          image_url: '/images/category-sarees.png',
        });
      }, 700);
    } catch (err) {
      console.error('Failed to register product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = searchQuery === '' || 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.productNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Top Header Card */}
      <div className="atelier-header-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <Shirt style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <h1 className="atelier-page-title">
              Artisan Catalog &amp; Loom <span style={{ color: 'var(--maharani-maroon)' }}>Inventory</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#4A3E36', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Live couture creations &bull; Unified database sync across workshop looms, admin portal &amp; client storefront
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={fetchProducts}
            style={{
              background: 'var(--pure-white)',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '2px',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ink-brown)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Sync Catalog
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              background: 'var(--maharani-maroon)',
              color: 'var(--ivory-silk)',
              border: '1.5px solid var(--maharani-maroon)',
              borderRadius: '2px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <Plus style={{ width: 15, height: 15 }} />
            Add New Piece
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="table-top-bar" style={{ background: 'var(--pure-white)', padding: '1rem 1.5rem', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Collections' },
            { id: 'sarees', label: 'Banarasi Sarees' },
            { id: 'lehengas', label: 'Bridal Lehengas' },
            { id: 'kurta-sets', label: 'Kurta Sets' },
            { id: 'accessories', label: 'Jewellery' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedCategory(f.id)}
              style={{
                background: selectedCategory === f.id ? 'var(--maharani-maroon)' : '#FAF7F2',
                color: selectedCategory === f.id ? '#FFFFFF' : 'var(--ink-brown)',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-taupe)' }} />
          <input
            type="text"
            placeholder="Search creations by title, code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.1rem',
              fontSize: '0.88rem',
              borderRadius: '4px',
              border: '1px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              color: 'var(--ink-brown)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', overflow: 'hidden' }}>
        <table className="seller-table">
          <thead>
            <tr>
              <th>Piece Code</th>
              <th>Creation Title</th>
              <th>Category</th>
              <th>Retail Price</th>
              <th>Atelier Stock</th>
              <th>Total Units Sold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const stock = Number(product.stock) || 0;
                const isOut = stock <= 0;

                return (
                  <tr key={product.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                      {product.productNo || 'ART-2605'}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={product.images?.[0] || '/images/category-sarees.png'}
                          alt={product.name}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)' }}
                        />
                        <div>
                          <div style={{ color: 'var(--ink-brown)', fontWeight: 700 }}>{product.name}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>{product.artType || 'Tangail Jamdani Pit Loom'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--stone-taupe)', textTransform: 'capitalize' }}>
                      {product.category}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>
                      ₹ {(Number(product.price) || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: isOut ? '#FFEBEE' : '#E8F5E9',
                        color: isOut ? '#C62828' : '#2E7D32',
                      }}>
                        {isOut ? 'Depleted (0)' : `${stock} In Stock`}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--ink-brown)' }}>
                      {product.totalSales || 0} Pieces
                    </td>
                    <td>
                      <Link
                        href={`/product/${product.id}`}
                        target="_blank"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '0.4rem 0.75rem',
                          borderRadius: 4,
                          background: '#FAF7F2',
                          border: '1px solid var(--soft-gold-line)',
                          color: 'var(--ink-brown)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <Eye size={13} /> View Live
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--stone-taupe)' }}>
                  No creation pieces found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Creation Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF7F2' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                Register New Handcrafted Piece
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Creation Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Jamdani Pit Loom Mulberry Saree"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Collection Category
                  </label>
                  <CustomDropdown
                    value={newProduct.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(val) => setNewProduct({ ...newProduct, category: val })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Craft Technique
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tangail Jamdani Weave"
                    value={newProduct.artType}
                    onChange={e => setNewProduct({ ...newProduct, artType: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 28500"
                    value={newProduct.price_in_rupees}
                    onChange={e => setNewProduct({ ...newProduct, price_in_rupees: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Available Loom Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 10"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {formSuccess && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.65rem', borderRadius: 4, fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={16} /> {formSuccess}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '0.55rem 1rem', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.55rem 1.25rem', background: 'var(--maharani-maroon)', color: '#FFFFFF', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  <span>Save Piece</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
