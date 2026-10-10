'use client';

import Link from 'next/link';
import {
  Landmark,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Flame,
  FolderTree,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminOverviewPage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Executive Platform Governance
          </span>
          <span style={{ fontSize: '0.65rem', background: '#FFF3E0', color: '#E65100', padding: '0.15rem 0.5rem', borderRadius: 2, fontWeight: 700 }}>
            Super Admin Only
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          House of Gargi Executive Dashboard
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.92rem' }}>
          Global marketplace oversight: platform GMV, take-rate revenue, admin team privileges, category architecture, and sales velocity.
        </p>
      </div>

      {/* 4 Macro Metric Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* Metric 1: Total GMV */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>
            Gross Merchandise Value (GMV)
          </span>
          <div style={{ margin: '0.75rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
              ₹14,84,000
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>
            +28.4% MTD Growth
          </span>
        </div>

        {/* Metric 2: Net House of Gargi Commission */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>
            Net Platform Take-Rate (15%)
          </span>
          <div style={{ margin: '0.75rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)' }}>
              ₹2,22,600
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>
            Cleared commission profit
          </span>
        </div>

        {/* Metric 3: Hot Products */}
        <Link href="/super-admin/bestsellers" style={{ textDecoration: 'none', background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>
              Hot Velocity Products
            </span>
            <Flame style={{ width: 18, height: 18, color: '#E65100' }} />
          </div>
          <div style={{ margin: '0.75rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
              5 Top Items
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--maharani-maroon)', fontWeight: 600 }}>
            View Bestsellers Intelligence &rarr;
          </span>
        </Link>

        {/* Metric 4: Admin Team Count */}
        <Link href="/super-admin/admins" style={{ textDecoration: 'none', background: '#FFFFFF', border: '1.5px solid var(--soft-gold-line)', borderRadius: 4, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase' }}>
              Admin Operations Staff
            </span>
            <Users style={{ width: 18, height: 18, color: 'var(--peacock-teal)' }} />
          </div>
          <div style={{ margin: '0.75rem 0 0.25rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
              4 Active
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
            Manage Admins & Privileges &rarr;
          </span>
        </Link>
      </div>

      {/* Quick Access Grid for Super Admin Core Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Link
          href="/super-admin/admins"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--maharani-maroon)', marginBottom: '0.5rem' }}>
            <ShieldCheck style={{ width: 22, height: 22 }} />
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-brown)' }}>
              Manage Admins & Privileges
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--stone-taupe)', lineHeight: 1.5 }}>
            Invite operations curators, assign permission roles (e.g., approve products, review questionnaires), or instantly revoke admin access.
          </p>
        </Link>

        <Link
          href="/super-admin/categories"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gargi-gold)', marginBottom: '0.5rem' }}>
            <FolderTree style={{ width: 22, height: 22 }} />
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-brown)' }}>
              Manage Categories & Taxonomies
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--stone-taupe)', lineHeight: 1.5 }}>
            Create and edit luxury categories (Sarees, Lehengas, Jewellery, Bespoke), Sanskrit lipi titles, banners, and homepage navigation order.
          </p>
        </Link>

        <Link
          href="/super-admin/bestsellers"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#E65100', marginBottom: '0.5rem' }}>
            <Flame style={{ width: 22, height: 22 }} />
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-brown)' }}>
              Hot & Best Selling Products
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--stone-taupe)', lineHeight: 1.5 }}>
            Analyze sales velocity, rank items by revenue, and pin top pieces directly to the storefront Hero Carousel or Featured Curations.
          </p>
        </Link>
      </div>
    </div>
  );
}
