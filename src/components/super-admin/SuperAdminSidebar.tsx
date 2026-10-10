'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Landmark,
  DollarSign,
  Flame,
  ShieldAlert,
  FileText,
  FolderTree,
  Grid,
  Sliders,
  CheckCircle2,
  Send,
  ExternalLink,
  LogOut,
  X,
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
      { label: 'Revenue Analytics', href: '/super-admin/revenue', icon: DollarSign },
      { label: 'Hot & Best Sellers', href: '/super-admin/bestsellers', icon: Flame, badge: 'HOT', badgeColor: '#B88E18' },
    ],
  },
  {
    section: 'Team & Privilege',
    items: [
      { label: 'Admin Management', href: '/super-admin/admins', icon: ShieldAlert, badge: '4 Staff', badgeColor: '#7A2331' },
      { label: 'Security Audit Trail', href: '/super-admin/audit-logs', icon: FileText },
    ],
  },
  {
    section: 'Storefront Architecture',
    items: [
      { label: 'Categories & Taxonomies', href: '/super-admin/categories', icon: FolderTree },
      { label: 'Master Catalog Display', href: '/super-admin/catalog', icon: Grid },
      { label: 'Featured Curations', href: '/super-admin/curations', icon: Sliders },
    ],
  },
  {
    section: 'Financial Settlements',
    items: [
      { label: 'Artisan Payouts', href: '/super-admin/payouts', icon: CheckCircle2, badge: 'Pending', badgeColor: '#1B5E20' },
    ],
  },
  {
    section: 'Infrastructure & External',
    items: [
      { label: 'Email Engine & Resend', href: '/super-admin/emails', icon: Send },
      { label: 'View Public Boutique', href: '/', icon: ExternalLink, external: true },
    ],
  },
];

export function SuperAdminSidebar({
  userEmail = 'gargisaha1508@gmail.com',
  userName = 'Gargi Saha (Founder)',
  isMobileOpen = false,
  onMobileClose,
}: SuperAdminSidebarProps) {
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
        localStorage.removeItem('super_admin_session');
      }
      router.push('/seller/login');
    } catch {
      router.push('/seller/login');
    }
  };

  const isExpanded = isHovered;

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
            color: '#A99B8D',
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
                  backgroundColor: isActive ? 'rgba(228, 211, 174, 0.15)' : 'transparent',
                  color: isActive ? '#E4D3AE' : '#D5C7B7',
                  borderLeft: isActive ? '3px solid #E4D3AE' : '3px solid transparent',
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
                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite', color: '#E4D3AE' }} />
                  ) : (
                    <Icon style={{ width: 18, height: 18, color: isActive ? '#E4D3AE' : '#9E8E7D' }} />
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
                          borderRadius: '2px',
                          backgroundColor: item.badgeColor || 'var(--maharani-maroon)',
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
      {/* Desktop Dark-Accent Floating Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="seller-sidebar-desktop"
        style={{
          width: isExpanded ? '264px' : '72px',
          backgroundColor: '#1E140F',
          borderRight: '1px solid rgba(228, 211, 174, 0.25)',
          boxShadow: isExpanded ? '0 10px 30px rgba(0,0,0,0.35)' : 'none',
          transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: '74px',
            borderBottom: '1px solid rgba(228, 211, 174, 0.2)',
            display: 'flex',
            alignItems: 'center',
            padding: isExpanded ? '0 1rem' : '0',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            backgroundColor: '#170E0B',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: 'var(--maharani-maroon)',
              border: '1px solid var(--gargi-gold)',
              color: '#FFFFFF',
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
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.98rem', color: '#E4D3AE' }}>
                HOUSE OF GARGI
              </div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.06em', color: '#C9A227', textTransform: 'uppercase', fontWeight: 700 }}>
                Super Admin Console
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Nav Groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.45rem', minHeight: 0 }}>
          {superAdminNavGroups.map((g) => renderNavGroup(g))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(228, 211, 174, 0.2)',
            padding: isExpanded ? '0.85rem 1rem' : '0.85rem 0',
            backgroundColor: '#170E0B',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isExpanded ? 'stretch' : 'center',
            gap: '0.5rem',
          }}
        >
          {isExpanded && (
            <div style={{ minWidth: 0, marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#E4D3AE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#9E8E7D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
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
              color: '#FF8A80',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
            title="Sign out of Super Admin Console"
          >
            <LogOut style={{ width: 16, height: 16 }} />
            {isExpanded && <span>Exit Super Admin</span>}
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
              backgroundColor: '#1E140F',
              borderRight: '1px solid rgba(228, 211, 174, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                height: 64,
                borderBottom: '1px solid rgba(228, 211, 174, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.25rem',
                backgroundColor: '#170E0B',
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#E4D3AE', fontSize: '0.95rem' }}>
                SUPER ADMIN
              </span>
              <button onClick={onMobileClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E4D3AE' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.6rem' }}>
              {superAdminNavGroups.map((g) => renderNavGroup(g, true))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
