'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Sparkles,
  Award,
  Check,
  Edit2,
  Save,
  Package,
  Clock,
  Heart,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Loader2,
  Eye,
} from 'lucide-react';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

interface ArtisanProfile {
  artisanNo: string;
  applicationId: string;
  name: string;
  role: string;
  region: string;
  lineage: string;
  experienceYears: number;
  loomHoursTotal: string;
  profileImage: string;
  workshopImage: string;
  philosophy: string;
  bio: string;
  specialties: string[];
  awards: string[];
  communityImpact: string;
  contactEmail: string;
  contactPhone: string;
}

export default function ArtistProfileAdminPage() {
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form edit state
  const [editForm, setEditForm] = useState<ArtisanProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profRes, prodRes] = await Promise.all([
        fetch('/api/admin/artisans/profile'),
        fetch('/api/admin/products'),
      ]);

      const profData = await profRes.json();
      const prodData = await prodRes.json();

      if (profData.success && profData.profile) {
        setProfile(profData.profile);
        setEditForm(profData.profile);
      }

      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }
    } catch (err) {
      console.error('Error loading artist profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setSaving(true);
    setSaveSuccess('');

    try {
      const res = await fetch('/api/admin/artisans/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setSaveSuccess('Artisan public storefront profile updated successfully!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile || !editForm) {
    return <AdminPageLoadingBlock minHeight="300px" message="Loading artist public profile..." />;
  }

  return (
    <div>
      {/* ════════════ PAGE HEADER ════════════ */}
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--maharani-maroon)' }}>
            Artisan Governance &amp; Storefront Dossier
          </span>
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink-brown)', margin: 0, lineHeight: 1.2 }}>
          Artist Profile: <span style={{ color: 'var(--maharani-maroon)' }}>{profile.name}</span> ({profile.artisanNo})
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: '#4A3E36', fontSize: '1.05rem' }}>
          This dossier represents the exact public profile displayed to patrons when they click on the master artisan name in any product description across the boutique.
        </p>
      </div>

      {/* ════════════ TWO COLUMN LAYOUT: LIVE CUSTOMER PREVIEW & ADMIN EDITOR ════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: LIVE CUSTOMER STOREFRONT PREVIEW ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Eye size={17} color="var(--maharani-maroon)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--maharani-maroon)' }}>
                Patron Storefront Modal Preview
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#8C7B70' }}>Clicking artisan name on PDP opens this view</span>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid var(--soft-gold-line)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(43,31,24,0.08)',
              position: 'relative',
            }}
          >
            {/* Royal Top Ribbon */}
            <div
              style={{
                background: 'linear-gradient(90deg, #7A2331 0%, #9B2D3E 50%, #7A2331 100%)',
                padding: '0.85rem 1.25rem',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Crown size={18} color="#E4D3AE" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  House of Gargi Master Artisan Dossier
                </span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.88rem', color: '#E4D3AE', background: 'rgba(0,0,0,0.25)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                {editForm.artisanNo}
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: '1.75rem' }}>
              {/* Profile Card Header */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2.5px solid var(--gargi-gold)',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(122, 35, 49, 0.2)',
                  }}
                >
                  <img src={editForm.profileImage} alt={editForm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                      {editForm.name}
                    </h2>
                    <ShieldCheck size={20} color="#2E7D32" title="Verified Master Artisan" />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--maharani-maroon)', marginTop: '2px' }}>
                    {editForm.role}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6A5A50', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '4px' }}>
                    <MapPin size={13} color="var(--stone-taupe)" />
                    <span>{editForm.region}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  background: '#FAF7F2',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.4rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                    Lineage Experience
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-brown)', marginTop: '2px' }}>
                    {editForm.experienceYears}+ Years Weaving
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                    Craft Preservation
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--maharani-maroon)', marginTop: '2px' }}>
                    {editForm.loomHoursTotal}
                  </div>
                </div>
              </div>

              {/* Philosophy Quote */}
              <div
                style={{
                  borderLeft: '3px solid var(--gargi-gold)',
                  paddingLeft: '1rem',
                  fontStyle: 'italic',
                  fontFamily: 'serif',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-brown)',
                  marginBottom: '1.4rem',
                }}
              >
                &ldquo;{editForm.philosophy}&rdquo;
              </div>

              {/* Biography */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Artisan Heritage &amp; Craft Bio
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: '#4A3E36' }}>
                  {editForm.bio}
                </p>
              </div>

              {/* Specialties Tags */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.5rem' }}>
                  Master Specialties
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {editForm.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#FAF7F2',
                        border: '1px solid var(--soft-gold-line)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--ink-brown)',
                      }}
                    >
                      ✦ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Registered Catalog Items (18 items) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-brown)' }}>
                    Handcrafted Catalog by {editForm.name} ({products.length} Creations)
                  </div>
                  <Link href="/admin/products" style={{ fontSize: '0.8rem', color: 'var(--maharani-maroon)', fontWeight: 700, textDecoration: 'none' }}>
                    Manage in Total Catalog &rarr;
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {products.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        background: '#FAF7F2',
                        border: '1px solid var(--soft-gold-line)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        padding: '0.5rem',
                      }}
                    >
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '84px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--ink-brown)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--maharani-maroon)' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: ADMIN CURATION & PROFILE EDITOR ── */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 2px 14px rgba(43,31,24,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--soft-gold-line)' }}>
            <Edit2 size={18} color="var(--maharani-maroon)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
              Curate Public Profile
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Name & Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Artisan Full Legal Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.94rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Master Role / Craft Title
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.94rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Region & Lineage */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                Workshop Region &amp; District
              </label>
              <input
                type="text"
                value={editForm.region}
                onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.94rem', boxSizing: 'border-box' }}
              />
            </div>

            {/* Experience & Loom Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={editForm.experienceYears}
                  onChange={(e) => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.94rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Loom Hours Statement
                </label>
                <input
                  type="text"
                  value={editForm.loomHoursTotal}
                  onChange={(e) => setEditForm({ ...editForm, loomHoursTotal: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.94rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Philosophy Quote */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                Master Philosophy Quote (Shown in Italics)
              </label>
              <textarea
                rows={3}
                value={editForm.philosophy}
                onChange={(e) => setEditForm({ ...editForm, philosophy: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', lineHeight: 1.5, boxSizing: 'border-box' }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                Craft Heritage &amp; Atelier Biography
              </label>
              <textarea
                rows={5}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', lineHeight: 1.55, boxSizing: 'border-box' }}
              />
            </div>

            {/* Community Impact */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                Community &amp; Rural Impact
              </label>
              <input
                type="text"
                value={editForm.communityImpact}
                onChange={(e) => setEditForm({ ...editForm, communityImpact: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.94rem', boxSizing: 'border-box' }}
              />
            </div>

            {saveSuccess && (
              <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.75rem 1rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} />
                <span>{saveSuccess}</span>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '0.65rem 1.65rem',
                  backgroundColor: 'var(--maharani-maroon)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(122, 35, 49, 0.2)',
                }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Public Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
