'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';
import { getCategory, getProductsByCategory, categories } from '@/data/products';
import { DiyaIcon, ArrowRightIcon, FilterIcon, CloseIcon } from '@/components/Icons';

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [fabric, setFabric] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [sort, setSort] = useState<string>('');

  const category = getCategory(id);
  if (!category) {
    notFound();
  }

  let items = getProductsByCategory(id);

  if (fabric) {
    items = items.filter(p => p.fabric.toLowerCase().includes(fabric.toLowerCase()));
  }
  if (occasion) {
    items = items.filter(p => p.occasion === occasion);
  }

  if (sort === 'price-asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    items.sort((a, b) => b.price - a.price);
  }

  const allCategoryItems = getProductsByCategory(id);
  const fabrics = Array.from(new Set(allCategoryItems.map(p => p.fabric)));
  const occasions = Array.from(new Set(allCategoryItems.map(p => p.occasion)));
  const otherCategories = categories.filter(c => c.id !== id);

  return (
    <>
      <div className="category-banner">
        <img src={category.bannerImage} alt={category.name} />
        <div className="category-banner__content">
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </div>

      <section className="section section--ivory section--category">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb" style={{ marginBottom: '22px' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Collections</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink-brown)', fontWeight: 600 }}>{category.name}</span>
          </div>

          {/* Atelier Filter & Sort Bar */}
          <div className="filter-bar">
            <div className="filter-bar__header">
              <div className="filter-bar__title">
                <FilterIcon size={18} style={{ color: 'var(--gargi-gold)' }} />
                <span>Refine Collection</span>
              </div>
              <div className="filter-bar__summary">
                Showing <strong>{items.length}</strong> {items.length === 1 ? 'Piece' : 'Pieces'}
              </div>
            </div>

            <div className="filter-bar__controls">
              <div className="filter-bar__group">
                <span className="filter-bar__label">Fabric</span>
                <CustomDropdown
                  options={fabrics.map(f => ({ value: f, label: f }))}
                  value={fabric}
                  onChange={setFabric}
                  placeholder="All Fabrics"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="filter-bar__group">
                <span className="filter-bar__label">Occasion</span>
                <CustomDropdown
                  options={occasions.map(o => ({ value: o, label: o }))}
                  value={occasion}
                  onChange={setOccasion}
                  placeholder="All Occasions"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="filter-bar__group">
                <span className="filter-bar__label">Sort By</span>
                <CustomDropdown
                  options={[
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                  ]}
                  value={sort}
                  onChange={setSort}
                  placeholder="Featured Curation"
                  showEmptyOption
                  fullWidth
                />
              </div>
            </div>

            {/* Active Filters Strip */}
            {(fabric || occasion || sort) && (
              <div className="filter-bar__active-chips">
                <span className="filter-bar__active-label">Active:</span>
                {fabric && (
                  <button type="button" className="filter-chip" onClick={() => setFabric('')}>
                    Fabric: {fabric} <CloseIcon size={12} />
                  </button>
                )}
                {occasion && (
                  <button type="button" className="filter-chip" onClick={() => setOccasion('')}>
                    Occasion: {occasion} <CloseIcon size={12} />
                  </button>
                )}
                {sort && (
                  <button type="button" className="filter-chip" onClick={() => setSort('')}>
                    Sort: {sort === 'price-asc' ? 'Price: Low-High' : 'Price: High-Low'} <CloseIcon size={12} />
                  </button>
                )}
                <button 
                  type="button" 
                  className="filter-bar__clear-btn" 
                  onClick={() => { setFabric(''); setOccasion(''); setSort(''); }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Product Grid */}
          {items.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 24px', 
              background: 'var(--pure-white)', 
              borderRadius: '8px', 
              border: '1px solid var(--soft-gold-line)',
              boxShadow: '0 4px 16px rgba(43, 31, 24, 0.03)'
            }}>
              <DiyaIcon size={44} style={{ color: 'var(--gargi-gold)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink-brown)', marginBottom: '8px' }}>
                No pieces match your selected filters.
              </h3>
              <p style={{ color: 'var(--stone-taupe)', fontSize: '15px', maxWidth: '420px', margin: '0 auto 20px' }}>
                Try relaxing your fabric or occasion criteria to explore more handcrafted treasures.
              </p>
              <button 
                type="button" 
                className="btn btn--primary" 
                onClick={() => { setFabric(''); setOccasion(''); setSort(''); }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {items.map(product => (
                <ScrollReveal key={product.id}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Explore Other Categories */}
          <div style={{ marginTop: '90px', marginBottom: '30px' }}>
            <div className="divider"><span className="divider__icon"><DiyaIcon size={16} /></span></div>
            
            <div style={{ textAlign: 'center', margin: '36px 0 44px' }}>
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: 'clamp(28px, 3.5vw, 38px)', 
                fontWeight: 600, 
                color: 'var(--ink-brown)',
                margin: 0
              }}>
                Explore More Collections
              </h2>
              <p style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '16.5px', 
                color: 'var(--stone-taupe)', 
                marginTop: '10px',
                maxWidth: '560px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.6
              }}>
                Discover the timeless artistry, master craftsmanship, and pure fabrics woven across our accompanying ateliers.
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '28px',
              alignItems: 'stretch'
            }}>
              {otherCategories.map(cat => (
                <Link 
                  href={`/category/${cat.id}`} 
                  key={cat.id} 
                  className="category-tile" 
                  style={{ minHeight: '420px', height: 'auto' }}
                >
                  <img src={cat.exploreImage || cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-tile__border" />
                  <div className="category-tile__label">
                    <h3 style={{ fontSize: '26px', marginBottom: '6px' }}>{cat.name}</h3>
                    {cat.tagline && (
                      <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {cat.tagline}
                      </p>
                    )}
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontFamily: 'var(--font-nav)',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--gargi-gold)'
                    }}>
                      Explore Collection <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
