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
  Pencil,
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  PackageCheck,
  Tag,
  ArrowRight
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
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; link?: string } | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'sarees',
    price_in_rupees: '',
    stock: '10',
    artType: 'Tangail Jamdani Pit Loom',
    fabric: 'Pure Mulberry Silk',
    occasion: 'Wedding & Festive',
    region: 'Varanasi, Uttar Pradesh',
    description: 'A luminous handwoven couture piece meticulously crafted across master artisan looms.',
    image_url: '/images/category-sarees.png',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  // Edit product form state
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
    description: '',
    image_url: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');

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

  // Copy product number helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      id: product.id,
      productNo: product.productNo || 'ART-2605',
      name: product.name || '',
      category: product.category || 'sarees',
      price: String(product.price || 0),
      stock: String(product.stock !== undefined ? product.stock : 10),
      artType: product.artType || 'Tangail Jamdani Pit Loom',
      fabric: product.fabric || 'Pure Mulberry Silk',
      occasion: product.occasion || 'Wedding & Festive',
      region: product.region || 'India',
      description: product.description || 'Authentic handcrafted heritage creation.',
      image_url: (product.images && product.images[0]) || '/images/category-sarees.png',
    });
    setEditSuccess('');
  };

  // Handle Edit Product Submit (Instant Storefront Publish)
  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editForm.id || !editForm.name || !editForm.price) return;

    setEditSubmitting(true);
    setEditSuccess('');

    try {
      const payload = {
        id: editForm.id,
        name: editForm.name,
        category: editForm.category,
        price: parseInt(editForm.price, 10),
        stock: parseInt(editForm.stock, 10) || 0,
        artType: editForm.artType,
        fabric: editForm.fabric,
        occasion: editForm.occasion,
        region: editForm.region,
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
              fabric: editForm.fabric,
              occasion: editForm.occasion,
              region: editForm.region,
              description: editForm.description,
              images: [editForm.image_url],
            };
          }
          return p;
        }));

        setEditSuccess('✨ Changes saved and published directly to customer storefront!');
        setToastMessage({
          text: `Piece "${editForm.name}" updated live on client storefront!`,
          link: `/product/${editForm.id}`
        });

        setTimeout(() => {
          setEditingProduct(null);
          setEditSuccess('');
        }, 800);
      } else {
        throw new Error(resData.message || 'Failed to update');
      }
    } catch (err: any) {
      console.error('Failed to update product:', err);
      alert('Error updating piece: ' + (err.message || 'Server error'));
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Add New Creation Submit
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
        fabric: newProduct.fabric,
        occasion: newProduct.occasion,
        region: newProduct.region,
        description: newProduct.description,
        images: [newProduct.image_url],
        totalSales: 0,
        curationStatus: 'approved',
      };

      // Save via patch endpoint
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdItem),
      });

      setProducts(prev => [createdItem, ...prev]);
      setFormSuccess('New piece registered and published directly to customer catalog!');
      setToastMessage({
        text: `New piece "${createdItem.name}" registered and live on storefront!`,
        link: `/product/${newId}`
      });

      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess('');
        setNewProduct({
          name: '',
          category: 'sarees',
          price_in_rupees: '',
          stock: '10',
          artType: 'Tangail Jamdani Pit Loom',
          fabric: 'Pure Mulberry Silk',
          occasion: 'Wedding & Festive',
          region: 'Varanasi, Uttar Pradesh',
          description: 'A luminous handwoven couture piece meticulously crafted across master artisan looms.',
          image_url: '/images/category-sarees.png',
        });
      }, 700);
    } catch (err) {
      console.error('Failed to register product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick KPI Metric Computations
  const totalPieces = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const inStockPieces = products.filter(p => Number(p.stock) > 0).length;
  const totalGrossValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(p => {
      const cat = (p.category || '').toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = searchQuery === '' || 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.productNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.artType || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* ── Toast Notification for Live Updates ── */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: 'var(--ink-brown)',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: 8,
          border: '1.5px solid var(--gargi-gold)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: 'fadeIn 0.25s ease'
        }}>
          <Sparkles size={18} color="var(--gargi-gold)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toastMessage.text}</span>
          {toastMessage.link && (
            <Link
              href={toastMessage.link}
              target="_blank"
              style={{
                color: 'var(--gargi-gold)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'underline',
                textUnderlineOffset: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              View Live <ArrowRight size={13} />
            </Link>
          )}
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#BBAE9E', cursor: 'pointer', padding: 2, marginLeft: 6 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Top Royal Header Card ── */}
      <div className="atelier-header-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div className="atelier-title-group">
          <div className="atelier-title-icon" style={{ boxShadow: '0 4px 12px rgba(184, 142, 24, 0.2)' }}>
            <Shirt style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="atelier-live-pill" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '0.2rem 0.65rem', fontSize: '0.74rem' }}>
                <span className="atelier-live-dot" /> Realtime Storefront Sync
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--gargi-gold)', fontWeight: 700 }}>
                Master Atelier • Gopal Chandra Dey
              </span>
            </div>
            <h1 className="atelier-page-title" style={{ fontSize: '2.1rem' }}>
              Artisan Catalog &amp; Loom <span style={{ color: 'var(--maharani-maroon)' }}>Inventory</span>
            </h1>
            <p style={{ fontSize: '0.98rem', color: '#4A3E36', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Live couture creations &bull; Unified database sync across workshop looms, admin portal &amp; client storefront
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchProducts}
            disabled={refreshing}
            style={{
              background: 'var(--pure-white)',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '4px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ink-brown)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(43, 31, 24, 0.04)',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Syncing...' : 'Sync Catalog'}
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              background: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              border: '1.5px solid var(--maharani-maroon)',
              borderRadius: '4px',
              padding: '0.65rem 1.25rem',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(122, 35, 49, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            Add New Piece
          </button>
        </div>
      </div>

      {/* ── 4 Luxury Quick Metric KPI Cards ── */}
      <div className="luxury-metrics-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="luxury-metric-card" style={{ borderLeft: '4px solid var(--maharani-maroon)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)' }}>
                Active Creations
              </span>
              <Layers size={18} color="var(--maharani-maroon)" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink-brown)', lineHeight: 1.1 }}>
              {totalPieces}
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#5C5043', marginTop: '0.75rem', fontWeight: 500 }}>
            Curated pieces ready for storefront display
          </div>
        </div>

        <div className="luxury-metric-card" style={{ borderLeft: '4px solid #16A34A' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)' }}>
                Atelier Loom Stock
              </span>
              <PackageCheck size={18} color="#16A34A" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink-brown)', lineHeight: 1.1 }}>
              {totalStockUnits} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#5C5043' }}>Units</span>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#166534', marginTop: '0.75rem', fontWeight: 600 }}>
            {inStockPieces} pieces ready to ship immediately
          </div>
        </div>

        <div className="luxury-metric-card" style={{ borderLeft: '4px solid var(--gargi-gold)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)' }}>
                Collections
              </span>
              <Tag size={18} color="var(--gargi-gold)" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink-brown)', lineHeight: 1.1 }}>
              4 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#5C5043' }}>Couture Lines</span>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#5C5043', marginTop: '0.75rem', fontWeight: 500 }}>
            Sarees, Lehengas, Kurtas &amp; Jewellery
          </div>
        </div>

        <div className="luxury-metric-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)' }}>
                Storefront Publishing
              </span>
              <Sparkles size={18} color="#0284C7" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0369A1', lineHeight: 1.1 }}>
              Direct Live
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#0369A1', marginTop: '0.75rem', fontWeight: 600 }}>
            Instant customer updates (No admin wait)
          </div>
        </div>
      </div>

      {/* ── Filter & Search Control Bar ── */}
      <div style={{
        background: 'var(--pure-white)',
        padding: '1.1rem 1.4rem',
        border: '1.5px solid var(--soft-gold-line)',
        borderRadius: '8px',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        boxShadow: '0 2px 8px rgba(43, 31, 24, 0.03)'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Collections', count: categoryCounts['all'] || 0 },
            { id: 'sarees', label: 'Banarasi Sarees', count: categoryCounts['sarees'] || 0 },
            { id: 'lehengas', label: 'Bridal Lehengas', count: categoryCounts['lehengas'] || 0 },
            { id: 'kurta-sets', label: 'Kurta Sets', count: categoryCounts['kurta-sets'] || 0 },
            { id: 'accessories', label: 'Jewellery', count: categoryCounts['accessories'] || 0 },
          ].map(f => {
            const isSelected = selectedCategory === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedCategory(f.id)}
                style={{
                  background: isSelected ? 'var(--maharani-maroon)' : '#FAF7F2',
                  color: isSelected ? '#FFFFFF' : 'var(--ink-brown)',
                  border: isSelected ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                  borderRadius: '4px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: isSelected ? '0 2px 8px rgba(122, 35, 49, 0.2)' : 'none'
                }}
              >
                <span>{f.label}</span>
                <span style={{
                  background: isSelected ? 'rgba(255,255,255,0.25)' : '#EBE4D5',
                  color: isSelected ? '#FFFFFF' : '#4A3E36',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search style={{ width: 15, height: 15, position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-taupe)' }} />
          <input
            type="text"
            placeholder="Search by title, piece code, craft..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 2rem 0.55rem 2.2rem',
              fontSize: '0.86rem',
              borderRadius: '4px',
              border: '1px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              color: 'var(--ink-brown)',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--stone-taupe)',
                cursor: 'pointer',
                padding: 2
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Products Luxury Table ── */}
      <div className="seller-table-container">
        <table className="seller-luxury-table">
          <thead>
            <tr>
              <th>Piece Code</th>
              <th>Creation &amp; Description Preview</th>
              <th>Category</th>
              <th>Retail Price</th>
              <th>Atelier Stock</th>
              <th>Units Sold</th>
              <th>Storefront Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '4rem', color: 'var(--stone-taupe)' }}>
                  <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 12px auto', color: 'var(--maharani-maroon)' }} />
                  <div>Loading live loom inventory &amp; catalog...</div>
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const stock = Number(product.stock) || 0;
                const isOut = stock <= 0;
                const pCode = product.productNo || 'ART-2605';
                const isCopied = copiedCode === pCode;

                return (
                  <tr key={product.id}>
                    {/* 1. Piece Code */}
                    <td>
                      <span 
                        className="seller-piece-code"
                        onClick={() => handleCopyCode(pCode)}
                        title="Click to copy Piece Code"
                      >
                        {pCode}
                        {isCopied ? <Check size={11} color="#16A34A" /> : <Copy size={11} color="var(--maharani-maroon)" />}
                      </span>
                    </td>

                    {/* 2. Creation Title + Technique + Description Preview */}
                    <td style={{ maxWidth: '340px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <img
                          src={product.images?.[0] || '/images/category-sarees.png'}
                          alt={product.name}
                          style={{
                            width: 52,
                            height: 52,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1.5px solid var(--soft-gold-line)',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ color: 'var(--ink-brown)', fontWeight: 700, fontSize: '0.94rem', lineHeight: 1.3, marginBottom: 2 }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#5C5043', fontWeight: 600, marginBottom: 4 }}>
                            {product.artType || 'Tangail Jamdani Pit Loom'} &bull; <span style={{ color: 'var(--maharani-maroon)' }}>{product.fabric || 'Pure Silk'}</span>
                          </div>
                          {/* First line preview of storefront description */}
                          <div 
                            style={{ 
                              fontSize: '0.78rem', 
                              color: '#6E5D52', 
                              lineHeight: 1.35, 
                              display: '-webkit-box', 
                              WebkitLineClamp: 1, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis' 
                            }}
                            title={product.description}
                          >
                            <span style={{ color: 'var(--gargi-gold)', marginRight: 4 }}>✦</span>
                            {product.description || 'Authentic handcrafted heritage creation.'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. Category */}
                    <td>
                      <span className="seller-cat-badge">
                        {product.category}
                      </span>
                    </td>

                    {/* 4. Retail Price */}
                    <td style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '0.96rem' }}>
                      ₹ {(Number(product.price) || 0).toLocaleString('en-IN')}
                    </td>

                    {/* 5. Atelier Stock */}
                    <td>
                      <span className={`seller-stock-badge ${isOut ? 'depleted' : 'instock'}`}>
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: isOut ? '#C62828' : '#16A34A'
                        }} />
                        {isOut ? 'Depleted (0)' : `${stock} In Stock`}
                      </span>
                    </td>

                    {/* 6. Total Units Sold */}
                    <td style={{ fontWeight: 700, color: 'var(--ink-brown)' }}>
                      {product.totalSales || 0} Pieces
                    </td>

                    {/* 7. Storefront Status */}
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#0369A1',
                        background: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        borderRadius: 4,
                        padding: '0.2rem 0.55rem',
                        whiteSpace: 'nowrap'
                      }}>
                        <Sparkles size={11} color="#0284C7" /> Published Live
                      </span>
                    </td>

                    {/* 8. Actions (Edit + View Live) */}
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          className="seller-btn-edit"
                          onClick={() => handleOpenEditModal(product)}
                          title="Edit creation details and update customer storefront directly"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>

                        {/* VIEW LIVE BUTTON */}
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          className="seller-btn-view"
                          title="View live piece on client storefront"
                        >
                          <Eye size={13} />
                          <span>View Live</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--stone-taupe)' }}>
                  No creation pieces found matching the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EDIT CREATION & STOREFRONT DETAILS MODAL
          Directly updates customer portal in realtime without admin wait
          ═══════════════════════════════════════════════════════════════ */}
      {editingProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(35, 24, 18, 0.72)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto'
          }}
          onClick={() => setEditingProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--gargi-gold)',
              borderRadius: '12px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1.5px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAF7F2'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--maharani-maroon)',
                    background: '#FFF5F6',
                    border: '1px solid #FAD1D6',
                    borderRadius: 4,
                    padding: '0.15rem 0.5rem'
                  }}>
                    {editForm.productNo}
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#166534',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: 4,
                    padding: '0.15rem 0.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <Sparkles size={11} /> Instant Storefront Sync
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Edit Creation &amp; Storefront Details
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--ink-brown)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProduct} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Notification Banner */}
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 6,
                padding: '0.75rem 1rem',
                fontSize: '0.84rem',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600
              }}>
                <Sparkles size={16} color="var(--gargi-gold)" style={{ flexShrink: 0 }} />
                <span>
                  Any updates made here are saved directly to the database and will <strong>instantly appear to customers</strong> on product cards, category pages, and PDP without requiring admin approval.
                </span>
              </div>

              {/* 2-Column Responsive Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Column 1: Core Specifications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Creation Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Creation Title (Customer Facing)
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Price & Stock Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
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
                        Atelier Stock (Units)
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

                  {/* Category & Technique */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                        Collection Category
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

                  {/* Fabric & Occasion */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                        Fabric / Material
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

                  {/* Image URL with live preview thumbnail */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                      Image Asset Path
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={editForm.image_url}
                        onChange={e => setEditForm({ ...editForm, image_url: e.target.value })}
                        style={{ flex: 1, padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                      <img
                        src={editForm.image_url || '/images/category-sarees.png'}
                        alt="Preview"
                        style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--soft-gold-line)', flexShrink: 0 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Customer Storefront Description & Live Card Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Storefront Description */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043' }}>
                        Customer Storefront Description
                      </label>
                      <span style={{ fontSize: '0.74rem', color: '#786C5E' }}>
                        {editForm.description.length} chars
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Enter the authentic creation description that customers will read directly on the storefront cards and product detail page..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 4,
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.92rem',
                        lineHeight: 1.5,
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ fontSize: '0.74rem', color: '#6A5A50', marginTop: 4 }}>
                      * The first lines appear below the product card with a gold ✦ bullet ending with '...', and the full text displays on the Product Detail Page.
                    </div>
                  </div>

                  {/* Live Storefront Card Preview Box */}
                  <div className="storefront-preview-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Sparkles size={13} color="var(--gargi-gold)" />
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)' }}>
                        Live Client Storefront Card Preview
                      </span>
                    </div>

                    <div className="storefront-preview-card">
                      <img
                        src={editForm.image_url || '/images/category-sarees.png'}
                        alt={editForm.name}
                        style={{
                          width: 80,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: '8px 8px 2px 2px',
                          border: '1px solid var(--soft-gold-line)',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink-brown)', lineHeight: 1.25, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {editForm.name || 'Creation Title'}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--maharani-maroon)', marginBottom: 6 }}>
                          ₹ {(Number(editForm.price) || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 6,
                          fontSize: '0.8rem',
                          color: '#42352B',
                          lineHeight: 1.35
                        }}>
                          <span style={{ color: 'var(--gargi-gold)', flexShrink: 0 }}>✦</span>
                          <span style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordBreak: 'break-word'
                          }}>
                            {editForm.description || 'A luminous handwoven couture piece meticulously crafted across master artisan looms...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editSuccess && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.75rem', borderRadius: 4, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={18} /> {editSuccess}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: '#FAF7F2',
                    border: '1px solid var(--soft-gold-line)',
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    color: 'var(--ink-brown)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  style={{
                    padding: '0.65rem 1.65rem',
                    background: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(122, 35, 49, 0.25)'
                  }}
                >
                  {editSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>Save &amp; Publish to Storefront</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ADD NEW CREATION MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(35, 24, 18, 0.72)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto'
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1.5px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF7F2' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Register New Handcrafted Piece
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                  ⚡ Instantly publishes to customer storefront catalog
                </span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Customer Storefront Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the authentic description for customer cards and detail page..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Mulberry Silk"
                    value={newProduct.fabric}
                    onChange={e => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 4, border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Occasion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding & Festive"
                    value={newProduct.occasion}
                    onChange={e => setNewProduct({ ...newProduct, occasion: e.target.value })}
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
                  style={{ padding: '0.55rem 1.15rem', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 4, fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.55rem 1.45rem', background: 'var(--maharani-maroon)', color: '#FFFFFF', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem' }}
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  <span>Register &amp; Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
