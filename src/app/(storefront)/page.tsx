import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import { categories, products, featuredProductIds } from '@/data/products';
import { ArrowRightIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: {
    absolute: 'House of Gargi | Handcrafted Luxury Indian Fashion',
  },
  description: 'House of Gargi offers luxury, handcrafted traditional Indian fashion. Explore our curated collections of pure silk sarees, bridal lehengas, block-printed kurta sets, and heritage jewellery. Handcrafted Heritage, Worn Today.',
  alternates: {
    canonical: 'https://www.gargisaha.com',
  },
  openGraph: {
    title: 'House of Gargi | Handcrafted Luxury Indian Fashion',
    description: 'House of Gargi offers luxury, handcrafted traditional Indian fashion. Explore our curated collections of pure silk sarees, bridal lehengas, block-printed kurta sets, and heritage jewellery.',
    url: 'https://www.gargisaha.com',
    siteName: 'House of Gargi',
    images: [{ url: '/images/hero-desktop-1.webp', width: 1200, height: 630, alt: 'House of Gargi Luxury Fashion' }],
  },
};

export default function HomePage() {
  const featured = featuredProductIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  return (
    <>
      {/* ═══════ 1. HERO ═══════ */}
      <HeroBanner />

      {/* ═══════ 2. SHOP BY CATEGORY ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-heading-bold">
                <span style={{ color: 'var(--ink-brown)' }}>Shop </span>by Collection
              </h2>
              <p className="subtitle-italic" style={{ color: 'var(--stone-taupe)', marginTop: '12px' }}>
                Explore our curated lines of traditional wear
              </p>
            </div>
          </ScrollReveal>
          <div className="category-grid">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} style={{ transitionDelay: `${i * 100}ms` }}>
                <Link href={`/category/${cat.id}`} className="category-tile">
                  <img src={cat.collectionTileImage || cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-tile__border" />
                  <div className="category-tile__label">
                    <h3>{cat.name}</h3>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Explore <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3. FEATURED PRODUCTS ═══════ */}
      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-heading-bold">
                <span style={{ color: 'var(--ink-brown)' }}>Featured </span>Curations
              </h2>
              <p className="subtitle-italic" style={{ color: 'var(--stone-taupe)', marginTop: '12px' }}>
                Our most loved pieces, selected for you
              </p>
            </div>
          </ScrollReveal>
          <div className="product-grid">
            {featured.map(product => (
              <ScrollReveal key={product.id}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 4. PROVENANCE & ATELIER PROMISE ═══════ */}
      <section style={{ 
        background: 'var(--ivory-silk)', 
        borderTop: '1px solid var(--soft-gold-line)',
        padding: '64px 0' 
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '36px',
            textAlign: 'center',
          }}>
            <div style={{ padding: '0 16px' }}>
              <div style={{ color: 'var(--gargi-gold)', fontSize: '26px', marginBottom: '10px' }}>✦</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 700, color: 'var(--ink-brown)', marginBottom: '8px' }}>
                100% Certified Handloom
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
                Authentic Silk Mark & Handloom certified weaves, handcrafted with genuine natural fibers.
              </p>
            </div>
            <div style={{ padding: '0 16px' }}>
              <div style={{ color: 'var(--gargi-gold)', fontSize: '26px', marginBottom: '10px' }}>⚜</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 700, color: 'var(--ink-brown)', marginBottom: '8px' }}>
                Direct Artisan Lineage
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
                Honoring 4th-generation master weaving families across Varanasi, Kanchipuram, and Jaipur.
              </p>
            </div>
            <div style={{ padding: '0 16px' }}>
              <div style={{ color: 'var(--gargi-gold)', fontSize: '26px', marginBottom: '10px' }}>✦</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 700, color: 'var(--ink-brown)', marginBottom: '8px' }}>
                White-Glove Global Shipping
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--stone-taupe)', lineHeight: 1.55 }}>
                Insured express delivery worldwide with bespoke atelier presentation and archival packaging.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

