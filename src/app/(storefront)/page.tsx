import { apiClient } from '@/lib/apiClient';
import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import { categories, products } from '@/data/products';
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
import backendOrders from '@/data/backend_orders.json';

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

// Curation base rank sequence (used when sales are 0 or tied)
const CURATED_FEATURED_RANK: string[] = [
  'royal-zardozi-lehenga',
  'banarasi-gold-weave',
  'sanganeri-block-print-kurta',
  'kundan-choker-set',
  'kanchipuram-temple-border',
  'chanderi-floral-jaal',
  'gota-patti-lehenga',
  'tussar-block-print',
  'paithani-peacock',
  'chikankari-white-kurta',
  'ajrakh-silk-kurta',
  'meenakari-jhumka',
  'temple-jewellery-set',
  'phulkari-dupatta',
  'chikankari-anarkali-lehenga',
  'mirror-work-lehenga',
  'kalamkari-anarkali-kurta',
  'bandhani-silk-kurta',
];

function getSalesMap(): Record<string, number> {
  const map: Record<string, number> = {};
  if (Array.isArray(backendOrders)) {
    backendOrders.forEach((o: any) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((it: any) => {
          const key = String(it.id || '').toLowerCase().trim();
          const nameKey = String(it.name || '').toLowerCase().trim();
          const qty = Number(it.quantity) || 1;
          if (key) map[key] = (map[key] || 0) + qty;
          if (nameKey) map[nameKey] = (map[nameKey] || 0) + qty;
        });
      }
    });
  }
  return map;
}

function getProductSales(p: any, salesMap: Record<string, number>): number {
  const idKey = String(p.id || '').toLowerCase().trim();
  const nameKey = String(p.name || '').toLowerCase().trim();
  return salesMap[idKey] || salesMap[nameKey] || p.totalSales || 0;
}

function getBaseCurationRank(p: any): number {
  const idKey = String(p.id || '').toLowerCase().trim();
  const nameKey = String(p.name || '').toLowerCase().trim();
  const idx = CURATED_FEATURED_RANK.findIndex(
    (r) => r === idKey || r === nameKey
  );
  return idx >= 0 ? idx : 999;
}

function getArrivalTimestamp(p: any): number {
  const overrides = (productOverrides || {}) as Record<string, any>;
  const ov =
    overrides[p.id] ||
    Object.values(overrides).find(
      (o: any) => (o.name || '').toLowerCase().trim() === (p.name || '').toLowerCase().trim()
    );
  const dateStr = p.createdAt || ov?.createdAt || ov?.updatedAt;
  if (dateStr) {
    const t = new Date(dateStr).getTime();
    if (!isNaN(t)) return t;
  }
  // Baseline arrival order: reverse catalog order (newest loom additions first)
  const idx = products.findIndex(
    (item) => item.id === p.id || item.name.toLowerCase() === p.name.toLowerCase()
  );
  return idx >= 0 ? 1000000 + (products.length - idx) : 0;
}

export default async function HomePage() {
  let featured: any[] = [];
  let newArrivals: any[] = [];

  // 1. Fetch live curated and ranked creations from Fastify backend
  try {
    const [featRes, newRes] = await Promise.allSettled([
      apiClient.products.featured(6),
      apiClient.products.newArrivals(12),
    ]);

    if (featRes.status === 'fulfilled' && featRes.value && Array.isArray(featRes.value.products) && featRes.value.products.length > 0) {
      featured = featRes.value.products;
    }
    if (newRes.status === 'fulfilled' && newRes.value && Array.isArray(newRes.value.products) && newRes.value.products.length > 0) {
      newArrivals = newRes.value.products;
    }
  } catch (err) {
    // Resilient fallback to local catalog
  }

  // 2. Resilient fallback if backend was sleeping or during static build
  if (featured.length === 0 || newArrivals.length === 0) {
    const salesMap = getSalesMap();
    const activeProducts = products.filter((p) => !isItemHiddenOrDeleted(p.id, p.name));

    if (featured.length === 0) {
      featured = [...activeProducts]
        .sort((a, b) => {
          const salesA = getProductSales(a, salesMap);
          const salesB = getProductSales(b, salesMap);
          if (salesB !== salesA) return salesB - salesA;
          return getBaseCurationRank(a) - getBaseCurationRank(b);
        })
        .slice(0, 6);
    }

    if (newArrivals.length === 0) {
      newArrivals = [...activeProducts]
        .sort((a, b) => getArrivalTimestamp(b) - getArrivalTimestamp(a))
        .slice(0, 12);
    }
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

