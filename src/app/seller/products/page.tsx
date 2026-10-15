'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
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
  Images,
  Trash2,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Upload,
  Star,
  CheckCircle2
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

const DEFAULT_CATEGORY_OPTIONS = [
  { value: 'sarees', label: 'Sarees' },
  { value: 'lehengas', label: 'Lehengas' },
  { value: 'kurta-sets', label: 'Kurta Sets' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bespoke', label: 'Bespoke' },
];

function formatCategoryName(cat: string): string {
  const c = (cat || '').toLowerCase();
  if (c === 'sarees') return 'Sarees';
  if (c === 'lehengas') return 'Lehengas';
  if (c === 'kurta-sets') return 'Kurta Sets';
  if (c === 'accessories') return 'Accessories';
  if (c === 'bespoke') return 'Bespoke';
  return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Sarees';
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string; slug: string }[]>([
    { id: 'sarees', name: 'Sarees', slug: 'sarees' },
    { id: 'lehengas', name: 'Lehengas', slug: 'lehengas' },
    { id: 'kurta-sets', name: 'Kurta Sets', slug: 'kurta-sets' },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    { id: 'bespoke', name: 'Bespoke', slug: 'bespoke' },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoriesList(
            data.categories
              .filter((c: any) => c.isActive !== false)
              .map((c: any) => ({
                id: c.slug || c.id,
                name: c.name,
                slug: c.slug || c.id,
              }))
          );
        }
      } catch {}
    }
    loadCategories();
  }, []);

  const categoryOptions = useMemo(() => {
    return categoriesList.map((c) => ({ value: c.slug || c.id, label: c.name }));
  }, [categoriesList]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Delete & Hide states
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingHideId, setTogglingHideId] = useState<string | null>(null);

  const handleToggleHide = async (product: any) => {
    const newHidden = !product.isHidden;
    setTogglingHideId(product.id);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isHidden: newHidden } : p))
    );
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct({ ...selectedProduct, isHidden: newHidden });
    }

    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, name: product.name, isHidden: newHidden }),
      });
    } catch (err) {
      console.error('Error toggling hide status:', err);
      fetchProducts();
    } finally {
      setTogglingHideId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmProduct) return;
    const target = deleteConfirmProduct;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/products?id=${encodeURIComponent(target.id)}&name=${encodeURIComponent(target.name)}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== target.id));
        if (selectedProduct && selectedProduct.id === target.id) {
          setSelectedProduct(null);
        }
        if (imageEditorProduct && imageEditorProduct.id === target.id) {
          setImageEditorProduct(null);
        }
        setDeleteConfirmProduct(null);
      } else {
        alert('Failed to delete piece: ' + (data.message || 'Server error'));
      }
    } catch (err: any) {
      console.error('Error deleting creation:', err);
      alert('Error deleting creation: ' + (err.message || 'Network error'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Image Editor Modal State
  const [imageEditorProduct, setImageEditorProduct] = useState<any | null>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [savingImages, setSavingImages] = useState(false);
  const [imageSaveSuccess, setImageSaveSuccess] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Open Image Editor Modal
  const handleOpenImageEditor = (product: any) => {
    setImageEditorProduct(product);
    const imgs = Array.isArray(product.images) && product.images.length > 0
      ? [...product.images]
      : [product.image_url || '/images/category-sarees.png'];
    setEditingImages(imgs);
    setNewImageUrl('');
    setImageSaveSuccess('');
  };

  // Reorder Images (Move Left / Right)
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingImages.length) return;
    const updated = [...editingImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setEditingImages(updated);
  };

  // Set selected image as Cover (Position 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...editingImages];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setEditingImages(updated);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    if (editingImages.length <= 1) {
      alert('Every authentic creation requires at least one showcase image.');
      return;
    }
    const updated = editingImages.filter((_, i) => i !== index);
    setEditingImages(updated);
  };

  // Upload local image files
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
      setEditingImages((prev) => [...prev, ...newImgs]);
      setUploadingFiles(false);
    }).catch(() => setUploadingFiles(false));

    e.target.value = '';
  };

  // Add Image by URL
  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setEditingImages((prev) => [...prev, trimmed]);
    setNewImageUrl('');
  };

  // Save Image changes to Backend & Customer Storefront
  const handleSaveImages = async () => {
    if (!imageEditorProduct?.id) return;
    if (editingImages.length === 0) {
      alert('Please keep at least one image.');
      return;
    }
    setSavingImages(true);
    setImageSaveSuccess('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: imageEditorProduct.id,
          name: imageEditorProduct.name,
          images: editingImages,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === imageEditorProduct.id
              ? { ...p, images: editingImages, image_url: editingImages[0] }
              : p
          )
        );
        setImageSaveSuccess('Images updated & published live!');
        setTimeout(() => {
          setImageEditorProduct(null);
          setImageSaveSuccess('');
        }, 1100);
      } else {
        alert(data.message || 'Failed to update images');
      }
    } catch (err) {
      console.error('Error updating images:', err);
      alert('Failed to update images. Please check network connection.');
    } finally {
      setSavingImages(false);
    }
  };

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

          <Link
            href="/artisan/products/new"
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
              textDecoration: 'none',
              transition: 'opacity 0.15s ease',
            }}
          >
            <Plus style={{ width: 15, height: 15 }} />
            Add New Piece
          </Link>
        </div>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="table-top-bar" style={{ background: 'var(--pure-white)', padding: '1rem 1.5rem', border: '1.5px solid var(--soft-gold-line)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Collections' },
            ...categoriesList.map((c) => ({ id: c.slug, label: c.name })),
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
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Retail Price</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Atelier Stock</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap' }}>Total Units Sold</th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', whiteSpace: 'nowrap', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
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
                        {product.isHidden && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: '#FFF3E0',
                              color: '#D97706',
                              border: '1px solid #FFE0B2',
                            }}
                          >
                            Hidden
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Retail Price: Single Line */}
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--ink-brown)', whiteSpace: 'nowrap' }}>
                      ₹ {(Number(product.price) || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Atelier Stock: Single Line */}
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

                    {/* Total Units Sold: Single Line */}
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--ink-brown)', whiteSpace: 'nowrap' }}>
                      {product.totalSales || 0} Pieces
                    </td>

                    {/* Actions: Edit Images, Edit Piece, View More, Hide & Delete */}
                    <td style={{ padding: '0.65rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenImageEditor(product)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.38rem 0.75rem',
                            borderRadius: 4,
                            background: '#FAF7F2',
                            border: '1px solid var(--soft-gold-line)',
                            color: 'var(--maharani-maroon)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Images style={{ width: 14, height: 14 }} />
                          Edit Images
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleOpenDetails(product);
                            setIsEditing(true);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.38rem 0.75rem',
                            borderRadius: 4,
                            background: 'var(--maharani-maroon)',
                            border: '1px solid var(--maharani-maroon)',
                            color: '#FFFFFF',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 1px 4px rgba(122, 35, 49, 0.15)',
                          }}
                        >
                          <Pencil style={{ width: 13, height: 13 }} />
                          Edit Piece
                        </button>

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

                        {/* Hide / Unhide Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleHide(product)}
                          disabled={togglingHideId === product.id}
                          title={product.isHidden ? 'Product is Hidden — click to Unhide' : 'Hide from customer storefront'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.38rem 0.65rem',
                            borderRadius: 4,
                            background: product.isHidden ? '#FFF3E0' : '#FFFFFF',
                            border: product.isHidden ? '1px solid #D97706' : '1px solid var(--soft-gold-line)',
                            color: product.isHidden ? '#D97706' : 'var(--ink-brown)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {togglingHideId === product.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : product.isHidden ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}
                          <span>{product.isHidden ? 'Hidden' : 'Hide'}</span>
                        </button>

                        {/* Delete Icon Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmProduct(product)}
                          title="Delete piece from existence"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.38rem 0.6rem',
                            borderRadius: 4,
                            background: '#FFEBEE',
                            border: '1px solid #FFCDD2',
                            color: '#C62828',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFCDD2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFEBEE')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--stone-taupe)' }}>
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
                  <>
                    <button
                      type="button"
                      onClick={() => selectedProduct && handleToggleHide(selectedProduct)}
                      disabled={togglingHideId === selectedProduct?.id}
                      style={{
                        background: selectedProduct?.isHidden ? '#FFF3E0' : '#FFFFFF',
                        border: selectedProduct?.isHidden ? '1px solid #D97706' : '1px solid var(--soft-gold-line)',
                        borderRadius: 4,
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: selectedProduct?.isHidden ? '#D97706' : 'var(--ink-brown)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {togglingHideId === selectedProduct?.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : selectedProduct?.isHidden ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                      <span>{selectedProduct?.isHidden ? 'Hidden' : 'Hide'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmProduct(selectedProduct)}
                      style={{
                        background: '#FFEBEE',
                        border: '1px solid #FFCDD2',
                        borderRadius: 4,
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#C62828',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: 'var(--maharani-maroon)',
                        border: '1px solid var(--maharani-maroon)',
                        borderRadius: 4,
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Pencil size={12} /> Edit Details
                    </button>
                  </>
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
                      options={categoryOptions}
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Hide / Unhide in Edit Modal */}
                    <button
                      type="button"
                      onClick={() => selectedProduct && handleToggleHide(selectedProduct)}
                      disabled={togglingHideId === selectedProduct?.id}
                      style={{
                        padding: '0.55rem 0.95rem',
                        background: selectedProduct?.isHidden ? '#FFF3E0' : '#FAF7F2',
                        border: selectedProduct?.isHidden ? '1px solid #D97706' : '1px solid var(--soft-gold-line)',
                        color: selectedProduct?.isHidden ? '#D97706' : 'var(--ink-brown)',
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {togglingHideId === selectedProduct?.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : selectedProduct?.isHidden ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                      <span>{selectedProduct?.isHidden ? 'Unhide Creation' : 'Hide from Boutique'}</span>
                    </button>

                    {/* Delete from Existence in Edit Modal */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmProduct(selectedProduct)}
                      style={{
                        padding: '0.55rem 0.95rem',
                        background: '#FFEBEE',
                        border: '1px solid #FFCDD2',
                        color: '#C62828',
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFCDD2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFEBEE')}
                    >
                      <Trash2 size={13} />
                      <span>Delete Piece</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                    options={categoryOptions}
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
    
      {/* ── Edit Creation Images Modal (Add, Reorder & Remove Images) ── */}
      {imageEditorProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => {
            if (!savingImages) setImageEditorProduct(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '10px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 56px rgba(0,0,0,0.28)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF7F2' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
                    Edit Creation Images
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, background: '#F5EBE1', color: 'var(--maharani-maroon)', padding: '2px 8px', borderRadius: 4 }}>
                    {imageEditorProduct.productNo || 'ART-2605'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--stone-taupe)' }}>
                  {imageEditorProduct.name} • {editingImages.length} {editingImages.length === 1 ? 'image' : 'images'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!savingImages) setImageEditorProduct(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)', padding: '4px' }}
                aria-label="Close image editor"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Gold Info Note */}
              <div style={{ padding: '0.75rem 1rem', background: '#FFFDF9', border: '1px solid var(--soft-gold-line)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Star size={16} color="var(--gargi-gold)" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-brown)', lineHeight: 1.4 }}>
                  <strong>Showcase Order:</strong> Image #1 is the primary cover photo showcased on boutique catalog cards. Use <strong>Move Left / Right</strong> or click <strong>Make Cover</strong> to adjust the display order.
                </p>
              </div>

              {/* Gallery Grid of Current Images */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Current Gallery Images ({editingImages.length})
                </label>

                {editingImages.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#FAF7F2', borderRadius: 6, border: '1px dashed var(--soft-gold-line)', color: 'var(--stone-taupe)' }}>
                    No images in gallery. Please add at least one image below.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                    {editingImages.map((imgUrl, index) => {
                      const isCover = index === 0;
                      return (
                        <div
                          key={index}
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
                          {/* Image Thumbnail Container */}
                          <div style={{ position: 'relative', width: '100%', height: '140px', background: '#F0EBE1' }}>
                            <img
                              src={imgUrl}
                              alt={`Gallery image ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/category-sarees.png';
                              }}
                            />
                            {/* Position Badge */}
                            <span
                              style={{
                                position: 'absolute',
                                top: 6,
                                left: 6,
                                background: 'rgba(35, 24, 18, 0.82)',
                                color: '#FFFFFF',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 3,
                              }}
                            >
                              #{index + 1}
                            </span>

                            {/* Cover Badge */}
                            {isCover && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 6,
                                  right: 6,
                                  background: 'var(--maharani-maroon)',
                                  color: '#FFFFFF',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 3,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                }}
                              >
                                <Star size={10} fill="#FFF" /> Cover
                              </span>
                            )}
                          </div>

                          {/* Controls Bar for this Image */}
                          <div style={{ padding: '0.5rem', background: '#FAF7F2', borderTop: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              {/* Move Left / Up Button */}
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveImage(index, 'left')}
                                title="Move Earlier in Order"
                                style={{
                                  padding: '4px',
                                  border: '1px solid var(--soft-gold-line)',
                                  borderRadius: 3,
                                  background: index === 0 ? '#EBE6DC' : '#FFFFFF',
                                  color: index === 0 ? '#AFA79B' : 'var(--ink-brown)',
                                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ChevronLeft size={14} />
                              </button>

                              {/* Move Right / Down Button */}
                              <button
                                type="button"
                                disabled={index === editingImages.length - 1}
                                onClick={() => handleMoveImage(index, 'right')}
                                title="Move Later in Order"
                                style={{
                                  padding: '4px',
                                  border: '1px solid var(--soft-gold-line)',
                                  borderRadius: 3,
                                  background: index === editingImages.length - 1 ? '#EBE6DC' : '#FFFFFF',
                                  color: index === editingImages.length - 1 ? '#AFA79B' : 'var(--ink-brown)',
                                  cursor: index === editingImages.length - 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>

                            {/* Set Cover button if not already cover */}
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(index)}
                                title="Set as primary cover image"
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: 'var(--maharani-maroon)',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px 4px',
                                  textDecoration: 'underline',
                                }}
                              >
                                Make Cover
                              </button>
                            )}

                            {/* Delete / Remove Image */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              title="Remove this image"
                              style={{
                                padding: '4px',
                                border: '1px solid #FFCDD2',
                                borderRadius: 3,
                                background: '#FFEBEE',
                                color: '#C62828',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add New Images Section */}
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 8, padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                  Add More Images to this Piece
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {/* File Upload Option */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--stone-taupe)', marginBottom: '0.35rem' }}>
                      Upload Image Files from Device:
                    </label>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.15rem',
                        borderRadius: 4,
                        border: '1.5px dashed var(--soft-gold-line)',
                        background: '#FFFFFF',
                        color: 'var(--ink-brown)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        width: '100%',
                        boxSizing: 'border-box',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Upload size={16} color="var(--maharani-maroon)" />
                      <span>{uploadingFiles ? 'Reading Files...' : 'Browse & Upload Images'}</span>
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

                  {/* Image URL Option */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--stone-taupe)', marginBottom: '0.35rem' }}>
                      Or Paste Image URL:
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="https://... or /images/..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '0.6rem 0.75rem',
                          borderRadius: 4,
                          border: '1px solid var(--soft-gold-line)',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        disabled={!newImageUrl.trim()}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: 4,
                          border: 'none',
                          background: newImageUrl.trim() ? 'var(--maharani-maroon)' : '#D8CBB6',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: newImageUrl.trim() ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Feedback */}
              {imageSaveSuccess && (
                <div style={{ padding: '0.75rem 1rem', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: 4, color: '#2E7D32', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} />
                  <span>{imageSaveSuccess}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', backgroundColor: '#FAF7F2' }}>
              <button
                type="button"
                disabled={savingImages}
                onClick={() => setImageEditorProduct(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FFFFFF',
                  color: 'var(--ink-brown)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingImages}
                onClick={handleSaveImages}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: 4,
                  border: 'none',
                  background: 'var(--maharani-maroon)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: savingImages ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {savingImages ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Saving Gallery...</span>
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    <span>Save Image Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ PERMANENT DELETE CONFIRMATION MODAL ════════════ */}
      {deleteConfirmProduct && (
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
          }}
          onClick={() => !isDeleting && setDeleteConfirmProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 24px 50px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#FFEBEE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Trash2 size={22} color="#C62828" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.22rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Delete Creation from Existence?
                </h3>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--maharani-maroon)',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                  }}
                >
                  {deleteConfirmProduct.productNo || 'ART-CREATION'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.94rem', color: '#4A3E36', lineHeight: 1.55, margin: '0 0 1.5rem 0' }}>
              Are you sure you want to permanently delete <strong>{deleteConfirmProduct.name}</strong>?
              This will remove this piece completely from both the <strong>Artisan Atelier</strong>, the <strong>Admin Catalog Directory</strong>, and the <strong>customer storefront</strong>. This cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmProduct(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: '#FAF7F2',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: '#C62828',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 8px rgba(198, 40, 40, 0.25)',
                }}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                <span>{isDeleting ? 'Deleting...' : 'Delete from Existence'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
