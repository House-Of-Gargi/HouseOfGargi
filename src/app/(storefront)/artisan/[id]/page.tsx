'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtisan } from '@/data/artisans';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles,
} from 'lucide-react';

interface ArtisanPageProps {
  params: Promise<{ id: string }>;
}

export default function ArtisanPage({ params }: ArtisanPageProps) {
  const { id } = use(params);
  const artisan = getArtisan(id);

  if (!artisan) {
    notFound();
  }

  // Filter products attributed to this artisan
  const allArtisanProducts = useMemo(() => {
    const list = products.filter(
      p => p.artisanId?.toLowerCase() === artisan.id.toLowerCase() ||
           p.artisanName?.toLowerCase() === artisan.name.toLowerCase()
    );
    return list.length > 0 ? list : products.slice(0, 8);
  }, [artisan]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return allArtisanProducts;
    return allArtisanProducts.filter(p => p.category === selectedCategory);
  }, [allArtisanProducts, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allArtisanProducts.length };
    categories.forEach(c => {
      counts[c.id] = allArtisanProducts.filter(p => p.category === c.id).length;
    });
    return counts;
  }, [allArtisanProducts]);

  return (
    <div className="artisan-page">
      
      {/* ── TOP NAV BAR (DESKTOP: LEFT-ALIGNED BREADCRUMB | MOBILE: BACK TO CATALOG) ── */}
      <div className="container" style={{ maxWidth: '1280px', padding: '0 20px', marginBottom: '1.75rem' }}>
        <div className="artisan-top-nav">
          <Link 
            href="/shop"
            className="artisan-back-link"
          >
            <ArrowLeft size={15} /> <span>Back to Catalog</span>
          </Link>

          <nav className="artisan-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="artisan-breadcrumb-sep">/</span>
            <Link href="/shop">Artisans</Link>
            <span className="artisan-breadcrumb-sep">/</span>
            <span className="artisan-breadcrumb-current">{artisan.name}</span>
          </nav>
        </div>
      </div>

      {/* ── 1. ARTISAN PROFILE LOCKUP (CORMORANT GARAMOND FONT, ENHANCED BIO LEGIBILITY) ── */}
      <section className="artisan-profile-section">
        <div className="container" style={{ maxWidth: '1280px', padding: '0 20px' }}>
          <div className="artisan-profile-card">
            
            {/* Master Artisan Portrait */}
            <div className="artisan-profile-avatar-wrap">
              <div className="artisan-profile-avatar">
                <img 
                  src={artisan.image || '/images/artisans_split.png'} 
                  alt={artisan.name} 
                />
              </div>
            </div>

            {/* Artisan Minimal Typography Lockup */}
            <div className="artisan-profile-content">
              <h1 className="artisan-profile-name">
                {artisan.name}
              </h1>

              {/* Minimalist, Clean Meta Row */}
              <div className="artisan-profile-meta">
                <span className="artisan-profile-role">
                  {artisan.role}
                </span>
                <span className="artisan-profile-dot">✦</span>
                <span className="artisan-profile-region">
                  <MapPin size={13} /> {artisan.region}
                </span>
                <span className="artisan-profile-dot">✦</span>
                <span className="artisan-profile-exp">
                  {artisan.experienceYears}+ Years at the Loom
                </span>
              </div>

              {/* Refined Craft Bio with enhanced readability & full stretch */}
              <p className="artisan-profile-bio">
                {artisan.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN FOCUS: CREATIONS BY THIS ARTISAN ── */}
      <main className="container" style={{ maxWidth: '1280px', padding: '0 20px' }}>
        
        {/* Section Header: Royal Header Lockup with Flanking Diamonds */}
        <div className="royal-header-lockup" style={{ marginBottom: '2.25rem' }}>
          <div className="royal-header-line-row">
            <div className="royal-header-line royal-header-line--left">
              <span className="royal-header-diamond" />
            </div>
            <h2 className="royal-header-title">
              <span style={{ color: 'var(--ink-brown)' }}>Creations by </span>
              <span style={{ color: 'var(--maharani-maroon)' }}>{artisan.name}</span>
            </h2>
            <div className="royal-header-line royal-header-line--right">
              <span className="royal-header-diamond" />
            </div>
          </div>
        </div>

        {/* Category Filter Chips with Playfair Display Serif Typography */}
        <div className="artisan-filter-pills" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
        }}>
          <button
            type="button"
            className={'artisan-pill ' + (selectedCategory === 'all' ? 'artisan-pill--active' : '')}
            onClick={() => setSelectedCategory('all')}
          >
            All Creations ({categoryCounts.all})
          </button>

          {categories.map((c) => {
            const count = categoryCounts[c.id] || 0;
            if (count === 0) return null;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={'artisan-pill ' + (isSelected ? 'artisan-pill--active' : '')}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* ── 4-COLUMN PRODUCT GRID (INCREASED VERTICAL STACKING GAP) ── */}
        {filteredProducts.length > 0 ? (
          <div
            className="explore-4col-grid artisan-products-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '52px 24px',
            }}
          >
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid var(--soft-gold-line)',
            borderRadius: '10px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#6A5A50',
          }}>
            <p style={{ margin: 0, fontSize: '0.98rem' }}>
              No creations found in this collection.
            </p>
          </div>
        )}

        {/* ── BESPOKE COMMISSION BANNER ── */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, rgba(251, 246, 238, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)',
          border: '1.5px solid var(--soft-gold-line)',
          borderRadius: '12px',
          padding: '2.25rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 18px rgba(43, 31, 24, 0.03)',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--maharani-maroon)',
            marginBottom: '6px',
          }}>
            <Sparkles size={14} color="var(--gargi-gold)" />
            <span>Exclusive Heritage Commissions</span>
          </div>
          <h3 style={{
            margin: '0 0 0.5rem',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--ink-brown)',
          }}>
            Commission a Custom Heirloom with {artisan.name}
          </h3>
          <p style={{
            margin: '0 auto 1.25rem',
            fontSize: '0.92rem',
            color: '#5C5043',
            maxWidth: '580px',
          }}>
            Collaborate directly with our master atelier to weave bespoke bridal wear, personalized zari borders, or custom color palettes.
          </p>
          <Link
            href="/bespoke"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.75rem',
              backgroundColor: 'var(--maharani-maroon)',
              color: '#FFFFFF',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(122, 35, 49, 0.2)',
            }}
          >
            Request Bespoke Commission &rarr;
          </Link>
        </div>

      </main>
    </div>
  );
}
