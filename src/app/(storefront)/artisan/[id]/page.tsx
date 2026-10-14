'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Crown
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import { getArtisan } from '@/data/artisans';
import { products, categories } from '@/data/products';

export default function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const artisan = getArtisan(id);
  if (!artisan) {
    notFound();
  }

  // All products crafted under this master artisan
  const allArtisanProducts = useMemo(() => {
    return products.filter(
      p => p.artisanId === artisan.id || artisan.productIds.includes(p.id)
    );
  }, [artisan]);

  // Category filter state
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
    <div style={{ background: '#FAF7F2', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* ── BREADCRUMB BAR ── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--soft-gold-line)' }}>
        <div className="container" style={{ maxWidth: '1280px', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            }}
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6A5A50' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Atelier</Link>
            <span>/</span>
            <span style={{ color: 'var(--maharani-maroon)', fontWeight: 700 }}>{artisan.name}</span>
          </div>
        </div>
      </div>

      {/* ── 1. ARTISAN HEADER LOCKUP (CLEAN, REGAL, MINIMAL) ── */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '1.5px solid var(--soft-gold-line)',
        padding: '2.5rem 0 2rem',
      }}>
        <div className="container" style={{ maxWidth: '1280px', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
          }}>
            {/* Master Artisan Portrait */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid var(--gargi-gold)',
                flexShrink: 0,
                boxShadow: '0 4px 18px rgba(122, 35, 49, 0.15)',
              }}
            >
              <img 
                src={artisan.image || '/images/artisans_split.png'} 
                alt={artisan.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Title & Heritage Metadata (NO ARTISAN NUMBER) */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--maharani-maroon)',
                  background: 'rgba(122, 35, 49, 0.08)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}>
                  Verified Master Artisan
                </span>
                <ShieldCheck size={16} color="#2E7D32" />
              </div>

              <h1 style={{
                margin: '2px 0 6px',
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                fontWeight: 800,
                color: 'var(--ink-brown)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}>
                {artisan.name}
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                fontSize: '0.88rem',
                color: '#5C5043',
                marginBottom: '8px',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                  {artisan.role}
                </span>
                <span style={{ color: 'var(--soft-gold-line)' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="var(--stone-taupe)" /> {artisan.region}
                </span>
                <span style={{ color: 'var(--soft-gold-line)' }}>•</span>
                <span style={{ fontWeight: 700, color: 'var(--ink-brown)' }}>
                  {artisan.experienceYears}+ Years Weaving
                </span>
              </div>

              {/* Concise Craft Heritage Bio */}
              <p style={{
                margin: 0,
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#4A3E36',
                maxWidth: '820px',
              }}>
                {artisan.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN FOCUS: CREATIONS BY THIS ARTISAN ── */}
      <main className="container" style={{ maxWidth: '1280px', padding: '2.5rem 20px 0' }}>
        
        {/* Section Header with Royal Symmetrical Gold Hairlines */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--gargi-gold)',
            marginBottom: '6px',
          }}>
            <Crown size={14} />
            <span>Masterworks Atelier Catalog</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            maxWidth: '720px',
            margin: '0 auto',
          }}>
            <span style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--gargi-gold))',
            }} />
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
              fontWeight: 800,
              color: 'var(--ink-brown)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              Creations by {artisan.name}
            </h2>
            <span style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, var(--gargi-gold), transparent)',
            }} />
          </div>

          <p style={{
            margin: '0.5rem auto 0',
            fontSize: '0.92rem',
            color: '#6A5A50',
            maxWidth: '560px',
          }}>
            Explore {allArtisanProducts.length} authentic handlooms and royal bridal silhouettes handcrafted under {artisan.name}&apos;s loom supervision.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.55rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '24px',
              border: selectedCategory === 'all' ? '1.5px solid var(--maharani-maroon)' : '1px solid var(--soft-gold-line)',
              backgroundColor: selectedCategory === 'all' ? 'var(--maharani-maroon)' : '#FFFFFF',
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
                  backgroundColor: isSelected ? 'var(--maharani-maroon)' : '#FFFFFF',
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
            background: '#FFFFFF',
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
          background: 'linear-gradient(135deg, #FAF7F2 0%, #FFFFFF 100%)',
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
