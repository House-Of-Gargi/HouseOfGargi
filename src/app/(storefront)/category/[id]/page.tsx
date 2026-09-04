'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';
import { getCategory, getProductsByCategory, categories } from '@/data/products';
import { DiyaIcon, ArrowRightIcon } from '@/components/Icons';

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

      <section className="section section--ivory">
        <div className="container">
          {/* Filters */}
          <div className="filter-bar">
            <div className="filter-bar__group">
              <span className="filter-bar__label">Fabric:</span>
              <CustomDropdown
                options={fabrics.map(f => ({ value: f, label: f }))}
                value={fabric}
                onChange={setFabric}
                placeholder="All Fabrics"
                showEmptyOption
              />
            </div>

            <div className="filter-bar__group">
              <span className="filter-bar__label">Occasion:</span>
              <CustomDropdown
                options={occasions.map(o => ({ value: o, label: o }))}
                value={occasion}
                onChange={setOccasion}
                placeholder="All Occasions"
                showEmptyOption
              />
            </div>

            <div className="filter-bar__group">
              <span className="filter-bar__label">Sort:</span>
              <CustomDropdown
                options={[
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                ]}
                value={sort}
                onChange={setSort}
                placeholder="Featured"
                showEmptyOption
              />
            </div>
          </div>

          {/* Product Grid */}
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <DiyaIcon size={40} style={{ color: 'var(--gargi-gold)', marginBottom: '16px' }} />
              <h3>No pieces match your selected filters.</h3>
              <button 
                type="button" 
                className="btn btn--primary" 
                style={{ marginTop: '20px' }}
                onClick={() => { setFabric(''); setOccasion(''); setSort(''); }}
              >
                Clear Filters
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '36px',
              alignItems: 'stretch'
            }}>
              {otherCategories.map(cat => (
                <Link 
                  href={`/category/${cat.id}`} 
                  key={cat.id} 
                  className="category-tile" 
                  style={{ minHeight: '420px', height: 'auto' }}
                >
                  <img src={cat.image} alt={cat.name} loading="lazy" />
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
