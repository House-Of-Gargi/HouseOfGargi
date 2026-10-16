'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuperAdminShell } from '@/components/super-admin/SuperAdminShell';
import { supabase } from '@/lib/supabaseClient';
import { getUserRole, canAccessSuperAdmin, AppRole } from '@/lib/rbac';
import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';
import { UnauthorizedSessionScreen } from '@/components/common/UnauthorizedSessionScreen';
import '@/seller.css';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Super Admin');
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    async function verifySuperAdmin() {
      try {
        let activeEmail = '';

        if (typeof window !== 'undefined') {
          // Check super_admin_session FIRST so other sessions never usurp executive authority
          const stored = localStorage.getItem('super_admin_session') || localStorage.getItem('admin_session') || localStorage.getItem('auth_session');
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
      <UnauthorizedSessionScreen
        portalTitle="Executive Super Admin Console"
        loginPath="/admin/login"
        currentEmail={currentEmail || undefined}
      />
    );
  }

  return (
    <SuperAdminShell userEmail={userEmail} userName={userName}>
      {children}
    </SuperAdminShell>
  );
}
