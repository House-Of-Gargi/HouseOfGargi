'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';
import {
  Sparkles,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  User,
  MessageSquare,
  FileText
} from 'lucide-react';

interface BespokeCommission {
  id?: string;
  request_number: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  material?: string;
  size?: string;
  details: string;
  status: string;
  assigned_artisan?: string;
  admin_notes?: string;
  created_at: string;
  reviewed_by?: string;
}

export default function AdminBespokePage() {
  const [commissions, setCommissions] = useState<BespokeCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommission, setSelectedCommission] = useState<BespokeCommission | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [artisanInput, setArtisanInput] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function loadCommissions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bespoke${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      const data = await res.json();
      if (data.success && data.commissions) {
        setCommissions(data.commissions);
      }
    } catch (err) {
      console.error('Failed loading bespoke commissions:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommissions();
  }, [statusFilter]);

  async function handleUpdateStatus(id: string, newStatus: string) {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/bespoke', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          adminNotes: notesInput || selectedCommission?.admin_notes,
          assignedArtisan: artisanInput || selectedCommission?.assigned_artisan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Commission ${id} updated to ${newStatus}`);
        setTimeout(() => setToastMessage(null), 3000);
        setSelectedCommission(null);
        loadCommissions();
      }
    } catch (err) {
      console.error('Failed updating commission status:', err);
    } finally {
      setUpdating(false);
    }
  }

  const filtered = commissions.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.request_number.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const pendingCount = commissions.filter((c) => c.status === 'pending').length;
  const inConsultCount = commissions.filter((c) => c.status === 'in_consultation' || c.status === 'contacted').length;
  const completedCount = commissions.filter((c) => c.status === 'completed').length;

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--maharani-maroon)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(122, 35, 49, 0.35)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 14,
          fontWeight: 600,
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--soft-gold-line)',
        paddingBottom: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--maharani-maroon)',
              fontFamily: 'var(--font-nav)',
            }}>
              Private Atelier Commissions
            </span>
            <span style={{ fontSize: '0.65rem', background: '#FFF3E0', color: '#B88E18', padding: '0.15rem 0.5rem', borderRadius: 2, fontWeight: 700 }}>
              Concierge Desk
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.35rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--ink-brown)',
            margin: 0,
          }}>
            Bespoke Commissions <span style={{ color: 'var(--maharani-maroon)' }}>Queue</span>
          </h1>
          <p style={{ margin: '4px 0 0', color: '#4A3E36', fontSize: '1.05rem', fontFamily: 'var(--font-subtitle)' }}>
            Manage custom bridal lehenga, heritage saree, and royal jewellery orders submitted by patrons.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCommissions}
          className="btn btn--outline"
          style={{ padding: '10px 18px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 3 Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '1.4rem 1.5rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
            e.currentTarget.style.borderColor = 'var(--gargi-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(43,31,24,0.03)';
            e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--stone-taupe)', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <span>Pending Curation</span>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={17} color="#7A2331" />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#7A2331', marginTop: '0.4rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.92rem', color: '#5C5043', color: 'var(--stone-taupe)', marginTop: '0.35rem' }}>Awaiting initial patron consultation</div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '1.4rem 1.5rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
            e.currentTarget.style.borderColor = 'var(--gargi-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(43,31,24,0.03)';
            e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--stone-taupe)', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <span>In Consultation</span>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={17} color="#B88E18" />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#B88E18', marginTop: '0.4rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {inConsultCount}
          </div>
          <div style={{ fontSize: '0.92rem', color: '#5C5043', color: 'var(--stone-taupe)', marginTop: '0.35rem' }}>Artisan concierge actively discussing vision</div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '1.4rem 1.5rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            transition: 'all 0.22s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,31,24,0.06)';
            e.currentTarget.style.borderColor = 'var(--gargi-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(43,31,24,0.03)';
            e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--stone-taupe)', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <span>Completed / Delivered</span>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={17} color="#2E7D32" />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2E7D32', marginTop: '0.4rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.92rem', color: '#5C5043', color: 'var(--stone-taupe)', marginTop: '0.35rem' }}>Bespoke masterpieces fulfilled</div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '1.5rem',
        padding: '12px 16px',
        background: '#FFFFFF',
        border: '1px solid var(--soft-gold-line)',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(43,31,24,0.02)',
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Commissions' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_consultation', label: 'In Consultation' },
            { id: 'in_production', label: 'In Production' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: statusFilter === tab.id ? 'var(--maharani-maroon)' : 'var(--soft-gold-line)',
                background: statusFilter === tab.id ? 'var(--maharani-maroon)' : '#FFFFFF',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--stone-taupe)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--soft-gold-line)', borderRadius: 4, padding: '6px 12px', minWidth: '240px' }}>
          <Search size={14} color="var(--stone-taupe)" />
          <input
            type="text"
            placeholder="Search patron, phone, id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '15px', width: '100%', background: 'transparent' }}
          />
        </div>
      </div>

      {/* Commissions List */}
      {loading ? (
        <AdminPageLoadingBlock minHeight="220px" message="Loading bespoke commissions queue..." />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: 6 }}>
          <Sparkles size={36} color="var(--gargi-gold)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-brown)', fontSize: '1.3rem', margin: 0 }}>
            No bespoke commissions found
          </h3>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '0.9rem', marginTop: '6px' }}>
            New custom requests submitted through /bespoke will appear here immediately for concierge processing.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((comm) => {
            const statusColors: Record<string, { bg: string; text: string }> = {
              pending: { bg: '#FFF3E0', text: '#E65100' },
              contacted: { bg: '#E3F2FD', text: '#1565C0' },
              in_consultation: { bg: '#F3E5F5', text: '#7B1FA2' },
              in_production: { bg: '#E8F5E9', text: '#2E7D32' },
              completed: { bg: '#E8F5E9', text: '#1B5E20' },
              cancelled: { bg: '#FFEBEE', text: '#C62828' },
            };
            const currentBadge = statusColors[comm.status] || { bg: '#EEEEEE', text: '#424242' };

            return (
              <div
                key={comm.request_number}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Card Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      color: 'var(--maharani-maroon)',
                      background: 'rgba(122, 35, 49, 0.08)',
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}>
                      {comm.request_number}
                    </span>
                    <span style={{ fontSize: '15px', color: 'var(--stone-taupe)' }}>
                      {new Date(comm.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: currentBadge.bg,
                    color: currentBadge.text,
                  }}>
                    {comm.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Patron & Garment Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  background: '#FAF7F2',
                  padding: '14px 16px',
                  borderRadius: 4,
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 700 }}>Patron</div>
                    <div style={{ fontWeight: 600, color: 'var(--ink-brown)', fontSize: '14px', marginTop: '2px' }}>{comm.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 700 }}>Contact</div>
                    <div style={{ fontSize: '15px', color: 'var(--ink-brown)', marginTop: '2px' }}>
                      <a href={`tel:${comm.phone}`} style={{ color: 'var(--maharani-maroon)', textDecoration: 'none' }}>{comm.phone}</a>
                      <span style={{ margin: '0 6px', color: 'var(--soft-gold-line)' }}>•</span>
                      <a href={`mailto:${comm.email}`} style={{ color: 'var(--ink-brown)', textDecoration: 'none' }}>{comm.email}</a>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 700 }}>Garment & Fabric</div>
                    <div style={{ fontWeight: 600, color: 'var(--ink-brown)', fontSize: '13.5px', marginTop: '2px' }}>
                      {comm.category} {comm.material ? `(${comm.material})` : ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 700 }}>Size / Measurements</div>
                    <div style={{ fontSize: '15px', color: 'var(--ink-brown)', marginTop: '2px' }}>
                      {comm.size || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Details / Inspiration */}
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    Patron Inspiration & Notes:
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--ink-brown)',
                    lineHeight: 1.6,
                    background: '#FFFFFF',
                    border: '1px solid var(--soft-gold-line)',
                    padding: '10px 14px',
                    borderRadius: 4,
                  }}>
                    {comm.details}
                  </div>
                </div>

                {/* Assigned Artisan / Concierge Notes if existing */}
                {(comm.assigned_artisan || comm.admin_notes) && (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12.5px', background: '#F8F9FA', padding: '10px 14px', borderRadius: 4 }}>
                    {comm.assigned_artisan && (
                      <div>
                        <strong>Assigned Artisan:</strong> <span style={{ color: 'var(--gargi-gold)', fontWeight: 600 }}>{comm.assigned_artisan}</span>
                      </div>
                    )}
                    {comm.admin_notes && (
                      <div>
                        <strong>Concierge Note:</strong> <span>{comm.admin_notes}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Actions Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(228, 211, 174, 0.4)',
                }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {comm.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(comm.request_number, 'in_consultation')}
                        disabled={updating}
                        className="btn btn--primary"
                        style={{ padding: '7px 14px', fontSize: '12px' }}
                      >
                        Start Consultation
                      </button>
                    )}
                    {comm.status === 'in_consultation' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(comm.request_number, 'in_production')}
                        disabled={updating}
                        className="btn btn--primary"
                        style={{ padding: '7px 14px', fontSize: '12px' }}
                      >
                        Move to Production
                      </button>
                    )}
                    {comm.status === 'in_production' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(comm.request_number, 'completed')}
                        disabled={updating}
                        style={{
                          padding: '7px 14px',
                          fontSize: '12px',
                          background: '#2E7D32',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 4,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Mark Completed
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCommission(comm);
                        setNotesInput(comm.admin_notes || '');
                        setArtisanInput(comm.assigned_artisan || '');
                      }}
                      className="btn btn--outline"
                      style={{ padding: '7px 14px', fontSize: '12px' }}
                    >
                      Edit Notes / Assign Artisan
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--stone-taupe)' }}>
                    Reviewed by: <strong>{comm.reviewed_by || 'Unassigned'}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Concierge Notes & Artisan Assignment Modal */}
      {selectedCommission && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setSelectedCommission(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--ink-brown)', margin: '0 0 16px' }}>
              Process Commission: {selectedCommission.request_number}
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--stone-taupe)', marginBottom: '6px' }}>
                Assigned Artisan / Guild
              </label>
              <input
                type="text"
                placeholder="e.g. Master Ramdas Mishra (Varanasi)"
                value={artisanInput}
                onChange={(e) => setArtisanInput(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--soft-gold-line)', borderRadius: 4, fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--stone-taupe)', marginBottom: '6px' }}>
                Internal Concierge Consultation Notes
              </label>
              <textarea
                rows={4}
                placeholder="Notes on client budget, custom embroidery motifs, delivery timeline..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--soft-gold-line)', borderRadius: 4, fontSize: '14px' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedCommission(null)}
                className="btn btn--outline"
                style={{ padding: '10px 18px', fontSize: '15px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCommission.request_number, selectedCommission.status)}
                disabled={updating}
                className="btn btn--primary"
                style={{ padding: '10px 22px', fontSize: '15px' }}
              >
                {updating ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
