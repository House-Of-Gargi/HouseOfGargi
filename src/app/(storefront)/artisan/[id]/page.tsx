'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Award, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Heart,
  Crown
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import { getArtisan } from '@/data/artisans';
import { products } from '@/data/products';

export default function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const artisan = getArtisan(id);
  if (!artisan) {
    notFound();
  }

  const artisanProducts = products.filter(
    p => p.artisanId === artisan.id || artisan.productIds.includes(p.id)
  );

  return (
    <div style={{ background: 'var(--ivory-silk)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* ── 1. HERO BANNER WITH ARTISAN HEADER ── */}
      <section className="category-banner" style={{ height: '460px', position: 'relative' }}>
        <img 
          src={artisan.coverImage || '/images/hero-desktop.png'} 
          alt={`${artisan.name} Atelier Workshop`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(36, 26, 21, 0.4) 0%, rgba(36, 26, 21, 0.85) 100%)',
          }} 
        />
        <div className="category-banner__content" style={{ maxWidth: '900px', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(201, 162, 39, 0.18)',
            border: '1px solid rgba(201, 162, 39, 0.45)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontFamily: 'var(--font-nav)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#FBF6EE',
            fontWeight: 700,
            marginBottom: '16px',
          }}>
            <Sparkles size={13} style={{ color: 'var(--gargi-gold)' }} />
            <span>Verified Master Artisan &bull; {artisan.lineage}</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(32px, 4.5vw, 48px)', 
            fontFamily: 'var(--font-serif)', 
            color: '#FFFFFF',
            marginBottom: '10px',
            letterSpacing: '-0.02em',
          }}>
            {artisan.name}
          </h1>

          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            marginBottom: '14px',
          }}>
            {artisan.role}
          </p>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '16px', 
            color: 'var(--soft-gold)',
            fontSize: '13.5px',
            fontFamily: 'var(--font-nav)',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} style={{ color: 'var(--gargi-gold)' }} /> {artisan.region}
            </span>
            <span style={{ opacity: 0.4 }}>&bull;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} style={{ color: 'var(--gargi-gold)' }} /> {artisan.experienceYears}+ Years Mastery
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN CONTENT WRAPPER ── */}
      <div className="container" style={{ maxWidth: '1140px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        
        {/* Navigation Breadcrumb Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: '8px',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          boxShadow: '0 4px 20px rgba(43, 31, 24, 0.06)',
          marginBottom: '36px',
        }}>
          <Link 
            href="/our-artisans"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-nav)',
              fontSize: '12.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ink-brown)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={15} /> All Master Artisans
          </Link>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-nav)',
            fontSize: '12px',
            color: 'var(--stone-taupe)',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/our-artisans" style={{ color: 'inherit', textDecoration: 'none' }}>Artisans</Link>
            <span>/</span>
            <span style={{ color: 'var(--maharani-maroon)', fontWeight: 600 }}>{artisan.name}</span>
          </div>
        </div>

        {/* ── 3. FOUR GILDED PROVENANCE LEDGER METRICS ── */}
        <ScrollReveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginBottom: '48px',
          }}>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '8px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
            }}>
              <div style={{ color: 'var(--gargi-gold)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <Layers size={26} strokeWidth={1.4} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink-brown)' }}>
                {artisan.lineage.split(' ')[0]} {artisan.lineage.split(' ')[1]}
              </div>
              <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)', fontWeight: 700, marginTop: '4px' }}>
                Generational Lineage
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '8px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
            }}>
              <div style={{ color: 'var(--gargi-gold)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <Award size={26} strokeWidth={1.4} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink-brown)' }}>
                {artisan.experienceYears}+ Years
              </div>
              <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)', fontWeight: 700, marginTop: '4px' }}>
                Loom Mastery
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '8px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
            }}>
              <div style={{ color: 'var(--gargi-gold)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <Clock size={26} strokeWidth={1.4} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink-brown)' }}>
                {artisan.loomHoursTotal}
              </div>
              <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)', fontWeight: 700, marginTop: '4px' }}>
                Authentic Craft Hours
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '8px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
            }}>
              <div style={{ color: 'var(--gargi-gold)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <ShieldCheck size={26} strokeWidth={1.4} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink-brown)' }}>
                100% Direct
              </div>
              <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)', fontWeight: 700, marginTop: '4px' }}>
                Fair Trade Royalty
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── 4. ARTISAN BIOGRAPHY & PHILOSOPHY CARD ── */}
        <ScrollReveal>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(201, 162, 39, 0.35)',
            borderRadius: '12px',
            padding: '48px 44px',
            boxShadow: '0 8px 30px rgba(43, 31, 24, 0.05)',
            marginBottom: '64px',
            position: 'relative',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-nav)',
                  fontSize: '11.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--maharani-maroon)',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}>
                  <span>✦ Master Artisan Provenance</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--ink-brown)', marginBottom: '18px' }}>
                  The Weaver&apos;s Lineage &amp; Philosophy
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--stone-taupe)', marginBottom: '20px' }}>
                  {artisan.bio}
                </p>

                {/* Specialties Tags */}
                <div style={{ marginTop: '24px' }}>
                  <div style={{ fontFamily: 'var(--font-nav)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)', fontWeight: 700, marginBottom: '10px' }}>
                    Craft Masteries &amp; Materials:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {artisan.specialties.map(spec => (
                      <span 
                        key={spec}
                        style={{
                          display: 'inline-block',
                          background: 'rgba(201, 162, 39, 0.08)',
                          border: '1px solid rgba(201, 162, 39, 0.3)',
                          padding: '5px 12px',
                          borderRadius: '16px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#725010',
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Philosophy Quote Callout Box */}
              <div style={{
                background: 'var(--ivory-silk)',
                border: '1.5px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '8px',
                padding: '36px 32px',
                position: 'relative',
              }}>
                <span style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  left: '20px', 
                  fontSize: '44px', 
                  lineHeight: 1, 
                  color: 'rgba(201, 162, 39, 0.3)',
                  fontFamily: 'var(--font-serif)',
                }}>
                  &ldquo;
                </span>
                <blockquote style={{ 
                  margin: 0, 
                  padding: '10px 0 0 16px',
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '18px', 
                  fontStyle: 'italic', 
                  lineHeight: 1.8, 
                  color: 'var(--ink-brown)' 
                }}>
                  {artisan.philosophy}
                </blockquote>
                <div style={{ 
                  marginTop: '20px', 
                  paddingLeft: '16px',
                  fontFamily: 'var(--font-nav)', 
                  fontSize: '12.5px', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--maharani-maroon)' 
                }}>
                  — {artisan.name}
                </div>

                {artisan.awards && artisan.awards.length > 0 && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(201, 162, 39, 0.2)', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone-taupe)', fontWeight: 700, marginBottom: '6px' }}>
                      Distinctions &amp; Honors:
                    </div>
                    {artisan.awards.map(aw => (
                      <div key={aw} style={{ fontSize: '13px', color: 'var(--ink-brown)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{ color: 'var(--gargi-gold)' }}>✦</span> {aw}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── 5. MASTERWORKS COLLECTION BY THIS ARTISAN ── */}
        <section style={{ marginBottom: '64px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-nav)',
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--gargi-gold)',
                fontWeight: 700,
                marginBottom: '8px',
              }}>
                <Crown size={15} /> Atelier Masterworks Catalog
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--ink-brown)', marginBottom: '10px' }}>
                Handcrafted Pieces by {artisan.name.split(' ')[0]}
              </h2>
              <p style={{ color: 'var(--stone-taupe)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                Every piece below has been hand-woven or crafted at {artisan.region.split(',')[0]} under the direct supervision of {artisan.name}.
              </p>
            </div>
          </ScrollReveal>

          {artisanProducts.length > 0 ? (
            <div className="product-grid">
              {artisanProducts.map(p => (
                <ScrollReveal key={p.id}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '16px', color: 'var(--stone-taupe)', marginBottom: '16px' }}>
                All current loom pieces by {artisan.name} are currently reserved or in bespoke commission.
              </p>
              <Link href="/shop" className="btn btn--primary">
                Explore All Atelier Collections
              </Link>
            </div>
          )}
        </section>

        {/* ── 6. BESPOKE COMMISSION CALLOUT WITH THIS ARTISAN ── */}
        <ScrollReveal>
          <div style={{
            background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 100%)',
            border: '1.5px solid rgba(201, 162, 39, 0.4)',
            borderRadius: '12px',
            padding: '48px 40px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(43, 31, 24, 0.04)',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-nav)',
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--maharani-maroon)',
              fontWeight: 700,
              marginBottom: '12px',
            }}>
              <span>✦ PRIVATE ATELIER COMMISSIONS</span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--ink-brown)', marginBottom: '12px' }}>
              Commission a Custom Heirloom with {artisan.name}
            </h3>

            <p style={{ maxWidth: '640px', margin: '0 auto 28px', fontSize: '16px', lineHeight: 1.7, color: 'var(--stone-taupe)' }}>
              Looking for a custom bridal trousseau, special colorway, or custom drape measurements? Reserve a bespoke consultation to have your piece crafted exclusively on {artisan.name}&apos;s looms.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href={`/bespoke?artisan=${artisan.id}`} className="btn btn--primary" style={{ padding: '14px 28px' }}>
                Inquire for Bespoke Commission &rarr;
              </Link>
              <Link href="/our-story" className="btn btn--outline" style={{ padding: '14px 28px' }}>
                Read Our Fair Trade Promise
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
