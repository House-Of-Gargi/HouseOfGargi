'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Shirt, 
  Layers, 
  Sparkles,
  Truck, 
  ExternalLink,
  LogOut, 
  X, 
  Loader2 
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export interface SellerSidebarProps {
  sellerPhone?: string;
  sellerName?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export interface SellerNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  badge?: string;
  external?: boolean;
}

export interface SellerNavGroup {
  section: string;
  items: SellerNavItem[];
}

const sellerNavGroups: SellerNavGroup[] = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', href: '/seller', icon: LayoutDashboard },
      { label: 'Live Orders', href: '/seller/orders', icon: ShoppingBag, badge: 'Live' },
    ],
  },
  {
    section: 'Catalog & Atelier',
    items: [
      { label: 'Master Catalog', href: '/seller/products', icon: Shirt },
      { label: 'Saree & Loom Matrix', href: '/seller/products?tab=sarees', icon: Layers },
      { label: 'Bespoke In-Weave', href: '/seller/orders?filter=bespoke', icon: Sparkles },
    ],
  },
  {
    section: 'Fulfillment & Store',
    items: [
      { label: 'Dispatch Manifests', href: '/seller/orders?filter=dispatch', icon: Truck },
      { label: 'Preview Boutique', href: '/', icon: ExternalLink, external: true },
    ],
  },
];

export function SellerSidebar({
  sellerPhone = '+91 98765 43210',
  sellerName = 'House of Gargi',
  isMobileOpen = false,
  onMobileClose,
}: SellerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Instant Eager Open on cursor enter
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

  // 280ms Anti-Flicker Buffer on Exit before 700ms smooth cubic collapse
  const handleMouseLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/seller/login');
  };

  const renderNavItem = (item: SellerNavItem, isExpanded: boolean) => {
    const Icon = item.icon;
    const isActive = item.href === '/seller' 
      ? pathname === '/seller' 
      : !item.external && pathname.startsWith(item.href.split('?')[0]);
    const isLoading = navigatingTo === item.href;

    const linkProps = item.external
      ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
      : { 
          href: item.href, 
          prefetch: true,
          onClick: () => {
            if (!isActive) setNavigatingTo(item.href);
            onMobileClose?.();
          }
        };

    return (
      <Link
        key={item.href}
        {...linkProps}
        className={`seller-nav-item ${isActive ? 'active' : 'inactive'}`}
        title={!isExpanded ? item.label : undefined}
      >
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, gap: isExpanded ? '0.75rem' : 0, justifyContent: isExpanded ? 'flex-start' : 'center', flex: 1 }}>
          {isLoading ? (
            <Loader2 style={{ width: 18, height: 18, color: 'var(--seller-brand)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          ) : (
            <Icon style={{ width: 18, height: 18, flexShrink: 0, color: isActive ? 'var(--seller-brand)' : '#64748B' }} />
          )}

          <span className="seller-nav-label" style={{ fontWeight: isActive ? 700 : 500 }}>
            {item.label}
          </span>
        </div>

        {isExpanded && (
          <div style={{ flexShrink: 0 }}>
            {isLoading ? (
              <span className="seller-nav-badge" style={{ animation: 'pulse 1.5s infinite' }}>Opening...</span>
            ) : item.badge ? (
              <span className="seller-nav-badge">{item.badge}</span>
            ) : null}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP HOVER-SLIDE RAIL (hidden below lg)            */}
      {/* ======================================================== */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`seller-sidebar-desktop ${isHovered ? 'expanded' : 'collapsed'}`}
      >
        {/* Brand Header */}
        <div className="seller-sidebar-header">
          <Link href="/seller" style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
            {/* Collapsed Store Initial Avatar */}
            {!isHovered ? (
              <div className="seller-avatar-mini">
                HG
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div className="seller-avatar-mini" style={{ margin: 0 }}>
                  HG
                </div>
                <div className="seller-brand-text">
                  <span className="brand-name">{sellerName}</span>
                  <span className="brand-sub">Seller Atelier Hub</span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Nav Sections */}
        <nav className="seller-nav-scroll">
          {sellerNavGroups.map((group) => (
            <div key={group.section} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {isHovered && (
                <div className="seller-nav-group-title">
                  {group.section}
                </div>
              )}
              {group.items.map((item) => renderNavItem(item, isHovered))}
            </div>
          ))}
        </nav>

        {/* Profile / Sign Out Footer */}
        <div className="seller-sidebar-footer">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--seller-brand)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0, margin: !isHovered ? '0 auto' : '0' }}>
            HG
          </div>

          {isHovered && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, minWidth: 0, marginLeft: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--seller-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sellerPhone}
                </span>
                <span style={{ fontSize: '0.62rem', fontFamily: 'ui-monospace, monospace', color: '#059669', fontWeight: 700 }}>
                  Verified Artisan
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.35rem', borderRadius: '6px', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER (< lg)                                  */}
      {/* ======================================================== */}
      {isMobileOpen && (
        <div
          className="seller-mobile-drawer-backdrop"
          onClick={onMobileClose}
        />
      )}

      <aside
        className="seller-mobile-drawer"
        style={{
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div>
          {/* Mobile Drawer Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--seller-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="seller-avatar-mini" style={{ margin: 0 }}>
                HG
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--seller-text-main)' }}>
                {sellerName}
              </span>
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              style={{ background: 'transparent', border: '1px solid var(--seller-border)', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#64748B' }}
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Mobile Nav */}
          <nav style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sellerNavGroups.map((group) => (
              <div key={group.section} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div className="seller-nav-group-title">
                  {group.section}
                </div>
                {group.items.map((item) => renderNavItem(item, true))}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Profile Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--seller-border)', background: 'var(--seller-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--seller-text-main)' }}>
              {sellerPhone}
            </span>
            <span style={{ fontSize: '0.65rem', fontFamily: 'ui-monospace, monospace', color: '#059669', fontWeight: 700 }}>
              Verified Artisan
            </span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
