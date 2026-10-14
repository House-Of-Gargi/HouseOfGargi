'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  X,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

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
  const displayRole = data.role || data.artStyle || 'Master Tangail Jamdani Pit Loom Weaver';
  const displayRegion = data.region || data.regionalBelonging || 'Shantipur, Nadia, West Bengal, India';
  const displayExperience = data.experience || `${data.experienceYears || 32}+ Years Weaving`;
  const displayImage = data.profileImage || '/images/artisans_split.png';
  const displayBio = data.bio || data.description || 'Rooted in the historic weaving cluster of Shantipur, Nadia, Master Gopal Chandra Dey preserves the centuries-old royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to hand-craft timeless heirloom drapes originally celebrated in Royal Bengal courts.';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(35, 24, 18, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--soft-gold-line)',
          borderRadius: '14px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon */}
        <div
          style={{
            background: 'linear-gradient(90deg, #7A2331 0%, #9B2D3E 50%, #7A2331 100%)',
            padding: '0.85rem 1.4rem',
            color: '#FAF7F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={17} color="#E4D3AE" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              House of Gargi Master Artisan Dossier
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#FAF7F2',
              display: 'flex',
              padding: '2px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          {/* Header Card (NO ARTISAN NUMBER) */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '82px',
                height: '82px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid var(--gargi-gold)',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(122, 35, 49, 0.2)',
              }}
            >
              <img src={displayImage} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  {displayName}
                </h2>
                <span title="Verified Master Artisan">
                  <ShieldCheck size={19} color="#2E7D32" />
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--maharani-maroon)', marginTop: '2px' }}>
                {displayRole}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6A5A50', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '3px' }}>
                <MapPin size={13} color="var(--stone-taupe)" />
                <span>{displayRegion}</span>
              </div>
            </div>
          </div>

          {/* Stats Bar (Single Lineage Experience stat, NO craft preservation) */}
          <div
            style={{
              background: '#FAF7F2',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
              Lineage Experience
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-brown)', marginTop: '2px' }}>
              {displayExperience}
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
              Craft Heritage &amp; Lineage
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: '#4A3E36' }}>
              {displayBio}
            </p>
          </div>

          {/* Direct CTA to the Artisan Dedicated Products Page */}
          <Link
            href="/artisan/HG-84192"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.92rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(122, 35, 49, 0.2)',
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
