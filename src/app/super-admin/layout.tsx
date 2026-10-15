'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SuperAdminShell } from '@/components/super-admin/SuperAdminShell';
import { supabase } from '@/lib/supabaseClient';
import { getUserRole, canAccessSuperAdmin, AppRole } from '@/lib/rbac';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';
import '@/seller.css';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState('tanmaysaaagr@gmail.com');
  const [userName, setUserName] = useState('Super Admin');

  useEffect(() => {
    async function verifySuperAdmin() {
      try {
        let activeEmail = '';

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('auth_session') || localStorage.getItem('super_admin_session') || localStorage.getItem('artisan_session') || localStorage.getItem('admin_session');
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
        const superAdmins = [
          'tanmaysaaagr@gmail.com',
          'tanmaysaagar@gmail.com',
          'gargisaha1508@gmail.com',
          'shawsumit6286@gmail.com',
          'sumitgreat2705@gmail.com',
        ];

        if (superAdmins.includes(cleanEmail)) {
          setUserEmail(cleanEmail);
          setUserName(cleanEmail.split('@')[0]);
          setAuthorized(true);
          setChecking(false);
          return;
        }

        if (cleanEmail) {
          const role: AppRole = await getUserRole(cleanEmail);
          if (canAccessSuperAdmin(role)) {
            setUserEmail(cleanEmail);
            setUserName(cleanEmail.split('@')[0]);
            setAuthorized(true);
            setChecking(false);
            return;
          }
        }

        setAuthorized(false);
      } catch (err) {
        console.error('Super Admin verify error:', err);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    }

    verifySuperAdmin();
  }, []);

  if (checking) {
    return <PortalLoadingScreen portalName="Executive Super Admin Command" theme="light" message="Verifying executive credentials..." />;
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2', color: 'var(--ink-brown)', padding: '1.5rem', fontFamily: 'var(--font-body)' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 12, padding: '2.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(43,31,24,0.06)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF5F5', border: '1.5px solid #FFCDD2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldAlert style={{ width: 32, height: 32, color: 'var(--maharani-maroon)' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--ink-brown)', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
            Executive Access <span style={{ color: 'var(--maharani-maroon)' }}>Restricted</span>
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
            The Super Admin console is strictly restricted to executive leadership (e.g. <code>tanmaysaaagr@gmail.com</code>).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/admin/login"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                borderRadius: 4,
                background: 'var(--maharani-maroon)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Sign In to Executive Console
            </Link>
            <Link
              href="/"
              style={{
                fontSize: '0.85rem',
                color: 'var(--stone-taupe)',
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
    <SuperAdminShell userEmail={userEmail} userName={userName}>
      {children}
    </SuperAdminShell>
  );
}
