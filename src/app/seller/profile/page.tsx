'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Upload, 
  Check, 
  Loader2, 
  ExternalLink, 
  Sparkles, 
  Camera, 
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import ArtisanProfileModal from '@/components/ArtisanProfileModal';
import ArtisanQuestionnaireDossier from '@/components/ArtisanQuestionnaireDossier';

export default function PersonalArtisanProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'public_profile' | 'questionnaire'>('public_profile');
  const [application, setApplication] = useState<any>(null);

  // Check URL tab parameter on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'questionnaire' || tab === 'dossier' || tab === 'answers') {
        setActiveTab('questionnaire');
      }
    }
  }, []);

  // Profile Form Fields
  const [id, setId] = useState('HG-ART-260501');
  const [artisanNo, setArtisanNo] = useState('HG-84192');
  const [name, setName] = useState('Gopal Chandra Dey');
  const [artStyle, setArtStyle] = useState('Maharaja Embroidary Design');
  const [regionalBelonging, setRegionalBelonging] = useState('Kolkata, West Bengal');
  const [experience, setExperience] = useState('32 Years');
  const [description, setDescription] = useState(
    'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft heirloom drapes.'
  );
  const [profileImage, setProfileImage] = useState('/images/artisans_split.png');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Load existing profile and onboarding application on mount
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        setLoading(true);

        // Check if user has an email in local storage
        let queryEmail = '';
        try {
          const sess = localStorage.getItem('artisan_session') || localStorage.getItem('auth_session');
          if (sess) {
            const parsed = JSON.parse(sess);
            if (parsed.email) queryEmail = parsed.email;
          }
        } catch {}

        const res = await fetch('/api/artisan/profile' + (queryEmail ? `?email=${encodeURIComponent(queryEmail)}` : ''));
        const data = await res.json();

        if (isMounted && data.success) {
          if (data.profile) {
            const p = data.profile;
            setId(p.id || 'HG-ART-260501');
            setArtisanNo(p.artisanNo || 'HG-84192');
            setName(p.name || 'Gopal Chandra Dey');
            setArtStyle(p.artStyle || p.role || 'Maharaja Embroidary Design');
            setRegionalBelonging(p.regionalBelonging || p.region || 'Kolkata, West Bengal');
            setExperience(p.experience || (p.experienceYears ? `${p.experienceYears} Years` : '32 Years'));
            setDescription(
              p.description ||
              p.bio ||
              'Master weaver preserving 4 generations of royal Jamdani pit-loom craft. Mentoring 14 rural weaver families, his workshop utilizes 100% certified Murshidabad mulberry silk, combed fine cotton, and natural AZO-free dyes to handcraft heirloom drapes.'
            );
            setProfileImage(p.profileImage || p.image || '/images/artisans_split.png');
          }

          if (data.application) {
            setApplication(data.application);
          }
        }
      } catch (err) {
        console.error('Error fetching artisan profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle local file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      if (uploadEvt.target?.result) {
        setProfileImage(uploadEvt.target.result as string);
      }
      setUploadingPhoto(false);
    };
    reader.onerror = () => setUploadingPhoto(false);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle direct image URL input
  const handleApplyImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setProfileImage(trimmed);
    setImageUrlInput('');
  };

  // Submit & Save Profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');

    try {
      const payload = {
        id,
        artisanNo,
        name: name.trim(),
        artStyle: artStyle.trim(),
        role: artStyle.trim(),
        regionalBelonging: regionalBelonging.trim(),
        region: regionalBelonging.trim(),
        experience: experience.trim(),
        description: description.trim(),
        bio: description.trim(),
        profileImage,
        image: profileImage,
      };

      const res = await fetch('/api/artisan/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Artisan profile updated and published 100% live on customer portal!');
        
        // Update local session if needed so top bar/sidebar relects new name
        try {
          const sess = localStorage.getItem('artisan_session');
          if (sess) {
            const parsed = JSON.parse(sess);
            parsed.name = name.trim();
            localStorage.setItem('artisan_session', JSON.stringify(parsed));
          }
        } catch {}
      } else {
        setSaveSuccess('Failed to update: ' + (data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Error saving artisan profile:', err);
      setSaveSuccess('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <Loader2 style={{ width: 36, height: 36, animation: 'spin 1s linear infinite', color: 'var(--maharani-maroon)' }} />
        <span style={{ fontSize: '0.95rem', color: 'var(--ink-brown)', fontWeight: 600 }}>Loading Master Artisan Profile...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* ── Top Header Card (Conforming to Atelier Dashboard Style) ── */}
      <div 
        className="atelier-header-card" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1.25rem',
          marginBottom: '2rem' 
        }}
      >
        <div className="atelier-title-group" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div 
            className="atelier-title-icon"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#FAF7F2',
              border: '1.5px solid var(--soft-gold-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--maharani-maroon)',
              flexShrink: 0,
            }}
          >
            <UserCheck style={{ width: 26, height: 26 }} />
          </div>
          <div>
            <h1 
              className="atelier-page-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Artisan Public <span style={{ color: 'var(--maharani-maroon)' }}>Profile</span>
            </h1>
            <p style={{ fontSize: '0.96rem', color: '#4A3E36', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Personal craft dossier &bull; Automatically published live on customer product dossiers &amp; storefront
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            style={{
              background: 'var(--pure-white)',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '4px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 500,
              color: 'var(--ink-brown)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(43, 31, 24, 0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles style={{ width: 15, height: 15, color: 'var(--gargi-gold)' }} />
            View Live Customer Popup
          </button>

          <Link
            href={`/artisan/${artisanNo}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#FAF7F2',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '4px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 500,
              color: 'var(--maharani-maroon)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(43, 31, 24, 0.04)',
            }}
          >
            <span>Preview Boutique Storefront</span>
            <ExternalLink style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>

      {/* ── Segmented Navigation Tabs ── */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          borderBottom: '1.5px solid var(--soft-gold-line, #E4D3AE)',
          paddingBottom: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('public_profile')}
          style={{
            background: activeTab === 'public_profile' ? 'var(--maharani-maroon, #7A2331)' : '#FFFFFF',
            color: activeTab === 'public_profile' ? '#FFFFFF' : 'var(--ink-brown, #2B1F18)',
            border: activeTab === 'public_profile' ? '1px solid var(--maharani-maroon, #7A2331)' : '1.5px solid var(--soft-gold-line, #E4D3AE)',
            borderRadius: '8px',
            padding: '0.75rem 1.35rem',
            fontSize: '0.88rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: activeTab === 'public_profile' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: activeTab === 'public_profile' ? '0 4px 12px rgba(122, 35, 49, 0.2)' : '0 2px 6px rgba(43, 31, 24, 0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <UserCheck style={{ width: 17, height: 17 }} />
          <span>Public Boutique Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questionnaire')}
          style={{
            background: activeTab === 'questionnaire' ? 'var(--maharani-maroon, #7A2331)' : '#FFFFFF',
            color: activeTab === 'questionnaire' ? '#FFFFFF' : 'var(--ink-brown, #2B1F18)',
            border: activeTab === 'questionnaire' ? '1px solid var(--maharani-maroon, #7A2331)' : '1.5px solid var(--soft-gold-line, #E4D3AE)',
            borderRadius: '8px',
            padding: '0.75rem 1.35rem',
            fontSize: '0.88rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: activeTab === 'questionnaire' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: activeTab === 'questionnaire' ? '0 4px 12px rgba(122, 35, 49, 0.2)' : '0 2px 6px rgba(43, 31, 24, 0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <FileText style={{ width: 17, height: 17 }} />
          <span>Heritage Questionnaire &amp; Dossier</span>
          <span
            style={{
              fontSize: '0.72rem',
              background: activeTab === 'questionnaire' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(122, 35, 49, 0.08)',
              color: activeTab === 'questionnaire' ? '#FFFFFF' : 'var(--maharani-maroon, #7A2331)',
              padding: '2px 7px',
              borderRadius: '10px',
              fontWeight: 700,
              marginLeft: '0.25rem',
            }}
          >
            14 Q&amp;As
          </span>
        </button>
      </div>

      {/* ── Tab Content Switcher ── */}
      {activeTab === 'questionnaire' ? (
        <ArtisanQuestionnaireDossier
          application={application}
          artisanName={name}
          artisanCode={artisanNo || id}
          onSwitchToProfileTab={() => setActiveTab('public_profile')}
        />
      ) : (
        <>
          {/* Helpful callout card to Questionnaire */}
          <div
            className="no-print"
            style={{
              background: 'linear-gradient(135deg, #FAF7F2 0%, #FFFFFF 100%)',
              border: '1.5px solid var(--soft-gold-line, #E4D3AE)',
              borderLeft: '4px solid var(--maharani-maroon, #7A2331)',
              borderRadius: '8px',
              padding: '1rem 1.35rem',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <BookOpen style={{ width: 22, height: 22, color: 'var(--maharani-maroon, #7A2331)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink-brown, #2B1F18)' }}>
                  Looking for your 14 Onboarding Heritage Questionnaire Answers?
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6E5D53', marginTop: '2px' }}>
                  Your craft lineage, fiber sourcing, personal memories, and signed child labor agreements are available to view.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('questionnaire')}
              style={{
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line, #E4D3AE)',
                color: 'var(--maharani-maroon, #7A2331)',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span>View 14 Questions &amp; Answers</span>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {saveSuccess && (
        <div
          style={{
            backgroundColor: '#E8F5E9',
            border: '1px solid #A5D6A7',
            color: '#1B5E20',
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 500,
            fontSize: '0.94rem',
          }}
        >
          <CheckCircle2 size={20} color="#2E7D32" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* ── Two-Column Layout: Form on Left, Live Customer Portal Preview on Right ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* ── Left Column: Edit Profile Form ── */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(43, 31, 24, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Section 1: Artisan Portrait & Identity */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>01</span>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Master Artisan Portrait &amp; Identity
              </h3>
            </div>

            {/* Photo Upload & Preview Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--gargi-gold)',
                  padding: '2px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(122, 35, 49, 0.15)',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <img
                  src={profileImage}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/artisans_split.png';
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Artisan Portrait Photo
                </label>
                
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.6rem 1rem',
                      borderRadius: 4,
                      border: '1.5px dashed var(--soft-gold-line)',
                      background: '#FAF7F2',
                      color: 'var(--ink-brown)',
                      fontWeight: 500,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={14} color="var(--maharani-maroon)" />
                    <span>{uploadingPhoto ? 'Uploading...' : 'Browse from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.65rem' }}>
                  <input
                    type="text"
                    placeholder="Or paste photo URL..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyImageUrl();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.75rem',
                      borderRadius: 4,
                      border: '1px solid var(--soft-gold-line)',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyImageUrl}
                    disabled={!imageUrlInput.trim()}
                    style={{
                      padding: '0.55rem 0.85rem',
                      borderRadius: 4,
                      border: 'none',
                      background: imageUrlInput.trim() ? 'var(--maharani-maroon)' : '#D8CBB6',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      cursor: imageUrlInput.trim() ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>

            {/* Name & ID Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Master Artisan Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gopal Chandra Dey"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Artisan ID / Code
                </label>
                <input
                  type="text"
                  value={artisanNo}
                  onChange={(e) => setArtisanNo(e.target.value)}
                  placeholder="e.g. HG-84192"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FAF7F2',
                    color: 'var(--maharani-maroon)',
                    fontFamily: 'monospace',
                    fontWeight: 500,
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Craft Style & Heritage Specs */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>02</span>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Craft Style &amp; Heritage Specifications
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                  Art Style / Craft Technique *
                </label>
                <input
                  type="text"
                  required
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="e.g. Maharaja Embroidary Design"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                    border: '1px solid var(--soft-gold-line)',
                    background: '#FFFFFF',
                    color: 'var(--ink-brown)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                    Regional Belonging *
                  </label>
                  <input
                    type="text"
                    required
                    value={regionalBelonging}
                    onChange={(e) => setRegionalBelonging(e.target.value)}
                    placeholder="e.g. Kolkata, West Bengal"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 4,
                      border: '1px solid var(--soft-gold-line)',
                      background: '#FFFFFF',
                      color: 'var(--ink-brown)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                    Lineage Experience *
                  </label>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 32 Years"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 4,
                      border: '1px solid var(--soft-gold-line)',
                      background: '#FFFFFF',
                      color: 'var(--ink-brown)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Description About the Artist */}
          <div>
            <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--maharani-maroon)', background: '#FAF7F2', padding: '2px 8px', borderRadius: 3 }}>03</span>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Description About the Artist
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.45rem' }}>
                Artisan Story &amp; Lineage Bio *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your generational craft, workshop techniques, natural materials, and heritage..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 4,
                  border: '1px solid var(--soft-gold-line)',
                  background: '#FFFFFF',
                  color: 'var(--ink-brown)',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--maharani-maroon)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--soft-gold-line)')}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ borderTop: '1px solid var(--soft-gold-line)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.85rem 2.2rem',
                borderRadius: 4,
                border: 'none',
                background: 'var(--maharani-maroon)',
                color: '#FFF',
                fontWeight: 500,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.94rem',
                fontFamily: 'var(--font-nav)',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(122, 35, 49, 0.28)',
                transition: 'opacity 0.15s ease',
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <span>Save &amp; Publish Live to Customer Portal &rarr;</span>
              )}
            </button>
          </div>
        </form>

        {/* ── Right Column: Live Customer Portal Preview Card (EXACT SCREENSHOT LAYOUT) ── */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--maharani-maroon)' }}>
              ✦ Live Customer Portal Preview
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--stone-taupe)', fontWeight: 600 }}>
              Real-Time Interactive
            </span>
          </div>

          {/* The Exact Modal / Card from the Screenshot */}
          <div
            style={{
              backgroundColor: '#FCFAF6',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: '12px',
              width: '100%',
              boxShadow: '0 12px 32px rgba(43, 31, 24, 0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
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
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    color: 'var(--maharani-maroon)',
                    letterSpacing: '0.04em',
                    marginBottom: '2px',
                  }}
                >
                  {artisanNo}
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.22rem',
                    fontWeight: 500,
                    color: 'var(--ink-brown)',
                    lineHeight: 1.25,
                  }}
                >
                  Public Profile: {name}
                </h2>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--stone-taupe)',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                &times;
              </div>
            </div>

            {/* Body */}
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
                    src={profileImage}
                    alt={name}
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
                      fontWeight: 500,
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
                      fontSize: '1.2rem',
                      fontWeight: 500,
                      color: 'var(--ink-brown)',
                    }}
                  >
                    {name}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#6E5D52' }}>
                    Artisan ID:{' '}
                    <strong style={{ color: 'var(--maharani-maroon)', fontWeight: 500 }}>
                      {artisanNo}
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
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      color: 'var(--ink-brown)',
                    }}
                  >
                    {artStyle}
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
                      {regionalBelonging}
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
                      {experience}
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
                  {description}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', fontStyle: 'italic' }}>
                  &bull; This exact dossier is presented to clients clicking on your pieces on the customer storefront &bull;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* ── Patron Modal Preview ── */}
      <ArtisanProfileModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        artisanName={name}
        artisanCode={artisanNo}
      />
    </div>
  );
}
