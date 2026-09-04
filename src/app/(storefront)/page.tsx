import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import AtelierNewsletter from '@/components/AtelierNewsletter';
import { categories, products, featuredProductIds } from '@/data/products';
import { ArrowRightIcon, LotusIcon } from '@/components/Icons';
import { ShieldCheck } from 'lucide-react';

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
    images: [{ url: '/images/hero-desktop.png', width: 1200, height: 630, alt: 'House of Gargi Luxury Fashion' }],
  },
};

export default function HomePage() {
  const featured = featuredProductIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  return (
    <>
      {/* ═══════ 1. HERO ═══════ */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/images/hero-desktop.png" alt="House of Gargi — Handcrafted Heritage" />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__tagline">Handcrafted Heritage, Worn Today.</h1>
          <p className="hero__subtitle">Luxury handmade Indian fashion — woven by hand, worn for a lifetime.</p>
          <Link href="/category/sarees" className="btn btn--gold">Explore the Collection</Link>
        </div>
      </section>

      {/* ═══════ 2. SHOP BY CATEGORY ═══════ */}
      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2>Shop by Collection</h2>
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

      {/* ═══════ 4. OUR STORY ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image-wrap">
                <img src="/assets/artisan-hands.png" alt="Artisan hand-embroidering pure gold zari" />
              </div>
              <div className="story-split__copy">
                <div className="story-epigraph">
                  <span>✦ गार्गी सूत्रम्</span>
                  <span style={{ opacity: 0.5 }}>|</span>
                  <span>Vedic Philosophy &amp; Couture</span>
                </div>
                <h2 style={{ color: 'var(--maharani-maroon)' }}>The House of Gargi Story</h2>
                <p>
                  Named after <strong>Gargi Vachaknavi</strong> — the renowned philosopher of ancient Vedic lore — our house honours the master weavers, dyers, and embroiderers who preserve India&apos;s heritage textile traditions.
                </p>
                <p>
                  Every piece in our collection is crafted by hand using techniques refined over centuries. We partner directly with established weaving families across Varanasi, Chanderi, and Kutch — ensuring unhurried craftsmanship and timeless heirloom quality.
                </p>

                {/* Archival Provenance Ledger */}
                <div className="provenance-ledger">
                  <div className="provenance-ledger__item">
                    <span className="provenance-ledger__val">180+ Hours</span>
                    <span className="provenance-ledger__label">Handloom Weaving</span>
                  </div>
                  <div className="provenance-ledger__item">
                    <span className="provenance-ledger__val">Varanasi &amp; Kutch</span>
                    <span className="provenance-ledger__label">Partner Clusters</span>
                  </div>
                  <div className="provenance-ledger__item">
                    <span className="provenance-ledger__val">100% Pure Zari</span>
                    <span className="provenance-ledger__label">Silver &amp; Gold Wire</span>
                  </div>
                </div>

                <p className="subtitle-italic" style={{ color: 'var(--ink-brown)', fontSize: '18px', marginTop: '12px' }}>
                  Woven by hand. Worn for a lifetime.
                </p>
                <Link href="/our-story" className="btn btn--outline" style={{ marginTop: '18px' }}>Read Our Story</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 5. FEATURED PRODUCTS ═══════ */}
      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2>Featured Curations</h2>
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

      {/* ═══════ 6. CRAFTSMANSHIP BANNER ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="craft-banner">
              <div className="craft-banner__bg">
                <img src="/assets/craft-story-banner.png" alt="Artisans at handloom" />
              </div>
              <div className="craft-banner__overlay" />
              <div className="craft-banner__content">
                <h2>Why House of Gargi</h2>
                <div className="craft-points">
                  <div className="craft-points__item">
                    <span className="craft-points__icon"><LotusIcon size={18} /></span>
                    <p><strong>100% Handmade:</strong> Every piece is crafted by skilled artisans, preserving techniques passed down through generations.</p>
                  </div>
                  <div className="craft-points__item">
                    <span className="craft-points__icon"><ShieldCheck size={18} strokeWidth={1.6} /></span>
                    <p><strong>Ethically Sourced:</strong> We partner directly with weaving families across India to ensure fair wages and sustainable practices.</p>
                  </div>
                  <div className="craft-points__item">
                    <span className="craft-points__icon"><LotusIcon size={18} /></span>
                    <p><strong>Limited Edition:</strong> Because true craft takes time, our collections are small-batch and uniquely yours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* European Provenance & Authenticity Ledger */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '24px',
              marginTop: '40px',
              padding: '20px 28px',
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '4px',
              fontSize: '13.5px',
              fontFamily: 'var(--font-nav)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--stone-taupe)',
              fontWeight: 500,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Silk Mark India Certified
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Handloom Mark GI Authenticated
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Direct Artisan Partnerships
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 7. NEWSLETTER (ATELIER JOURNAL) ═══════ */}
      <section className="section section--sand" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <ScrollReveal>
            <AtelierNewsletter />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
