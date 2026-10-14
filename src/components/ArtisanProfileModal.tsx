'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Sparkles,
  Award,
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Package,
  Heart,
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/admin/artisans/profile')
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.profile) {
            setProfile(d.profile);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = profile || {
    name: artisanName,
    artisanNo: artisanCode,
    role: 'Master Tangail Jamdani Pit Loom Weaver',
    region: 'Shantipur, Nadia, West Bengal, India',
    lineage: '4th Generation Pit Loom Lineage (Trained by Late Narayan Chandra Dey)',
    experienceYears: 32,
    loomHoursTotal: '15,000+ Loom Hours Preserved',
    profileImage: '/images/artisans_split.png',
    philosophy: 'In Shantipur, every Jamdani motif is a sacred prayer of rhythm, breath, and patience. When the shuttle moves across mulberry silk on our pit loom, time stands still.',
    bio: 'Rooted in the historic weaving cluster of Shantipur, Nadia, Master Gopal Chandra Dey preserves the centuries-old royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to hand-craft timeless heirloom drapes originally celebrated in Royal Bengal courts.',
    specialties: [
      'Tangail Jamdani Pit Loom Weave',
      '100% Murshidabad Mulberry Silk',
      'Tested Real Silver & Gold Zari',
      'Natural AZO-Free Vegetable Dyes',
      'Terracotta & Geometric Peacock Motifs',
    ],
    communityImpact: 'Regular fair-wage employment for 14 rural weaver families and flexible home-spinning shifts for women artisans in Nadia district.',
  };

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
          maxWidth: '680px',
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
          {/* Header Card */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.4rem' }}>
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
              <img src={data.profileImage} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-brown)' }}>
                  {data.name}
                </h2>
                <span title="Verified Master Artisan"><ShieldCheck size={19} color="#2E7D32" /></span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--maharani-maroon)', marginTop: '2px' }}>
                {data.role}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6A5A50', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '3px' }}>
                <MapPin size={13} color="var(--stone-taupe)" />
                <span>{data.region}</span>
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
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                Lineage Experience
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-brown)', marginTop: '2px' }}>
                {data.experienceYears}+ Years Weaving
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 700 }}>
                Craft Preservation
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--maharani-maroon)', marginTop: '2px' }}>
                {data.loomHoursTotal}
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
              fontSize: '0.98rem',
              lineHeight: 1.6,
              color: 'var(--ink-brown)',
              marginBottom: '1.4rem',
              background: '#FAF7F2',
              padding: '0.85rem 1rem 0.85rem 1.15rem',
              borderRadius: '0 8px 8px 0',
            }}
          >
            &ldquo;{data.philosophy}&rdquo;
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '1.4rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.35rem' }}>
              Craft Heritage &amp; Lineage
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: '#4A3E36' }}>
              {data.bio}
            </p>
          </div>

          {/* Specialties */}
          <div style={{ marginBottom: '1.4rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5043', marginBottom: '0.45rem' }}>
              Signature Techniques &amp; Materials
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {data.specialties.map((s: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    background: '#FAF7F2',
                    border: '1px solid var(--soft-gold-line)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 4,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--ink-brown)',
                  }}
                >
                  ✦ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Community Impact */}
          <div
            style={{
              background: '#F1F8E9',
              border: '1px solid #C8E6C9',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <Award size={20} color="#2E7D32" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#1B5E20', lineHeight: 1.45 }}>
              <strong>Fair-Wage Artisan Guild Certified:</strong> {data.communityImpact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
