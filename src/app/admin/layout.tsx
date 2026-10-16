'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { supabase } from '@/lib/supabaseClient';
import { getUserRole, canAccessAdmin, AppRole } from '@/lib/rbac';
import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';
import { UnauthorizedSessionScreen } from '@/components/common/UnauthorizedSessionScreen';
import '@/seller.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('Operations Admin');
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    async function verifyAdmin() {
      try {
        let activeEmail = '';

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('admin_session') || localStorage.getItem('super_admin_session') || localStorage.getItem('auth_session');
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
        setCurrentEmail(cleanEmail);

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
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return <PortalLoadingScreen portalName="Operations Console" theme="light" message="Verifying Administrative credentials..." />;
  }

  if (!authorized) {
    return (
      <UnauthorizedSessionScreen
        portalTitle="Operations Admin Console"
        loginPath="/admin/login"
        currentEmail={currentEmail || undefined}
      />
    );
  }

  return (
    <AdminShell adminEmail={adminEmail} adminName={adminName}>
      {children}
    </AdminShell>
  );
}
