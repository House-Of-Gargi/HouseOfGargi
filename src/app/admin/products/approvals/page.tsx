'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  Check,
  X,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

interface SubmissionItem {
  id: string;
  productNo: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  artisanName: string;
  artisanNo: string;
  artType: string;
  curationStatus: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export default function ProductQCApprovalsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [inspectingItem, setInspectingItem] = useState<SubmissionItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setSubmissions(data.products);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleDecision = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      setActionSuccess(`Item ${decision === 'approved' ? 'accepted and published to boutique catalog' : 'marked as rejected'}.`);
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, curationStatus: decision }),
      });

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, curationStatus: decision } : s))
      );

      setTimeout(() => {
        setInspectingItem(null);
        setActionSuccess('');
      }, 700);
    } catch (err) {
      console.error('Error recording QC decision:', err);
    }
  };

  const pendingList = submissions.filter((s) => s.curationStatus === 'pending');
  const reviewedList = submissions.filter((s) => s.curationStatus !== 'pending');
  const displayedList = activeTab === 'pending' ? pendingList : reviewedList;

  const totalPages = Math.ceil(displayedList.length / ITEMS_PER_PAGE) || 1;
  const paginatedSubmissions = displayedList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* ════════════ PAGE HEADER ════════════ */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Quality Inspection Gate
          </span>
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
          Product QC &amp; Storefront <span style={{ color: 'var(--maharani-maroon)' }}>Approvals</span>
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: '#4A3E36', fontSize: '1.05rem' }}>
          Dedicated quality inspection queue solely responsible to view submitted artisan creations and decide whether to accept or reject them for publication.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '6px',
            border: '1.5px solid',
            borderColor: activeTab === 'pending' ? 'var(--maharani-maroon)' : 'var(--soft-gold-line)',
            backgroundColor: activeTab === 'pending' ? 'var(--maharani-maroon)' : '#FFFFFF',
            color: activeTab === 'pending' ? '#FFFFFF' : 'var(--ink-brown)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={16} />
          <span>Pending Submissions ({pendingList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviewed')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '6px',
            border: '1.5px solid',
            borderColor: activeTab === 'reviewed' ? 'var(--maharani-maroon)' : 'var(--soft-gold-line)',
            backgroundColor: activeTab === 'reviewed' ? 'var(--maharani-maroon)' : '#FFFFFF',
            color: activeTab === 'reviewed' ? '#FFFFFF' : 'var(--ink-brown)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Reviewed Catalog ({reviewedList.length})</span>
        </button>
      </div>

      {/* Submissions List */}
      {loading ? (
        <AdminPageLoadingBlock minHeight="220px" message="Loading QC queue..." />
      ) : displayedList.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            color: 'var(--stone-taupe)',
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--gargi-gold)' }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            {activeTab === 'pending' ? 'No Submissions Pending QC' : 'No Reviewed Items'}
          </h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', color: '#5C5043' }}>
            {activeTab === 'pending'
              ? 'The QC queue is clear. When artisans upload new creations via their atelier portal, they will appear here for quality review.'
              : 'All catalog items have been reviewed.'}
          </p>
          <Link
            href="/admin/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.25rem',
              backgroundColor: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.86rem',
            }}
          >
            <span>View Total Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paginatedSubmissions.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '10px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                <img
                  src={item.images[0] || '/images/category-sarees.png'}
                  alt={item.name}
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--soft-gold-line)' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.86rem', color: 'var(--maharani-maroon)', background: 'rgba(122, 35, 49, 0.08)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      {item.productNo}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                      {item.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#6A5A50', marginTop: '3px' }}>
                    By <strong>{item.artisanName}</strong> ({item.artisanNo}) &bull; {item.artType} &bull; ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Accept / Reject / Inspect */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setInspectingItem(item)}
                  style={{
                    padding: '0.5rem 0.95rem',
                    backgroundColor: '#FAF7F2',
                    border: '1px solid var(--soft-gold-line)',
                    borderRadius: '5px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Eye size={14} />
                  <span>Inspect Art Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(item.id, 'approved')}
                  style={{
                    padding: '0.5rem 1.15rem',
                    backgroundColor: '#2E7D32',
                    border: 'none',
                    borderRadius: '5px',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Check size={15} />
                  <span>Accept &amp; Publish</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(item.id, 'rejected')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1.5px solid #EF9A9A',
                    borderRadius: '5px',
                    color: '#C62828',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <X size={15} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════ PAGINATION BAR (5 ITEMS PER PAGE) ════════════ */}
        {displayedList.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.4rem',
              background: '#FFFFFF',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '10px',
              marginTop: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.84rem', color: '#6A5A50', fontWeight: 600 }}>
              Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong>–
              <strong>{Math.min(currentPage * ITEMS_PER_PAGE, displayedList.length)}</strong> of{' '}
              <strong>{displayedList.length}</strong> submissions
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
        )}
        </>
      )}

      {/* Inspect Item Modal */}
      {inspectingItem && (
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
          onClick={() => setInspectingItem(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAF7F2' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--maharani-maroon)' }}>{inspectingItem.productNo}</span>
                <h3 style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: 800 }}>{inspectingItem.name}</h3>
              </div>
              <button type="button" onClick={() => setInspectingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ height: '260px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--soft-gold-line)', marginBottom: '1rem' }}>
                <img src={inspectingItem.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              <div style={{ background: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--soft-gold-line)', marginBottom: '1rem' }}>
                <div><strong>Artisan:</strong> {inspectingItem.artisanName} ({inspectingItem.artisanNo})</div>
                <div style={{ marginTop: '4px' }}><strong>Art Type:</strong> {inspectingItem.artType}</div>
                <div style={{ marginTop: '4px' }}><strong>Proposed Price:</strong> ₹{inspectingItem.price.toLocaleString('en-IN')}</div>
              </div>

              <div style={{ marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                <strong>Description:</strong>
                <p style={{ margin: '4px 0 0', color: '#4A3E36' }}>{inspectingItem.description}</p>
              </div>

              {actionSuccess && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.65rem 1rem', borderRadius: '6px', fontWeight: 700, marginBottom: '1rem' }}>
                  {actionSuccess}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--soft-gold-line)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleDecision(inspectingItem.id, 'rejected')}
                  style={{ padding: '0.55rem 1.15rem', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Reject Art
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(inspectingItem.id, 'approved')}
                  style={{ padding: '0.55rem 1.35rem', backgroundColor: '#2E7D32', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Accept &amp; Publish to Storefront
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
