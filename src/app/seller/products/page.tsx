'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  Shirt, 
  Plus, 
  Search, 
  Loader2, 
  Check, 
  X, 
  RefreshCw,
  Eye,
  Pencil
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

const CATEGORY_OPTIONS = [
  { value: 'sarees', label: 'Sarees' },
  { value: 'lehengas', label: 'Lehengas' },
  { value: 'kurta-sets', label: 'Kurta Sets' },
  { value: 'accessories', label: 'Accessories' },
];

function formatCategoryName(cat: string): string {
  const c = (cat || '').toLowerCase();
  if (c === 'sarees') return 'Sarees';
  if (c === 'lehengas') return 'Lehengas';
  if (c === 'kurta-sets') return 'Kurta Sets';
  if (c === 'accessories') return 'Accessories';
  return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Sarees';
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for View More / Edit Modal
  const [editForm, setEditForm] = useState({
    id: '',
    productNo: '',
    name: '',
    category: 'sarees',
    price: '',
    stock: '',
    artType: '',
    fabric: '',
    occasion: '',
    region: '',
    care: '',
    sizes: '',
    description: '',
    image_url: '',
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'sarees',
    price_in_rupees: '',
    stock: '10',
    artType: 'Handloom Weave',
    fabric: 'Pure Silk',
    occasion: 'Festive',
    region: 'India',
    care: 'Dry clean recommended.',
    description: 'Authentic handcrafted heritage creation.',
    image_url: '/images/category-sarees.png',
  });
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newSuccess, setNewSuccess] = useState('');

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

  // Open View More Modal
  const handleOpenDetails = (product: any) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setSaveSuccess('');
    setEditForm({
      id: product.id,
      productNo: product.productNo || 'ART-2605',
      name: product.name || '',
      category: product.category || 'sarees',
      price: String(product.price || 0),
      stock: String(product.stock !== undefined ? product.stock : 10),
      artType: product.artType || 'Handloom Weave',
      fabric: product.fabric || 'Pure Silk',
      occasion: product.occasion || 'Festive',
      region: product.region || 'India',
      care: product.care || 'Dry clean recommended.',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || 'Free Size'),
      description: product.description || 'Authentic handcrafted heritage creation.',
      image_url: (product.images && product.images[0]) || '/images/category-sarees.png',
    });
  };

  // Save changes to backend and customer portal
  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!editForm.id || !editForm.name || !editForm.price) return;

    setSubmittingEdit(true);
    setSaveSuccess('');

    try {
      const parsedSizes = editForm.sizes
        ? editForm.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : ['Free Size'];

      const payload = {
        id: editForm.id,
        name: editForm.name,
        category: editForm.category,
        price: parseInt(editForm.price, 10),
        stock: parseInt(editForm.stock, 10) || 0,
        artType: editForm.artType,
        technique: editForm.artType,
        fabric: editForm.fabric,
        occasion: editForm.occasion,
        region: editForm.region,
        care: editForm.care,
        sizes: parsedSizes,
        description: editForm.description,
        images: [editForm.image_url],
        curationStatus: 'approved',
      };

      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        // Update local state immediately
        setProducts(prev => prev.map(p => {
          if (p.id === editForm.id) {
            return {
              ...p,
              name: editForm.name,
              category: editForm.category,
              price: parseInt(editForm.price, 10),
              stock: parseInt(editForm.stock, 10) || 0,
              artType: editForm.artType,
              technique: editForm.artType,
              fabric: editForm.fabric,
              occasion: editForm.occasion,
              region: editForm.region,
              care: editForm.care,
              sizes: parsedSizes,
              description: editForm.description,
              images: [editForm.image_url],
            };
          }
          return p;
        }));

        setSaveSuccess('Product details updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(''), 2000);
      } else {
        throw new Error(resData.message || 'Failed to update');
      }
    } catch (err: any) {
      console.error('Failed to update product:', err);
      alert('Error updating piece: ' + (err.message || 'Server error'));
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle Add New Creation Submit
  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price_in_rupees || !newProduct.stock) {
      return;
    }

    setSubmittingNew(true);
    setNewSuccess('');

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
        technique: newProduct.artType,
        fabric: newProduct.fabric,
        occasion: newProduct.occasion,
        region: newProduct.region,
        care: newProduct.care,
        sizes: ['Free Size'],
        description: newProduct.description,
        images: [newProduct.image_url],
        totalSales: 0,
        curationStatus: 'approved',
      };

      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdItem),
      });

      setProducts(prev => [createdItem, ...prev]);
      setNewSuccess('New piece registered successfully!');

      setTimeout(() => {
        setIsAddModalOpen(false);
        setNewSuccess('');
        setNewProduct({
          name: '',
          category: 'sarees',
          price_in_rupees: '',
          stock: '10',
          artType: 'Handloom Weave',
          fabric: 'Pure Silk',
          occasion: 'Festive',
          region: 'India',
          care: 'Dry clean recommended.',
          description: 'Authentic handcrafted heritage creation.',
          image_url: '/images/category-sarees.png',
        });
      }, 700);
    } catch (err) {
      console.error('Failed to register product:', err);
    } finally {
      setSubmittingNew(false);
    }
  };

  // Filtered products list
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
      {/* ── Top Header Card (Matching Artist Dashboard Style) ── */}
      <div className="atelier-header-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
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
              color: '#FFFFFF',
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

      {/* ── Filter & Search Bar ── */}
      <div className="table-top-bar" style={{ background: 'var(--pure-white)', padding: '1rem 1.5rem', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Collections' },
            { id: 'sarees', label: 'Sarees' },
            { id: 'lehengas', label: 'Lehengas' },
            { id: 'kurta-sets', label: 'Kurta Sets' },
            { id: 'accessories', label: 'Accessories' },
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

      {/* ── Products Table: Strictly a SINGLE ROW per product, NO multi-line discrepancy ── */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', overflowX: 'auto' }}>
        <table className="seller-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)' }}>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Piece Code</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Creation Title</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Retail Price</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Atelier Stock</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Total Units Sold</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                  <Loader2 className="animate-spin" size={20} style={{ margin: '0 auto 8px auto', color: 'var(--maharani-maroon)' }} />
                  <div>Loading atelier catalog...</div>
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const stock = Number(product.stock) || 0;
                const isOut = stock <= 0;

                return (
                  <tr 
                    key={product.id} 
                    style={{ borderBottom: '1px solid var(--soft-gold-line)', height: '56px', verticalAlign: 'middle' }}
                  >
                    {/* 1. Piece Code (Single Line) */}
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--maharani-maroon)', whiteSpace: 'nowrap' }}>
                      {product.productNo || 'ART-2605'}
                    </td>

                    {/* 2. Creation Title: Thumbnail + Title text on a SINGLE LINE, no wrap */}
                    <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={product.images?.[0] || '/images/category-sarees.png'}
                          alt={product.name}
                          style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)', flexShrink: 0 }}
                        />
                        <span style={{ color: 'var(--ink-brown)', fontWeight: 700, fontSize: '0.9rem' }}>
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* 3. Category: Single Line */}
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>
                      {formatCategoryName(product.category)}
                    </td>

                    {/* 4. Retail Price: Single Line */}
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--ink-brown)', whiteSpace: 'nowrap' }}>
                      ₹ {(Number(product.price) || 0).toLocaleString('en-IN')}
                    </td>

                    {/* 5. Atelier Stock: Single Line */}
                    <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
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

                    {/* 6. Total Units Sold: Single Line */}
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--ink-brown)', whiteSpace: 'nowrap' }}>
                      {product.totalSales || 0} Pieces
                    </td>

                    {/* 7. Actions: Clean View More Button (NO View Live) */}
                    <td style={{ padding: '0.65rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(product)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '0.38rem 0.75rem',
                          borderRadius: 4,
                          background: '#FAF7F2',
                          border: '1px solid var(--soft-gold-line)',
                          color: 'var(--ink-brown)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        View More
                      </button>
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

      {/* ═══════════════════════════════════════════════════════════════
          VIEW MORE / EDIT MODAL (Customer Presentation & Edit)
          ═══════════════════════════════════════════════════════════════ */}
      {selectedProduct && (
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
            padding: '1.25rem',
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF7F2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--maharani-maroon)', fontSize: '0.88rem' }}>
                  {editForm.productNo}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--stone-taupe)' }}>&bull;</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  {isEditing ? 'Edit Creation Details' : 'Creation Specifications'}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--soft-gold-line)',
                      borderRadius: 4,
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--maharani-maroon)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                )}
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            {isEditing ? (
              /* ── EDIT FORM VIEW ── */
              <form onSubmit={handleSaveChanges} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Creation Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                  />
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
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Atelier Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editForm.stock}
                      onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Category
                    </label>
                    <CustomDropdown
                      value={editForm.category}
                      options={CATEGORY_OPTIONS}
                      onChange={(val) => setEditForm({ ...editForm, category: val })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Craft Technique
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.artType}
                      onChange={e => setEditForm({ ...editForm, artType: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Customer Storefront Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Specs Box Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Fabric
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.fabric}
                      onChange={e => setEditForm({ ...editForm, fabric: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Occasion
                    </label>
                    <input
                      type="text"
                      value={editForm.occasion}
                      onChange={e => setEditForm({ ...editForm, occasion: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Fabric Care & Craft Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Fabric Care Instructions
                    </label>
                    <input
                      type="text"
                      value={editForm.care}
                      onChange={e => setEditForm({ ...editForm, care: e.target.value })}
                      placeholder="e.g. Dry clean only"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Heritage Craft Region
                    </label>
                    <input
                      type="text"
                      value={editForm.region}
                      onChange={e => setEditForm({ ...editForm, region: e.target.value })}
                      placeholder="e.g. Varanasi, Uttar Pradesh"
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {saveSuccess && (
                  <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.65rem', borderRadius: 4, fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={16} /> {saveSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '0.55rem 1rem', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEdit}
                    style={{ padding: '0.55rem 1.25rem', background: 'var(--maharani-maroon)', color: '#FFFFFF', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {submittingEdit ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ── CUSTOMER PRESENTATION VIEW (Matches user's screenshot) ── */
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Product Title & Price Header */}
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display, Playfair Display, serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
                    {editForm.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--maharani-maroon)' }}>
                      ₹ {(Number(editForm.price) || 0).toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#6A5A50', fontWeight: 600 }}>
                      (${Math.round((Number(editForm.price) || 0) / 83).toLocaleString('en-US')} USD)
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: '#2E7D32', background: '#E8F5E9', padding: '2px 8px', borderRadius: 10 }}>
                      {editForm.stock} in Loom Stock
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.95rem', color: '#3A2E27', lineHeight: 1.6, margin: 0 }}>
                  {editForm.description}
                </p>

                {/* Clean Specs Card (Matches User's Screenshot Exactly) */}
                <div style={{
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  padding: '1.1rem 1.4rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#786C5E', marginBottom: 4 }}>
                      FABRIC
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                      {editForm.fabric || 'Pure Silk'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#786C5E', marginBottom: 4 }}>
                      TECHNIQUE
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                      {editForm.artType || 'Handloom Weave'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#786C5E', marginBottom: 4 }}>
                      OCCASION
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                      {editForm.occasion || 'Festive'}
                    </div>
                  </div>
                </div>

                {/* Master Artisan Attribution */}
                <div style={{ fontSize: '0.88rem', color: '#6A5A50', fontWeight: 600 }}>
                  MASTER ARTISAN: <strong style={{ color: 'var(--maharani-maroon)' }}>Gopal Chandra Dey &rarr;</strong>
                </div>

                {/* Fabric Care & Craft Details */}
                <div style={{ borderTop: '1px solid var(--soft-gold-line)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#4A3E36' }}>
                    <strong style={{ color: 'var(--ink-brown)' }}>Care Instructions:</strong> {editForm.care || 'Dry clean recommended.'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4A3E36' }}>
                    <strong style={{ color: 'var(--ink-brown)' }}>Heritage Region:</strong> {editForm.region || 'India'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4A3E36' }}>
                    <strong style={{ color: 'var(--ink-brown)' }}>Available Sizes:</strong> {editForm.sizes || 'Free Size'}
                  </div>
                </div>

                {/* Action Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    style={{ padding: '0.55rem 1.15rem', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 4, fontWeight: 600, cursor: 'pointer', fontSize: '0.86rem' }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '0.55rem 1.25rem', background: 'var(--maharani-maroon)', color: '#FFFFFF', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem' }}
                  >
                    <Pencil size={14} />
                    <span>Edit Piece Details</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add New Creation Modal ── */}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Fabric
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Mulberry Silk"
                  value={newProduct.fabric}
                  onChange={e => setNewProduct({ ...newProduct, fabric: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                />
              </div>

              {newSuccess && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.65rem', borderRadius: 4, fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={16} /> {newSuccess}
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
                  disabled={submittingNew}
                  style={{ padding: '0.55rem 1.25rem', background: 'var(--maharani-maroon)', color: '#FFFFFF', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {submittingNew ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
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
