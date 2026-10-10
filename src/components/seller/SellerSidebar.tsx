'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp,
  Shirt, 
  PlusCircle,
  Boxes,
  ShoppingBag, 
  Truck, 
  Wallet,
  ShieldCheck,
  UserCheck,
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
  bengaliLabel?: string;
  href: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  badge?: string;
  external?: boolean;
}

export interface SellerNavGroup {
  section: string;
  bengaliSection?: string;
  items: SellerNavItem[];
}

const sellerNavGroups: SellerNavGroup[] = [
  {
    section: 'Overview',
    bengaliSection: 'সারসংক্ষেপ',
    items: [
      { label: 'Dashboard', bengaliLabel: 'ড্যাশবোর্ড', href: '/artisan/dashboard', icon: LayoutDashboard },
      { label: 'Performance Analytics', bengaliLabel: 'বিক্রয় তথ্য', href: '/seller/analytics', icon: TrendingUp },
    ],
  },
  {
    section: 'My Creations',
    bengaliSection: 'আমার সৃষ্টি',
    items: [
      { label: 'My Products', bengaliLabel: 'আমার পণ্যতালিকা', href: '/seller/products', icon: Shirt },
      { label: 'Add New Creation', bengaliLabel: 'নতুন সৃষ্টি যোগ করুন', href: '/seller/products/new', icon: PlusCircle },
      { label: 'Inventory & Loom Stock', bengaliLabel: 'মজুত ও তাঁত সংখ্যা', href: '/seller/inventory', icon: Boxes, badge: 'Stock' },
    ],
  },
  {
    section: 'Orders & Dispatch',
    bengaliSection: 'অর্ডার ও ডেলিভারি',
    items: [
      { label: 'Assigned Orders', bengaliLabel: 'প্রেরিত অর্ডার', href: '/seller/orders', icon: ShoppingBag, badge: 'Live' },
      { label: 'Dispatch Slips', bengaliLabel: 'চালান ও প্যাকিং', href: '/seller/orders?filter=dispatch', icon: Truck },
    ],
  },
  {
    section: 'Finances & Payouts',
    bengaliSection: 'আয় ও লেনদেন',
    items: [
      { label: 'Earnings Ledger', bengaliLabel: 'অর্জিত আয়', href: '/seller/earnings', icon: Wallet },
    ],
  },
  {
    section: 'Ethical Lineage',
    bengaliSection: 'পরিচয় ও নীতি',
    items: [
      { label: 'Child Labor Agreement', bengaliLabel: 'নীতিগত চুক্তি', href: '/seller/compliance', icon: ShieldCheck },
      { label: 'Preview Boutique', bengaliLabel: 'দোকান দেখুন', href: '/', icon: ExternalLink, external: true },
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

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('artisan_session');
      }
      router.push('/seller/login');
    } catch {
      router.push('/seller/login');
    }
  };

  const isExpanded = isHovered;

  const renderNavGroup = (group: SellerNavGroup, isDrawer = false) => (
    <div key={group.section} style={{ marginBottom: '1.25rem' }}>
      {(isExpanded || isDrawer) && (
        <div
          style={{
            padding: '0 0.85rem',
            marginBottom: '0.4rem',
            fontSize: '0.66rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--stone-taupe)',
            fontFamily: 'var(--font-nav)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {group.section} {group.bengaliSection ? '• ' + group.bengaliSection : ''}
        </div>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {group.items.map((item) => {
          const isActive = pathname === item.href;
          const isPending = navigatingTo === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href} style={{ position: 'relative' }}>
              <Link
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  if (!item.external && !isActive) setNavigatingTo(item.href);
                  if (isDrawer && onMobileClose) onMobileClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '42px',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: (isExpanded || isDrawer) ? '0 0.85rem' : '0',
                  justifyContent: (isExpanded || isDrawer) ? 'flex-start' : 'center',
                  backgroundColor: isActive ? '#F7F1E5' : 'transparent',
                  color: isActive ? 'var(--maharani-maroon)' : 'var(--ink-brown)',
                  borderLeft: isActive ? '3px solid var(--maharani-maroon)' : '3px solid transparent',
                  transition: 'background-color 0.18s ease, color 0.18s ease',
                }}
                title={!isExpanded && !isDrawer ? item.label : undefined}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPending ? (
                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite', color: 'var(--maharani-maroon)' }} />
                  ) : (
                    <Icon style={{ width: 18, height: 18, color: isActive ? 'var(--maharani-maroon)' : 'var(--stone-taupe)' }} />
                  )}
                </div>

                {(isExpanded || isDrawer) && (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginLeft: '0.45rem',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-nav)',
                          fontSize: '0.84rem',
                          fontWeight: isActive ? 600 : 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.label}
                      </span>
                      {item.bengaliLabel && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--stone-taupe)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.bengaliLabel}
                        </span>
                      )}
                    </div>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '2px',
                          backgroundColor: 'var(--maharani-maroon)',
                          color: '#FFFFFF',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="seller-sidebar-desktop"
        style={{
          width: isExpanded ? '264px' : '72px',
          boxShadow: isExpanded ? '0 10px 30px rgba(43,31,24,0.12)' : 'none',
          transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            height: '74px',
            borderBottom: '1px solid var(--soft-gold-line)',
            display: 'flex',
            alignItems: 'center',
            padding: isExpanded ? '0 1rem' : '0',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            backgroundColor: '#FAF7F2',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: 'var(--maharani-maroon)',
              border: '1px solid var(--gargi-gold)',
              color: 'var(--ivory-silk)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.92rem',
              flexShrink: 0,
            }}
          >
            HG
          </div>

          {isExpanded && (
            <div style={{ marginLeft: '0.75rem', minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.98rem', color: 'var(--maharani-maroon)' }}>
                HOUSE OF GARGI
              </div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.06em', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 600 }}>
                Artisan Atelier • কারিগর
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.45rem', minHeight: 0 }}>
          {sellerNavGroups.map((g) => renderNavGroup(g))}
        </div>

        <div
          style={{
            borderTop: '1px solid var(--soft-gold-line)',
            padding: isExpanded ? '0.85rem 1rem' : '0.85rem 0',
            backgroundColor: '#FAF7F2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isExpanded ? 'stretch' : 'center',
            gap: '0.5rem',
          }}
        >
          {isExpanded && (
            <div style={{ minWidth: 0, marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sellerName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--stone-taupe)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sellerPhone}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: 2,
              background: 'transparent',
              border: 'none',
              color: 'var(--maharani-maroon)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
            title="প্রস্থান / Sign Out"
          >
            <LogOut style={{ width: 16, height: 16 }} />
            {isExpanded && <span>প্রস্থান / Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
          }}
          onClick={onMobileClose}
        >
          <div
            style={{
              width: '280px',
              maxWidth: '85vw',
              height: '100%',
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid var(--soft-gold-line)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                height: 64,
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.25rem',
                backgroundColor: '#FAF7F2',
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--maharani-maroon)', fontSize: '0.95rem' }}>
                ARTISAN ATELIER
              </span>
              <button onClick={onMobileClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.6rem' }}>
              {sellerNavGroups.map((g) => renderNavGroup(g, true))}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--soft-gold-line)', backgroundColor: '#FAF7F2' }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid var(--maharani-maroon)',
                  borderRadius: 2,
                  background: 'transparent',
                  color: 'var(--maharani-maroon)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  justifyContent: 'center',
                }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
                <span>প্রস্থান / Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
