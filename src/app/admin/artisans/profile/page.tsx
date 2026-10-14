'use client';

import { useState, useEffect } from 'react';
import {
  Eye,
  Edit3,
  X,
  Check,
  Loader2,
  Users,
  Search,
  MapPin,
  Clock,
  Palette,
  ShieldCheck,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminPageLoadingBlock } from '@/components/admin/AdminLoadingSpinner';

interface ArtisanProfileItem {
  id: string;
  artisanNo: string;
  name: string;
  artStyle: string;
  regionalBelonging: string;
  experience: string;
  description: string;
  profileImage?: string;
  image?: string;
}

export default function ArtisanProfileTablePage() {
  const [profiles, setProfiles] = useState<ArtisanProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Modals
  const [viewingProfile, setViewingProfile] = useState<ArtisanProfileItem | null>(null);
  const [editingProfile, setEditingProfile] = useState<ArtisanProfileItem | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState<{
    name: string;
    artStyle: string;
    regionalBelonging: string;
    experience: string;
    description: string;
    profileImage: string;
  }>({
    name: '',
    artStyle: '',
    regionalBelonging: '',
    experience: '',
    description: '',
    profileImage: '/images/artisans_split.png',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/artisans/profile');
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
      } else if (data.profile) {
        setProfiles([data.profile]);
      }
    } catch (err) {
      console.error('Error fetching artisan profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenEdit = (artisan: ArtisanProfileItem) => {
    setEditingProfile(artisan);
    setEditForm({
      name: artisan.name,
      artStyle: artisan.artStyle,
      regionalBelonging: artisan.regionalBelonging,
      experience: artisan.experience,
      description: artisan.description,
      profileImage: artisan.profileImage || artisan.image || '/images/artisans_split.png',
    });
    setSaveSuccess('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    setSaving(true);
    setSaveSuccess('');

    try {
      const res = await fetch('/api/admin/artisans/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProfile.id,
          artisanNo: editingProfile.artisanNo,
          ...editForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Public profile updated successfully! Changes published live.');
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === editingProfile.id || p.artisanNo === editingProfile.artisanNo
              ? { ...p, ...editForm, profileImage: editForm.profileImage, image: editForm.profileImage }
              : p
          )
        );
        setTimeout(() => {
          setEditingProfile(null);
          setSaveSuccess('');
        }, 900);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.artStyle.toLowerCase().includes(q) ||
      p.regionalBelonging.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.artisanNo.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProfiles = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* ════════════ PAGE HEADER ════════════ */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--maharani-maroon)' }}>
            Artisan Administration
          </span>
          <span style={{ color: 'var(--gargi-gold)' }}>✦</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--stone-taupe)' }}>
            Master Atelier Directory
          </span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: 800, color: 'var(--ink-brown)', letterSpacing: '-0.02em' }}>
          Artisan Public Profiles
        </h1>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#6A5A50', maxWidth: '750px', lineHeight: 1.55 }}>
          Manage artisan biographies, regional belonging, loom heritage, and official profile pictures. All changes publish immediately to the live customer portal and dedicated artisan profile pages.
        </p>
      </div>

      {/* ════════════ METRICS BAR ════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            background: '#FAF7F2',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 2px 8px rgba(35, 24, 18, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A6B60' }}>
              Total Artisans
            </span>
            <Users size={18} color="var(--maharani-maroon)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
            {profiles.length}
          </div>
        </div>

        <div
          style={{
            background: '#FAF7F2',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 2px 8px rgba(35, 24, 18, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A6B60' }}>
              Live on Storefront
            </span>
            <ShieldCheck size={18} color="var(--gargi-gold)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--maharani-maroon)' }}>
            {profiles.length}
          </div>
        </div>

        <div
          style={{
            background: '#FAF7F2',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 2px 8px rgba(35, 24, 18, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A6B60' }}>
              Primary Art Styles
            </span>
            <Palette size={18} color="#2A6F4E" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
            Jamdani & Kadwa
          </div>
        </div>
      </div>

      {/* ════════════ SEARCH & CONTROLS ════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8A7B70',
            }}
          />
          <input
            type="text"
            placeholder="Search by name, artisan ID, art style, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.3rem',
              borderRadius: '6px',
              border: '1.5px solid var(--soft-gold-line)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.88rem',
              color: 'var(--ink-brown)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ════════════ TABLE ════════════ */}
      {loading ? (
        <AdminPageLoadingBlock message="Loading master artisan directory..." />
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(35, 24, 18, 0.05)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#FAF7F2',
                  borderBottom: '1.5px solid var(--soft-gold-line)',
                }}
              >
                <th style={{ padding: '0.95rem 1.3rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043' }}>
                  Master Artisan
                </th>
                <th style={{ padding: '0.95rem 1.3rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043' }}>
                  Art Style
                </th>
                <th style={{ padding: '0.95rem 1.3rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043' }}>
                  Regional Belonging
                </th>
                <th style={{ padding: '0.95rem 1.3rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043' }}>
                  Experience
                </th>
                <th style={{ padding: '0.95rem 1.3rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProfiles.map((artisan) => (
                <tr
                  key={artisan.id || artisan.artisanNo}
                  style={{
                    borderBottom: '1px solid #F0E8DC',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF7F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  {/* 1. Name, Photo & Artisan No */}
                  <td style={{ padding: '1rem 1.3rem', borderBottom: '1px solid #F0E8DC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1.5px solid var(--gargi-gold)',
                        padding: '1.5px',
                        background: '#FFFFFF',
                        flexShrink: 0,
                      }}>
                        <img
                          src={artisan.profileImage || artisan.image || '/images/artisans_split.png'}
                          alt={artisan.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/artisans_split.png';
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--ink-brown)', fontSize: '1rem' }}>
                          {artisan.name}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 800, color: 'var(--maharani-maroon)', marginTop: '1px' }}>
                          {artisan.artisanNo}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Art Style */}
                  <td style={{ padding: '1.1rem 1.3rem', borderBottom: '1px solid #F0E8DC' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '0.94rem' }}>
                      {artisan.artStyle}
                    </span>
                  </td>

                  {/* 3. Regional Belonging */}
                  <td style={{ padding: '1.1rem 1.3rem', borderBottom: '1px solid #F0E8DC' }}>
                    <span style={{ fontSize: '0.92rem', color: '#4A3E36', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--stone-taupe)" />
                      <span>{artisan.regionalBelonging}</span>
                    </span>
                  </td>

                  {/* 4. Experience */}
                  <td style={{ padding: '1.1rem 1.3rem', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--maharani-maroon)' }}>
                      {artisan.experience}
                    </span>
                  </td>

                  {/* 5. Actions: View Public Profile & Edit Public Profile */}
                  <td style={{ padding: '1.1rem 1.3rem', textAlign: 'right', whiteSpace: 'nowrap', borderBottom: '1px solid #F0E8DC' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                      {/* View Public Profile */}
                      <button
                        type="button"
                        onClick={() => setViewingProfile(artisan)}
                        style={{
                          padding: '0.5rem 0.95rem',
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid var(--soft-gold-line)',
                          color: 'var(--ink-brown)',
                          borderRadius: '5px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gargi-gold)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--soft-gold-line)')}
                      >
                        <Eye size={14} />
                        <span>View Public Profile</span>
                      </button>

                      {/* Edit Public Profile */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(artisan)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--maharani-maroon)',
                          border: '1.5px solid var(--maharani-maroon)',
                          color: '#FFFFFF',
                          borderRadius: '5px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 2px 6px rgba(122, 35, 49, 0.15)',
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Public Profile</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ════════════ PAGINATION BAR (5 ITEMS PER PAGE) ════════════ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.4rem',
              background: '#FAF7F2',
              borderTop: '1px solid var(--soft-gold-line)',
              borderBottomLeftRadius: '11px',
              borderBottomRightRadius: '11px',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.84rem', color: '#6A5A50', fontWeight: 600 }}>
              Showing <strong>{filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong>–
              <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of{' '}
              <strong>{filtered.length}</strong> profiles
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '5px',
                  border: '1px solid var(--soft-gold-line)',
                  backgroundColor: '#FFFFFF',
                  color: currentPage === 1 ? '#A89E96' : 'var(--ink-brown)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  opacity: currentPage === 1 ? 0.6 : 1,
                }}
              >
                &larr; Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '5px',
                      border: isActive ? '1px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                      backgroundColor: isActive ? 'var(--maharani-maroon)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : 'var(--ink-brown)',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '0.38rem 0.75rem',
                  borderRadius: '5px',
                  border: '1px solid var(--soft-gold-line)',
                  backgroundColor: '#FFFFFF',
                  color: currentPage === totalPages ? '#A89E96' : 'var(--ink-brown)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  opacity: currentPage === totalPages ? 0.6 : 1,
                }}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ MODAL 1: VIEW PUBLIC PROFILE ════════════ */}
      {viewingProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setViewingProfile(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
              }}
            >
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: 'var(--maharani-maroon)' }}>
                  {viewingProfile.artisanNo}
                </span>
                <h3 style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Public Profile: {viewingProfile.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProfile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.65rem' }}>

              {/* 1. Profile Picture & Live Status Preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.15rem',
                  background: '#FAF7F2',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2.5px solid var(--gargi-gold)',
                    padding: '2px',
                    background: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(122,35,49,0.12)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={viewingProfile.profileImage || viewingProfile.image || '/images/artisans_split.png'}
                    alt={viewingProfile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/artisans_split.png';
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#E8F5E9',
                      color: '#2E7D32',
                      padding: '2px 9px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}
                  >
                    <Check size={12} /> Live on Customer Portal
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                    {viewingProfile.name}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#6E5D52', marginTop: '2px' }}>
                    Artisan ID: <strong style={{ color: 'var(--maharani-maroon)' }}>{viewingProfile.artisanNo}</strong>
                  </div>
                </div>
              </div>

              {/* 2. Metadata Box */}
              <div style={{ background: '#FAF7F2', border: '1px solid var(--soft-gold-line)', borderRadius: '8px', padding: '1.15rem', marginBottom: '1.25rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                    Art Style
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-brown)', marginTop: '2px' }}>
                    {viewingProfile.artStyle}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                      Regional Belonging
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#4A3E36', marginTop: '2px' }}>
                      {viewingProfile.regionalBelonging}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                      Experience
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--maharani-maroon)', marginTop: '2px' }}>
                      {viewingProfile.experience}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Description Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.4rem' }}>
                  Description about the Artist
                </label>
                <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-gold-line)', borderRadius: '8px', padding: '1rem', fontSize: '0.94rem', lineHeight: 1.65, color: '#3E342D' }}>
                  {viewingProfile.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ MODAL 2: EDIT PUBLIC PROFILE ════════════ */}
      {editingProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(35, 24, 18, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setEditingProfile(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--soft-gold-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAF7F2',
              }}
            >
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: 'var(--maharani-maroon)' }}>
                  {editingProfile.artisanNo}
                </span>
                <h3 style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  Edit Public Profile: {editingProfile.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ padding: '1.65rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* ── 0. PROFILE PICTURE & LIVE PREVIEW ── */}
              <div
                style={{
                  background: '#FAF7F2',
                  border: '1.5px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  padding: '1.15rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', margin: 0 }}>
                    <Camera size={15} color="var(--maharani-maroon)" />
                    <span>Artisan Profile Picture</span>
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#7A6B60', fontWeight: 600 }}>
                    Live Preview below
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {/* Left: What currently is there (Real-time Preview) */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2.5px solid var(--gargi-gold)',
                        padding: '2px',
                        background: '#FFFFFF',
                        boxShadow: '0 4px 14px rgba(122,35,49,0.12)',
                        margin: '0 auto 6px',
                      }}
                    >
                      <img
                        src={editForm.profileImage || '/images/artisans_split.png'}
                        alt="Current profile preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/artisans_split.png';
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Current Photo
                    </span>
                  </div>

                  {/* Right: Upload File or Enter URL */}
                  <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div>
                      <label
                        htmlFor="artisan-pic-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '0.55rem 1rem',
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid var(--gargi-gold)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          color: 'var(--ink-brown)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Upload size={15} color="var(--maharani-maroon)" />
                        <span>Upload New Picture</span>
                      </label>
                      <input
                        id="artisan-pic-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvt) => {
                              if (uploadEvt.target?.result) {
                                setEditForm((prev) => ({
                                  ...prev,
                                  profileImage: uploadEvt.target!.result as string,
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <span style={{ marginLeft: '10px', fontSize: '0.75rem', color: '#7A6B60' }}>
                        Supports JPG, PNG, WebP
                      </span>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={editForm.profileImage}
                        onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                        placeholder="Or enter image URL (/images/... or https://...)"
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--soft-gold-line)',
                          fontSize: '0.82rem',
                          background: '#FFFFFF',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Quick Preset Avatars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#8C7B70', fontWeight: 600 }}>Presets:</span>
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, profileImage: '/images/artisans_split.png' }))}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--soft-gold-line)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: '#5C5043',
                        }}
                      >
                        Master Weaver
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, profileImage: '/assets/artisan-hands.png' }))}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--soft-gold-line)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: '#5C5043',
                        }}
                      >
                        Hands at Loom
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, profileImage: '/images/collections/collection-sarees.jpg' }))}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--soft-gold-line)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: '#5C5043',
                        }}
                      >
                        Silk Atelier
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Artisan Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              {/* 2. Art Style */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Art Style
                </label>
                <input
                  type="text"
                  required
                  value={editForm.artStyle}
                  onChange={(e) => setEditForm({ ...editForm, artStyle: e.target.value })}
                  placeholder="e.g. Tangail Jamdani Pit Loom"
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.95rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* 3. Regional Belonging & Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Regional Belonging
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.regionalBelonging}
                    onChange={(e) => setEditForm({ ...editForm, regionalBelonging: e.target.value })}
                    placeholder="e.g. Shantipur, Nadia, West Bengal"
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                    Experience
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    placeholder="e.g. 32 Years"
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* 4. Description about the artist */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
                  Description about the Artist
                </label>
                <textarea
                  rows={4}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Master weaver preserving generations of authentic handloom heritage..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', fontSize: '0.92rem', lineHeight: 1.55, boxSizing: 'border-box' }}
                />
              </div>

              {saveSuccess && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.65rem 0.95rem', borderRadius: '6px', fontSize: '0.86rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Check size={16} />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line)' }}>
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  style={{
                    padding: '0.55rem 1rem',
                    background: '#FAF7F2',
                    border: '1px solid var(--soft-gold-line)',
                    borderRadius: '4px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.55rem 1.35rem',
                    backgroundColor: 'var(--maharani-maroon)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  <span>Save Public Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
