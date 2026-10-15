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
    images: [{ url: '/banners/desktop-banner-1.webp', width: 1200, height: 630, alt: 'House of Gargi Luxury Fashion' }],
  },
};

import productOverrides from '@/data/product_overrides.json';
import deletedProducts from '@/data/deleted_products.json';

const deletedSet = new Set(
  (Array.isArray(deletedProducts) ? deletedProducts : []).map((s: string) =>
    String(s).toLowerCase().trim()
  )
);

function isItemHiddenOrDeleted(id: string, name: string): boolean {
  const idKey = String(id || '').toLowerCase().trim();
  const nameKey = String(name || '').toLowerCase().trim();
  if (deletedSet.has(idKey) || deletedSet.has(nameKey)) return true;

  const overrides = (productOverrides || {}) as Record<string, any>;
  if (overrides[id]?.isHidden || overrides[id]?.isDeleted) return true;
  for (const [key, ov] of Object.entries(overrides)) {
    if (key.toLowerCase().trim() === nameKey && (ov.isHidden || ov.isDeleted)) return true;
    if (ov && ov.name && String(ov.name).toLowerCase().trim() === nameKey && (ov.isHidden || ov.isDeleted)) {
      return true;
    }
  }
  return false;
}

export default async function HomePage() {
  const featured = featuredProductIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => p !== undefined && !isItemHiddenOrDeleted(p.id, p.name));

  // Fetch 12 most recent products from Fastify backend (strictly filtered by active storefront status)
  let newArrivals: typeof products = [];
  try {
    const res = await apiClient.products.list();
    if (res && res.products && Array.isArray(res.products) && res.products.length > 0) {
      newArrivals = res.products
        .filter((item: any) => !isItemHiddenOrDeleted(item.id, item.name))
        .map((item: any) => {
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
        })
        .filter((p): p is typeof products[0] => p !== undefined && !isItemHiddenOrDeleted(p.id, p.name))
        .slice(0, 12);
    }
  } catch (err) {
    // Graceful fallback to static products
  }
  if (!newArrivals || newArrivals.length === 0) {
    newArrivals = products.filter(p => !isItemHiddenOrDeleted(p.id, p.name)).slice(0, 12);
  } else {
    newArrivals = newArrivals.filter(p => !isItemHiddenOrDeleted(p.id, p.name));
  }

  return (
    <>
      {/* ── High Priority Hero Preloads for 0ms Zero-Buffer Instant Render ── */}
      <link rel="preload" as="image" href="/banners/desktop-banner-1.webp" type="image/webp" media="(min-width: 769px)" />
      <link rel="preload" as="image" href="/banners/mobile-banner-1.webp" type="image/webp" media="(max-width: 768px)" />

      {/* ═══════ 1. HERO ═══════ */}
      <HeroBanner />

      {/* ═══════ 2. SHOP BY CATEGORY ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="royal-header-lockup">
              <div className="royal-header-line-row">
                <div className="royal-header-line royal-header-line--left">
                  <span className="royal-header-diamond" />
                </div>
                <h2 className="royal-header-title">
                  <span style={{ color: 'var(--ink-brown)' }}>Shop </span>by Collection
                </h2>
                <div className="royal-header-line royal-header-line--right">
                  <span className="royal-header-diamond" />
                </div>
              </div>
              <p className="royal-header-desc">
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
            <div className="royal-header-lockup">
              <div className="royal-header-line-row">
                <div className="royal-header-line royal-header-line--left">
                  <span className="royal-header-diamond" />
                </div>
                <h2 className="royal-header-title">
                  <span style={{ color: 'var(--ink-brown)' }}>Featured </span>Curations
                </h2>
                <div className="royal-header-line royal-header-line--right">
                  <span className="royal-header-diamond" />
                </div>
              </div>
              <p className="royal-header-desc">
                Our most loved pieces, selected for you
              </p>
            </div>
          </ScrollReveal>
          <div className="product-grid product-grid--home">
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
            <div className="royal-header-lockup">
              <div className="royal-header-line-row">
                <div className="royal-header-line royal-header-line--left">
                  <span className="royal-header-diamond" />
                </div>
                <h2 className="royal-header-title">
                  <span style={{ color: 'var(--ink-brown)' }}>New </span>Arrivals
                </h2>
                <div className="royal-header-line royal-header-line--right">
                  <span className="royal-header-diamond" />
                </div>
              </div>
              <p className="royal-header-desc">
                Freshly woven creations directly from master artisan looms
              </p>
            </div>
          </ScrollReveal>
          <div className="product-grid product-grid--home">
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

