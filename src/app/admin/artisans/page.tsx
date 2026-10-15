'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Package,
  X,
  ExternalLink,
  Edit2,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  created_at?: string;
}

interface VerifiedArtisan {
  applicationId: string;
  id: string;
  artisanNo: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  typeOfArt: string;
  totalRegisteredProducts: number;
  totalSales: number;
  products: ProductItem[];
}

export default function VerifiedArtisansPage() {
  const [artisans, setArtisans] = useState<VerifiedArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Modal for "View All Products"
  const [selectedArtisanForProducts, setSelectedArtisanForProducts] = useState<VerifiedArtisan | null>(null);

  // Manual code assignment modal
  const [editingArtisan, setEditingArtisan] = useState<VerifiedArtisan | null>(null);
  const [newCodeInput, setNewCodeInput] = useState('');
  const [assigningCode, setAssigningCode] = useState(false);
  const [assignError, setAssignError] = useState('');

  const fetchVerifiedArtisans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/artisans');
      const data = await res.json();
      if (data.success && Array.isArray(data.artisans)) {
        setArtisans(data.artisans);
      } else {
        setArtisans([]);
      }
    } catch (err) {
      console.error('Error fetching verified artisans:', err);
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedArtisans();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenArtisanProducts = async (artisan: VerifiedArtisan) => {
    setSelectedArtisanForProducts(artisan);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        const isGopal = (artisan.artisanNo === 'HG-84192') ||
          (artisan.name && artisan.name.toLowerCase().includes('gopal')) ||
          (artisan.applicationId === 'HG-ART-260501');

        let matched = data.products;
        if (!isGopal) {
          matched = data.products.filter((p: any) =>
            (p.artisanNo && p.artisanNo === artisan.artisanNo) ||
            (p.artisanName && p.artisanName.toLowerCase() === artisan.name.toLowerCase()) ||
            (p.artisanId && p.artisanId === artisan.applicationId)
          );
        }

        const formatted = matched.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock ?? 0,
          image: p.images?.[0] || '/images/category-sarees.png',
        }));

        setSelectedArtisanForProducts((prev) => prev ? {
          ...prev,
          totalRegisteredProducts: formatted.length,
          products: formatted,
        } : null);
      }
    } catch (err) {
      console.warn('Error refreshing live artisan products:', err);
    }
  };

  const handleOpenAssignModal = (artisan: VerifiedArtisan) => {
    setEditingArtisan(artisan);
    setNewCodeInput(artisan.artisanNo || '');
    setAssignError('');
  };

  const handleSaveArtisanCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtisan) return;

    setAssigningCode(true);
    setAssignError('');

    try {
      const res = await fetch('/api/admin/artisans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: editingArtisan.applicationId,
          artisanNo: newCodeInput.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setAssignError(data.message || 'Failed to assign code');
        return;
      }

      // Update state in place
      setArtisans((prev) =>
        prev.map((a) =>
          a.applicationId === editingArtisan.applicationId ? { ...a, artisanNo: data.artisanNo } : a
        )
      );
      setEditingArtisan(null);
    } catch (err: any) {
      setAssignError(err?.message || 'Network error assigning artisan code');
    } finally {
      setAssigningCode(false);
    }
  };

  const filteredArtisans = artisans.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (a.artisanNo && a.artisanNo.toLowerCase().includes(q)) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.typeOfArt && a.typeOfArt.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredArtisans.length / ITEMS_PER_PAGE) || 1;
  const paginatedArtisans = filteredArtisans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* ════════════ PAGE HEADER ════════════ */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Artisans
          </span>
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
          Verified Artisans <span style={{ color: 'var(--maharani-maroon)' }}>({artisans.length})</span>
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: '#4A3E36', fontSize: '1.05rem' }}>
          Directory of all officially approved artisan partners preserving India&apos;s heritage weaves.
        </p>
      </div>

      {/* ════════════ SEARCH BAR ════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '12px 16px',
          background: '#FFFFFF',
          border: '1px solid var(--soft-gold-line)',
          borderRadius: '10px',
        }}
      >
        <Search size={18} color="var(--stone-taupe)" />
        <input
          type="text"
          placeholder="Search by Artisan No (e.g. HG-84192) or Artisan Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.98rem',
            background: 'transparent',
            color: 'var(--ink-brown)',
          }}
        />
      </div>

      {/* ════════════ STANDARD TABULAR FORMAT ════════════ */}
      {loading ? (
        <AdminPageLoadingBlock minHeight="240px" message="Loading verified artisans..." />
      ) : filteredArtisans.length === 0 ? (
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
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            No Verified Artisans
          </h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', color: '#5C5043' }}>
            {searchQuery
              ? `No verified artisans match "${searchQuery}".`
              : 'Artisans approved through the Application Inbox will be listed here.'}
          </p>
          <Link
            href="/admin/artisans/applications"
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.35rem',
              backgroundColor: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.86rem',
            }}
          >
            Review Applications Queue
          </Link>
        </div>
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
            position: 'relative',
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
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {/* 1. Artisan No. */}
                <th style={{ padding: '1rem 1.4rem', width: '200px', borderTopLeftRadius: '11px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Artisan No.
                </th>

                {/* 2. Name */}
                <th style={{ padding: '1rem 1.4rem', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Name
                </th>

                {/* 3. Total Registered Products */}
                <th style={{ padding: '1rem 1.4rem', width: '230px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Total Registered Products
                </th>

                {/* 4. Total Sales */}
                <th style={{ padding: '1rem 1.4rem', width: '160px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Total Sales
                </th>

                {/* 5. Actions */}
                <th style={{ padding: '1rem 1.4rem', textAlign: 'right', width: '220px', borderTopRightRadius: '11px', borderBottom: '1.5px solid var(--soft-gold-line)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedArtisans.map((artisan) => (
                <tr
                  key={artisan.id || artisan.applicationId}
                  style={{
                    borderBottom: '1px solid #F0E8DC',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF7F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  {/* 1. Artisan No. (HG + 5 random digits) */}
                  <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: 'var(--maharani-maroon)',
                          background: 'rgba(122, 35, 49, 0.08)',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '6px',
                          letterSpacing: '0.04em',
                          display: 'inline-block',
                        }}
                      >
                        {artisan.artisanNo || 'Pending'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(artisan)}
                        title="Manually assign or edit code"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#8C7B70',
                          padding: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </td>

                  {/* 2. Name */}
                  <td style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid #F0E8DC' }}>
                    <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1.05rem' }}>
                      {artisan.name}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#6A5A50', marginTop: '2px' }}>
                      {artisan.typeOfArt || 'Master Artisan'} &bull; {artisan.state}
                    </div>
                  </td>

                  {/* 3. Total Registered Products */}
                  <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--ink-brown)' }}>
                      {artisan.totalRegisteredProducts}{' '}
                      <span style={{ fontSize: '0.86rem', color: '#6A5A50', fontWeight: 500 }}>
                        {artisan.totalRegisteredProducts === 1 ? 'Product' : 'Products'}
                      </span>
                    </span>
                  </td>

                  {/* 4. Total Sales */}
                  <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--ink-brown)' }}>
                      {artisan.totalSales}{' '}
                      <span style={{ fontSize: '0.86rem', color: '#6A5A50', fontWeight: 500 }}>
                        Sold
                      </span>
                    </span>
                  </td>

                  {/* 5. Actions: View All Products */}
                  <td style={{ padding: '1.1rem 1.4rem', textAlign: 'right', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenArtisanProducts(artisan)}
                      style={{
                        padding: '0.55rem 1.15rem',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid var(--maharani-maroon)',
                        color: 'var(--maharani-maroon)',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--maharani-maroon)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.color = 'var(--maharani-maroon)';
                      }}
                    >
                      <Package size={15} />
                      <span>View All Products</span>
                    </button>
                  </td>
                </tr>
              ))}
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
              Showing <strong>{filteredArtisans.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong>–
              <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredArtisans.length)}</strong> of{' '}
              <strong>{filteredArtisans.length}</strong> artisans
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

      {/* ════════════ MODAL: VIEW ALL PRODUCTS UNDER ARTISAN ════════════ */}
      {selectedArtisanForProducts && (
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
          onClick={() => setSelectedArtisanForProducts(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
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
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Registered Products: {selectedArtisanForProducts.name}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#6A5A50' }}>
                  Artisan Code:{' '}
                  <strong style={{ color: 'var(--maharani-maroon)' }}>
                    {selectedArtisanForProducts.artisanNo}
                  </strong>{' '}
                  &bull; {selectedArtisanForProducts.totalRegisteredProducts} Listed Products
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtisanForProducts(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-brown)',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              {selectedArtisanForProducts.totalRegisteredProducts === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#5C5043' }}>
                  <Package size={36} color="var(--gargi-gold)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                    No Products Registered Yet
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#6A5A50', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    No products have been listed under {selectedArtisanForProducts.name} ({selectedArtisanForProducts.artisanNo}). Products submitted via the Artisan Atelier Portal will automatically populate here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedArtisanForProducts.products.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.15rem',
                        border: '1px solid var(--soft-gold-line)',
                        borderRadius: '8px',
                        background: '#FAF7F2',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: '46px',
                            height: '46px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid var(--soft-gold-line)',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '0.96rem' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6A5A50' }}>{p.category}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--maharani-maroon)', fontSize: '0.98rem' }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 700 }}>
                          Stock: {p.stock}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════ MODAL: MANUALLY ASSIGN ARTISAN CODE ════════════ */}
      {editingArtisan && (
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
          onClick={() => setEditingArtisan(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                Assign Artisan Code
              </h3>
              <button
                type="button"
                onClick={() => setEditingArtisan(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveArtisanCode} style={{ padding: '1.5rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#5C5043' }}>
                Set or manually assign the unique artisan code for <strong>{editingArtisan.name}</strong>.
                Must start with <code>HG</code> and contain 5 random digits (e.g. <code>HG-84192</code>).
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.4rem' }}>
                  Artisan Code
                </label>
                <input
                  type="text"
                  value={newCodeInput}
                  onChange={(e) => setNewCodeInput(e.target.value.toUpperCase())}
                  placeholder="HG-12345"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontFamily: 'monospace',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    border: '1.5px solid var(--soft-gold-line)',
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {assignError && (
                <div style={{ color: '#C62828', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  {assignError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingArtisan(null)}
                  style={{
                    padding: '0.55rem 1rem',
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
                  disabled={assigningCode}
                  style={{
                    padding: '0.55rem 1.25rem',
                    backgroundColor: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {assigningCode ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  <span>Save Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
