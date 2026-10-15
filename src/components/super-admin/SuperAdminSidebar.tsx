'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Landmark,
  DollarSign,
  Flame,
  ShieldCheck,
  FolderTree,
  Grid,
  ExternalLink,
  LogOut,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export interface SuperAdminSidebarProps {
  userEmail?: string;
  userName?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export interface SuperAdminNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  badge?: string;
  badgeColor?: string;
  external?: boolean;
}

export interface SuperAdminNavGroup {
  section: string;
  items: SuperAdminNavItem[];
}

const superAdminNavGroups: SuperAdminNavGroup[] = [
  {
    section: 'Executive Governance',
    items: [
      { label: 'Executive Overview', href: '/super-admin/dashboard', icon: Landmark },
      { label: 'Revenue & Ledger', href: '/super-admin/revenue', icon: DollarSign },
      { label: 'Hot & Best Sellers', href: '/super-admin/bestsellers', icon: Flame },
    ],
  },
  {
    section: 'Team & Privileges',
    items: [
      { label: 'Admin Management', href: '/super-admin/admins', icon: ShieldCheck },
    ],
  },
  {
    section: 'Storefront Architecture',
    items: [
      { label: 'Categories & Taxonomies', href: '/super-admin/categories', icon: FolderTree },
      { label: 'Master Catalog Display', href: '/super-admin/catalog', icon: Grid },
    ],
  },
  {
    section: 'Storefront',
    items: [
      { label: 'View Public Boutique', href: '/', icon: ExternalLink, external: true },
    ],
  },
];

export function SuperAdminSidebar({
  userEmail = 'tanmaysaaagr@gmail.com',
  userName = 'Executive Super Admin',
  isMobileOpen = false,
  onMobileClose,
}: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isManualExpanded, setIsManualExpanded] = useState(false);
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
      setIsManualExpanded(false);
    }, 280);
  };

  const toggleManualExpand = () => {
    setIsManualExpanded((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setNavigatingTo(null);
    setIsManualExpanded(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_session');
        localStorage.removeItem('super_admin_session');
        localStorage.removeItem('admin_session');
      }
      router.push('/admin/login?logout=true');
    } catch {
      router.push('/admin/login?logout=true');
    }
  };

  const isExpanded = isHovered || isManualExpanded;

  const renderNavGroup = (group: SuperAdminNavGroup, isDrawer = false) => (
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
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '10px',
                          backgroundColor: item.badgeColor || '#E4D3AE',
                          color: '#231812',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          flexShrink: 0,
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
      <style jsx global>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Permanent Luxury Rail Sidebar (Visible across all viewport sizes, zero top header required) */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="seller-sidebar-desktop super-admin-sidebar-rail"
        style={{
          display: 'flex',
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 40,
          width: isExpanded ? '264px' : '72px',
          boxShadow: isExpanded ? '0 10px 30px rgba(43,31,24,0.12)' : '2px 0 12px rgba(43, 31, 24, 0.03)',
          transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
          backgroundColor: '#FAF7F2',
          borderRight: '1px solid var(--soft-gold-line)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          onClick={toggleManualExpand}
          style={{
            height: '74px',
            borderBottom: '1px solid var(--soft-gold-line)',
            display: 'flex',
            alignItems: 'center',
            padding: isExpanded ? '0 1.25rem' : '0',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            backgroundColor: '#FAF7F2',
            cursor: 'pointer',
          }}
          title={isExpanded ? 'Click to collapse navigation' : 'Click or hover to expand navigation'}
        >
          {isExpanded ? (
            /* When side nav is opened: ONLY the House of Gargi long word format logo, nothing else */
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <img
                src="/logo-images/new-logo.png"
                alt="House of Gargi"
                style={{
                  height: 34,
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            /* When side nav is collapsed: compact HG crest */
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
              title="House of Gargi"
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
          )}
        </div>

        {/* Scrollable Nav Groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.45rem', minHeight: 0 }}>
          {superAdminNavGroups.map((g) => renderNavGroup(g))}
        </div>

        {/* Footer with Super Admin Identity and Sign Out */}
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
            <div style={{ minWidth: 0, marginBottom: '0.25rem', width: '100%' }}>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--stone-taupe)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 500,
                }}
                title={userEmail}
              >
                {userEmail}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
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
              fontFamily: 'var(--font-nav)',
            }}
            title="Sign out of Super Admin Console"
          >
            <LogOut style={{ width: 16, height: 16 }} />
            {isExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
