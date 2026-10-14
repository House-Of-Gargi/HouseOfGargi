'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  X,
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Loader2,
  Package,
  Layers,
  Image as ImageIcon,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

interface ProductItem {
  id: string;
  productNo: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  totalSales: number;
  images: string[];
  description: string;
  artisanName: string;
  artisanNo: string;
  artType: string;
  fabric?: string;
  occasion?: string;
  curationStatus: 'approved' | 'pending' | 'rejected';
  createdAt?: string;
}

export default function ProductApprovalsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Modal states
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
  }>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');
  const [customerPreviewIndex, setCustomerPreviewIndex] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Open "View More" details modal
  const handleOpenViewModal = (prod: ProductItem) => {
    setViewingProduct(prod);
    setActiveGalleryIndex(0);
  };

  // Open "Edit Product" customer preview & sequence modal
  const handleOpenEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      images: [...prod.images],
    });
    setCustomerPreviewIndex(0);
    setEditSuccessMsg('');
  };

  // Move image earlier in sequence
  const handleMoveImageEarlier = (index: number) => {
    if (index === 0) return;
    const newImgs = [...editForm.images];
    const temp = newImgs[index - 1];
    newImgs[index - 1] = newImgs[index];
    newImgs[index] = temp;
    setEditForm((prev) => ({ ...prev, images: newImgs }));
    setCustomerPreviewIndex(index - 1);
  };

  // Move image later in sequence
  const handleMoveImageLater = (index: number) => {
    if (index === editForm.images.length - 1) return;
    const newImgs = [...editForm.images];
    const temp = newImgs[index + 1];
    newImgs[index + 1] = newImgs[index];
    newImgs[index] = temp;
    setEditForm((prev) => ({ ...prev, images: newImgs }));
    setCustomerPreviewIndex(index + 1);
  };

  // Set image as cover / 1st position
  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const newImgs = [...editForm.images];
    const [selected] = newImgs.splice(index, 1);
    newImgs.unshift(selected);
    setEditForm((prev) => ({ ...prev, images: newImgs }));
    setCustomerPreviewIndex(0);
  };

  // Save changes to API
  const handleSaveProductChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingEdit(true);
    setEditSuccessMsg('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          stock: editForm.stock,
          images: editForm.images,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditSuccessMsg('Product details and image sequence updated successfully!');
        // Update local state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: editForm.name,
                  description: editForm.description,
                  price: editForm.price,
                  stock: editForm.stock,
                  images: editForm.images,
                }
              : p
          )
        );

        setTimeout(() => {
          setEditingProduct(null);
        }, 900);
      }
    } catch (err) {
      console.error('Error saving product edits:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  // Quick QC toggle (Approve / Reject)
  const handleToggleQCStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, curationStatus: newStatus }),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, curationStatus: newStatus } : p))
      );

      if (viewingProduct && viewingProduct.id === id) {
        setViewingProduct((prev) => (prev ? { ...prev, curationStatus: newStatus } : null));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (statusFilter === 'pending' && p.curationStatus !== 'pending') return false;
    if (statusFilter === 'approved' && p.curationStatus !== 'approved') return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.productNo.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.artisanName.toLowerCase().includes(q) ||
      p.artType.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* ════════════ PAGE HEADER ════════════ */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Catalog Curation &amp; QC
          </span>
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
          Total Catalog <span style={{ color: 'var(--maharani-maroon)' }}>Directory</span> ({products.length})
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: '#4A3E36', fontSize: '1.05rem' }}>
          Live boutique inventory of all handcrafted creations preserved under Master Artisan Gopal Chandra Dey (HG-84192).
        </p>
      </div>

      {/* ════════════ SEARCH & STATUS FILTER BAR ════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Search Input */}
        <div
          style={{
            flex: '1 1 320px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '12px 16px',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
          }}
        >
          <Search size={18} color="var(--stone-taupe)" />
          <input
            type="text"
            placeholder="Search products by Product No (e.g. ART-90433), title, artisan, or craft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.96rem',
              background: 'transparent',
              color: 'var(--ink-brown)',
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#FAF7F2', padding: '4px', borderRadius: '8px', border: '1px solid var(--soft-gold-line)' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: statusFilter === 'all' ? '#FFFFFF' : 'transparent',
              color: statusFilter === 'all' ? 'var(--maharani-maroon)' : '#6A5A50',
              fontWeight: statusFilter === 'all' ? 800 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: statusFilter === 'all' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            All Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: statusFilter === 'approved' ? '#FFFFFF' : 'transparent',
              color: statusFilter === 'approved' ? '#2E7D32' : '#6A5A50',
              fontWeight: statusFilter === 'approved' ? 800 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: statusFilter === 'approved' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Approved ({products.filter((p) => p.curationStatus === 'approved').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: statusFilter === 'pending' ? '#FFFFFF' : 'transparent',
              color: statusFilter === 'pending' ? '#D97706' : '#6A5A50',
              fontWeight: statusFilter === 'pending' ? 800 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: statusFilter === 'pending' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Pending QC ({products.filter((p) => p.curationStatus === 'pending').length})
          </button>
        </div>
      </div>

      {/* ════════════ TABULAR LISTING (STYLE OF VERIFIED ARTISANS) ════════════ */}
      {loading ? (
        <AdminPageLoadingBlock minHeight="240px" message="Loading catalog creations..." />
      ) : filteredProducts.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            color: 'var(--stone-taupe)',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--gargi-gold)',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            No Products Found
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#5C5043' }}>
            {searchQuery
              ? `No products match "${searchQuery}".`
              : 'The curation queue is currently empty.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  background: '#FAF7F2',
                  borderBottom: '1.5px solid var(--soft-gold-line)',
                  color: '#5C5043',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {/* 1. Small icon & Product No (ART-XXXXX) */}
                <th style={{ padding: '1rem 1.25rem', width: '220px', borderTopLeftRadius: '11px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Product No. &amp; Icon
                </th>

                {/* 2. Product Name */}
                <th style={{ padding: '1rem 1.25rem', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Product Name
                </th>

                {/* 3. Artisan */}
                <th style={{ padding: '1rem 1.25rem', width: '220px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Artisan
                </th>

                {/* 4. Inventory */}
                <th style={{ padding: '1rem 1.25rem', width: '150px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Inventory
                </th>

                {/* 5. Total Sales */}
                <th style={{ padding: '1rem 1.25rem', width: '140px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Total Sales
                </th>

                {/* 6. Actions (View More & Edit Product) */}
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right', width: '250px', borderTopRightRadius: '11px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => {
                const primaryImage = p.images && p.images.length > 0 ? p.images[0] : '/images/category-sarees.png';

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #F0E8DC',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF7F2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                  >
                    {/* 1. Image Icon & Product No. (ART-XXXXX) */}
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {/* Small Image Icon */}
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--soft-gold-line)',
                            backgroundColor: '#F5EFE6',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={primaryImage}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>

                        {/* In front of it: Product Number ART-XXXXX */}
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            color: 'var(--maharani-maroon)',
                            background: 'rgba(122, 35, 49, 0.08)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            letterSpacing: '0.04em',
                            display: 'inline-block',
                          }}
                        >
                          {p.productNo}
                        </span>
                      </div>
                    </td>

                    {/* 2. Product Name & Category */}
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F0E8DC' }}>
                      <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1.02rem' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6A5A50', marginTop: '2px', textTransform: 'capitalize' }}>
                        {p.category} &bull; ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* 3. Artisan Name & Code */}
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F0E8DC' }}>
                      <div style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '0.94rem' }}>
                        {p.artisanName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--maharani-maroon)', fontFamily: 'monospace', fontWeight: 700, marginTop: '2px' }}>
                        {p.artisanNo}
                      </div>
                    </td>

                    {/* 4. Inventory */}
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--ink-brown)' }}>
                        {p.stock}{' '}
                        <span style={{ fontSize: '0.82rem', color: '#2E7D32', fontWeight: 600 }}>
                          in Stock
                        </span>
                      </span>
                    </td>

                    {/* 5. Total Sales */}
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--ink-brown)' }}>
                        {p.totalSales}{' '}
                        <span style={{ fontSize: '0.82rem', color: '#6A5A50', fontWeight: 500 }}>
                          Sold
                        </span>
                      </span>
                    </td>

                    {/* 6. Actions: View More & Edit Product */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                        {/* View More Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenViewModal(p)}
                          style={{
                            padding: '0.48rem 0.88rem',
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid var(--soft-gold-line)',
                            color: 'var(--ink-brown)',
                            borderRadius: '5px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gargi-gold)')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--soft-gold-line)')}
                        >
                          <Eye size={14} />
                          <span>View More</span>
                        </button>

                        {/* Edit Product Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          style={{
                            padding: '0.48rem 0.95rem',
                            backgroundColor: 'var(--maharani-maroon)',
                            border: '1.5px solid var(--maharani-maroon)',
                            color: '#FFFFFF',
                            borderRadius: '5px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(122, 35, 49, 0.15)',
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Edit Product</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ════════════ PAGINATION BAR (5 ITEMS PER PAGE) ════════════ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.4rem',
              background: '#FAF7F2',
              borderTop: '1px solid var(--soft-gold-line)',
              borderBottomLeftRadius: '11px',
              borderBottomRightRadius: '11px',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.84rem', color: '#6A5A50', fontWeight: 600 }}>
              Showing <strong>{filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong>–
              <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</strong> of{' '}
              <strong>{filteredProducts.length}</strong> creations
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '5px',
                  border: '1px solid var(--soft-gold-line)',
                  backgroundColor: '#FFFFFF',
                  color: currentPage === 1 ? '#A89E96' : 'var(--ink-brown)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  opacity: currentPage === 1 ? 0.6 : 1,
                }}
              >
                &larr; Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '5px',
                      border: isActive ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                      backgroundColor: isActive ? 'var(--maharani-maroon)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : 'var(--ink-brown)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      boxShadow: isActive ? '0 1px 4px rgba(122, 35, 49, 0.2)' : 'none',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '5px',
                  border: '1px solid var(--soft-gold-line)',
                  backgroundColor: '#FFFFFF',
                  color: currentPage === totalPages ? '#A89E96' : 'var(--ink-brown)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  opacity: currentPage === totalPages ? 0.6 : 1,
                }}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ 1. VIEW MORE DETAILS DIALOGUE BOX ════════════ */}
      {viewingProduct && (
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
          onClick={() => setViewingProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.65rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      color: 'var(--maharani-maroon)',
                      background: 'rgba(122, 35, 49, 0.08)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px',
                    }}
                  >
                    {viewingProduct.productNo}
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 9999,
                      background: viewingProduct.curationStatus === 'approved' ? '#E8F5E9' : '#FFF3E0',
                      color: viewingProduct.curationStatus === 'approved' ? '#2E7D32' : '#D97706',
                    }}
                  >
                    {viewingProduct.curationStatus === 'approved' ? 'Storefront Approved' : 'Pending QC'}
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  {viewingProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.65rem' }}>
              {/* Artisan & Art Type Dossier */}
              <div
                style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  padding: '1.15rem 1.4rem',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 800 }}>
                    Master Artisan
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1.05rem', marginTop: '2px' }}>
                    {viewingProduct.artisanName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--maharani-maroon)', fontFamily: 'monospace', fontWeight: 700 }}>
                    {viewingProduct.artisanNo}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 800 }}>
                    Art Type &amp; Technique
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1.05rem', marginTop: '2px' }}>
                    {viewingProduct.artType}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6A5A50' }}>
                    Fabric: {viewingProduct.fabric || 'Pure Silk'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 800 }}>
                    Commercial Details
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--maharani-maroon)', fontSize: '1.1rem', marginTop: '2px' }}>
                    ₹{viewingProduct.price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#2E7D32', fontWeight: 700 }}>
                    Stock: {viewingProduct.stock} units &bull; Sold: {viewingProduct.totalSales} units
                  </div>
                </div>
              </div>

              {/* Multiple Images Uploaded by the Artisan */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043' }}>
                    Artisan Uploaded Images ({viewingProduct.images.length})
                  </label>
                  <span style={{ fontSize: '0.8rem', color: '#8C7B70' }}>Click any thumbnail to expand</span>
                </div>

                {/* Primary Lightbox View */}
                <div
                  style={{
                    height: '280px',
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--soft-gold-line)',
                    backgroundColor: '#F5EFE6',
                    marginBottom: '0.75rem',
                  }}
                >
                  <img
                    src={viewingProduct.images[activeGalleryIndex] || viewingProduct.images[0]}
                    alt={viewingProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>

                {/* Gallery Thumbs */}
                <div style={{ display: 'flex', gap: '0.55rem', overflowX: 'auto', paddingBottom: '4px' }}>
                  {viewingProduct.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveGalleryIndex(idx)}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        padding: 0,
                        border: activeGalleryIndex === idx ? '2px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                        cursor: 'pointer',
                        opacity: activeGalleryIndex === idx ? 1 : 0.65,
                        flexShrink: 0,
                      }}
                    >
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.4rem' }}>
                  Craft Description &amp; Provenance
                </label>
                <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '8px', padding: '1rem', fontSize: '0.94rem', lineHeight: 1.6, color: '#3E342D' }}>
                  {viewingProduct.description}
                </div>
              </div>

              {/* QC Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                <div style={{ fontSize: '0.85rem', color: '#8C7B70' }}>
                  Status: <strong style={{ color: 'var(--ink-brown)', textTransform: 'capitalize' }}>{viewingProduct.curationStatus}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {viewingProduct.curationStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleToggleQCStatus(viewingProduct.id, 'approved')}
                      style={{
                        padding: '0.55rem 1.15rem',
                        backgroundColor: '#2E7D32',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve to Storefront</span>
                    </button>
                  )}
                  {viewingProduct.curationStatus !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleToggleQCStatus(viewingProduct.id, 'rejected')}
                      style={{
                        padding: '0.55rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#C62828',
                        border: '1.5px solid #EF9A9A',
                        borderRadius: '5px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                      }}
                    >
                      Reject Submission
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ 2. EDIT PRODUCT DIALOGUE BOX (CUSTOMER PREVIEW + REORDER IMAGES + EDIT DESC) ════════════ */}
      {editingProduct && (
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
          onClick={() => setEditingProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '1050px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    color: 'var(--maharani-maroon)',
                    background: 'rgba(122, 35, 49, 0.08)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                  }}
                >
                  {editingProduct.productNo}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Storefront Display Editor &amp; Customer Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal 2-Column Layout: Customer View on Left, Admin Editor on Right */}
            <form onSubmit={handleSaveProductChanges}>
              <div
                style={{
                  padding: '1.75rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '2rem',
                }}
              >
                {/* ── LEFT COLUMN: CUSTOMER STOREFRONT DISPLAY PREVIEW ── */}
                <div
                  style={{
                    background: '#FAF7F2',
                    border: '1.5px solid var(--soft-gold-line)',
                    borderRadius: '10px',
                    padding: '1.4rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <ShoppingBag size={16} color="var(--maharani-maroon)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--maharani-maroon)' }}>
                      Live Customer Storefront Display
                    </span>
                  </div>

                  {/* Primary Cover Image (Images[0] or selected thumbnail) */}
                  <div
                    style={{
                      height: '280px',
                      width: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--soft-gold-line)',
                      backgroundColor: '#FFFFFF',
                      position: 'relative',
                      boxShadow: '0 4px 12px rgba(43,31,24,0.06)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <img
                      src={editForm.images[customerPreviewIndex] || editForm.images[0] || '/images/category-sarees.png'}
                      alt="Customer Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'rgba(35, 24, 18, 0.75)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 4,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {customerPreviewIndex === 0 ? '★ Storefront Cover Image' : `Angle ${customerPreviewIndex + 1}`}
                    </div>
                  </div>

                  {/* Customer Thumbnail Selectors */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
                    {editForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCustomerPreviewIndex(idx)}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: customerPreviewIndex === idx ? '2px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                          cursor: 'pointer',
                          opacity: customerPreviewIndex === idx ? 1 : 0.6,
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {idx === 0 && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--maharani-maroon)', color: '#FFF', fontSize: '9px', textAlign: 'center', fontWeight: 800 }}>
                            COVER
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Customer Title & Price */}
                  <div style={{ borderTop: '1px solid var(--soft-gold-line)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                      House of Gargi &bull; {editingProduct.category}
                    </div>
                    <h4 style={{ margin: '4px 0 6px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                      {editForm.name || editingProduct.name}
                    </h4>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--maharani-maroon)', marginBottom: '0.85rem' }}>
                      ₹{Number(editForm.price || 0).toLocaleString('en-IN')}
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#4A3E36', lineHeight: 1.6, background: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--soft-gold-line)' }}>
                      {editForm.description || editingProduct.description}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: ADMIN CONTROLS (REORDER IMAGES & EDIT DESCRIPTION) ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                  {/* 1. Change Image Sequence ("which image should come first and which after") */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-brown)' }}>
                        Image Sequence &amp; Priority Order
                      </label>
                      <span style={{ fontSize: '0.78rem', color: '#8C7B70' }}>The 1st image is the Cover</span>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#6A5A50' }}>
                      Click <strong>Set as 1st (Cover)</strong> or use the arrows to reorder which image comes first and which comes after on the storefront.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {editForm.images.map((imgUrl, idx) => {
                        const isCover = idx === 0;

                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.65rem 0.85rem',
                              border: isCover ? '1.5px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                              borderRadius: '8px',
                              background: isCover ? '#FAF7F2' : '#FFFFFF',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={imgUrl}
                                alt=""
                                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--soft-gold-line)' }}
                              />
                              <div>
                                <span
                                  style={{
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    color: isCover ? 'var(--maharani-maroon)' : '#6A5A50',
                                  }}
                                >
                                  {isCover ? '★ 1st (Cover Photo)' : `Position #${idx + 1}`}
                                </span>
                                <div style={{ fontSize: '0.74rem', color: '#8C7B70', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {imgUrl}
                                </div>
                              </div>
                            </div>

                            {/* Reordering Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(idx)}
                                  title="Set as 1st Cover Image"
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--maharani-maroon)',
                                    backgroundColor: '#FFFFFF',
                                    color: 'var(--maharani-maroon)',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                  }}
                                >
                                  <Star size={12} fill="var(--maharani-maroon)" />
                                  <span>Make 1st</span>
                                </button>
                              )}
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveImageEarlier(idx)}
                                title="Move Earlier in Sequence"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: '4px',
                                  border: '1px solid var(--soft-gold-line)',
                                  backgroundColor: '#FFFFFF',
                                  cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                  opacity: idx === 0 ? 0.4 : 1,
                                }}
                              >
                                <ArrowLeft size={13} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === editForm.images.length - 1}
                                onClick={() => handleMoveImageLater(idx)}
                                title="Move Later in Sequence"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: '4px',
                                  border: '1px solid var(--soft-gold-line)',
                                  backgroundColor: '#FFFFFF',
                                  cursor: idx === editForm.images.length - 1 ? 'not-allowed' : 'pointer',
                                  opacity: idx === editForm.images.length - 1 ? 0.4 : 1,
                                }}
                              >
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Edit Customer Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-brown)', marginBottom: '0.4rem' }}>
                      Edit Product Description
                    </label>
                    <textarea
                      rows={5}
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Craft narrative, weaving notes, and customer description..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '0.94rem',
                        lineHeight: 1.55,
                        borderRadius: '6px',
                        border: '1.5px solid var(--soft-gold-line)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* 3. Title, Price, & Inventory Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                        Retail Price (₹)
                      </label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '6px',
                          border: '1.5px solid var(--soft-gold-line)',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                        Inventory Stock
                      </label>
                      <input
                        type="number"
                        value={editForm.stock}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '6px',
                          border: '1.5px solid var(--soft-gold-line)',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {editSuccessMsg && (
                    <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.65rem 0.95rem', borderRadius: '6px', fontSize: '0.86rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Check size={16} />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      style={{
                        padding: '0.6rem 1.15rem',
                        background: '#FAF7F2',
                        border: '1px solid var(--soft-gold-line)',
                        borderRadius: '4px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      style={{
                        padding: '0.6rem 1.5rem',
                        backgroundColor: 'var(--maharani-maroon)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 8px rgba(122, 35, 49, 0.2)',
                      }}
                    >
                      {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
