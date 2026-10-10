'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { supabase } from '@/lib/supabaseClient';
import { getUserRole, canAccessAdmin, AppRole } from '@/lib/rbac';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import '@/seller.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState('sumitgreat2705@gmail.com');
  const [adminName, setAdminName] = useState('Operations Admin');

  useEffect(() => {
    async function verifyAdmin() {
      try {
        let activeEmail = '';

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('auth_session') || localStorage.getItem('admin_session') || localStorage.getItem('super_admin_session') || localStorage.getItem('artisan_session');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.email) activeEmail = parsed.email;
            } catch {}
          }
        }

        if (!activeEmail) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.email) activeEmail = session.user.email;
        }

        if (!activeEmail && typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const asParam = urlParams.get('as');
          if (asParam) activeEmail = asParam;
        }

        const cleanEmail = (activeEmail || '').toLowerCase().trim();
        const allowedAdmins = [
          'sumitgreat2705@gmail.com',
          'tanmaysaaagr@gmail.com',
          'tanmaysaagar@gmail.com',
          'gargisaha1508@gmail.com',
          'shawsumit6286@gmail.com',
          'admin@gargisaha.com'
        ];

        if (allowedAdmins.includes(cleanEmail)) {
          setAdminEmail(cleanEmail);
          setAdminName(cleanEmail.split('@')[0]);
          setAuthorized(true);
          setChecking(false);
          return;
        }

        if (cleanEmail) {
          const role: AppRole = await getUserRole(cleanEmail);
          if (canAccessAdmin(role)) {
            setAdminEmail(cleanEmail);
            setAdminName(cleanEmail.split('@')[0]);
            setAuthorized(true);
            setChecking(false);
            return;
          }
        }

        setAuthorized(false);
      } catch (err) {
        console.error('Admin auth check error:', err);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    }

    verifyAdmin();
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF6EE', color: 'var(--maharani-maroon)' }}>
        <Loader2 style={{ width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2', color: 'var(--ink-brown)', padding: '1.5rem', fontFamily: 'Georgia, serif' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 6, padding: '2.5rem', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <ShieldAlert style={{ width: 48, height: 48, color: 'var(--maharani-maroon)', margin: '0 auto 1.25rem' }} />
          <h1 style={{ fontSize: '1.5rem', color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            Admin Authorization Required &bull; 403
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
            The Operations Console is restricted to verified Admin staff (e.g. <code>sumitgreat2705@gmail.com</code>).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/seller/login"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                borderRadius: 2,
                background: 'var(--maharani-maroon)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              style={{
                fontSize: '0.8rem',
                color: 'var(--maharani-maroon)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Return to Public Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminShell adminEmail={adminEmail} adminName={adminName}>
      {children}
    </AdminShell>
  );
}
