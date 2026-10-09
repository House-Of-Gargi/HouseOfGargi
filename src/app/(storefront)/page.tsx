import { apiClient } from '@/lib/apiClient';
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

export default async function HomePage() {
  const featured = featuredProductIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  // Fetch 12 most recent products from Fastify backend (with resilient catalog fallback)
  let newArrivals: typeof products = [];
  try {
    const res = await apiClient.products.list();
    if (res && res.products && Array.isArray(res.products) && res.products.length > 0) {
      newArrivals = res.products.slice(0, 12).map((item: any) => {
        const matched = products.find(p => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase());
        if (matched) return matched;
        return {
          id: String(item.id),
          category: item.category || 'sarees',
          name: item.name,
          price: item.price || item.price_in_rupees || 0,
          artisanNote: item.artisanNote || item.artisan_note || 'Crafted by master weavers in India',
          description: item.description || `${item.name} handcrafted with heritage artisanal techniques.`,
          fabric: item.fabric || 'Pure Silk',
          technique: item.technique || 'Handloom Weave',
          region: item.region || 'India',
          occasion: item.occasion || 'Bridal & Festive',
          sizes: item.sizes || ['Free Size'],
          care: item.care || 'Dry clean only',
          images: item.images && Array.isArray(item.images) ? item.images : [item.image_url || item.image || '/images/category-sarees.png'],
        };
      });
    }
  } catch (err) {
    // Graceful fallback to static products
  }
  if (!newArrivals || newArrivals.length === 0) {
    newArrivals = products.slice(0, 12);
  }

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

      {/* ═══════ 4. NEW ARRIVALS ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-heading-bold">
                <span style={{ color: 'var(--ink-brown)' }}>New </span>Arrivals
              </h2>
              <p className="subtitle-italic" style={{ color: 'var(--stone-taupe)', marginTop: '12px' }}>
                Freshly woven creations directly from master artisan looms
              </p>
            </div>
          </ScrollReveal>
          <div className="product-grid">
            {newArrivals.map(product => (
              <ScrollReveal key={product.id}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/shop" className="btn btn--outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All Creations <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

