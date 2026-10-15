'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Check, ArrowRight } from 'lucide-react';

interface ArtisanProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisanName?: string;
  artisanCode?: string;
}

export default function ArtisanProfileModal({
  isOpen,
  onClose,
  artisanName = 'Gopal Chandra Dey',
  artisanCode = 'HG-84192',
}: ArtisanProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/artisans/profile')
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.profile) {
            setProfile(d.profile);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = profile || {};

  const displayName = data.name || artisanName || 'Gopal Chandra Dey';
  const displayCode = data.artisanNo || artisanCode || 'HG-84192';
  const displayArtStyle = data.artStyle || data.role || 'Maharaja Embroidary Design';
  const displayRegion = data.regionalBelonging || data.region || 'Kolkata, West Bengal';
  const displayExperience = data.experience || (data.experienceYears ? `${data.experienceYears} Years` : '32 Years');
  const displayImage = data.profileImage || data.image || '/images/artisans_split.png';
  const displayDescription =
    data.description ||
    data.bio ||
    'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft heirloom drapes.';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(35, 24, 18, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FCFAF6',
          border: '1.5px solid var(--soft-gold-line)',
          borderRadius: '12px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header matching screenshot ── */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--soft-gold-line)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#FAF7F2',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: 'var(--maharani-maroon)',
                letterSpacing: '0.04em',
                marginBottom: '2px',
              }}
            >
              {displayCode}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--ink-brown)',
                lineHeight: 1.25,
              }}
            >
              Public Profile: {displayName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-brown)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body Cards matching screenshot ── */}
        <div style={{ padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Card 1: Avatar & Live Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              padding: '1rem 1.15rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(43, 31, 24, 0.03)',
            }}
          >
            <div
              style={{
                width: '78px',
                height: '78px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid var(--gargi-gold)',
                padding: '2px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(122, 35, 49, 0.12)',
                flexShrink: 0,
              }}
            >
              <img
                src={displayImage}
                alt={displayName}
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
                  gap: '4px',
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  padding: '2px 9px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '4px',
                }}
              >
                <Check size={12} strokeWidth={3} />
                <span>LIVE ON CUSTOMER PORTAL</span>
              </div>
              <h3
                style={{
                  margin: '1px 0 2px',
                  fontSize: '1.22rem',
                  fontWeight: 500,
                  color: 'var(--ink-brown)',
                }}
              >
                {displayName}
              </h3>
              <div style={{ fontSize: '0.84rem', color: '#6E5D52' }}>
                Artisan ID:{' '}
                <strong style={{ color: 'var(--maharani-maroon)', fontWeight: 500 }}>
                  {displayCode}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 2: Art Style, Regional Belonging & Experience */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '8px',
              padding: '1.15rem',
              boxShadow: '0 2px 6px rgba(43, 31, 24, 0.03)',
            }}
          >
            <div style={{ marginBottom: '0.85rem' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#8C7B70',
                  fontWeight: 500,
                  marginBottom: '3px',
                }}
              >
                ART STYLE
              </div>
              <div
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 500,
                  color: 'var(--ink-brown)',
                }}
              >
                {displayArtStyle}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#8C7B70',
                    fontWeight: 500,
                    marginBottom: '3px',
                  }}
                >
                  REGIONAL BELONGING
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 500, color: 'var(--ink-brown)' }}>
                  {displayRegion}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#8C7B70',
                    fontWeight: 500,
                    marginBottom: '3px',
                  }}
                >
                  EXPERIENCE
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 500, color: 'var(--maharani-maroon)' }}>
                  {displayExperience}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Description About the Artist */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#5C5043',
                marginBottom: '6px',
              }}
            >
              DESCRIPTION ABOUT THE ARTIST
            </div>
            <div
              style={{
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                padding: '0.95rem 1.15rem',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: '#4A3E36',
                boxShadow: '0 2px 6px rgba(43, 31, 24, 0.03)',
              }}
            >
              {displayDescription}
            </div>
          </div>

          {/* Direct Link to View All Handcrafted Creations */}
          <Link
            href={`/artisan/${displayCode}`}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.8rem 1.25rem',
              backgroundColor: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(122, 35, 49, 0.2)',
              marginTop: '0.25rem',
            }}
          >
            <span>Explore All Creations by {displayName}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
