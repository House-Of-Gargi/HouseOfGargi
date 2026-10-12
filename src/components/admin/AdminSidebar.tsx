'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Gauge,
  AlertOctagon,
  Inbox,
  Users,
  ClipboardCheck,
  Sparkles,
  Layers,
  Tag,
  Package,
  Truck,
  RotateCcw,
  BookOpen,
  ExternalLink,
  LogOut,
  X,
  Shield,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export interface AdminSidebarProps {
  adminEmail?: string;
  adminName?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  badge?: string;
  badgeColor?: string;
  external?: boolean;
}

export interface AdminNavGroup {
  section: string;
  items: AdminNavItem[];
}

const adminNavGroups: AdminNavGroup[] = [
  {
    section: 'Command Center',
    items: [
      { label: 'Operational Hub', href: '/admin/dashboard', icon: Gauge },
      { label: 'Bespoke Commissions', href: '/admin/bespoke', icon: Sparkles },
    ],
  },
  {
    section: 'Artisan Governance',
    items: [
      { label: 'Application Inbox', href: '/admin/artisans/applications', icon: Inbox },
      { label: 'Verified Guilds', href: '/admin/artisans', icon: Users },
    ],
  },
  {
    section: 'Catalog Curation & QC',
    items: [
      { label: 'Product Approvals', href: '/admin/products/approvals', icon: Sparkles },
      { label: 'Total Catalog', href: '/admin/products', icon: Layers },
    ],
  },
  {
    section: 'Storefront',
    items: [
      { label: 'View Public Boutique', href: '/', icon: ExternalLink, external: true },
    ],
  },
];

export function AdminSidebar({
  adminEmail = 'admin@gargisaha.com',
  adminName = 'Operations Curator',
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
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
        localStorage.removeItem('admin_session');
      }
      router.push('/seller/login');
    } catch {
      router.push('/seller/login');
    }
  };

  const isExpanded = isHovered;

  const renderNavGroup = (group: AdminNavGroup, isDrawer = false) => (
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
          {group.section}
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
                      animation: 'fadeInText 0.22s ease forwards',
                    }}
                  >
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
      {/* Desktop Floating Rail Sidebar */}
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
        {/* Brand Header */}
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
              width: 42,
              height: 42,
              borderRadius: 6,
              background: 'var(--maharani-maroon)',
              border: '1.5px solid var(--gargi-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(122, 35, 49, 0.22)',
              flexShrink: 0,
            }}
            title="House of Gargi — Operations Console"
          >
            <img
              src="/logo-images/small-logo.png"
              alt="House of Gargi"
              style={{
                width: 30,
                height: 30,
                objectFit: 'contain',
              }}
            />
          </div>

          {isExpanded && (
            <div style={{ marginLeft: '0.75rem', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <img
                src="/logo-images/new-logo.png"
                alt="House of Gargi"
                style={{
                  height: 28,
                  width: 'auto',
                  objectFit: 'contain',
                  alignSelf: 'flex-start',
                }}
              />
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--stone-taupe)', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-nav)' }}>
                Operations Console
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Nav Groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.45rem', minHeight: 0 }}>
          {adminNavGroups.map((g) => renderNavGroup(g))}
        </div>

        {/* Footer with Admin Identity and Sign Out */}
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
                {adminName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--stone-taupe)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {adminEmail}
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
            title="Sign out of Operations Console"
          >
            <LogOut style={{ width: 16, height: 16 }} />
            {isExpanded && <span>Exit Console</span>}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 5, background: 'var(--maharani-maroon)', border: '1.5px solid var(--gargi-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src="/logo-images/small-logo.png" alt="House of Gargi" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                </div>
                <img src="/logo-images/new-logo.png" alt="House of Gargi" style={{ height: 26, width: 'auto', objectFit: 'contain' }} />
              </div>
              <button onClick={onMobileClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.6rem' }}>
              {adminNavGroups.map((g) => renderNavGroup(g, true))}
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
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
