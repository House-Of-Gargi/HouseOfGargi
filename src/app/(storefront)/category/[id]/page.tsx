'use client';

import { useState, use, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CustomDropdown from '@/components/CustomDropdown';
import { getCategory, getProductsByCategory, categories, products } from '@/data/products';
import { Product } from '@/types';
import { 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const category = getCategory(id);
  if (!category) {
    notFound();
  }

  // Filter states
  const [fabric, setFabric] = useState<string>('');
  const [priceTier, setPriceTier] = useState<string>('all');
  const [sort, setSort] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [liveItems, setLiveItems] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          const normalized = data.products.map((p: any) => {
            const staticMatch = products.find(
              (sp) =>
                sp.id === p.id ||
                sp.id === p.slug ||
                sp.name.toLowerCase().trim() === (p.name || '').toLowerCase().trim()
            );
            return {
              ...staticMatch,
              ...p,
              id: p.id || staticMatch?.id,
              name: p.name || staticMatch?.name,
              price: Number(p.price ?? p.price_in_rupees ?? staticMatch?.price ?? 0),
              fabric: (p.fabric && p.fabric !== 'Pure Mulberry Silk' ? p.fabric : staticMatch?.fabric) || p.fabric || 'Pure Silk',
              images: (Array.isArray(p.images) && p.images.length > 0) ? p.images : (staticMatch?.images || [p.image_url || '/images/category-sarees.png']),
            };
          });
          setLiveItems(normalized);
        }
      })
      .catch(() => {});
  }, [id]);

  // Raw items for this category (live items prioritized, fallback to filtered static catalog)
  const baseItems = useMemo(() => {
    if (liveItems) return liveItems;
    return getProductsByCategory(id);
  }, [id, liveItems]);

  const getProductPrice = (p: any): number => {
    const val = Number(p.price ?? p.price_in_rupees ?? 0);
    return isNaN(val) ? 0 : val;
  };

  const getProductFabric = (p: any): string => {
    return String(p.fabric || '').toLowerCase().trim();
  };

  // Derived fabrics
  const allFabrics = useMemo(() => {
    return Array.from(new Set(baseItems.map(p => p.fabric))).filter(Boolean);
  }, [baseItems]);

  const fabricOptions = useMemo(() => {
    return allFabrics.map(f => ({ value: f, label: f }));
  }, [allFabrics]);

  const priceOptions = useMemo(() => [
    { value: 'under-15k', label: 'Under ₹15,000' },
    { value: '15k-40k', label: '₹15,000 – ₹40,000' },
    { value: 'above-40k', label: 'Above ₹40,000' },
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A–Z' },
  ], []);

  // Filter and sort
  const filteredItems = useMemo(() => {
    let result = [...baseItems];

    if (fabric) {
      result = result.filter(p => getProductFabric(p).includes(fabric.toLowerCase().trim()));
    }

    if (priceTier === 'under-15k') {
      result = result.filter(p => getProductPrice(p) < 15000);
    } else if (priceTier === '15k-40k') {
      result = result.filter(p => {
        const pr = getProductPrice(p);
        return pr >= 15000 && pr <= 40000;
      });
    } else if (priceTier === 'above-40k') {
      result = result.filter(p => getProductPrice(p) > 40000);
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    } else if (sort === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [baseItems, fabric, priceTier, sort]);

  const hasActiveFilters = Boolean(
    fabric ||
    (priceTier && priceTier !== 'all') ||
    sort
  );

  const resetAllFilters = () => {
    setFabric('');
    setPriceTier('all');
    setSort('');
  };

  const otherCategories = categories.filter(c => c.id !== id);

  return (
    <div className="explore-page">
      <div className="container">
        {/* ── 1. Results for : <Category Name> ─────────────────────── */}
        <div className="explore-header-row">
          <div className="explore-results-title-wrap">
            <span className="explore-results-label">Results for :</span>
            <h1 className="explore-results-query" style={{ display: 'inline' }}>
              {category.name}
            </h1>
            <span className="explore-results-count">
              ({filteredItems.length} {filteredItems.length === 1 ? 'Piece' : 'Pieces'})
            </span>
          </div>
        </div>

        {/* ── 2. Filter Strip with CustomDropdown ─────────────────── */}
        <div className="explore-filter-strip">
          <div className="explore-filter-strip__left">
            <div className="explore-strip-group">
              <span className="explore-strip-label">Fabric</span>
              <CustomDropdown
                options={fabricOptions}
                value={fabric}
                onChange={setFabric}
                placeholder="All Fabrics"
                showEmptyOption
                fullWidth
              />
            </div>

            <div className="explore-strip-group">
              <span className="explore-strip-label">Price</span>
              <CustomDropdown
                options={priceOptions}
                value={priceTier === 'all' ? '' : priceTier}
                onChange={(v) => setPriceTier(v || 'all')}
                placeholder="All Prices"
                showEmptyOption
                fullWidth
              />
            </div>

            <div className="explore-strip-group">
              <span className="explore-strip-label">Sort By</span>
              <CustomDropdown
                options={sortOptions}
                value={sort}
                onChange={setSort}
                placeholder="Featured Curation"
                showEmptyOption
                fullWidth
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="explore-strip-reset"
                onClick={resetAllFilters}
                title="Reset filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Mobile Filter & Quick Sort Controls */}
          <div className="explore-mobile-controls">
            <button
              type="button"
              className="explore-mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {hasActiveFilters && <span className="explore-dot" />}
            </button>
            <div className="explore-mobile-sort-wrap">
              <CustomDropdown
                options={sortOptions}
                value={sort}
                onChange={setSort}
                placeholder="Sort: Featured"
                showEmptyOption={false}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* ── 3. Product Grid: Exactly 4 Products Per Row ─────────── */}
        <section className="explore-grid-section">
          {filteredItems.length === 0 ? (
            <div className="explore-empty-minimal">
              <h2 className="explore-empty-minimal__title">No creations match your filters</h2>
              <p className="explore-empty-minimal__desc">
                Try relaxing your fabric or price criteria to view all {category.name.toLowerCase()}.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={resetAllFilters}
                style={{ marginTop: '20px' }}
              >
                View All {category.name}
              </button>
            </div>
          ) : (
            <div className="explore-4col-grid">
              {filteredItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Explore More Collections ─────────────────────────── */}
        <div style={{ marginTop: '90px', paddingTop: '50px', borderTop: '1px solid var(--soft-gold-line)' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(26px, 3.2vw, 36px)', 
              fontWeight: 400, 
              color: 'var(--ink-brown)',
              margin: 0
            }}>
              Explore Accompanying Collections
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '15.5px', 
              color: 'var(--stone-taupe)', 
              marginTop: '10px',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6
            }}>
              Discover handwoven masterpieces, heirloom couture, and temple adornments crafted across our other ateliers.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {otherCategories.map(cat => (
              <Link 
                href={`/category/${cat.id}`} 
                key={cat.id} 
                className="category-tile" 
                style={{ minHeight: '380px', height: 'auto' }}
              >
                <img src={cat.exploreImage || cat.image} alt={cat.name} loading="lazy" />
                <div className="category-tile__border" />
                <div className="category-tile__label">
                  <h3 style={{ fontSize: '24px', marginBottom: '6px', fontWeight: 400 }}>{cat.name}</h3>
                  {cat.tagline && (
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.5, marginBottom: '12px' }}>
                      {cat.tagline}
                    </p>
                  )}
                  <span className="category-tile__explore" style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontFamily: 'var(--font-nav)',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--gargi-gold)'
                  }}>
                    Explore Collection <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Mobile Filter Drawer ───────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="explore-mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="explore-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="explore-mobile-drawer__header">
              <span className="explore-mobile-drawer__title">Filter & Sort</span>
              <button
                type="button"
                className="explore-mobile-drawer__close"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="explore-mobile-drawer__body">
              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Fabric</label>
                <CustomDropdown
                  options={fabricOptions}
                  value={fabric}
                  onChange={setFabric}
                  placeholder="All Fabrics"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Price</label>
                <CustomDropdown
                  options={priceOptions}
                  value={priceTier === 'all' ? '' : priceTier}
                  onChange={(v) => setPriceTier(v || 'all')}
                  placeholder="All Prices"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Sort</label>
                <CustomDropdown
                  options={sortOptions}
                  value={sort}
                  onChange={setSort}
                  placeholder="Featured Curation"
                  showEmptyOption
                  fullWidth
                />
              </div>
            </div>

            <div className="explore-mobile-drawer__footer">
              <button
                type="button"
                className="explore-drawer-reset-btn"
                onClick={resetAllFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn--primary explore-drawer-apply-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                Show {filteredItems.length} pieces
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
