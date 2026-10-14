'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  FileText,
  AlertCircle,
  Loader2,
  ChevronDown,
  Sparkles,
  Send,
  SlidersHorizontal,
} from 'lucide-react';

interface ArtisanApplication {
  applicationId: string;
  name: string;
  dob?: string;
  age?: number;
  gender?: string;
  state?: string;
  placeOfBirth?: string;
  typeOfArt?: string;
  phone?: string;
  email?: string;
  answers?: Record<string, any>;
  agreedChildLabor?: boolean;
  agreedInspection?: boolean;
  signature?: string;
  signatureDate?: string;
  status: string;
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt?: string;
}

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [applications, setApplications] = useState<ArtisanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewingApp, setViewingApp] = useState<ArtisanApplication | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<{
    app: ArtisanApplication;
    action: 'approve' | 'reject' | 'pending';
  } | null>(null);

  const [reviewNotesInput, setReviewNotesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/applications?status=' + statusFilter);
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
        if (highlightedId) {
          const match = data.applications.find((a: any) => a.applicationId === highlightedId);
          if (match) setViewingApp(match);
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleOpenConfirm = (app: ArtisanApplication, action: 'approve' | 'reject' | 'pending') => {
    setConfirmingAction({ app, action });
    setReviewNotesInput(app.reviewNotes || '');
  };

  const handleExecuteStatusChange = async () => {
    if (!confirmingAction) return;
    const { app, action } = confirmingAction;

    try {
      setActionLoading(true);
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: app.applicationId,
          action,
          reviewNotes: reviewNotesInput,
          adminEmail: 'admin@gargisaha.com',
        }),
      });
      const data = await res.json();
      if (data.success) {
        const actionLabel = action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Marked Pending';
        setToastMsg(`Application ${app.applicationId} ${actionLabel} & notification email sent!`);
        setTimeout(() => setToastMsg(null), 4000);
        setConfirmingAction(null);
        if (viewingApp && viewingApp.applicationId === app.applicationId) {
          setViewingApp({
            ...viewingApp,
            status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending',
            reviewNotes: reviewNotesInput,
          });
        }
        fetchApplications();
      } else {
        alert(data.message || 'Error updating application status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.name?.toLowerCase().includes(q) ||
      app.typeOfArt?.toLowerCase().includes(q) ||
      app.state?.toLowerCase().includes(q) ||
      app.applicationId?.toLowerCase().includes(q) ||
      app.phone?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q)
    );
  });

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#FFF3E0', text: '#E65100' },
    approved: { bg: '#E8F5E9', text: '#2E7D32' },
    rejected: { bg: '#FFEBEE', text: '#C62828' },
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 10000,
            background: 'var(--maharani-maroon)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(122, 35, 49, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.95rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Admin Curation Desk
          </span>
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
          Artisan Questionnaire Applications <span style={{ color: 'var(--maharani-maroon)' }}>Inbox</span>
        </h1>
        <p style={{ margin: '0.4rem 0 0', color: '#4A3E36', fontSize: '1.05rem', lineHeight: 1.55 }}>
          Review the complete 14-question heritage submissions sent by artisans to join House of Gargi. Verify child labor agreements and approve logins.
        </p>
      </div>

      {/* Search & Status Filters Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          padding: '12px 16px',
          background: '#FFFFFF',
          border: '1px solid var(--soft-gold-line)',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(43,31,24,0.02)',
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.5rem 1.15rem',
                borderRadius: '6px',
                border: statusFilter === st ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                background: statusFilter === st ? 'var(--maharani-maroon)' : '#FAF7F2',
                color: statusFilter === st ? '#FFFFFF' : 'var(--ink-brown)',
                fontWeight: statusFilter === st ? 700 : 600,
                fontSize: '0.92rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={16} color="var(--stone-taupe)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, craft, state, or ID..."
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

      {/* ════════════ APPLICATIONS TABLE WITH EXACT REQUESTED COLUMN HEADERS ════════════ */}
      {loading ? (
        <AdminPageLoadingBlock minHeight="240px" message="Loading artisan applications..." />
      ) : filteredApps.length === 0 ? (
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
              color: 'var(--gargi-gold)',
            }}
          >
            <Inbox size={26} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            No Applications Found
          </h3>
          <p style={{ margin: 0, fontSize: '1rem', color: '#5C5043' }}>
            {statusFilter !== 'all'
              ? `No artisan applications currently marked as '${statusFilter}'.`
              : 'The artisan applications inbox is empty.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                  <th style={{ padding: '1rem 1.4rem', width: '180px' }}>Art No.</th>
                  <th style={{ padding: '1rem 1.4rem' }}>Name</th>
                  <th style={{ padding: '1rem 1.4rem' }}>Phone Number</th>
                  <th style={{ padding: '1rem 1.4rem', width: '150px' }}>Status</th>
                  <th style={{ padding: '1rem 1.4rem', textAlign: 'right', width: '280px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const currentBadge = statusColors[app.status] || { bg: '#EEEEEE', text: '#424242' };

                  return (
                    <tr
                      key={app.applicationId}
                      style={{
                        borderBottom: '1px solid #F0E8DC',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF7F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      {/* 1. Art No. */}
                      <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            color: 'var(--maharani-maroon)',
                            background: 'rgba(122, 35, 49, 0.08)',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '6px',
                            letterSpacing: '0.04em',
                            display: 'inline-block',
                          }}
                        >
                          {app.applicationId}
                        </span>
                      </td>

                      {/* 2. Name */}
                      <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1.08rem' }}>
                          {app.name}
                        </span>
                      </td>

                      {/* 3. Phone Number */}
                      <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ink-brown)', fontSize: '0.98rem' }}>
                          {app.phone || 'N/A'}
                        </span>
                      </td>

                      {/* 4. Status */}
                      <td style={{ padding: '1.1rem 1.4rem', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            padding: '0.35rem 0.85rem',
                            borderRadius: 9999,
                            background: currentBadge.bg,
                            color: currentBadge.text,
                            display: 'inline-block',
                          }}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* 5. The Two Buttons */}
                      <td style={{ padding: '1.1rem 1.4rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                          {/* Button 1: View Details */}
                          <button
                            type="button"
                            onClick={() => setViewingApp(app)}
                            style={{
                              padding: '0.55rem 1.15rem',
                              borderRadius: '6px',
                              border: '1.5px solid var(--soft-gold-line)',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--ink-brown)',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.18s ease',
                            }}
                          >
                            <FileText size={15} />
                            <span>View Details</span>
                          </button>

                          {/* Button 2: Actions Dropdown Selector */}
                          <select
                            value={app.status}
                            onChange={(e) => {
                              const val = e.target.value as 'approve' | 'reject' | 'pending';
                              if (val !== app.status) {
                                handleOpenConfirm(app, val);
                              }
                            }}
                            style={{
                              padding: '0.55rem 1.15rem',
                              borderRadius: '6px',
                              border: '1.5px solid var(--maharani-maroon)',
                              backgroundColor: 'var(--maharani-maroon)',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              outline: 'none',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 2px 6px rgba(122, 35, 49, 0.2)',
                            }}
                          >
                            <option value="" disabled style={{ color: '#231812', background: '#FFFFFF' }}>Action / Change Status ▾</option>
                            <option value="approved" style={{ color: '#2E7D32', background: '#FFFFFF', fontWeight: 700 }}>✓ Approve Application</option>
                            <option value="rejected" style={{ color: '#C62828', background: '#FFFFFF', fontWeight: 700 }}>✕ Reject Application</option>
                            <option value="pending" style={{ color: '#E65100', background: '#FFFFFF', fontWeight: 700 }}>⟳ Mark as Pending</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════ DIALOG MODAL 1: VIEW DETAILS (FULL ARTISAN DOSSIER) ════════════ */}
      {viewingApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setViewingApp(null)}
        >
          <div
            style={{
              width: '760px',
              maxWidth: '92vw',
              maxHeight: '90vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dossier Header */}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                backgroundColor: '#FAF7F2',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
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
                    {viewingApp.applicationId}
                  </span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 9999,
                      background: (statusColors[viewingApp.status] || { bg: '#EEEEEE' }).bg,
                      color: (statusColors[viewingApp.status] || { text: '#424242' }).text,
                    }}
                  >
                    {viewingApp.status}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.4rem 0 0', color: 'var(--ink-brown)' }}>
                  {viewingApp.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingApp(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--ink-brown)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Dossier Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Profile Overview */}
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '10px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--maharani-maroon)', margin: '0 0 1rem' }}>
                  Artisan Profile &amp; Lineage
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.92rem' }}>
                  <div>
                    <span style={{ color: '#5C5043', fontSize: '0.78rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Craft / Type of Art</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{viewingApp.typeOfArt}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5C5043', fontSize: '0.78rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>State &amp; Region</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{viewingApp.placeOfBirth ? viewingApp.placeOfBirth + ', ' : ''}{viewingApp.state}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5C5043', fontSize: '0.78rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Gender &amp; Age</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{viewingApp.gender || 'Not specified'} {viewingApp.age ? '(' + viewingApp.age + ' yrs)' : ''}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5C5043', fontSize: '0.78rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{viewingApp.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5C5043', fontSize: '0.78rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{viewingApp.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5C5043', fontSize: '0.78rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Date of Birth</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{viewingApp.dob || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* 14 Heritage Questionnaire Responses */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-brown)', margin: '0 0 0.25rem' }}>
                  14-Point Heritage Questionnaire Responses
                </h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', color: '#5C5043' }}>
                  Qualitative craft, historical lineage, loom setup, and raw material answers submitted by artisan
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {Object.entries(viewingApp.answers || {}).length === 0 ? (
                    <div style={{ padding: '1rem', background: '#FAF7F2', borderRadius: '8px', color: '#5C5043', fontSize: '0.92rem' }}>
                      No qualitative answers recorded for this applicant.
                    </div>
                  ) : (
                    Object.entries(viewingApp.answers || {}).map(([key, val]: [string, any], idx) => (
                      <div
                        key={key}
                        style={{
                          padding: '1rem 1.25rem',
                          border: '1px solid var(--soft-gold-line)',
                          borderRadius: '8px',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2',
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--maharani-maroon)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Question {idx + 1}: {key}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--ink-brown)', marginTop: '0.4rem', lineHeight: 1.55 }}>
                          {typeof val === 'string' ? val : JSON.stringify(val)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ethical Agreement */}
              <div style={{ border: '1.5px solid #C8E6C9', background: '#F1F8E9', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2E7D32', fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.4rem' }}>
                  <ShieldCheck style={{ width: 22, height: 22 }} />
                  Child Labor Agreement &amp; Inspection Consent
                </div>
                <p style={{ margin: '0 0 0.85rem', fontSize: '0.92rem', color: '#33691E', lineHeight: 1.55 }}>
                  The applicant has legally certified that <strong>no child labor</strong> is engaged in their atelier and granted House of Gargi unrestricted physical inspection rights to their looms.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #DCEDC8', paddingTop: '0.75rem', fontSize: '0.88rem', color: '#1B5E20' }}>
                  <div>
                    Digital Signature: <strong>{viewingApp.signature || viewingApp.name}</strong>
                  </div>
                  <div>
                    Signed Date: <strong>{viewingApp.signatureDate || 'On file'}</strong>
                  </div>
                </div>
              </div>

              {/* Review Notes History if present */}
              {viewingApp.reviewNotes && (
                <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '10px', padding: '1.15rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Current Review Notes
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--ink-brown)', lineHeight: 1.5 }}>
                    {viewingApp.reviewNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Dossier Bottom Actions */}
            <div
              style={{
                padding: '1.25rem 2rem',
                borderTop: '1px solid var(--soft-gold-line)',
                backgroundColor: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {viewingApp.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleOpenConfirm(viewingApp, 'approve')}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--maharani-maroon)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 2px 6px rgba(122, 35, 49, 0.25)',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve Application</span>
                  </button>
                )}

                {viewingApp.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleOpenConfirm(viewingApp, 'reject')}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '6px',
                      border: '1.5px solid #EF5350',
                      backgroundColor: '#FFEBEE',
                      color: '#C62828',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <XCircle size={16} />
                    <span>Reject Application</span>
                  </button>
                )}

                {viewingApp.status !== 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleOpenConfirm(viewingApp, 'pending')}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '6px',
                      border: '1px solid var(--soft-gold-line)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--ink-brown)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    Mark as Pending
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewingApp(null)}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
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

      {/* ════════════ DIALOG MODAL 2: CONFIRMATION WITH BRAND COLORS & EMAIL NOTIFICATION ════════════ */}
      {confirmingAction && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setConfirmingAction(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
              padding: '2rem 2.25rem',
              maxWidth: '540px',
              width: '100%',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Medallion */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF7F2',
                  border: '1.5px solid #231812',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {confirmingAction.action === 'approve' ? (
                  <CheckCircle2 size={26} color="#2E7D32" strokeWidth={2} />
                ) : confirmingAction.action === 'reject' ? (
                  <XCircle size={26} color="#C62828" strokeWidth={2} />
                ) : (
                  <Clock size={26} color="#E65100" strokeWidth={2} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink-brown)', margin: 0, lineHeight: 1.25 }}>
                  {confirmingAction.action === 'approve'
                    ? 'Confirm Application Approval'
                    : confirmingAction.action === 'reject'
                    ? 'Confirm Application Rejection'
                    : 'Reset to Pending Review'}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#5C5043', marginTop: '4px' }}>
                  Applicant: <strong>{confirmingAction.app.name}</strong> ({confirmingAction.app.applicationId})
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmingAction(null)}
                style={{
                  width: '32px',
                  height: '32px',
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
                <X size={16} />
              </button>
            </div>

            {/* Email Dispatch Notice */}
            <div
              style={{
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '8px',
                padding: '1rem 1.15rem',
                marginBottom: '1.25rem',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                color: 'var(--ink-brown)',
              }}
            >
              {confirmingAction.action === 'approve' ? (
                <>
                  An official <strong>Welcome &amp; Onboarding Email</strong> will be automatically dispatched to{' '}
                  <strong style={{ color: 'var(--maharani-maroon)' }}>{confirmingAction.app.email}</strong>, providing login instructions to access the Artisan Atelier Portal.
                </>
              ) : confirmingAction.action === 'reject' ? (
                <>
                  An official <strong>Application Decision Notification</strong> will be dispatched to{' '}
                  <strong style={{ color: 'var(--maharani-maroon)' }}>{confirmingAction.app.email}</strong> respectfully communicating the curation desk&apos;s decision.
                </>
              ) : (
                <>
                  The status of application <strong>{confirmingAction.app.applicationId}</strong> will be reset to <strong>Pending</strong> for further review.
                </>
              )}
            </div>

            {/* Curation Review Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#5C5043', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {confirmingAction.action === 'reject'
                  ? 'Curation Feedback (Included in Rejection Email):'
                  : 'Curation Desk Notes (Internal Record):'}
              </label>
              <textarea
                rows={3}
                placeholder={
                  confirmingAction.action === 'reject'
                    ? 'Optional reason or guidance for the artisan...'
                    : 'Notes on loom audit, fiber purity, or onboarding terms...'
                }
                value={reviewNotesInput}
                onChange={(e) => setReviewNotesInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1.5px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: 'var(--ink-brown)',
                  background: '#FAF7F2',
                  resize: 'vertical',
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Modal Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
              <button
                type="button"
                onClick={() => setConfirmingAction(null)}
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
                disabled={actionLoading}
                onClick={handleExecuteStatusChange}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor:
                    confirmingAction.action === 'approve'
                      ? 'var(--maharani-maroon)'
                      : confirmingAction.action === 'reject'
                      ? '#C62828'
                      : 'var(--ink-brown)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing &amp; Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>
                      {confirmingAction.action === 'approve'
                        ? 'Confirm & Send Approval Email'
                        : confirmingAction.action === 'reject'
                        ? 'Confirm & Send Rejection Email'
                        : 'Confirm Status Change'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
