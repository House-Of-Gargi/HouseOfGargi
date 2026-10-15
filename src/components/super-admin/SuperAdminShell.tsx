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
  userEmail = 'tanmaysaaagr@gmail.com',
  userName = 'Executive Super Admin',
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
        {/* Mobile Header matching Admin Portal luxury ivory palette */}
        <header
          className="seller-mobile-header lg:hidden"
          style={{
            backgroundColor: '#FAF7F2',
            borderBottom: '1px solid var(--soft-gold-line)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 4,
              border: '1px solid var(--soft-gold-line)',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-brown)',
              cursor: 'pointer',
            }}
            aria-label="Open super admin menu"
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <Link
            href="/super-admin/dashboard"
            style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--ink-brown)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 4,
                background: '#FFFFFF',
                border: '1.5px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src="/logo-images/small-logo.png"
                alt="House of Gargi"
                style={{ width: 20, height: 20, objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
              Super Admin Console
            </span>
          </Link>

          <div style={{ width: 38 }} />
        </header>

        <div className="seller-container" style={{ padding: '2rem 2.5rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
