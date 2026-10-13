'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Mail, Phone, MapPin, Award } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

export default function VerifiedArtisansPage() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtisans() {
      try {
        const { data, error } = await supabase
          .from('artisan_applications')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setArtisans(data);
        }
      } catch (err) {
        console.error('Error fetching verified artisans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArtisans();
  }, []);

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0 }}>
          Verified Guilds & Master <span style={{ color: 'var(--maharani-maroon)' }}>Artisans</span> ({artisans.length})
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '1.05rem', color: '#4A3E36', fontFamily: 'var(--font-subtitle)' }}>
          Directory of all officially approved artisan partners preserving India&apos;s heritage weaves.
        </p>
      </div>

      {loading ? (
        <AdminPageLoadingBlock minHeight="220px" message="Loading verified artisan roster..." />
      ) : artisans.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
            color: 'var(--stone-taupe)',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--gargi-gold)' }}>
            <Award style={{ width: 22, height: 22 }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ink-brown)', margin: '0 0 0.5rem' }}>
            No Verified Artisans Yet
          </h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--stone-taupe)', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
            Artisans approved through the Application Inbox will be listed here.
          </p>
          <Link
            href="/admin/artisans/applications"
            style={{
              display: 'inline-block',
              padding: '0.55rem 1.2rem',
              backgroundColor: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.82rem',
              fontFamily: 'var(--font-nav)',
            }}
          >
            Review Applications Queue
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {artisans.map((a) => (
            <div
              key={a.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '10px',
                padding: '1.5rem',
                boxShadow: '0 2px 12px rgba(43,31,24,0.03)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink-brown)', margin: '0 0 0.25rem' }}>
                {a.name}
              </h3>
              <div style={{ fontSize: '0.95rem', color: 'var(--stone-taupe)', marginBottom: '0.75rem' }}>
                {a.type_of_art || 'Master Handloom'} &bull; {a.state || 'India'}
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--ink-brown)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>Email: {a.email || '—'}</div>
                <div>Phone: {a.phone || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
