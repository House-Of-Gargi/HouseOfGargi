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
  FileText,
  X,
  ExternalLink,
  ChevronRight,
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

  // Modals state
  const [viewingCommission, setViewingCommission] = useState<BespokeCommission | null>(null);
  const [assigningCommission, setAssigningCommission] = useState<BespokeCommission | null>(null);
  const [artisanInput, setArtisanInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Commission ${id} moved to ${newStatus.replace('_', ' ')}`);
        setTimeout(() => setToastMessage(null), 3000);
        if (viewingCommission && viewingCommission.request_number === id) {
          setViewingCommission({ ...viewingCommission, status: newStatus });
        }
        loadCommissions();
      }
    } catch (err) {
      console.error('Failed updating commission status:', err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSaveArtisanAssignment() {
    if (!assigningCommission) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/bespoke', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assigningCommission.request_number,
          assignedArtisan: artisanInput,
          adminNotes: notesInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Artisan updated for ${assigningCommission.request_number}`);
        setTimeout(() => setToastMessage(null), 3000);
        setAssigningCommission(null);
        if (viewingCommission && viewingCommission.request_number === assigningCommission.request_number) {
          setViewingCommission({
            ...viewingCommission,
            assigned_artisan: artisanInput,
            admin_notes: notesInput,
          });
        }
        loadCommissions();
      }
    } catch (err) {
      console.error('Failed updating artisan assignment:', err);
    } finally {
      setUpdating(false);
    }
  }

  const openAssignModal = (comm: BespokeCommission) => {
    setAssigningCommission(comm);
    setArtisanInput(comm.assigned_artisan || '');
    setNotesInput(comm.admin_notes || '');
  };

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

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#FFF3E0', text: '#E65100' },
    contacted: { bg: '#E3F2FD', text: '#1565C0' },
    in_consultation: { bg: '#F3E5F5', text: '#7B1FA2' },
    in_production: { bg: '#E8F5E9', text: '#2E7D32' },
    completed: { bg: '#E8F5E9', text: '#1B5E20' },
    cancelled: { bg: '#FFEBEE', text: '#C62828' },
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
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
            fontSize: '0.95rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--soft-gold-line)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--maharani-maroon)',
              }}
            >
              Private Atelier Commissions
            </span>
          </div>
          <h1
            style={{
              fontSize: '2.35rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--ink-brown)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Bespoke Commissions <span style={{ color: 'var(--maharani-maroon)' }}>Queue</span>
          </h1>
          <p style={{ margin: '0.4rem 0 0', color: '#4A3E36', fontSize: '1.05rem', lineHeight: 1.55 }}>
            Manage custom bridal lehenga, heritage saree, and royal jewellery orders submitted by patrons.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCommissions}
          style={{
            padding: '0.6rem 1.25rem',
            fontSize: '0.92rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '6px',
            color: 'var(--ink-brown)',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(43,31,24,0.03)',
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ════════════ 3 METRIC BOXES WITH DASHBOARD ICON MEDALLION STYLE ════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Box 1: Pending Curation */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.75rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '155px',
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
          {/* Dashboard Icon Medallion */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <AlertCircle style={{ width: 22, height: 22, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.92rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}
            >
              Pending Curation
            </div>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#7A2331',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#5C5043', marginTop: '0.35rem' }}>
              Awaiting initial patron consultation
            </div>
          </div>
        </div>

        {/* Box 2: In Consultation */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.75rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '155px',
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
          {/* Dashboard Icon Medallion */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Clock style={{ width: 22, height: 22, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.92rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}
            >
              In Consultation
            </div>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#B88E18',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {inConsultCount}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#5C5043', marginTop: '0.35rem' }}>
              Artisan concierge actively discussing vision
            </div>
          </div>
        </div>

        {/* Box 3: Completed / Delivered */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.75rem 1.65rem',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '155px',
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
          {/* Dashboard Icon Medallion */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #231812',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <CheckCircle2 style={{ width: 22, height: 22, color: '#231812' }} strokeWidth={1.8} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.92rem',
                color: '#5C5043',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}
            >
              Completed / Delivered
            </div>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#2E7D32',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {completedCount}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#5C5043', marginTop: '0.35rem' }}>
              Bespoke masterpieces fulfilled
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div
        style={{
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
        }}
      >
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
                padding: '0.5rem 1.15rem',
                borderRadius: '6px',
                border: statusFilter === tab.id ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                background: statusFilter === tab.id ? 'var(--maharani-maroon)' : '#FAF7F2',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--ink-brown)',
                fontWeight: statusFilter === tab.id ? 700 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={16} color="var(--stone-taupe)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search patron, phone, id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.25rem',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '6px',
              fontSize: '0.95rem',
              background: '#FAF7F2',
              outline: 'none',
              color: 'var(--ink-brown)',
            }}
          />
        </div>
      </div>

      {/* ════════════ SINGLE-ROW COMPACT COMMISSIONS LIST ════════════ */}
      {loading ? (
        <AdminPageLoadingBlock minHeight="240px" message="Loading bespoke commissions queue..." />
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            color: '#5C5043',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FAF7F2',
              border: '1.5px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Sparkles size={26} color="var(--gargi-gold)" />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            No Commissions Found
          </h3>
          <p style={{ margin: 0, fontSize: '1rem', color: '#5C5043', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
            {statusFilter !== 'all'
              ? `There are currently no commissions with status '${statusFilter.replace('_', ' ')}'.`
              : 'The bespoke commission queue is empty. New client orders will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {filtered.map((comm) => {
            const currentBadge = statusColors[comm.status] || { bg: '#EEEEEE', text: '#424242' };

            return (
              <div
                key={comm.request_number}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.65rem',
                  boxShadow: '0 2px 10px rgba(43,31,24,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gargi-gold)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(43,31,24,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--soft-gold-line)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(43,31,24,0.03)';
                }}
              >
                {/* Left Section: Single-Row Summary Elements */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', flex: 1, minWidth: '320px' }}>
                  {/* Request ID Pill */}
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
                      flexShrink: 0,
                    }}
                  >
                    {comm.request_number}
                  </span>

                  {/* Patron Name & Contact */}
                  <div style={{ minWidth: '180px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1.08rem', lineHeight: 1.2 }}>
                      {comm.name}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#5C5043', marginTop: '3px' }}>
                      {comm.phone}
                    </div>
                  </div>

                  {/* Garment & Fabric */}
                  <div style={{ minWidth: '170px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '0.98rem' }}>
                      {comm.category}
                    </div>
                    <div style={{ fontSize: '0.86rem', color: '#5C5043', marginTop: '2px' }}>
                      {comm.material ? `${comm.material} • ` : ''}{comm.size || 'Custom size'}
                    </div>
                  </div>

                  {/* Status Pill Badge */}
                  <span
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 9999,
                      background: currentBadge.bg,
                      color: currentBadge.text,
                      flexShrink: 0,
                    }}
                  >
                    {comm.status.replace('_', ' ')}
                  </span>

                  {/* Assigned Artisan pill */}
                  {comm.assigned_artisan ? (
                    <span
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--ink-brown)',
                        fontWeight: 600,
                        background: '#FAF7F2',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--soft-gold-line)',
                        flexShrink: 0,
                      }}
                    >
                      Artisan: <strong style={{ color: 'var(--maharani-maroon)' }}>{comm.assigned_artisan}</strong>
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#5C5043', fontStyle: 'italic', flexShrink: 0 }}>
                      Unassigned
                    </span>
                  )}
                </div>

                {/* Right Section: The Two Required Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {/* Button 1: Assign Artisan */}
                  <button
                    type="button"
                    onClick={() => openAssignModal(comm)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '6px',
                      border: '1.5px solid var(--maharani-maroon)',
                      backgroundColor: 'var(--maharani-maroon)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.18s ease',
                      boxShadow: '0 2px 6px rgba(122, 35, 49, 0.2)',
                    }}
                  >
                    <Scissors size={15} />
                    <span>Assign Artisan</span>
                  </button>

                  {/* Button 2: View Details */}
                  <button
                    type="button"
                    onClick={() => setViewingCommission(comm)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '6px',
                      border: '1.5px solid var(--soft-gold-line)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--ink-brown)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <FileText size={15} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════ DIALOG MODAL 1: VIEW DETAILS (ALL RELATED CONTENT) ════════════ */}
      {viewingCommission && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setViewingCommission(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '2rem 2.25rem',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              border: '1.5px solid var(--soft-gold-line)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: 'var(--maharani-maroon)',
                      background: 'rgba(122, 35, 49, 0.08)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                    }}
                  >
                    {viewingCommission.request_number}
                  </span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 9999,
                      background: (statusColors[viewingCommission.status] || { bg: '#EEEEEE' }).bg,
                      color: (statusColors[viewingCommission.status] || { text: '#424242' }).text,
                    }}
                  >
                    {viewingCommission.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#5C5043', marginTop: '0.35rem' }}>
                  Submitted on {new Date(viewingCommission.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingCommission(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--ink-brown)',
                }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Section 1: Patron Profile */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.65rem' }}>
                Patron Information
              </div>
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '10px', padding: '1.15rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-brown)', marginTop: '2px' }}>{viewingCommission.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>
                    <a href={`tel:${viewingCommission.phone}`} style={{ color: 'var(--maharani-maroon)', textDecoration: 'none' }}>
                      {viewingCommission.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 600, marginTop: '2px' }}>
                    <a href={`mailto:${viewingCommission.email}`} style={{ color: 'var(--ink-brown)', textDecoration: 'none' }}>
                      {viewingCommission.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Garment Specifications */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.65rem' }}>
                Couture Specifications
              </div>
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '10px', padding: '1.15rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Garment Category</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-brown)', marginTop: '2px' }}>{viewingCommission.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Fabric / Craft</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-brown)', marginTop: '2px' }}>{viewingCommission.material || 'Heirloom Handloom'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Size & Measurements</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-brown)', marginTop: '2px' }}>{viewingCommission.size || 'Custom Atelier Sizing'}</div>
                </div>
              </div>
            </div>

            {/* Section 3: Patron Inspiration & Vision Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.65rem' }}>
                Patron Inspiration &amp; Bespoke Vision
              </div>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid var(--soft-gold-line)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontSize: '1.02rem',
                  color: 'var(--ink-brown)',
                  lineHeight: 1.65,
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                {viewingCommission.details}
              </div>
            </div>

            {/* Section 4: Artisan & Concierge Assignment Status */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.65rem' }}>
                Artisan Assignment &amp; Internal Notes
              </div>
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '10px', padding: '1.15rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#5C5043', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Artisan Guild: </span>
                    <strong style={{ fontSize: '1.05rem', color: viewingCommission.assigned_artisan ? 'var(--maharani-maroon)' : '#5C5043' }}>
                      {viewingCommission.assigned_artisan || 'None yet assigned'}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setViewingCommission(null);
                      openAssignModal(viewingCommission);
                    }}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '4px',
                      border: '1px solid var(--maharani-maroon)',
                      background: '#FFFFFF',
                      color: 'var(--maharani-maroon)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    Change Artisan
                  </button>
                </div>

                {viewingCommission.admin_notes && (
                  <div style={{ fontSize: '0.95rem', color: 'var(--ink-brown)', paddingTop: '0.5rem', borderTop: '1px dashed #E5DACB' }}>
                    <span style={{ fontWeight: 700, color: '#5C5043' }}>Concierge Curation Notes: </span>
                    {viewingCommission.admin_notes}
                  </div>
                )}
              </div>
            </div>

            {/* Status Stepper Buttons */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.65rem' }}>
                Advance Commission Workflow
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={updating || viewingCommission.status === 'in_consultation'}
                  onClick={() => handleUpdateStatus(viewingCommission.request_number, 'in_consultation')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--soft-gold-line)',
                    background: viewingCommission.status === 'in_consultation' ? '#F3E5F5' : '#FFFFFF',
                    color: viewingCommission.status === 'in_consultation' ? '#7B1FA2' : 'var(--ink-brown)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: viewingCommission.status === 'in_consultation' ? 'default' : 'pointer',
                  }}
                >
                  In Consultation
                </button>

                <button
                  type="button"
                  disabled={updating || viewingCommission.status === 'in_production'}
                  onClick={() => handleUpdateStatus(viewingCommission.request_number, 'in_production')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--soft-gold-line)',
                    background: viewingCommission.status === 'in_production' ? '#E8F5E9' : '#FFFFFF',
                    color: viewingCommission.status === 'in_production' ? '#2E7D32' : 'var(--ink-brown)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: viewingCommission.status === 'in_production' ? 'default' : 'pointer',
                  }}
                >
                  In Production
                </button>

                <button
                  type="button"
                  disabled={updating || viewingCommission.status === 'completed'}
                  onClick={() => handleUpdateStatus(viewingCommission.request_number, 'completed')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--soft-gold-line)',
                    background: viewingCommission.status === 'completed' ? '#E8F5E9' : '#FFFFFF',
                    color: viewingCommission.status === 'completed' ? '#1B5E20' : 'var(--ink-brown)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: viewingCommission.status === 'completed' ? 'default' : 'pointer',
                  }}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
              <button
                type="button"
                onClick={() => {
                  setViewingCommission(null);
                  openAssignModal(viewingCommission);
                }}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--maharani-maroon)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Scissors size={15} />
                <span>Assign Artisan</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingCommission(null)}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '6px',
                  backgroundColor: '#FAF7F2',
                  color: 'var(--ink-brown)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: '1px solid var(--soft-gold-line)',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ DIALOG MODAL 2: ASSIGN ARTISAN ════════════ */}
      {assigningCommission && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setAssigningCommission(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '2rem 2.25rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              border: '1.5px solid var(--soft-gold-line)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink-brown)', margin: 0 }}>
                  Assign Master Artisan
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#5C5043', marginTop: '2px' }}>
                  Commission: <strong>{assigningCommission.request_number}</strong> ({assigningCommission.name})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssigningCommission(null)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--ink-brown)',
                }}
              >
                <X size={17} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#5C5043', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Master Artisan / Guild Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramdas Mishra Pit Loom Guild"
                  value={artisanInput}
                  onChange={(e) => setArtisanInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1.5px solid var(--soft-gold-line)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    color: 'var(--ink-brown)',
                    background: '#FAF7F2',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#5C5043', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Concierge Curation Notes:
                </label>
                <textarea
                  rows={3}
                  placeholder="Internal instructions on zari density, delivery deadlines, dyeing tests..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1.5px solid var(--soft-gold-line)',
                    borderRadius: '8px',
                    fontSize: '0.98rem',
                    outline: 'none',
                    color: 'var(--ink-brown)',
                    background: '#FAF7F2',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAssigningCommission(null)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '6px',
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSaveArtisanAssignment}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(122, 35, 49, 0.25)',
                  }}
                >
                  {updating ? 'Saving...' : 'Save Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
