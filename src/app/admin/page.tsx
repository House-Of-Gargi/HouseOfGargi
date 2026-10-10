'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Sparkles,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/applications');
        const data = await res.json();
        if (data.success && data.applications) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const approvedApps = applications.filter((a) => a.status === 'approved');

  return (
    <div>
      {/* Top Welcome Banner */}
      <div
        style={{
          borderBottom: '1px solid var(--soft-gold-line)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--maharani-maroon)',
              fontFamily: 'var(--font-nav)',
            }}
          >
            Operations & Curation Command Center
          </span>
          <span style={{ fontSize: '0.65rem', background: '#E8F5E9', color: '#2E7D32', padding: '0.15rem 0.5rem', borderRadius: 2, fontWeight: 700 }}>
            Active Desk
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--ink-brown)',
            margin: 0,
          }}
        >
          Artisan Operations & Quality Hub
        </h1>
        <p style={{ margin: 0, color: 'var(--stone-taupe)', fontSize: '0.92rem' }}>
          Review artisan questionnaire applications, inspect master handloom creations, and oversee boutique fulfillment.
        </p>
      </div>

      {/* 4 HUD Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Card 1: Pending Applications */}
        <Link
          href="/admin/artisans/applications"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Artisan Applications
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 2, background: '#FBF6EE', color: 'var(--maharani-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ margin: '1rem 0 0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--maharani-maroon)', fontFamily: 'var(--font-serif)' }}>
              {pendingApps.length}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginLeft: '0.5rem' }}>Awaiting Review</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--maharani-maroon)', fontWeight: 600 }}>
            <span>Open Application Inbox</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>

        {/* Card 2: Product QC Approvals */}
        <Link
          href="/admin/products/approvals"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Product QC Queue
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 2, background: '#FBF6EE', color: 'var(--gargi-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ margin: '1rem 0 0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
              4
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginLeft: '0.5rem' }}>Pending Curation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
            <span>Review submitted pieces</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>

        {/* Card 3: Verified Guilds */}
        <Link
          href="/admin/artisans"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Verified Guilds
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 2, background: '#FBF6EE', color: 'var(--peacock-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ margin: '1rem 0 0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
              {12 + approvedApps.length}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginLeft: '0.5rem' }}>Active Workshops</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
            <span>Manage artisan profiles</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>

        {/* Card 4: Orders in Fulfillment */}
        <Link
          href="/admin/orders"
          style={{
            textDecoration: 'none',
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Loom Orders
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 2, background: '#FBF6EE', color: 'var(--ink-brown)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ margin: '1rem 0 0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink-brown)', fontFamily: 'var(--font-serif)' }}>
              14
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--stone-taupe)', marginLeft: '0.5rem' }}>In Weaving / Dispatch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
            <span>Dispatch tracking</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </div>
        </Link>
      </div>

      {/* Main Split Section: Urgent Action Stream & Pending Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                New Artisan Applications (Questionnaires)
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>
                Directly submitted via /seller/apply for Admin team onboarding
              </p>
            </div>
            <Link
              href="/admin/artisans/applications"
              style={{
                fontSize: '0.8rem',
                color: 'var(--maharani-maroon)',
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid var(--soft-gold-line)',
                padding: '0.35rem 0.75rem',
                borderRadius: 2,
              }}
            >
              View All ({applications.length})
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--stone-taupe)' }}>
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--stone-taupe)', background: '#FAF7F2', borderRadius: 4 }}>
              No applications submitted yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app.applicationId}
                  style={{
                    padding: '1rem',
                    border: '1px solid #EAE2D5',
                    borderRadius: 4,
                    backgroundColor: '#FAF7F2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink-brown)' }}>
                        {app.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: 2,
                          backgroundColor:
                            app.status === 'approved'
                              ? '#E8F5E9'
                              : app.status === 'rejected'
                              ? '#FFEBEE'
                              : '#FFF3E0',
                          color:
                            app.status === 'approved'
                              ? '#2E7D32'
                              : app.status === 'rejected'
                              ? '#C62828'
                              : '#E65100',
                          textTransform: 'uppercase',
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', marginTop: '0.2rem' }}>
                      {app.typeOfArt} &bull; {app.state} &bull; ID: <code>{app.applicationId}</code>
                    </div>
                  </div>

                  <Link
                    href={'/admin/artisans/applications?id=' + app.applicationId}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 2,
                      backgroundColor: 'var(--maharani-maroon)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Inspect Dossier
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operational Curation Checklist */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: 4,
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.3rem', color: 'var(--ink-brown)' }}>
            Atelier Quality Control Standards
          </h2>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>
            Admin curation guidelines for verifying incoming artisan submissions
          </p>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: '#FAF7F2', borderRadius: 4 }}>
              <ShieldCheck style={{ width: 20, height: 20, color: 'var(--peacock-teal)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  Child Labor Agreement & Ethics
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--stone-taupe)', marginTop: 2 }}>
                  Verify that the artisan has signed the Child Labor Agreement and consented to workshop inspections.
                </div>
              </div>
            </li>

            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: '#FAF7F2', borderRadius: 4 }}>
              <Sparkles style={{ width: 20, height: 20, color: 'var(--gargi-gold)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  Pure Silk & Natural Fiber Purity
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--stone-taupe)', marginTop: 2 }}>
                  Ensure products carry Silk Mark, Handloom Mark, or certified natural zari certifications before storefront publishing.
                </div>
              </div>
            </li>

            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: '#FAF7F2', borderRadius: 4 }}>
              <Clock style={{ width: 20, height: 20, color: 'var(--maharani-maroon)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-brown)' }}>
                  Loom Production Lead-Time SLAs
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--stone-taupe)', marginTop: 2 }}>
                  Audit ready-to-ship vs made-to-order loom lead times so patron expectations are met flawlessly.
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
