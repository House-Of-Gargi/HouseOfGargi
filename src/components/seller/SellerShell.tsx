'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { SellerSidebar } from './SellerSidebar';

export interface SellerShellProps {
  children: ReactNode;
  sellerPhone?: string;
  sellerName?: string;
}

export function SellerShell({
  children,
  sellerPhone = '+91 98765 43210',
  sellerName = 'House of Gargi',
}: SellerShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="seller-shell">
      {/* 1. Sidebar: Desktop Hover Rail & Mobile Drawer */}
      <SellerSidebar
        sellerPhone={sellerPhone}
        sellerName={sellerName}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Center Content: lg:pl-[72px] ensures ZERO layout shift */}
      <main className="seller-main">
        {/* Mobile Sticky Top Bar (< lg) */}
        <header className="seller-mobile-header">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1px solid var(--seller-border)',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--seller-text-main)',
              cursor: 'pointer',
            }}
            aria-label="Open navigation menu"
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <Link
            href="/seller"
            style={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: '1rem',
              color: 'var(--seller-text-main)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'var(--seller-brand)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}>
              HG
            </span>
            {sellerName}
          </Link>

          <span
            style={{
              fontSize: '0.625rem',
              fontFamily: 'ui-monospace, monospace',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.6rem',
              borderRadius: 9999,
              background: 'var(--seller-brand-tint)',
              color: 'var(--seller-brand)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            Seller Hub
          </span>
        </header>

        {/* Page Content Container */}
        <div className="seller-container">
          {children}
        </div>
      </main>
    </div>
  );
}
