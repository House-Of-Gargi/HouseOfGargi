'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';

export interface SuperAdminShellProps {
  children: ReactNode;
  userEmail?: string;
  userName?: string;
}

export function SuperAdminShell({
  children,
  userEmail = 'gargisaha1508@gmail.com',
  userName = 'Gargi Saha (Founder)',
}: SuperAdminShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="seller-shell">
      <SuperAdminSidebar
        userEmail={userEmail}
        userName={userName}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="seller-main">
        {/* Mobile Header */}
        <header className="seller-mobile-header" style={{ backgroundColor: '#1E140F', borderBottomColor: 'rgba(228, 211, 174, 0.2)' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 2,
              border: '1px solid rgba(228, 211, 174, 0.4)',
              background: '#170E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E4D3AE',
              cursor: 'pointer',
            }}
            aria-label="Open super admin menu"
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <Link
            href="/super-admin/dashboard"
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#E4D3AE',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Super Admin Console</span>
          </Link>
        </header>

        <div className="seller-container">{children}</div>
      </main>
    </div>
  );
}
