'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import {
  Landmark,
  DollarSign,
  Flame,
  ShieldCheck,
  FolderTree,
  Grid,
  ExternalLink,
  LogOut,
  X,
  Loader2,
  Shield,
  Layers,
  Sparkles,
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
                  borderRadius: '4px',
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

      {/* Desktop Floating Sidebar with Royal Ivory / Gold Theme */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 90,
          width: isExpanded ? '264px' : '72px',
          backgroundColor: '#FAF7F2',
          borderRight: '1px solid var(--soft-gold-line)',
          transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
          boxShadow: isExpanded ? '4px 0 24px rgba(43,31,24,0.06)' : 'none',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        {/* Top Brand Logo Lockup */}
        <div
          style={{
            height: '72px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            padding: isExpanded ? '0 1rem' : '0',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            borderBottom: '1px solid var(--soft-gold-line)',
            backgroundColor: '#FAF7F2',
          }}
        >
          <Link
            href="/super-admin/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 4,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <img
                src="/logo-images/small-logo.png"
                alt="House of Gargi"
                style={{ width: 26, height: 26, objectFit: 'contain' }}
              />
            </div>
            {isExpanded && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  animation: 'fadeInText 0.22s ease forwards',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--ink-brown)',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  House of Gargi
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--maharani-maroon)',
                  }}
                >
                  Super Admin Console
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Groups */}
        <div
          style={{
            flex: 1,
            padding: '1rem 0.5rem',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {superAdminNavGroups.map((group) => renderNavGroup(group))}
        </div>

        {/* User Card & Logout Footer */}
        <div
          style={{
            flexShrink: 0,
            borderTop: '1px solid var(--soft-gold-line)',
            padding: isExpanded ? '0.85rem' : '0.75rem 0',
            backgroundColor: '#FAF7F2',
          }}
        >
          {isExpanded ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                animation: 'fadeInText 0.22s ease forwards',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 4,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--soft-gold-line)',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid var(--maharani-maroon)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--maharani-maroon)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--ink-brown)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--stone-taupe)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userEmail}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 2,
                    backgroundColor: '#FAF0E6',
                    color: 'var(--maharani-maroon)',
                    border: '1px solid rgba(122, 35, 49, 0.2)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Executive Access
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    color: 'var(--stone-taupe)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: '0.2rem 0.4rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--maharani-maroon)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone-taupe)')}
                >
                  <LogOut style={{ width: 14, height: 14 }} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--soft-gold-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--maharani-maroon)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
                title={`${userName} (${userEmail})`}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--stone-taupe)',
                  cursor: 'pointer',
                }}
                title="Sign Out"
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--maharani-maroon)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone-taupe)')}
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
          }}
          className="lg:hidden"
        >
          <div
            onClick={onMobileClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(35, 24, 18, 0.4)',
              backdropFilter: 'blur(2px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '280px',
              maxWidth: '85vw',
              backgroundColor: '#FAF7F2',
              borderRight: '1px solid var(--soft-gold-line)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(43,31,24,0.15)',
              zIndex: 101,
            }}
          >
            {/* Header */}
            <div
              style={{
                height: '64px',
                padding: '0 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--soft-gold-line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src="/logo-images/small-logo.png"
                  alt="House of Gargi"
                  style={{ width: 26, height: 26, objectFit: 'contain' }}
                />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink-brown)' }}>
                  Super Admin
                </span>
              </div>
              <button
                type="button"
                onClick={onMobileClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FFFFFF',
                  color: 'var(--ink-brown)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Nav list */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
              {superAdminNavGroups.map((group) => renderNavGroup(group, true))}
            </div>

            {/* Mobile Footer */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--soft-gold-line)', backgroundColor: '#FAF7F2' }}>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--maharani-maroon)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
