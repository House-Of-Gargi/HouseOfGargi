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
} from 'lucide-react';

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
            Admin & Staff Privilege Management
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
            Exclusive Super Admin function: control operations team access, invite curators, and assign permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 2,
            border: 'none',
            backgroundColor: 'var(--maharani-maroon)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <PlusCircle style={{ width: 16, height: 16 }} />
          Invite New Admin
        </button>
      </div>

      {/* Admins Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
            <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem', color: 'var(--maharani-maroon)' }} />
            Loading admin staff...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Staff Member</th>
                <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                <th style={{ padding: '0.85rem 1rem' }}>Role Tier</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department / Scope</th>
                <th style={{ padding: '0.85rem 1rem' }}>Last Active</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: '1px solid #F0E8DC' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink-brown)' }}>{adm.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{adm.email}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 2,
                        backgroundColor: adm.role === 'super_admin' ? '#7A2331' : '#E0E7FF',
                        color: adm.role === 'super_admin' ? '#FFFFFF' : '#3730A3',
                        textTransform: 'uppercase',
                      }}
                    >
                      {adm.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--ink-brown)' }}>{adm.department}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--stone-taupe)' }}>{adm.lastActive}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    {adm.role !== 'super_admin' && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(adm.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C62828',
                          cursor: 'pointer',
                          padding: '0.3rem',
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
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
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
              borderRadius: 4,
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                Invite Operations Admin
              </h2>
              <button onClick={() => setIsInviteOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
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
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Role Tier
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="admin">Operations Admin (Artisans & QC)</option>
                  <option value="super_admin">Super Admin (Full Governance)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                  Department / Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handloom QC & Silk Verification"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 2, border: '1px solid #D8CBB6', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 2, border: '1px solid #D8CBB6', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 2, border: 'none', background: 'var(--maharani-maroon)', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Inviting...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
