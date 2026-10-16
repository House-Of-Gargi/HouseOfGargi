'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  PlusCircle,
  Trash2,
  Mail,
  CheckCircle2,
  X,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { AdminLoadingSpinner } from '@/components/admin/AdminLoadingSpinner';
import { usePortalRealtimeSync } from '@/lib/realtimeSync';

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [department, setDepartment] = useState('Operations & Curation');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/admins');
      const data = await res.json();
      if (data.success && data.admins) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  usePortalRealtimeSync(['PORTAL_CATALOG_SYNC'], () => {
    fetchAdmins();
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, department }),
      });
      const data = await res.json();
      if (data.success) {
        setIsInviteOpen(false);
        setName('');
        setEmail('');
        fetchAdmins();
      } else {
        alert(data.message || 'Error inviting admin');
      }
    } catch (err) {
      console.error('Invite error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this admin\'s access?')) return;
    try {
      const res = await fetch('/api/super-admin/admins?id=' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAdmins();
      } else {
        alert(data.message || 'Error revoking admin');
      }
    } catch (err) {
      console.error('Revoke error:', err);
    }
  };

  const superAdminsCount = admins.filter((a) => a.role === 'super_admin').length;
  const curatorsCount = admins.filter((a) => a.role !== 'super_admin').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Lockup */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <ShieldCheck style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
              Team Access & Privileges
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.95rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.25 }}>
            Admin & Staff Privilege <span style={{ color: 'var(--maharani-maroon)' }}>Management</span>
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.98rem', color: '#4A3E36', lineHeight: 1.55 }}>
            Exclusive Super Admin function: control operations team access, invite curators, and assign permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 4,
            border: 'none',
            backgroundColor: 'var(--maharani-maroon)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 8px rgba(122,35,49,0.2)',
          }}
        >
          <PlusCircle style={{ width: 16, height: 16 }} />
          Invite Operations Staff
        </button>
      </div>

      {/* 3 Metric Summary Boxes - Minimal Box Styling & Proportional Font Sizes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Total Governance Staff
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${admins.length} Members`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Authorized operations team
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Executive Super Admins
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--maharani-maroon)', letterSpacing: '-0.01em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${superAdminsCount} Super Admins`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Unrestricted governance privilege
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.6rem',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '135px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#5C5043', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Operations & Curators
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 600, lineHeight: 1.15, color: 'var(--ink-brown)', letterSpacing: '-0.01em' }}>
            {loading ? <AdminLoadingSpinner size={26} /> : `${curatorsCount} Staff`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)' }}>
            Artisan & catalog review permissions
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,31,24,0.03)' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <AdminLoadingSpinner size={28} />
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Staff Member</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Email Address</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Role Tier</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Department / Scope</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Last Active</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                    {adm.name}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--stone-taupe)' }}>
                    {adm.email}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 4,
                        backgroundColor: adm.role === 'super_admin' ? '#FAF0E6' : '#FAF7F2',
                        color: adm.role === 'super_admin' ? 'var(--maharani-maroon)' : 'var(--ink-brown)',
                        border: adm.role === 'super_admin' ? '1px solid rgba(122,35,49,0.3)' : '1px solid var(--soft-gold-line)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {adm.role === 'super_admin' ? 'Super Admin' : 'Admin Curator'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--ink-brown)' }}>
                    {adm.department}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--stone-taupe)' }}>
                    {adm.lastActive}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    {adm.role !== 'super_admin' && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(adm.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C62828',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: 4,
                        }}
                        title="Revoke Admin Access"
                      >
                        <Trash2 style={{ width: 16, height: 16 }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Admin Modal */}
      {isInviteOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(35, 24, 18, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsInviteOpen(false)}
        >
          <div
            style={{
              width: '480px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 12px 36px rgba(43,31,24,0.15)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                Invite Operations Staff
              </h2>
              <button
                onClick={() => setIsInviteOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleInvite} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandita Bose"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin.name@gargisaha.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Role Tier
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF' }}
                >
                  <option value="admin">Operations Curator (Catalog & Artisans)</option>
                  <option value="super_admin">Super Admin (Full Governance)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Department / Scope
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handloom Quality Control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  style={{ padding: '0.65rem 1.15rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FAF7F2', color: 'var(--ink-brown)', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.65rem 1.35rem', borderRadius: 4, border: 'none', background: 'var(--maharani-maroon)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Granting Access...' : 'Send Access Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
