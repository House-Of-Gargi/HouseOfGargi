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
      
      {/* ── BREADCRUMB / BACK ROW (SEAMLESS MATCHING IVORY BG) ── */}
      <div className="container" style={{ maxWidth: '1280px', padding: '0 20px', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <Link 
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ink-brown)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
          >
            <ArrowLeft size={14} /> <span>Back to Catalog</span>
          </Link>

          <nav className="breadcrumb" style={{ fontSize: '0.82rem', color: '#7A6B60', margin: 0 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Artisans</Link>
            <span>/</span>
            <span style={{ color: 'var(--maharani-maroon)', fontWeight: 700 }}>{artisan.name}</span>
          </nav>
        </div>
      </div>

      {/* ── 1. ARTISAN PROFILE LOCKUP (BEAUTIFULLY FORMATTED, MINIMAL & SEAMLESS BG) ── */}
      <section style={{
        background: 'transparent',
        borderBottom: '1px solid rgba(228, 211, 174, 0.75)',
        paddingBottom: '2.5rem',
        marginBottom: '2.5rem',
      }}>
        <div className="container" style={{ maxWidth: '1280px', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.25rem',
            flexWrap: 'wrap',
          }}>
            {/* Master Artisan Portrait */}
            <div
              style={{
                width: '108px',
                height: '108px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--gargi-gold)',
                padding: '3px',
                background: 'var(--ivory-silk, #FBF6EE)',
                flexShrink: 0,
                boxShadow: '0 4px 20px rgba(122, 35, 49, 0.12)',
              }}
            >
              <img 
                src={artisan.image || '/images/artisans_split.png'} 
                alt={artisan.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>

            {/* Artisan Minimal Typography Lockup */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h1 style={{
                margin: '0 0 8px',
                fontSize: 'clamp(1.9rem, 3.4vw, 2.5rem)',
                fontWeight: 800,
                fontFamily: "var(--font-display, 'Playfair Display', serif)",
                color: 'var(--ink-brown)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}>
                {artisan.name}
              </h1>

              {/* Minimalist, Clean Meta Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                fontSize: '0.9rem',
                color: '#5C5043',
                marginBottom: '12px',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--maharani-maroon)', letterSpacing: '0.02em' }}>
                  {artisan.role}
                </span>
                <span style={{ color: 'var(--gargi-gold)', fontSize: '0.75rem' }}>✦</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--gargi-gold)" /> {artisan.region}
                </span>
                <span style={{ color: 'var(--gargi-gold)', fontSize: '0.75rem' }}>✦</span>
                <span style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>
                  {artisan.experienceYears}+ Years at the Loom
                </span>
              </div>

              {/* Refined Minimal Craft Bio */}
              <p style={{
                margin: 0,
                fontSize: '0.94rem',
                lineHeight: 1.68,
                color: '#5C4E44',
                maxWidth: '820px',
              }}>
                {artisan.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN FOCUS: CREATIONS BY THIS ARTISAN ── */}
      <main className="container" style={{ maxWidth: '1280px', padding: '0 20px' }}>
        
        {/* Section Header: Symmetrical Gold Hairlines with Red Artisan Name */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            maxWidth: '780px',
            margin: '0 auto',
          }}>
            <span style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--gargi-gold))',
            }} />
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
              fontWeight: 800,
              fontFamily: "var(--font-display, 'Playfair Display', serif)",
              color: 'var(--ink-brown)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              Creations by{' '}
              <span style={{ color: 'var(--maharani-maroon)' }}>
                {artisan.name}
              </span>
            </h2>
            <span style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, var(--gargi-gold), transparent)',
            }} />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.55rem',
          flexWrap: 'wrap',
          marginBottom: '2.25rem',
        }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '24px',
              border: selectedCategory === 'all' ? '1.5px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
              backgroundColor: selectedCategory === 'all' ? 'var(--maharani-maroon)' : 'transparent',
              color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--ink-brown)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
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
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '24px',
                  border: isSelected ? '1.5px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
                  backgroundColor: isSelected ? 'var(--maharani-maroon)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--ink-brown)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* ── 4-COLUMN PRODUCT GRID ── */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem',
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
          marginTop: '3.5rem',
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
