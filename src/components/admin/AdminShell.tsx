'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export interface AdminShellProps {
  children: ReactNode;
  adminEmail?: string;
  adminName?: string;
}

export function AdminShell({
  children,
  adminEmail = 'admin@gargisaha.com',
  adminName = 'Operations Curator',
}: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="seller-shell">
      <AdminSidebar
        adminEmail={adminEmail}
        adminName={adminName}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="seller-main">
        {/* Mobile Sticky Header */}
        <header className="seller-mobile-header">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 2,
              border: '1px solid var(--soft-gold-line)',
              background: 'var(--pure-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-brown)',
              cursor: 'pointer',
            }}
            aria-label="Open admin navigation menu"
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <Link
            href="/admin/dashboard"
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--ink-brown)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 4, background: 'var(--maharani-maroon)', border: '1.5px solid var(--gargi-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo-images/small-logo.png" alt="House of Gargi" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </div>
            <span>Operations Console</span>
          </Link>
        </header>

        {/* Core Viewport */}
        <div className="seller-container">{children}</div>
      </main>
    </div>
  );
}
