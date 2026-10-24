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
  Key,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
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

  // Current logged in Super Admin identity
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  // Self password change state
  const [isSelfPwOpen, setIsSelfPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [selfPwMsg, setSelfPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin password reset modal state
  const [resetModalAdmin, setResetModalAdmin] = useState<any | null>(null);
  const [resetMode, setResetMode] = useState<'default' | 'custom'>('default');
  const [customResetPassword, setCustomResetPassword] = useState('');
  const [customResetConfirm, setCustomResetConfirm] = useState('');
  const [showCustomPw, setShowCustomPw] = useState(false);
  const [resettingPw, setResettingPw] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('super_admin_session') || localStorage.getItem('auth_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            setCurrentAdminEmail(parsed.email);
          }
        } catch {}
      }
    }
  }, []);

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
    if (!confirm("Are you sure you want to revoke this admin's access?")) return;
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

  // Self password change handler
  const handleSelfPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelfPwMsg(null);

    if (!currentPassword || !newPassword) {
      setSelfPwMsg({ type: 'error', text: 'Please fill in both current and new password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setSelfPwMsg({ type: 'error', text: 'New password must be at least 6 characters in length.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSelfPwMsg({ type: 'error', text: 'New passwords do not match. Please re-enter.' });
      return;
    }

    try {
      setChangingPw(true);
      const res = await fetch('/api/super-admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentAdminEmail,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelfPwMsg({ type: 'success', text: 'Your Super Admin password has been updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsSelfPwOpen(false);
          setSelfPwMsg(null);
        }, 3000);
      } else {
        setSelfPwMsg({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch (err: any) {
      setSelfPwMsg({ type: 'error', text: err?.message || 'Network error updating password.' });
    } finally {
      setChangingPw(false);
    }
  };

  // Reset target admin password handler
  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);

    const targetPassword = resetMode === 'default' ? '12345678' : customResetPassword.trim();

    if (resetMode === 'custom') {
      if (targetPassword.length < 6) {
        setResetMsg({ type: 'error', text: 'Custom password must be at least 6 characters in length.' });
        return;
      }
      if (targetPassword !== customResetConfirm.trim()) {
        setResetMsg({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
        return;
      }
    }

    try {
      setResettingPw(true);
      const res = await fetch('/api/super-admin/admins/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetModalAdmin.email,
          newPassword: targetPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResetMsg({
          type: 'success',
          text: resetMode === 'default'
            ? `Password for ${resetModalAdmin.email} has been reset to default (12345678).`
            : `Password for ${resetModalAdmin.email} has been updated to your custom setting.`,
        });
        setTimeout(() => {
          setResetModalAdmin(null);
          setResetMsg(null);
          setCustomResetPassword('');
          setCustomResetConfirm('');
        }, 2200);
      } else {
        setResetMsg({ type: 'error', text: data.message || 'Failed to reset administrator password.' });
      }
    } catch (err: any) {
      setResetMsg({ type: 'error', text: err?.message || 'Network error while resetting password.' });
    } finally {
      setResettingPw(false);
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
            Exclusive Super Admin function: control operations team access, invite curators, manage credentials, and assign permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsSelfPwOpen(!isSelfPwOpen)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 4,
              border: '1px solid var(--soft-gold-line)',
              backgroundColor: '#FFFFFF',
              color: 'var(--ink-brown)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 1px 4px rgba(43,31,24,0.06)',
            }}
          >
            <Key style={{ width: 16, height: 16, color: 'var(--maharani-maroon)' }} />
            {isSelfPwOpen ? 'Close Password Panel' : 'Change Your Password'}
          </button>

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
      </div>

      {/* Super Admin Self-Service Password Change Section (Collapsible) */}
      {isSelfPwOpen && (
        <div
          style={{
            background: '#FAF7F2',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 4px 16px rgba(43,31,24,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0, color: 'var(--ink-brown)' }}>
                Change Your Super Admin Password
              </h2>
              {currentAdminEmail && (
                <span style={{ fontSize: '0.8rem', background: '#FFFFFF', padding: '0.2rem 0.55rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', color: 'var(--stone-taupe)' }}>
                  {currentAdminEmail}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsSelfPwOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {selfPwMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 6,
                marginBottom: '1rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: selfPwMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                color: selfPwMsg.type === 'success' ? '#065F46' : '#991B1B',
                border: `1px solid ${selfPwMsg.type === 'success' ? '#A7F3D0' : '#FECDD3'}`,
              }}
            >
              {selfPwMsg.type === 'success' ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : <ShieldAlert style={{ width: 16, height: 16 }} />}
              <span>{selfPwMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSelfPasswordChange} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.35rem' }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
                >
                  {showCurrentPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.35rem' }}>
                New Password (min 6 chars)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
                >
                  {showNewPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.35rem' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={changingPw}
                style={{
                  width: '100%',
                  padding: '0.68rem 1.25rem',
                  borderRadius: 4,
                  border: 'none',
                  backgroundColor: 'var(--maharani-maroon)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: changingPw ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                }}
              >
                {changingPw ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    Updating...
                  </>
                ) : (
                  'Update My Password'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3 Metric Summary Boxes */}
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
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {/* Password Reset Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setResetModalAdmin(adm);
                          setResetMode('default');
                          setCustomResetPassword('');
                          setCustomResetConfirm('');
                          setResetMsg(null);
                        }}
                        style={{
                          background: '#FAF7F2',
                          border: '1px solid var(--soft-gold-line)',
                          color: 'var(--ink-brown)',
                          cursor: 'pointer',
                          padding: '0.35rem 0.65rem',
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          transition: 'background 150ms ease',
                        }}
                        title={`Reset password for ${adm.name}`}
                      >
                        <Key style={{ width: 13, height: 13, color: 'var(--maharani-maroon)' }} />
                        <span>Reset Password</span>
                      </button>

                      {/* Revoke Action Button (non-super-admin only) */}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Admin Password Reset Modal */}
      {resetModalAdmin && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 65,
            backgroundColor: 'rgba(35, 24, 18, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setResetModalAdmin(null)}
        >
          <div
            style={{
              width: '500px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              border: '1.5px solid var(--soft-gold-line)',
              boxShadow: '0 16px 40px rgba(43,31,24,0.18)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--soft-gold-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key style={{ width: 18, height: 18, color: 'var(--maharani-maroon)' }} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                  Reset Staff Password
                </h2>
              </div>
              <button
                onClick={() => setResetModalAdmin(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleAdminResetPassword} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Target info card */}
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: 8, padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Target Administrator
                </div>
                <div style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '1rem', marginTop: '0.2rem' }}>
                  {resetModalAdmin.name} ({resetModalAdmin.email})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--maharani-maroon)', marginTop: '0.15rem', fontWeight: 600 }}>
                  Role: {resetModalAdmin.role === 'super_admin' ? 'Super Admin' : 'Admin Curator'}
                </div>
              </div>

              {resetMsg && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 6,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: resetMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                    color: resetMsg.type === 'success' ? '#065F46' : '#991B1B',
                    border: `1px solid ${resetMsg.type === 'success' ? '#A7F3D0' : '#FECDD3'}`,
                  }}
                >
                  {resetMsg.type === 'success' ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : <ShieldAlert style={{ width: 16, height: 16 }} />}
                  <span>{resetMsg.text}</span>
                </div>
              )}

              {/* Reset Mode Selection */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.5rem' }}>
                  Choose Reset Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setResetMode('default')}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 6,
                      border: resetMode === 'default' ? '2px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                      background: resetMode === 'default' ? '#FAF0E6' : '#FFFFFF',
                      color: resetMode === 'default' ? 'var(--maharani-maroon)' : 'var(--ink-brown)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.2rem',
                    }}
                  >
                    <span>Reset to Default</span>
                    <code style={{ fontSize: '0.78rem', opacity: 0.85 }}>12345678</code>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetMode('custom')}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 6,
                      border: resetMode === 'custom' ? '2px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                      background: resetMode === 'custom' ? '#FAF0E6' : '#FFFFFF',
                      color: resetMode === 'custom' ? 'var(--maharani-maroon)' : 'var(--ink-brown)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.2rem',
                    }}
                  >
                    <span>Custom Password</span>
                    <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>Enter new password</span>
                  </button>
                </div>
              </div>

              {/* Custom Password Inputs */}
              {resetMode === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                      New Password (minimum 6 characters)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCustomPw ? 'text' : 'password'}
                        required
                        placeholder="Type new password"
                        value={customResetPassword}
                        onChange={(e) => setCustomResetPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 2.2rem 0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomPw(!showCustomPw)}
                        style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
                      >
                        {showCustomPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-brown)', display: 'block', marginBottom: '0.3rem' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={customResetConfirm}
                      onChange={(e) => setCustomResetConfirm(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setResetModalAdmin(null)}
                  style={{ padding: '0.65rem 1.15rem', borderRadius: 4, border: '1px solid var(--soft-gold-line)', background: '#FAF7F2', color: 'var(--ink-brown)', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPw}
                  style={{
                    padding: '0.65rem 1.35rem',
                    borderRadius: 4,
                    border: 'none',
                    background: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: resettingPw ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {resettingPw ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Resetting Password...
                    </>
                  ) : (
                    'Confirm Password Reset'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

              {/* Password Allocation Callout */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E4D3AE',
                borderRadius: 6,
                padding: '0.75rem 0.9rem',
                fontSize: '0.82rem',
                color: '#6B584E',
                lineHeight: 1.45,
              }}>
                <strong style={{ color: 'var(--maharani-maroon)' }}>Default Password Notice:</strong> Newly invited staff will automatically be allocated default password <code>12345678</code>. They can sign in immediately at the Admin Console and have it updated here anytime.
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
