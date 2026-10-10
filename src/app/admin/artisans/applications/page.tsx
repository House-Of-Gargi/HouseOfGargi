'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
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
          if (match) setSelectedApp(match);
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

  const handleStatusChange = async (action: 'approve' | 'reject' | 'under_review') => {
    if (!selectedApp) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.applicationId,
          action,
          reviewNotes,
          adminEmail: 'admin@gargisaha.com',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg('Application ' + selectedApp.applicationId + ' marked as ' + action.toUpperCase() + '!');
        setTimeout(() => setToastMsg(null), 4000);
        setSelectedApp(null);
        setReviewNotes('');
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
      app.applicationId?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 100,
            background: 'var(--maharani-maroon)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-nav)',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 style={{ width: 18, height: 18 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Admin Curation Desk
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Artisan Questionnaire Applications Inbox
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Review the complete 14-question heritage submissions sent by artisans to join House of Gargi. Verify child labor agreements and approve logins.
        </p>
      </div>

      {/* Search & Status Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#FAF7F2', padding: '0.3rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)' }}>
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 2,
                border: 'none',
                background: statusFilter === st ? 'var(--maharani-maroon)' : 'transparent',
                color: statusFilter === st ? '#FFFFFF' : 'var(--ink-brown)',
                fontWeight: statusFilter === st ? 700 : 500,
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <Search style={{ position: 'absolute', left: 10, top: 11, width: 16, height: 16, color: 'var(--stone-taupe)' }} />
          <input
            type="text"
            placeholder="Search by name, craft, state, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.2rem',
              borderRadius: 2,
              border: '1.5px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              fontSize: '0.84rem',
              color: 'var(--ink-brown)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Applications Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 8px rgba(43,31,24,0.04)' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <Loader2 style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem', color: 'var(--maharani-maroon)' }} />
            Loading artisan submissions...
          </div>
        ) : filteredApps.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)', background: '#FAF7F2' }}>
            No artisan applications found for this filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Application ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Artisan Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Craft / Specialty</th>
                  <th style={{ padding: '0.85rem 1rem' }}>State & Origin</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Phone & Contact</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Child Labor Agreement</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr
                    key={app.applicationId}
                    style={{
                      borderBottom: '1px solid #F0E8DC',
                      backgroundColor: selectedApp?.applicationId === app.applicationId ? '#FBF6EE' : '#FFFFFF',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                      {app.applicationId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                      {app.name}
                      {app.gender && <span style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)', display: 'block' }}>{app.gender} {app.age ? '• ' + app.age + ' yrs' : ''}</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--ink-brown)' }}>
                      {app.typeOfArt || 'Master Handloom'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>
                      {app.state}
                      {app.placeOfBirth && <span style={{ display: 'block', fontSize: '0.72rem' }}>{app.placeOfBirth}</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ color: 'var(--ink-brown)', fontWeight: 500 }}>{app.phone}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--stone-taupe)' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {app.agreedChildLabor ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#1B5E20', fontSize: '0.75rem', fontWeight: 700 }}>
                          <ShieldCheck style={{ width: 14, height: 14 }} />
                          Verified
                        </span>
                      ) : (
                        <span style={{ color: '#B71C1C', fontSize: '0.75rem', fontWeight: 700 }}>
                          Unverified
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 2,
                          textTransform: 'uppercase',
                          backgroundColor:
                            app.status === 'approved'
                              ? '#E8F5E9'
                              : app.status === 'rejected'
                              ? '#FFEBEE'
                              : '#FFF3E0',
                          color:
                            app.status === 'approved'
                              ? '#2E7D32'
                              : app.status === 'rejected'
                              ? '#C62828'
                              : '#E65100',
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        style={{
                          padding: '0.45rem 0.95rem',
                          borderRadius: 2,
                          border: '1.5px solid var(--soft-gold-line)',
                          backgroundColor: '#FAF7F2',
                          color: 'var(--maharani-maroon)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Open Dossier &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Dossier Inspector Modal */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              width: '740px',
              maxWidth: '92vw',
              height: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dossier Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1.5px solid var(--soft-gold-line)',
                backgroundColor: '#FAF7F2',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
                  Artisan Dossier • {selectedApp.applicationId}
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, margin: '0.2rem 0 0', color: 'var(--ink-brown)' }}>
                  {selectedApp.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>

            {/* Dossier Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--maharani-maroon)', margin: '0 0 1rem' }}>
                  Artisan Profile & Background
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--stone-taupe)', fontSize: '0.72rem', display: 'block' }}>Craft / Type of Art</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{selectedApp.typeOfArt}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--stone-taupe)', fontSize: '0.72rem', display: 'block' }}>State & Region</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{selectedApp.placeOfBirth ? selectedApp.placeOfBirth + ', ' : ''}{selectedApp.state}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--stone-taupe)', fontSize: '0.72rem', display: 'block' }}>Gender & Age</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{selectedApp.gender || 'Not specified'} {selectedApp.age ? '(' + selectedApp.age + ' yrs)' : ''}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--stone-taupe)', fontSize: '0.72rem', display: 'block' }}>Phone Number</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{selectedApp.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--stone-taupe)', fontSize: '0.72rem', display: 'block' }}>Email Address</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{selectedApp.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--stone-taupe)', fontSize: '0.72rem', display: 'block' }}>Date of Birth</span>
                    <strong style={{ color: 'var(--ink-brown)' }}>{selectedApp.dob || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* 14 Questionnaire Responses */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink-brown)', margin: '0 0 0.2rem' }}>
                  Questionnaire Responses (শিল্পী প্রশ্নাবলী)
                </h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>
                  14 qualitative craft, history, and workshop questions answered by the artisan
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {Object.entries(selectedApp.answers || {}).map(([key, val]: [string, any], idx) => (
                    <div
                      key={key}
                      style={{
                        padding: '1rem',
                        border: '1px solid #EAE2D5',
                        borderRadius: 4,
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--maharani-maroon)', textTransform: 'uppercase' }}>
                        Question {idx + 1}: {key}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--ink-brown)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                        {typeof val === 'string' ? val : JSON.stringify(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ethical Agreement */}
              <div style={{ border: '1.5px solid #C8E6C9', background: '#F1F8E9', borderRadius: 4, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2E7D32', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck style={{ width: 20, height: 20 }} />
                  Child Labor Agreement & Inspection Consent
                </div>
                <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: '#33691E', lineHeight: 1.5 }}>
                  The applicant has legally certified that <strong>no child labor</strong> is engaged in their atelier and granted House of Gargi unrestricted physical inspection rights to their looms.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #DCEDC8', paddingTop: '0.75rem', fontSize: '0.82rem', color: '#1B5E20' }}>
                  <div>
                    Digital Signature: <strong>{selectedApp.signature}</strong>
                  </div>
                  <div>
                    Signed Date: <strong>{selectedApp.signatureDate}</strong>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div style={{ border: '1.5px solid var(--soft-gold-line)', background: '#FAF7F2', borderRadius: 4, padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                  Admin Review Notes & Decision
                </h4>
                <textarea
                  rows={3}
                  placeholder="Enter curation notes, workshop audit comments, or rejection rationale..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 2,
                    border: '1px solid #D8CBB6',
                    fontSize: '0.84rem',
                    outline: 'none',
                    marginBottom: '1rem',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('approve')}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.25rem',
                      borderRadius: 2,
                      border: 'none',
                      backgroundColor: 'var(--maharani-maroon)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <CheckCircle2 style={{ width: 16, height: 16 }} />
                    Approve & Issue Artisan Login
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('reject')}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: 2,
                      border: '1px solid #EF5350',
                      backgroundColor: '#FFEBEE',
                      color: '#C62828',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <XCircle style={{ width: 16, height: 16 }} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
